import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NotFound } from './components/pages/NotFound.tsx'
import { BookingForm } from './components/pages/BookingForm.tsx'
// import {Header} from './components/custom/Header.tsx'
// import {Footer} from './components/custom/Footer.tsx'
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    {/* <Header /> */}
    <div className='w-full max-w-[1200px] mx-auto'>
      <Routes>
        <Route path="/" element={<BookingForm />} />
        <Route path="*" element={<NotFound />} /> 
      </Routes>

    </div>
    {/* <Footer /> */}
  </BrowserRouter>
)
