import type { DirectoryEntry } from '@simple-browser/shared';
import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { api } from '../services/api';
import './TreeNode.css';

interface TreeNodeProps {
  entry: DirectoryEntry;
  level: number;
  onSelect?: (path: string) => void;
}

export function TreeNode({ entry, level, onSelect }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [children, setChildren] = useState<DirectoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    if (!isExpanded && children.length === 0) {
      // Lazy load children
      await loadChildren();
    }
    setIsExpanded(!isExpanded);
  };

  const loadChildren = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getDirectories(entry.path);
      setChildren(response.directories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    handleToggle();
    onSelect?.(entry.path);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleToggle();
        onSelect?.(entry.path);
        break;
      case 'ArrowRight':
        if (!isExpanded) {
          e.preventDefault();
          handleToggle();
        }
        break;
      case 'ArrowLeft':
        if (isExpanded) {
          e.preventDefault();
          setIsExpanded(false);
        }
        break;
    }
  };

  const hasChildren = children.length > 0 || !isExpanded;

  return (
    <div className="tree-node" role="treeitem" aria-expanded={isExpanded}>
      <div
        className="tree-node-content"
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`${entry.name} folder`}
      >
        {hasChildren && (
          <span className="tree-node-icon" aria-hidden="true">
            {loading ? '⋯' : isExpanded ? '▼' : '▶'}
          </span>
        )}
        <span className="tree-node-icon folder-icon" aria-hidden="true">
          📁
        </span>
        <span className="tree-node-label">{entry.name}</span>
      </div>

      {error && (
        <div className="tree-node-error" style={{ paddingLeft: `${(level + 1) * 20}px` }}>
          Failed to load
        </div>
      )}

      {isExpanded && children.length > 0 && (
        <div className="tree-node-children">
          {children.map((child) => (
            <TreeNode
              key={child.path}
              entry={child}
              level={level + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
