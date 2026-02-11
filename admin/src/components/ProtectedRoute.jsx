import { useAuth, useUser } from '@clerk/clerk-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const ProtectedRoute = ({ children }) => {
    const { isSignedIn, isLoaded } = useAuth()
    const { user } = useUser()
    const navigate = useNavigate()

    // 🔴 BACKUP FIX: Force redirect after sign up
    useEffect(() => {
        if (isSignedIn && user) {
            // Check if we just signed up (you can set this flag anywhere)
            const justSignedUp = sessionStorage.getItem('clerk_sign_up')
            if (justSignedUp) {
                sessionStorage.removeItem('clerk_sign_up')
                navigate('/', { replace: true })
            }
        }
    }, [isSignedIn, user, navigate])

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#2d1f1f] via-[#3a2b2b] to-[#4a3a3a] flex items-center justify-center">
                <div className="text-amber-400 text-xl animate-pulse">
                    Loading your dashboard...
                </div>
            </div>
        )
    }

    if (!isSignedIn) {
        return <Navigate to="/sign-in" replace />
    }

    return children
}

export default ProtectedRoute