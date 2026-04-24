import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './animations.css'
import App from './App'
import { BASE_DOMAIN } from '@/constants';

const hostname = window.location.hostname;
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
const isSubdomain =
    !isLocalhost &&
    hostname !== BASE_DOMAIN &&
    hostname !== `www.${BASE_DOMAIN}` &&
    hostname.endsWith(`.${BASE_DOMAIN}`);
const subdomain = isSubdomain ? hostname.replace(`.${BASE_DOMAIN}`, '') : null;

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
    <StrictMode>
        <App subdomain={subdomain}/>
    </StrictMode>,
)
