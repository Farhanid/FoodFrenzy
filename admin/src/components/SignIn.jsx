import { SignIn } from '@clerk/clerk-react'
import { styles } from '../assets/dummyadmin'

const SignInPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2d1f1f] via-[#3a2b2b] to-[#4a3a3a] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className={styles.formCard}>
                    <h2 className={styles.formTitle}>Welcome Back Chef! 👨‍🍳</h2>
                    <SignIn
                        routing="path"
                        path="/sign-in"
                        signUpUrl="/sign-up"
                        // 🔴 REMOVED afterSignInUrl & redirectUrl - they're buggy
                        // 🔴 USING FORCE REDIRECT FROM .env INSTEAD
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "bg-transparent shadow-none",
                                headerTitle: "text-amber-400 text-2xl",
                                headerSubtitle: "text-amber-100/60",
                                socialButtonsBlockButton: "bg-[#4a3a3a] border-amber-500/30 text-amber-100 hover:bg-[#5a4a4a]",
                                formFieldLabel: "text-amber-400",
                                formFieldInput: "bg-[#3a2b2b] border-amber-500/30 text-amber-100",
                                formButtonPrimary: "bg-amber-600 hover:bg-amber-700",
                                footerActionText: "text-amber-100/60",
                                footerActionLink: "text-amber-400 hover:text-amber-300",
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default SignInPage