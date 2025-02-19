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
import { PrintProvider } from './context/PrinterProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Provider store={store}>
        <PrintProvider>
          <ColorProvider>
            <Router>
              <App />
            </Router>
          </ColorProvider>
        </PrintProvider>
      </Provider>
    </AuthProvider>
  </React.StrictMode>
)