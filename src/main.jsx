import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Ye line add karein
import App from './App'
import './styles/main.css'
import "react-day-picker/dist/style.css";

// StrictMode ko hata dein
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
