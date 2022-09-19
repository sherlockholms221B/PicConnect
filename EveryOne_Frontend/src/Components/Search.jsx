import React, { useState, useEffect } from 'react'
import { MasonryLayout, client, SpinnerLoader } from '../imports'
import { searchQuery, allSearchQuery } from '../utils/data'

const Search = ({ searchTerm, setSearchTerm }) => {
  const [pins, setPins] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    if (searchTerm) {
      const query = searchQuery(searchTerm.toLowerCase())
      client.fetch(query).then((data) => {
        setPins(data)
        setIsLoading(false)
      })
    } else {
      client.fetch(allSearchQuery).then((data) => {
        setPins(data)
        setIsLoading(false)
      })
    }
  }, [searchTerm])

  if (isLoading) {
    return <SpinnerLoader message='Searching for posts' />
  }
  return (
    <div>
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}

      {pins?.length === 0 && searchTerm !== '' && !isLoading && (
        <div className='mt-10 text-center text-2xl'>No post found</div>
      )}
    </div>
  )
}

export default Search
