import AddItems from "./components/AddItems"
import List from "./components/List"
import Navbar from "./components/Navbar"
import Order from "./components/Order"
import { Routes, Route } from "react-router-dom";
import UpdateItem from "./components/UpdateItem";



function App() {


  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<AddItems />} />
        <Route path='/list' element={<List />} />
        <Route path='/orders' element={<Order />} />
        <Route path='/update-item/:id' element={<UpdateItem />} />
      </Routes>
    </>
  )
}

export default App


// import AddItems from "./components/AddItems"
// import List from "./components/List"
// import Navbar from "./components/Navbar"
// import Order from "./components/Order"
// import SignInPage from "./components/SignIn"
// import SignUpPage from "./components/SignUp"
// import ProtectedRoute from "./components/ProtectedRoute"
// import { Routes, Route, Navigate } from "react-router-dom"
// import { useAuth } from "@clerk/clerk-react"

// function App() {
//   const { isLoaded } = useAuth()

//   if (!isLoaded) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#2d1f1f] via-[#3a2b2b] to-[#4a3a3a] flex items-center justify-center">
//         <div className="text-amber-400 text-2xl animate-pulse">
//           🍳 Loading Admin Panel...
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//       <Navbar />
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/sign-in" element={<SignInPage />} />
//         <Route path="/sign-up" element={<SignUpPage />} />

//         {/* Protected Routes */}
//         <Route path="/" element={
//           <ProtectedRoute>
//             <AddItems />
//           </ProtectedRoute>
//         } />
//         <Route path="/list" element={
//           <ProtectedRoute>
//             <List />
//           </ProtectedRoute>
//         } />
//         <Route path="/orders" element={
//           <ProtectedRoute>
//             <Order />
//           </ProtectedRoute>
//         } />

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </>
//   )
// }

// export default App