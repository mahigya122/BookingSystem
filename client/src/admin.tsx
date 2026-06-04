import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AdminApp from './AdminApp.tsx'
import { initializeData } from './domains/admin/data/initData'

async function bootstrap() {
  await initializeData();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AdminApp />
    </StrictMode>,
  )
}

void bootstrap();
