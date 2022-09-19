import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { ImHome } from 'react-icons/im'
import { urlFor } from '../Client'
import { categories } from '../utils/data'
import { logo } from '../Assets/data'

const SideBar = ({ user, setTogleSidebar }) => {
  const { image } = user

  const handleCloseTogleBar = () => {
    if (setTogleSidebar) {
      setTogleSidebar(false)
    }
  }

  const clickedClass =
    'flex items-center px-5 py-2 mt-3 mb-3 font-extrabold border-r-5 border-r-black border-2 transition-all duration-200 ease-in-out capitalize'
  const notClickedClass =
    'flex items-center px-5 py-2 mt-3 mb-3 text-gray-500 font-extrabold hover:text-black transition-all duration-200 ease-in-out capitalize'

  return (
    <div className='flex flex-col justify-between bg-white overflow-y-scroll h-full min-w-210 hide-scrollbar shadow-lg'>
      <div className='flex flex-col '>
        <Link
          to='/'
          className='px-5 flex gap-2 my-6 w-190 items-center pt-1 '
          onClick={handleCloseTogleBar}
        >
          <div className='flex justify-center items-center   p-5 w-40 mr-auto ml-auto rounded-lg'>
            <img src={logo} alt='logo' className='rounded-lg' />
          </div>
        </Link>
        <div className='flex flex-col gap=5'>
          <NavLink
            to='/'
            className={({ isActive }) =>
              isActive ? clickedClass : notClickedClass
            }
            onClick={handleCloseTogleBar}
          >
            <ImHome fontSize={25} className='text-gray-500 mr-3' />
            Home
          </NavLink>
          <h3 className='mt-3 px-5 text-base 2xl:text-xl text-gray-500 font-bold'>
            Discover more
          </h3>
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`category/${category.name}`}
              className={({ isActive }) =>
                isActive ? clickedClass : notClickedClass
              }
              onClick={handleCloseTogleBar}
              key={category.name}
            >
              <img
                src={category.image}
                alt='category'
                className='rounded-full w-10 h-10 shadow-lg mr-3'
              />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      {user && (
        <Link
          to={`user-profile/${user?._id}`}
          className='flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3'
          onClick={handleCloseTogleBar}
        >
          <img
            src={urlFor(image)?.width(50).height(50).url()}
            alt='user-profile'
            className='rounded-full'
          />
        </Link>
      )}
    </div>
  )
}

export default SideBar
