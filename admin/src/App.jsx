import AddItems from "./components/AddItems"
import List from "./components/List"
import Navbar from "./components/Navbar"
import Order from "./components/Order"
import { Routes, Route } from "react-router-dom";





function App() {
  

  return (
    <>
    <Navbar />
    <Routes>
        <Route  path='/' element={<AddItems />} />
        <Route path='/list' element={<List />} />
        <Route path='/orders' element={<Order />} />
    </Routes>
    </>
  )
}

export default App
