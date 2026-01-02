import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, SplitPane, Panel } from './components/Layout';
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
  return (
    <Layout>
      <SplitPane
        left={
          <Panel title="Directories">
            <p>Directory tree will appear here</p>
          </Panel>
        }
        right={
          <Panel title="Images">
            <p>Image thumbnails will appear here</p>
          </Panel>
        }
      />
    </Layout>
  );
}

export default App;
