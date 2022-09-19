import React from 'react'

const Input = ({
  handleChange,
  type,
  name,
  placeholder,
  value,
  onFocus,
  search,
  login,
  comment,
}) => {
  return (
    <>
      <input
        className={`bg-white outline-none border-4 border-b-2 border-black-900 shadow-lg p-3 rounded-md  ${
          search && 'w-full rounded-lg mr-2'
        } ${login && ' w-full md:w-[40%]'} ${comment && 'w-full'}`}
        value={value}
        onChange={handleChange}
        onFocus={onFocus}
        type={type}
        name={name}
        placeholder={placeholder}
      />
    </>
  )
}

export default Input
