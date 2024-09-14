import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NotFound } from './components/pages/NotFound.tsx'
import HomePage from './components/pages/HomePage.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFound />} /> 
    </Routes>
  </BrowserRouter>
)
