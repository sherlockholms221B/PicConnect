import React, { useState, useEffect } from 'react'
import { MdLogout } from 'react-icons/md'
import { useParams, useNavigate } from 'react-router-dom'
import { urlFor } from '../Client'
import { client, MasonryLayout, SpinnerLoader } from '../imports'
import {
  userSavedPinsQuery,
  userCreatedPinsQuery,
  userQuery,
} from '../utils/data'

const UserProfile = ({ user: profile }) => {
  const { _id: userIdUrl } = profile
  const [user, setUser] = useState(null)
  const [pins, setPins] = useState(null)
  const [text, setText] = useState('Created')
  const [active, setActive] = useState('created')
  const [imageUrl, setimageUrl] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  const [userName, setUserName] = useState('')
  const navigate = useNavigate()
  const { userId } = useParams()

  const logout = () => {
    localStorage.clear()
    navigate('/login')
    window.location.reload()
  }

  useEffect(() => {
    const query = userQuery(userId)

    client.fetch(query).then((data) => {
      const user = data[0]
      const { image, backgoundImage, firstName, lastName } = user
      setimageUrl(urlFor(image).url())
      setBannerUrl(urlFor(backgoundImage).url())
      setUserName(`${firstName}  ${lastName}`)
      setUser(data[0])
    })
  }, [userId])

  useEffect(() => {
    if (text === 'Created') {
      const createdPinsQuery = userCreatedPinsQuery(userId)

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data)
      })
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId)

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data)
      })
    }
  }, [text, userId])

  const activeBtnClass =
    'bg-red-500 text-white font-bold mr-4 p-2 rounded-full w-20 outline-none mt-5'
  const notActiveClass =
    'bg-gray-500 text-black mr-4 font-bold p-2 rounded-full w-20 outline-none mt-5 '

  if (!user) {
    return <SpinnerLoader message='loading profile' />
  }

  return (
    <div className='relative pb-2 h-full justify-center items-center flex'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center '>
            <img
              src={bannerUrl}
              alt='user-banner'
              className='w-full h-420 xl:h-600 shadow-lg object-cover'
            />
            <img
              src={imageUrl}
              className='w-20 h-20 -mt-10 shadow-lg object-cover rounded-full '
              alt='user-img'
            />
            <h1 className='font-bold text-3xl text-center mt-3'>{userName}</h1>
            <div className='absolute top-50 z-5 right-0'>
              {userId === userIdUrl && (
                <button
                  type='button'
                  title='logout'
                  className='bg-red-500 rounded-full px-4  py-2 text-white font-bold text-2xl capitalize mt-2 mr-2'
                  onClick={logout}
                >
                  <MdLogout fontSize={20} />
                </button>
              )}
            </div>
          </div>
          <div className='text-center mb-7'>
            <button
              className={`${
                active === 'Created' ? activeBtnClass : notActiveClass
              }`}
              onClick={(e) => {
                setText(e.target.textContent)
                setActive('Created')
              }}
            >
              Created
            </button>
            <button
              className={`${
                active === 'Saved' ? activeBtnClass : notActiveClass
              }`}
              onClick={(e) => {
                setText(e.target.textContent)
                setActive('Saved')
              }}
            >
              Saved
            </button>
          </div>
          {pins?.length ? (
            <div className='px-2 '>
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className='flex justify-center items-center font-bold w-full text-xl '>
              No post found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
