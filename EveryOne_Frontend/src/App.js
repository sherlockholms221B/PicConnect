import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home, Login, PrivateRoutes } from './imports'

const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route
        path='*'
        element={
          <PrivateRoutes>
            <Home />
          </PrivateRoutes>
        }
      />
    </Routes>
  )
}

export default App
