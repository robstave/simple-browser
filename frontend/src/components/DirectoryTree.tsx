import type { DirectoryEntry } from '@simple-browser/shared';
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TreeNode } from './TreeNode';
import './DirectoryTree.css';

interface DirectoryTreeProps {
  onDirectorySelect?: (path: string) => void;
}

export function DirectoryTree({ onDirectorySelect }: DirectoryTreeProps) {
  const [rootDirectories, setRootDirectories] = useState<DirectoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRootDirectories();
  }, []);

  const loadRootDirectories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getDirectories('');
      setRootDirectories(response.directories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load directories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="directory-tree-loading">Loading directories...</div>;
  }

  if (error) {
    return (
      <div className="directory-tree-error">
        <p>Error loading directories</p>
        <button onClick={loadRootDirectories}>Retry</button>
      </div>
    );
  }

  return (
    <div className="directory-tree" role="tree" aria-label="Directory tree">
      {rootDirectories.map((dir) => (
        <TreeNode
          key={dir.path}
          entry={dir}
          level={0}
          onSelect={onDirectorySelect}
        />
      ))}
    </div>
  );
}
