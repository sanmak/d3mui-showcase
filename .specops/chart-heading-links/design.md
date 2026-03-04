# Design: Chart Heading Shareable Links

## Architecture Decision

All changes are confined to `app/page.tsx` — no new files, no new routes, no new dependencies. This is a purely client-side enhancement to the existing single-page gallery.

**Rationale:** The feature is a UI enhancement to the existing rendering pipeline. The `ChartCard` component and section rendering loop are both defined inline in `page.tsx`. Adding anchor IDs, a link icon, scroll-on-load logic, and a snackbar can all be done within the existing component structure without introducing unnecessary abstractions.

## Slug Generation Utility

```typescript
function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // Remove special chars (parentheses, +, etc.)
    .replace(/\s+/g, '-')           // Spaces to hyphens
    .replace(/-+/g, '-')            // Collapse consecutive hyphens
    .replace(/^-|-$/g, '');         // Trim leading/trailing hyphens
}
```

Defined as a module-level function (outside the component) since it's pure and stateless. No memoization needed — it runs once per render for static section/chart data.

**Example outputs:**
| Title | Slug |
|-------|------|
| Bar Chart | `bar-chart` |
| Candlestick Chart (OHLC) | `candlestick-chart-ohlc` |
| Force-Directed Graph | `force-directed-graph` |
| Hybrid SVG+Canvas Large Scatter | `hybrid-svgcanvas-large-scatter` |
| Statistical Charts | `statistical-charts` |

## Component Changes

### 1. ChartCard — Add anchor ID and link icon

**Current signature:**
```typescript
const ChartCard = ({ title, description, icon, children }: { ... })
```

**New signature:**
```typescript
const ChartCard = ({ title, description, icon, children, slug }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  slug: string;
  children: React.ReactNode;
})
```

**Changes to ChartCard rendering:**

```
┌─────────────────────────────────────────────┐
│  [ChartIcon] Chart Title  [🔗]              │  ← link icon appears on hover
│  Description text here...                    │
│  ┌───────────────────────────────────────┐  │
│  │                                       │  │
│  │         Chart Visualization           │  │
│  │                                       │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
         ▲
         │
    id="{slug}" on the Card's outer Box wrapper
```

- Wrap the `Card` in a `Box` with `id={slug}` and add `scroll-margin-top: 80px` (for AppBar offset)
- Add a MUI `IconButton` with `LinkIcon` after the title `Typography`
- The `IconButton` is `opacity: 0` by default, `opacity: 1` on parent hover (CSS via `sx` prop using `&:hover` on the flex container)
- Clicking the `IconButton` calls `handleCopyLink(slug)`
- Clicking the title `Typography` updates `window.location.hash` to `#${slug}`
- Title gets `cursor: pointer` and `&:hover` underline styling

### 2. Section Headings — Add anchor ID and link icon

Apply the same pattern to section headings:

```
─────────────────────────────────────────────────
  [SectionIcon]  Section Title  [🔗]
  Section description text...
─────────────────────────────────────────────────
```

- Add `id={sectionSlug}` and `scroll-margin-top: 80px` to the section `Box`
- Add `IconButton` with `LinkIcon` next to the section `Typography variant="h4"`
- Same hover-to-reveal and click-to-copy behavior

### 3. Copy-to-Clipboard Handler

```typescript
const [snackbarOpen, setSnackbarOpen] = useState(false);

const handleCopyLink = async (slug: string) => {
  const url = `${window.location.origin}${window.location.pathname}#${slug}`;
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = url;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
  setSnackbarOpen(true);
};
```

### 4. Snackbar for Confirmation

Add a single MUI `Snackbar` at the bottom of the page return:

```typescript
<Snackbar
  open={snackbarOpen}
  autoHideDuration={2000}
  onClose={() => setSnackbarOpen(false)}
  message="Link copied to clipboard!"
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
/>
```

### 5. Scroll-on-Load Effect

Add a `useEffect` that runs once on mount:

```typescript
useEffect(() => {
  const hash = window.location.hash.slice(1);
  if (hash) {
    // Delay slightly to ensure DOM is rendered (charts init async)
    const timer = setTimeout(() => {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Add highlight animation
        element.style.transition = 'box-shadow 0.3s ease';
        element.style.boxShadow = '0 0 0 3px #1976d2';
        setTimeout(() => {
          element.style.boxShadow = '';
        }, 2000);
      }
    }, 500);
    return () => clearTimeout(timer);
  }
}, []);
```

## Import Changes

Add to existing MUI imports:
```typescript
import { ..., Snackbar, IconButton } from '@mui/material';
import { ..., Link as LinkIcon } from '@mui/icons-material';
```

## Styling Details

### Link Icon — Hover Reveal

On the heading flex container (both ChartCard and section):
```typescript
sx={{
  display: 'flex',
  alignItems: 'center',
  '& .link-icon': {
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  '&:hover .link-icon': {
    opacity: 1,
  },
}}
```

On mobile (responsive), the icon should always be visible. Use MUI breakpoints:
```typescript
'& .link-icon': {
  opacity: { xs: 0.5, md: 0 },
  transition: 'opacity 0.2s',
},
```

### Scroll Margin

On anchor elements:
```typescript
sx={{ scrollMarginTop: '80px' }}
```

This ensures scrolling doesn't hide the heading behind the fixed AppBar (~64px + some padding).

### Title Click Styling

```typescript
<Typography
  variant="h6"
  component="div"
  ml={1}
  sx={{
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline' },
  }}
  onClick={() => { window.location.hash = slug; }}
>
  {title}
</Typography>
```

## Data Flow Diagram

```
page.tsx mount
     │
     ├─► sections[] static array (existing)
     │      │
     │      ├─► section.title → toSlug() → section anchor id
     │      │
     │      └─► chart.title → toSlug() → chart anchor id
     │                                       │
     │                                       └─► passed as `slug` prop to ChartCard
     │
     ├─► useEffect (scroll-on-load)
     │      │
     │      └─► reads window.location.hash
     │          └─► document.getElementById(hash)
     │              └─► scrollIntoView + highlight
     │
     └─► handleCopyLink(slug)
            │
            └─► constructs URL → clipboard API → setSnackbarOpen(true)
```

## Edge Cases

1. **Duplicate slugs**: Theoretically possible if two charts have the same name. Current data has no duplicates. No collision handling needed — slugs are derived from unique titles.

2. **Special characters in titles**: The `toSlug()` function strips all non-alphanumeric characters. Titles like "Candlestick Chart (OHLC)" and "Hybrid SVG+Canvas Large Scatter" produce clean slugs.

3. **Hash conflicts with other frameworks**: Next.js App Router doesn't use hash-based routing, so no conflicts.

4. **SSR considerations**: All hash/scroll/clipboard logic runs in `useEffect` or event handlers (client-only), so no SSR issues. The `'use client'` directive is already present.

5. **Long page with many anchors**: 60 chart IDs + 5 section IDs = 65 anchor points. No performance concern — these are just DOM `id` attributes.

## Files Modified

| File | Change |
|------|--------|
| `app/page.tsx` | Add `toSlug()`, modify `ChartCard`, modify section rendering, add scroll-on-load effect, add snackbar, add copy handler, add MUI imports |

**No new files. No new dependencies. No new routes.**
