import { useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const { isSignedIn, isLoaded } = useAuth()

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