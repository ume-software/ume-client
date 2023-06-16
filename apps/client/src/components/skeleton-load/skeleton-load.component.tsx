import React from 'react'

const PostSkeletonLoader = () => {
  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <div className="w-full animate-pulse flex-row items-center justify-center space-x-1 rounded-xl border p-6 ">
        <div className="flex flex-col space-y-2">
          <div className="h-6 w-3/12 rounded-md bg-gray-300 "></div>
          <div className="h-6 w-5/12 rounded-md bg-gray-300 "></div>
          <div className="h-6 w-9/12 rounded-md bg-gray-300 "></div>
          <div className="h-96 w-full rounded-md bg-gray-300 "></div>
        </div>
      </div>
    </div>
  )
}

const CommentSkeletonLoader = () => {
  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <div className="w-full animate-pulse flex-row items-center justify-center space-x-1 rounded-xl border p-6 ">
        <div className="flex flex-col space-y-2">
          <div className="h-6 w-5/12 rounded-md bg-gray-300 "></div>
          <div className="h-6 w-full rounded-md bg-gray-300 "></div>
        </div>
      </div>
    </div>
  )
}

export { PostSkeletonLoader, CommentSkeletonLoader }
