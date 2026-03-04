# Tasks: Chart Heading Shareable Links

## Task Breakdown

### Task 1: Add `toSlug` utility function

**Status:** Completed
**File:** `app/page.tsx`
**Location:** Module level (above the `Home` component)
**Action:**

- Add a `toSlug(title: string): string` function that converts chart/section titles to URL-safe slugs
- Lowercase, strip special chars, replace spaces with hyphens, collapse consecutive hyphens

**Validation:** Verify all 60 chart titles + 5 section titles produce unique, clean slugs ✓

---

### Task 2: Update MUI imports

**Status:** Completed
**File:** `app/page.tsx`
**Action:**

- Add `Snackbar` and `IconButton` to the `@mui/material` import ✓
- Add `Link as LinkIcon` to the `@mui/icons-material` import ✓

---

### Task 3: Add clipboard copy handler and snackbar state

**Status:** Completed
**File:** `app/page.tsx`
**Location:** Inside the `Home` component, near existing `useState` declarations
**Action:**

- Add `const [snackbarOpen, setSnackbarOpen] = useState(false);` ✓
- Add `handleCopyLink(slug: string)` async function using Clipboard API with fallback ✓

---

### Task 4: Modify `ChartCard` component

**Status:** Completed
**File:** `app/page.tsx`
**Location:** `ChartCard` component definition (lines ~210-237)
**Action:**

- Add `slug` prop to `ChartCard` signature ✓
- Wrap `Card` in a `Box` with `id={slug}` and `scrollMarginTop: '80px'` ✓
- Add `IconButton` with `LinkIcon` next to title (hover-to-reveal via CSS) ✓
- Make title `Typography` clickable (updates URL hash, cursor pointer, underline on hover) ✓
- Add `.link-icon` class styling for hover reveal behavior ✓
- On mobile: icon is semi-visible (opacity 0.5) instead of fully hidden ✓

---

### Task 5: Modify section heading rendering

**Status:** Completed
**File:** `app/page.tsx`
**Location:** Section rendering loop (lines ~785-797)
**Action:**

- Compute `sectionSlug = toSlug(section.title)` for each section ✓
- Add `id={sectionSlug}` and `scrollMarginTop: '80px'` to the section wrapper `Box` ✓
- Add `IconButton` with `LinkIcon` next to section title `Typography` ✓
- Make section title clickable (updates URL hash) ✓
- Same hover-to-reveal styling as ChartCard ✓

---

### Task 6: Pass `slug` prop in chart rendering loop

**Status:** Completed
**File:** `app/page.tsx`
**Location:** Chart grid rendering (lines ~800-815)
**Action:**

- Compute `slug={toSlug(chart.title)}` and pass to `ChartCard` ✓

---

### Task 7: Add scroll-on-load `useEffect`

**Status:** Completed
**File:** `app/page.tsx`
**Location:** Inside `Home` component, after existing `useEffect`
**Action:**

- Add a `useEffect` that reads `window.location.hash` on mount ✓
- If hash matches an element ID, scroll to it with smooth behavior after a 500ms delay ✓
- Apply a brief highlight animation (box-shadow pulse for 2 seconds) ✓
- Clean up timeout on unmount ✓

---

### Task 8: Add `Snackbar` component

**Status:** Completed
**File:** `app/page.tsx`
**Location:** End of the return JSX, before closing fragment/container
**Action:**

- Add `<Snackbar>` with `autoHideDuration={2000}`, anchored bottom-center ✓
- Message: "Link copied to clipboard!" ✓
- Controlled by `snackbarOpen` state ✓

---

### Task 9: Validate with lint, type-check, and build

**Status:** Completed
**Commands:**

```bash
npm run lint     ✓ Passed (1 pre-existing warning unrelated to changes)
npm run type-check  ✓ Passed
npm run build    ✓ Passed
```

**Acceptance:** All three pass with no errors related to the changes. ✓

---

## Task Dependency Graph

```
Task 1 (toSlug)  ──┐
                    ├──► Task 4 (ChartCard) ──┐
Task 2 (imports) ──┤                          │
                    ├──► Task 5 (sections)  ──┤
Task 3 (handler) ──┘                          │
                                              ├──► Task 8 (Snackbar)
Task 6 (pass slug) ──────────────────────────┤
                                              │
Task 7 (scroll-on-load) ────────────────────┘
                                              │
                                              └──► Task 9 (validate)
```

**Parallel tracks:** Tasks 1, 2, 3 can all be done first (foundations). Tasks 4, 5, 6, 7, 8 build on them. Task 9 is final validation.

## Estimated Complexity

- **Total lines changed:** ~80-100 lines in `app/page.tsx`
- **New files:** 0
- **New dependencies:** 0
- **Risk:** Low — all changes are additive, no existing behavior modified
