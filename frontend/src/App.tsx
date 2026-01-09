import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, SplitPane, Panel } from './components/Layout';
import { DirectoryTree } from './components/DirectoryTree';
import { useState } from 'react';
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
  const [selectedPath, setSelectedPath] = useState<string>('');

  return (
    <Layout>
      <SplitPane
        left={
          <Panel title="Directories">
            <DirectoryTree onDirectorySelect={setSelectedPath} />
          </Panel>
        }
        right={
          <Panel title="Images">
            {selectedPath ? (
              <p>Selected: {selectedPath}</p>
            ) : (
              <p>Select a directory to view images</p>
            )}
          </Panel>
        }
      />
    </Layout>
  );
}

export default App;
