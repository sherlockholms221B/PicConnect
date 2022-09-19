import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoMdAdd } from 'react-icons/io'
import { Input } from '../imports'
import { urlFor } from '../Client'

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const { image, _id: userId } = user
  const navigate = useNavigate()

  const handleFocus = () => {
    navigate('/search')
  }
  if (!user) {
    return null
  }
  return (
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
      <div className='flex justify-start items-center w-full p-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>
        <Input
          type='text'
          handleChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          placeholder='Search'
          onFocus={handleFocus}
          search
        />

        <div className='flex gap-3'>
          <Link to={`/user-profile/${userId}`} className='hidden md:block'>
            <img
              src={urlFor(image)?.width(50).height(50).url()}
              alt='user-profile'
              className='rounded-full'
            />
          </Link>
          <Link
            to={`/create-Pin`}
            className='bg-black text-white h-12 w-12 flex justify-center items-center rounded-lg md:w-14 '
          >
            <IoMdAdd fontSize={21} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar
