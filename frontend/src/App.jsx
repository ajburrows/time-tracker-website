import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"


function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  // If someone registers, we want to firstly clear the local storage to prevent them from sending access token to the local route because that could cause an error
  localStorage.clear()
  return <Register />
}


function App() {

  return (
    // Users can only go to the Register, Login, or Home pages. If they go anywhere else, they are sent to the NotFound route
    <BrowserRouter>
      <Routes>
        <Route 
          path="/"
          element={
            // Ensure the user cannot access the Home component unless they have a valid access token
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />}/>
        <Route path="/logout" element={<Logout />}/>
        <Route path="/register" element={<RegisterAndLogout />}/>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
