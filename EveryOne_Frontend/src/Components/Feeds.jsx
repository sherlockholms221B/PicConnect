import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { client, MasonryLayout, SpinnerLoader } from '../imports'
import { allSearchQuery, searchQuery } from '../utils/data'
import { BiCommentX } from 'react-icons/bi'

const Feeds = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [pins, setPins] = useState(null)
  const { categoryId } = useParams()
  const location = useLocation()

  useEffect(() => {
    setIsLoading(true)

    if (categoryId) {
      const query = searchQuery(categoryId)

      client.fetch(query).then((data) => {
        setPins(data)
        setIsLoading(false)
      })
    } else
      client.fetch(allSearchQuery).then((data) => {
        setPins(data)
        setIsLoading(false)
      })
  }, [categoryId, location])

  if (isLoading === true) {
    return <SpinnerLoader message='fatching new idea and posts' />
  }

  if (pins?.length === 0) {
    return (
      <div className='w-full h-screen capitalize flex flex-col justify-center items-center'>
        <BiCommentX fontSize={100} className='text-gray-500' />
        <h2 className='font-bold text-2xl text-gray-500 mt-6'>
          No post found for {categoryId}
        </h2>
      </div>
    )
  }

  return <div>{pins && <MasonryLayout pins={pins} />}</div>
}

export default Feeds
