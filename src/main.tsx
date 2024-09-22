import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NotFound } from './components/pages/NotFound.tsx'
import { BookingForm } from './components/pages/BookingForm.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import { Success } from './components/pages/Success.tsx'
import { Cancelled } from './components/pages/Cancelled.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    {/* <Header /> */}
    <div className='w-full max-w-[1200px] mx-auto'>
      <Routes>
        <Route path="/" element={<BookingForm />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancelled" element={<Cancelled />} />
        <Route path="*" element={<NotFound />} /> 
      </Routes>
    </div>
    {/* <Footer /> */}
    <Toaster />
  </BrowserRouter>
)
