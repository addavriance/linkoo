import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './animations.css'
import App from './App'

const hostname = window.location.hostname;
const baseDomain = import.meta.env.VITE_BASE_DOMAIN || 'linkoo.dev';
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
const isSubdomain =
    !isLocalhost &&
    hostname !== baseDomain &&
    hostname !== `www.${baseDomain}` &&
    hostname.endsWith(`.${baseDomain}`);
const subdomain = isSubdomain ? hostname.replace(`.${baseDomain}`, '') : null;

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
    <StrictMode>
        <App subdomain={subdomain}/>
    </StrictMode>,
)
