import React from 'react'
import Masonry from 'react-masonry-css'
import { Pin } from '../imports'

const MasonryLayout = ({ pins }) => {
  const breakPiont = {
    default: 4,
    3000: 5,
    2000: 4,
    1200: 3,
    1000: 2,
    500: 1,
  }
  return (
    <Masonry className='flex amimate-slide-fwwd' breakpointCols={breakPiont}>
      {pins?.map((pin) => (
        <Pin key={pin._id} pin={pin} className='w-max' />
      ))}
    </Masonry>
  )
}

export default MasonryLayout
