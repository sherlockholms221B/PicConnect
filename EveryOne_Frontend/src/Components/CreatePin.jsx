import React, { useState } from 'react'
import { AiFillCloud } from 'react-icons/ai'
import { AiTwotoneDelete } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'

import { client, urlFor } from '../Client'
import { SpinnerLoader, Input } from '../imports'
import { categories } from '../utils/data'

const CreatePin = ({ user }) => {
  const { image, firstName, lastName, _id } = user
  const [title, setTitle] = useState('')
  const [about, setAbout] = useState('')
  const [destination, setDestination] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [creatingPost, setCreatingPost] = useState(false)
  const [error, setError] = useState(false)
  const [category, setCategory] = useState('')
  const [imageAsset, setImageAsset] = useState(null)
  const [wrongeImagetype, setWrongeImagetype] = useState(false)

  const navigate = useNavigate()

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0]
    if (
      type === 'image/png' ||
      type === 'image/jpeg' ||
      type === 'image/svg' ||
      type === 'image/gif' ||
      type === 'image/tiff'
    ) {
      setWrongeImagetype(false)
      setIsLoading(true)

      client.assets
        .upload('image', e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((data) => {
          setImageAsset(data)
          setIsLoading(false)
        })
        .catch((error) => {
          console.log('Image upload error', error)
        })
    } else {
      setWrongeImagetype(true)
    }
  }

  const handlePost = () => {
    if (title && about && destination && imageAsset?._id && category) {
      setCreatingPost(true)
      const post = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id,
          },
        },
        userId: _id,
        postedBy: {
          _type: 'postedBy',
          _ref: _id,
        },
        category,
      }

      client.create(post).then(() => {
        setCreatingPost(false)
        navigate('/')
      })
    } else {
      setError(true)

      setTimeout(() => {
        setError(false)
      }, 2000)
    }
  }

  if (creatingPost) {
    return <SpinnerLoader message='creating...' creating />
  }

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {error && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
          Please fill in the required fileds
        </p>
      )}
      <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-5 lg:w-4/5 w-full'>
        <div className='bg-gray-500 p-3 flex flex-0.7 w-full '>
          <div className='flex justify-center items-center border-2 border-dotted border-black p-3 w-full h-420'>
            {isLoading && <SpinnerLoader message='loading ...' />}
            {wrongeImagetype && (
              <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
                Please fill in the required fileds
              </p>
            )}
            {!imageAsset ? (
              <label>
                {!isLoading && (
                  <div className='flex flex-col items-center justify-center h-full text-center'>
                    <div className='flex flex-col items-center justify-center '>
                      <p className='font-bold text-gray-900 text-2xl'>
                        <AiFillCloud fontSize={50} />
                      </p>
                      <p className='font-bold text-black-500 text-2xl'>
                        Upload Image
                      </p>
                    </div>
                    <p className='mt-32 text-gray-400 '>
                      Recomendation: Use high quality JPG, SVG, PNG, TIFF OR GIF
                      less than 20mb
                    </p>
                  </div>
                )}

                <input
                  type='file'
                  name='upload-image'
                  onChange={uploadImage}
                  className='w-0 h-0'
                />
              </label>
            ) : (
              <div className='relative h-full'>
                <img src={imageAsset.url} alt='img' className='h-full w-full' />
                <button
                  className='absolute p-3 bottom-3 right-3 bg-white rounded-full text-xl cursor-pointer outlilne hover:shadow-md transition-all duration-500 ease-in-out'
                  type='button'
                  onClick={() => setImageAsset(null)}
                >
                  <AiTwotoneDelete fontSize={25} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-1 flex-col gap-6 pl-5 mt-5 w-full text-center '>
          <Input
            type='text'
            value={title}
            handleChange={(e) => setTitle(e.target.value)}
            placeholder='Add your title'
          />

          {user && (
            <div className='flex gap-3 my-3 items-center rounded-lg bg-white'>
              <img
                src={urlFor(image).width(50).height(50).url()}
                alt='user'
                className='w-10 h-10 rounded-full'
              />
              <p className='font-bold'> {firstName.concat(lastName)}</p>
            </div>
          )}

          <Input
            type='text'
            value={about}
            handleChange={(e) => setAbout(e.target.value)}
            placeholder='What is your post about'
          />
          <Input
            type='text'
            value={destination}
            handleChange={(e) => setDestination(e.target.value)}
            placeholder='Add a destination link of your post'
          />
          <div className='flex flex-col'>
            <div>
              <p className='mb-2 font-semibold text-lg sm:text-xl'>
                Choose post Category
              </p>
              <select
                className='outline-none shadow-lg w-4/5 text-base p-2 rounded-md cursor-pointer  border-b-2 border-black-900 border-4'
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value='others' className='bg-white p-2'>
                  Select Category
                </option>
                {categories.map((item, i) => (
                  <option
                    key={i}
                    className='text-base border-0 outline-none bg-white text-black capitalize '
                    value={item.name}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex items-end mt-5 justify-end'>
              <button
                className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none'
                type='button'
                onClick={handlePost}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePin
