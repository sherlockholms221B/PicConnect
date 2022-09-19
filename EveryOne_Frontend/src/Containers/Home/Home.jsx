import React, { useState } from 'react'
import { HiMenu } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'
import { Routes, Route, Link } from 'react-router-dom'
import { SideBar, UserProfile, Pins } from '../../imports'
import { urlFor } from '../../Client'

const Home = () => {
  const [togleSidebar, setTogleSidebar] = useState(false)

  const user = JSON.parse(localStorage.getItem('profile'))
  const { _id, image } = user

  const handleTogle = () => setTogleSidebar(true)
  const handleCloseTogleBar = () => setTogleSidebar(false)

  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial'>
        <SideBar user={user && user} />
      </div>
      <div className='flex md:hidden flex-wrap'>
        <div className='p-2 h-full w-full flex felx-row justify-between items-center shadow-md'>
          <HiMenu
            fontSize={40}
            className='cursor-pointer'
            onClick={handleTogle}
          />

          <Link to={`user-profile/${_id}`}>
            <img
              src={urlFor(image)?.width(50).height(50).url()}
              alt='user-profile'
              className='rounded-full'
            />
          </Link>
        </div>
        {togleSidebar && (
          <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
            <div className='absolute  w-full flex justify-end p-2 items-center'>
              <AiFillCloseCircle fontSize={30} onClick={handleCloseTogleBar} />
            </div>
            <SideBar user={user && user} setTogleSidebar={setTogleSidebar} />
          </div>
        )}
      </div>
      <div className='pb-2 flex-1 h-screen overflow-y-scroll ref={scrollRef}'>
        <Routes>
          <Route
            path='/user-profile/:userId'
            element={<UserProfile user={user} />}
          />
          <Route path='/*' element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Home
