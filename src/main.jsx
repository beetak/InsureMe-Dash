// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/index.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import { ColorProvider } from './context/ColorProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Provider store={store}>
        <ColorProvider>
          <Router>
            <App />
          </Router>
        </ColorProvider>
      </Provider>
    </AuthProvider>
  </React.StrictMode>
)