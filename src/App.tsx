import { Routes, Route } from "react-router-dom"
import Layout from "./pages/Layout"
import Dashboard from "./pages/Dashboard"
import FoodLog from "./pages/Clients"
import ActivityLog from "./pages/Products"
import Bill from "./pages/Bill"
import { useAppContext } from "./context/AppContext"
import Login from "./pages/Login"
import { Toaster } from "react-hot-toast"


const App = () => {

  const {user, isUserFetched} = useAppContext()

  if(!user){
    return isUserFetched ? <Login/> : <p>Loading...</p>
  }

  return (
    <>
    <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            borderRadius: "10px"
          }
        }}
      />
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path="clientes" element={<FoodLog/>}/>
          <Route path="productos" element={<ActivityLog/>}/>
          <Route path="facturacion" element={<Bill/>}/>
          
        </Route>
      </Routes>
    </>
  )
}

export default App