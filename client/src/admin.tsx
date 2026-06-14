import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AdminApp from './AdminApp.tsx'
import { initializeData } from './domains/admin/data/initData'

async function bootstrap() {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error("Root element not found");

  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <AdminApp />
    </StrictMode>,
  )

  // Initialize data in the background
  void initializeData();
}

void bootstrap();
