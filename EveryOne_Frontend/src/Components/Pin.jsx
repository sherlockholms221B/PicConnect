import React, { useState } from 'react'
import { client, urlFor } from '../Client'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { IoMdDownload } from 'react-icons/io'
import { AiTwotoneDelete } from 'react-icons/ai'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { user } from '../utils/user'

const Pin = ({ pin }) => {
  const { image, postedBy, _id, destination, save } = pin
  const { image: creatorImage, firstName, lastName } = postedBy

  const navigate = useNavigate()
  const [postHoveredOn, setPostHoveredOn] = useState(false)

  const { _id: userId } = user()

  const isDownloaded = Boolean(
    save?.filter((item) => item.postedBy._id === userId)?.length
  )

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload()
    })
  }

  const downloadPin = (id) => {
    if (!isDownloaded) {
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [
          {
            _key: uuidv4(),
            userId: userId,
            postedBy: {
              _type: postedBy,
              _ref: userId,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload()
        })
    }
  }

  return (
    <div className='m-2  '>
      <div
        className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
        onMouseEnter={() => setPostHoveredOn(true)}
        onMouseLeave={() => setPostHoveredOn(false)}
        onClick={() => navigate(`pin-detail/${_id}`)}
      >
        <img
          className='rounded-lg w-full '
          alt='user-post'
          src={urlFor(image).width(350).url()}
        />
        {postHoveredOn && (
          <div className='absolute top-0 bottom-0 right-0  w-full h-full flex felx-col justify-between p-1 pr-2 pt-2 pb-2 z-50 '>
            <div className='flex flex-col items-center justify-between w-full '>
              <div className='flex gap-2 justify-between w-full'>
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className='bg-white  h-9 w-9 rounded-full flex items-center justify-center text-xl text-dark opacity-50 hover:opacity-100 hover:shadow-lg outline-none'
                >
                  <IoMdDownload fontSize={25} />
                </a>
                {isDownloaded ? (
                  <button
                    type='button'
                    className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 hover:shadow-md text-base rounded-3xl outline-none  '
                  >
                    {save?.length} Saved
                  </button>
                ) : (
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation()
                      downloadPin(_id)
                    }}
                    className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 hover:shadow-md text-base rounded-3xl outline-none  '
                  >
                    Save
                  </button>
                )}
              </div>

              <div className='flex justify-between items-center gap-2 w-full '>
                {destination && (
                  <a
                    href={destination}
                    target='_blank'
                    rel='noreferrer'
                    className='flex items-center  bg-white text-block p-1 pl-2 pr-2 font-bold rounded-full opacity-70 hover:opacity-100 hover:shadow-lg'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <BsFillArrowUpRightCircleFill
                      fontSize={25}
                      className='mr-2'
                    />
                    {destination.length > 20
                      ? destination.slice(8, 21)
                      : destination.slice(8)}
                  </a>
                )}
                {postedBy?._id === userId && (
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation()
                      deletePin(_id)
                    }}
                    className='bg-white opacity-70 hover:opacity-100 text-darkfont-bold px-3 py-1 hover:shadow-md text-base rounded-3xl outline-none  '
                  >
                    <AiTwotoneDelete fontSize={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Link
        to={`user-profile/${userId}`}
        className='flex gap-2 mt-4 items-center'
      >
        <img
          src={urlFor(creatorImage)?.width(50).height(50).url()}
          className='w-8 h-8 rounded-full object-cover'
          alt='creator'
        />
        <p className='font-semibold capitalize'>
          {firstName} {lastName}
        </p>
      </Link>
    </div>
  )
}

export default Pin
