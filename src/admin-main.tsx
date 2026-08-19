import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AdminPortal from './AdminPortal'
import './admin-portal.css'
createRoot(document.getElementById('admin-root')!).render(<StrictMode><AdminPortal /></StrictMode>)
