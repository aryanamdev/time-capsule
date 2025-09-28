import React from 'react'

const page = ({params}: {params: {id: string}}) => {
  return (
    <div>Page for user {params.id}</div>
  )
}

export default page