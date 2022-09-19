import React from 'react'
import { Bars, ThreeDots } from 'react-loader-spinner'

const SpinnerLoader = ({ message, creating }) => {
  return (
    <div className='flex flex-col justify-center items-center w=full h-screen text-center'>
      {creating ? (
        <Bars
          height='80'
          width='80'
          color='blue'
          ariaLabel='bars-loading'
          wrapperStyle={{}}
          wrapperClass=''
          visible={true}
        />
      ) : (
        <ThreeDots
          height='80'
          width='80'
          radius='9'
          color='gray'
          ariaLabel='three-dots-loading'
          wrapperStyle={{}}
          wrapperClassName=''
          visible={true}
        />
      )}
      <p className='text-3xl text-center px-2 mt-4'>{message}</p>
    </div>
  )
}

export default SpinnerLoader
