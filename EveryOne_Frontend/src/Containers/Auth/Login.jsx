import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, client } from '../../imports'
import everyOne from '../../Assets/EveryOne.mp4'
import { userQuery } from '../../utils/signIn'
import { v4 as uuidv4 } from 'uuid'
import { AiFillCloud, AiTwotoneDelete } from 'react-icons/ai'
import { SpinnerLoader } from '../../imports'
import { logo } from '../../Assets/data'

const Login = () => {
  const [isSignUp, setisSignUp] = useState(false)
  const [next, setNext] = useState(false)
  const [wrongeImagetype, setWrongeImagetype] = useState(false)
  const [banner, setBanner] = useState(null)
  const [bannerLoading, setBannerLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [profileIsLoadding, setProfileIsLoadding] = useState(false)
  const [wrongePassword, setWrongePassword] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [loging, setLoging] = useState(false)
  const [userExist, setUserExist] = useState('')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmite = (e) => {
    e.preventDefault()
    const { firstName, lastName, email, password, repeatPassword } = formData

    const doc = {
      _type: 'user',
      _id: uuidv4(),
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      repeatPassword: repeatPassword,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: profile?._id,
        },
      },
      backgoundImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: banner?._id,
        },
      },
    }
    if (isSignUp) {
      setLoging(true)
      if (password !== repeatPassword) {
        setWrongePassword(true)
      } else if (
        email === '' ||
        firstName === '' ||
        lastName === '' ||
        password === '' ||
        repeatPassword === ''
      ) {
        setInvalid(true)
      } else {
        const query = userQuery({ email, password })
        setLoging(true)
        client.fetch(query).then((data) => {
          console.log(data)
          if (data.length === 0) {
            client.createIfNotExists(doc).then((data) => {
              localStorage.setItem('profile', JSON.stringify(data))
              setLoging(false)
              navigate('/', { replace: true })
            })
          } else {
            console.log('reached')
            setLoging(false)
            setUserExist('user already exist')
          }
        })
      }
    } else {
      const query = userQuery({ email, password })
      setLoging(true)
      client.fetch(query).then((data) => {
        localStorage.setItem('profile', JSON.stringify(data[0]))
        setLoging(false)
        navigate('/', { replace: true })
      })
    }
  }

  const handleClick = () => {
    setisSignUp((prev) => !prev)
  }

  const uploadProfile = (e) => {
    const { type, name } = e.target.files[0]
    if (
      type === 'image/png' ||
      type === 'image/jpeg' ||
      type === 'image/svg' ||
      type === 'image/gif' ||
      type === 'image/tiff'
    ) {
      setWrongeImagetype(false)
      setProfileIsLoadding(true)

      client.assets
        .upload('image', e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((data) => {
          setProfile(data)
          setProfileIsLoadding(false)
        })
        .catch((error) => {
          console.log('Image upload error', error)
        })
    } else {
      setWrongeImagetype(true)
    }
  }

  const uploadBanner = (e) => {
    const { type, name } = e.target.files[0]
    if (
      type === 'image/png' ||
      type === 'image/jpeg' ||
      type === 'image/svg' ||
      type === 'image/gif' ||
      type === 'image/tiff'
    ) {
      setWrongeImagetype(false)
      setBannerLoading(true)

      client.assets
        .upload('image', e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((data) => {
          setBanner(data)
          setBannerLoading(false)
        })
        .catch((error) => {
          console.log('Image upload error', error)
        })
    } else {
      setWrongeImagetype(true)
    }
  }

  return (
    <div className='flex justify-start items-center h-screen'>
      <div className='relative w-full h-full'>
        <video
          className='w-full h-full object-cover'
          src={everyOne}
          loop
          type='video/mp4'
          controls={false}
          autoPlay
          muted
        ></video>
        <div className='absolute flex flex-col justify-center top-0 right-0 bottom-0 left-0 bg-blackOverlay'>
          <div className='flex justify-center items-center  mb-3 p-5 w-40 mr-auto ml-auto rounded-lg'>
            <img src={logo} alt='logo' />
          </div>
          {loging ? (
            <>
              {userExist ? (
                <p className='text-center flex  justify-center align-cneter text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
                  user already exist
                </p>
              ) : (
                <SpinnerLoader message='loging in' />
              )}
            </>
          ) : (
            <form onSubmit={handleSubmite}>
              <div className='flex flex-col gap-3 justify-center items-center bg-inputBox pt-4 pb-2 pl-2 pr-2'>
                {invalid && (
                  <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
                    Invalid credentails
                  </p>
                )}
                {wrongePassword && (
                  <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
                    password dosn't match
                  </p>
                )}
                {next ? (
                  <div className='flex lg:flex-row flex-col  justify-center gap-8 items-center lg:p-5 p-5 lg:w-4/5 w-full'>
                    <div className='bg-gray-500 p-3 flex flex-0.7 w-full '>
                      <div className='flex justify-center items-center border-2 border-dotted border-black p-3 w-full h-420'>
                        {profileIsLoadding && (
                          <SpinnerLoader message='loading ...' />
                        )}
                        {wrongeImagetype && (
                          <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
                            Please fill in the required fileds
                          </p>
                        )}
                        {!profile ? (
                          <label>
                            {!profileIsLoadding && (
                              <div className='flex flex-col items-center justify-center h-full text-center'>
                                <div className='flex flex-col items-center justify-center '>
                                  <p className='font-bold text-gray-900 text-2xl'>
                                    <AiFillCloud fontSize={50} />
                                  </p>
                                  <p className='font-bold text-black-500 text-2xl'>
                                    Profile Image
                                  </p>
                                </div>
                              </div>
                            )}

                            <input
                              type='file'
                              name='upload-image'
                              onChange={uploadProfile}
                              className='w-0 h-0'
                            />
                          </label>
                        ) : (
                          <div className='relative h-full'>
                            <img
                              src={profile.url}
                              alt='img'
                              className='h-full w-full'
                            />
                            <button
                              className='absolute p-3 bottom-3 right-3 bg-white rounded-full text-xl cursor-pointer outlilne hover:shadow-md transition-all duration-500 ease-in-out'
                              type='button'
                              onClick={() => setProfile(null)}
                            >
                              <AiTwotoneDelete fontSize={25} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='bg-gray-500 p-3 flex flex-0.7 w-full '>
                      <div className='flex justify-center items-center border-2 border-dotted border-black p-3 w-full h-420'>
                        {bannerLoading && (
                          <SpinnerLoader message='loading ...' />
                        )}
                        {wrongeImagetype && (
                          <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
                            Please fill in the required fileds
                          </p>
                        )}
                        {!banner ? (
                          <label>
                            {!bannerLoading && (
                              <div className='flex flex-col items-center justify-center h-full text-center'>
                                <div className='flex flex-col items-center justify-center '>
                                  <p className='font-bold text-gray-900 text-2xl'>
                                    <AiFillCloud fontSize={50} />
                                  </p>
                                  <p className='font-bold text-black-500 text-2xl'>
                                    Banner image
                                  </p>
                                </div>
                              </div>
                            )}

                            <input
                              type='file'
                              name='upload-image'
                              onChange={uploadBanner}
                              className='w-0 h-0'
                            />
                          </label>
                        ) : (
                          <div className='relative h-full'>
                            <img
                              src={banner.url}
                              alt='img'
                              className='h-full w-full'
                            />
                            <button
                              className='absolute p-3 bottom-3 right-3 bg-white rounded-full text-xl cursor-pointer outlilne hover:shadow-md transition-all duration-500 ease-in-out'
                              type='button'
                              onClick={() => setBanner(null)}
                            >
                              <AiTwotoneDelete fontSize={25} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {isSignUp && (
                      <>
                        <Input
                          value={formData.firstName}
                          handleChange={handleChange}
                          name='firstName'
                          placeholder='FirstName'
                          type='text'
                          login
                        />
                        <Input
                          value={formData.lastName}
                          handleChange={handleChange}
                          name='lastName'
                          placeholder='lastName'
                          type='text'
                          login
                        />
                      </>
                    )}
                    <Input
                      value={formData.email}
                      handleChange={handleChange}
                      name='email'
                      placeholder='Email'
                      type='email'
                      login
                    />
                    <Input
                      value={formData.password}
                      handleChange={handleChange}
                      name='password'
                      placeholder='Password'
                      type='password'
                      login
                    />
                    {isSignUp && (
                      <Input
                        value={formData.repeatPassword}
                        handleChange={handleChange}
                        name='repeatPassword'
                        placeholder='Confirm Password'
                        type='password'
                        login
                      />
                    )}
                  </>
                )}
                {isSignUp ? (
                  <>
                    {!next ? (
                      <h1
                        className='text-white font-extrabold rounded-lg shadow-lg px-4 py-2 text-2xl hover:opacity-100 opacity-70 text-blue-500 hover:cursor-pointer'
                        onClick={(e) => {
                          e.stopPropagation()
                          setNext(true)
                        }}
                      >
                        Next
                      </h1>
                    ) : (
                      <button
                        type='submite'
                        className='text-white font-extrabold rounded-lg shadow-lg px-4 py-2 text-2xl hover:opacity-100 opacity-70 text-white bg-blue-500'
                      >
                        Sign Up
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    type='submite'
                    className={`text-white font-bold rounded-md shadow-lg px-4 py-2 text-2xl hover:opacity-100 opacity-70 ${
                      !isSignUp ? 'text-white bg-blue-500' : 'text-blue-500 '
                    }`}
                  >
                    Sign In
                  </button>
                )}
                <button
                  type='button'
                  onClick={handleClick}
                  className='text-white font-bold '
                >
                  {isSignUp
                    ? 'Alredy have an account ? sign in'
                    : "Don't have an account ? sign up"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
