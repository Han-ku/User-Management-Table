import React from 'react'

const SingleUser = ({ user, keys }) => {
  return (
    <>
        {keys.map((key) => (
            <td key={key}>
                {typeof user[key] === 'object' && user[key] !== null
                    ? JSON.stringify(user[key]) 
                    : user[key]}
            </td>
        ))}
    </>
  )
}

export default SingleUser