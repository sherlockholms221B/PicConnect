import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.js'
import './index.css'

const element = document.getElementById('root')
const elementRender = createRoot(element)

elementRender.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
