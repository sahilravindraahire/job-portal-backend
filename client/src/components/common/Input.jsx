import React from 'react'

function Input({
    label,
    id,
    error,
    className = "",
    as = "input",
    children,
    ...rest
}) {

    const Component = as

  return (
    <div className='flex flex-col gap-1.5 w-full'>
      {label && (
        <label htmlFor={id} className='stamp text-gray-mid'>
            {label}
        </label>
      )}
      <Component
      id={id}
      className={`input-field w-full px-3.5 py-2.5 text-sm ${className}`}
      {...rest}
      >
        {children}
      </Component>
      {error && <p className='text-xs text-danger font-mono'>{error}</p>}
    </div>
  )
}

export default Input
