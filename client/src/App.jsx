import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from "react-hot-toast"
import { AuthContext } from '../context/AuthContext.jsx'
import bgImage from './assets/bgImage.svg'

const App = () => {
  const { authUser, isLoading } = useContext(AuthContext)

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="bg-contain min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-cover bg-center bg-no-repeat min-h-screen" style={{ backgroundImage: `url(${bgImage})` }}>
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to={'/login'} replace />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={'/'} replace />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to={'/login'} replace />} />
      </Routes>
    </div>
  )
}

export default App
