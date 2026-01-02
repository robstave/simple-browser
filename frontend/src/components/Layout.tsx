import type { ReactNode } from 'react';
import './Layout.css';

/**
 * Main layout component with split-pane interface
 * Left pane: Directory tree
 * Right pane: Image grid
 */

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <header className="layout-header">
        <h1>simple-browser</h1>
        <div className="layout-header-controls">
          {/* Placeholder for future controls (e.g., grid density selector) */}
        </div>
      </header>
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
}

interface SplitPaneProps {
  left: ReactNode;
  right: ReactNode;
}

export function SplitPane({ left, right }: SplitPaneProps) {
  return (
    <div className="split-pane">
      <div className="split-pane-left">
        {left}
      </div>
      <div className="split-pane-divider" />
      <div className="split-pane-right">
        {right}
      </div>
    </div>
  );
}

interface PanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Panel({ title, children, className = '' }: PanelProps) {
  return (
    <div className={`panel ${className}`}>
      {title && <div className="panel-header">{title}</div>}
      <div className="panel-content">
        {children}
      </div>
    </div>
  );
}
