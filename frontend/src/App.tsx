import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.86.28:8765';

function App() {
  const [count, setCount] = useState(0)
  const [backendMessage, setBackendMessage] = useState<string>('Loading...')
  const [backendStatus, setBackendStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    // Test backend connection
    fetch(`${API_BASE_URL}/api/hello`)
      .then(res => res.json())
      .then(data => {
        setBackendMessage(data.message)
        setBackendStatus('success')
      })
      .catch(err => {
        setBackendMessage(`Error: ${err.message}`)
        setBackendStatus('error')
      })
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>simple-browser</h1>
      
      <div className="card" style={{ 
        backgroundColor: backendStatus === 'success' ? '#1a4d1a' : backendStatus === 'error' ? '#4d1a1a' : '#4d4d1a',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem'
      }}>
        <h3>Backend Connection Test</h3>
        <p>{backendMessage}</p>
        <p style={{ fontSize: '0.9em', opacity: 0.8 }}>
          Status: {backendStatus}
        </p>
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Frontend connected to backend on port 8765
      </p>
    </>
  )
}

export default App
