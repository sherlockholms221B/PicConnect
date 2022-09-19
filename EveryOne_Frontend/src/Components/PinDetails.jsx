import React, { useState, useEffect } from 'react'
import { IoMdDownload } from 'react-icons/io'
import { BiCommentX } from 'react-icons/bi'
import { v4 as uuidv4 } from 'uuid'
import { Link, useParams } from 'react-router-dom'
import { SpinnerLoader, MasonryLayout, client, Input } from '../imports.js'
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data'
import { urlFor } from '../Client'

const PinDetails = ({ user }) => {
  const [pins, setPins] = useState(null)
  const [pinDetails, setPinDetials] = useState(false)
  const [comment, setComment] = useState('')
  const [addingAComment, setAddingAComment] = useState(false)
  const { pinId } = useParams()
  console.log(pinId)
  const { _id: userId } = user
  const fatchDetails = () => {
    let query = pinDetailQuery(pinId)

    client.fetch(query).then((data) => {
      setPinDetials(data[0])

      if (data[0]) {
        query = pinDetailMorePinQuery(data[0])

        client.fetch(query).then((data) => {
          setPins(data)
        })
      }
    })
  }
  useEffect(() => {
    let query = pinDetailQuery(pinId)

    client.fetch(query).then((data) => {
      setPinDetials(data[0])
      console.log(data[0])

      if (data[0]) {
        query = pinDetailMorePinQuery(data[0])

        client.fetch(query).then((data) => {
          console.log(data)
          setPins(data)
        })
      }
    })
  }, [pinId])

  const addComment = () => {
    if (comment) {
      setAddingAComment(true)

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: 'postedBy',
              _ref: userId,
            },
          },
        ])
        .commit()
        .then(() => {
          fatchDetails()

          setComment('')
          setAddingAComment(false)
          window.location.reload()
        })
    }
  }

  if (!pinDetails) {
    return <SpinnerLoader message='loading post' />
  }

  return (
    <>
      <div
        className='flex xl:flex-row flex-col m-auto bg-white '
        style={{ maxWidth: '1500px', borderRadius: '3px' }}
      >
        <div className='flex justify-center items-center md:items-start flex-initial'>
          <img
            src={pinDetails?.image && urlFor(pinDetails.image).width(400).url()}
            alt='pin-details'
            className='rounded-t-3xl rounded-b-lg '
          />
        </div>
        <div className='w-full p-5 flex-1 xl:min-620'>
          <div className='flex items-center justify-between'>
            <div className='flex gap-2 items-center'>
              <a
                href={`${pinDetails.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className='bg-gray-500 p-2  h-12 w-12 rounded-full flex items-center justify-center text-xl text-dark opacity-50 hover:opacity-100 hover:shadow-lg outline-none'
              >
                <IoMdDownload fontSize={30} />
              </a>
            </div>
            <a
              href={pinDetails.destination}
              target='_blank'
              rel='noreferrer'
              className=''
            >
              {pinDetails.destination.length > 20
                ? pinDetails.destination.slice(8, 21)
                : pinDetails.destination.slice(8)}
            </a>
          </div>
          <div className=''>
            <h1 className='text-4xl font-bold break-words mt-8'>
              {pinDetails.title}
            </h1>
            <p className='mt-3 '>{pinDetails.about}</p>
          </div>
          <Link
            to={`user-profile/${pinDetails.postedBy._id}`}
            className='flex gap-2 mt-5 items-center bg-white rounded-lg'
          >
            <img
              src={urlFor(pinDetails.postedBy.image)
                ?.width(50)
                .height(50)
                .url()}
              className='w-13 h-13 rounded-full object-cover'
              alt='creator'
            />
            <p className='font-semibold capitalize text-black text-3xl'>
              {pinDetails.postedBy.firstName} {pinDetails.postedBy.lastName}
            </p>
          </Link>

          <h2 className='mt-5 text-2xl'>comments</h2>
          <div className='max-h-370 overflow-y-auto border-4 border-b-2 border-black-900 shadow-lg p-4'>
            {pinDetails.comments ? (
              <>
                {pinDetails.comments?.map((comment, i) => (
                  <div
                    className='flex gap-2 mt-5 items-center bg-white rouneded-5xl p-3 border-4 border-b-2 border-black-900 shadow-lg w-inherit'
                    key={i}
                  >
                    <img
                      src={urlFor(comment.postedBy.image)
                        .height(50)
                        .width(50)
                        .url()}
                      alt='user-profile'
                      className='w-8 h-8 rounded-full cursor-pointer'
                    />
                    <div className='flex flex-col '>
                      <p className='font-bold '>
                        {comment.postedBy.firstName.concat(
                          comment.postedBy.lastName
                        )}
                      </p>
                      <p className='mt-2'>{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className='w-full h-full text-center flex flex-col justify-center items-center'>
                <BiCommentX fontSize={80} className='text-gray-500' />
                <h2 className='font-bold text-gray-400 mt-3'>
                  No comments yet
                </h2>
              </div>
            )}
          </div>

          <div className='flex flex-wrap mt-6 gap-3 '>
            <Link
              to={`user-profile/${pinDetails.postedBy._id}`}
              className='flex gap-2 mt-5 items-center bg-white rounded-lg'
            >
              <img
                src={urlFor(pinDetails.postedBy.image)
                  ?.width(50)
                  .height(50)
                  .url()}
                className='w-13 h-13 rounded-full object-cover'
                alt='creator'
              />
            </Link>
            <Input
              type='text'
              placeholder='Add a comment'
              value={comment}
              handleChange={(e) => setComment(e.target.value)}
              comment
            />
            <button
              className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
              type='button'
              onClick={addComment}
            >
              {addingAComment ? 'posting the comment' : 'Post'}
            </button>
          </div>
        </div>
      </div>
      {pins?.length !== 0 ? (
        <>
          <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
            more like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <div className='w-full h-full text-center flex flex-col justify-center items-center mb-3'>
          <BiCommentX fontSize={80} className='text-gray-500' />
          <h2 className='font-bold text-gray-400 mt-3'>
            No recomended posts yet
          </h2>
        </div>
      )}
    </>
  )
}

export default PinDetails
