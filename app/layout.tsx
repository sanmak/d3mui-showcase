import type { Metadata } from 'next';
import ThemeRegistry from './ThemeRegistry';
import './globals.css';

export const metadata: Metadata = {
  title: 'D3.js & MUI5 Visualizations',
  description: 'Comprehensive showcase of D3.js visualizations with Material-UI 5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
