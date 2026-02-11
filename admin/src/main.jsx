
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'


const CLERK_PUBLISHABLE_KEY =  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const SIGN_UP_FORCE_REDIRECT_URL = import.meta.env.VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL || '/'
const SIGN_IN_FORCE_REDIRECT_URL = import.meta.env.VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL || '/'

createRoot(document.getElementById('root')).render(

    <BrowserRouter>
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}
            signUpForceRedirectUrl={SIGN_UP_FORCE_REDIRECT_URL}  
            signInForceRedirectUrl={SIGN_IN_FORCE_REDIRECT_URL}  >
        <App />
        </ClerkProvider>
    </BrowserRouter>


)
