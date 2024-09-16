import React from 'react'

interface SingleUserProps {
  user: Record<string, any>
  keys: string[]
}

const SingleUser: React.FC<SingleUserProps> = React.memo(({ user, keys }) => {
  return (
    <>
        {keys.map((key) => (
            <td key={key}>
                {typeof user[key] === 'object' && user[key] !== null
                  ? Array.isArray(user[key])
                  ? user[key].join(', ')
                  : Object.keys(user[key]).map((subKey) => (
                      <div key={subKey}>
                      <strong>{subKey}:</strong> {user[key][subKey]}
                    </div>
                  ))
                  : user[key]}
            </td>
        ))}
    </>
  )
})

export default SingleUser