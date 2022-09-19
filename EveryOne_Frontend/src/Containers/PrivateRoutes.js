import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoutes = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('profile'))
  return user ? children : <Navigate to='/login' />
}

export default PrivateRoutes
