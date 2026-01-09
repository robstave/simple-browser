import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, SplitPane, Panel } from './components/Layout';
import { DirectoryTree } from './components/DirectoryTree';
import { ThumbnailGrid } from './components/ThumbnailGrid';
import { useState } from 'react';
import type { ImageFile } from '@simple-browser/shared';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

function HomePage() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const handleDirectorySelect = (path: string) => {
    setSelectedPath(path || null);
  };

  const handleImageClick = (image: ImageFile) => {
    // TODO: Open modal in Phase 5
    console.log('Image clicked:', image);
  };

  return (
    <Layout>
      <SplitPane
        left={
          <Panel title="Directories">
            <DirectoryTree onDirectorySelect={handleDirectorySelect} />
          </Panel>
        }
        right={
          <Panel title="Images">
            <ThumbnailGrid 
              selectedPath={selectedPath} 
              onImageClick={handleImageClick}
            />
          </Panel>
        }
      />
    </Layout>
  );
}

export default App;
