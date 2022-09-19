import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Feeds, Navbar, PinDetails, CreatePin, Search } from '../imports'

const Pins = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('')
  return (
    <div className='px-2 md:px-5'>
      <div className='bg-gray-50'>
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
        />
      </div>
      <div className='h-full'>
        <Routes>
          <Route path='/' element={<Feeds />} />
          <Route path='/category/:categoryId' element={<Feeds />} />
          <Route
            path='/pin-detail/:pinId'
            element={<PinDetails user={user} />}
          />
          <Route
            path='/create-Pin'
            element={<CreatePin user={user && user} />}
          />
          <Route
            path='/search'
            element={
              <Search setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default Pins
