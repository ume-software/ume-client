import React from 'react'

import { Shimmer } from 'react-shimmer'

const PostSkeletonLoader = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full flex-1 flex-col items-center">
        <div className="w-full animate-pulse flex-row items-center justify-center space-x-1 rounded-xl border p-6 ">
          <div className="flex flex-col space-y-2">
            <div className="h-6 w-3/12 rounded-md bg-gray-300 "></div>
            <div className="h-6 w-5/12 rounded-md bg-gray-300 "></div>
            <div className="h-6 w-9/12 rounded-md bg-gray-300 "></div>
            <div className="h-30 w-full rounded-md bg-gray-300 "></div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col items-center">
        <div className="w-full animate-pulse flex-row items-center justify-center space-x-1 rounded-xl border p-6 ">
          <div className="flex flex-col space-y-2">
            <div className="h-6 w-3/12 rounded-md bg-gray-300 "></div>
            <div className="h-6 w-5/12 rounded-md bg-gray-300 "></div>
            <div className="h-6 w-9/12 rounded-md bg-gray-300 "></div>
            <div className="h-30 w-full rounded-md bg-gray-300 "></div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CommentSkeletonLoader = () => {
  return (
    <>
      <div className="flex w-full flex-1 flex-col items-center">
        <div className="w-full animate-pulse flex-row items-center justify-center space-x-1 rounded-xl border p-6 ">
          <div className="flex flex-col space-y-2">
            <div className="h-6 w-5/12 rounded-md bg-gray-300 "></div>
            <div className="h-6 w-full rounded-md bg-gray-300 "></div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col items-center">
        <div className="w-full animate-pulse flex-row items-center justify-center space-x-1 rounded-xl border p-6 ">
          <div className="flex flex-col space-y-2">
            <div className="h-6 w-5/12 rounded-md bg-gray-300 "></div>
            <div className="h-6 w-full rounded-md bg-gray-300 "></div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col items-center">
        <div className="w-full animate-pulse flex-row items-center justify-center space-x-1 rounded-xl border p-6 ">
          <div className="flex flex-col space-y-2">
            <div className="h-6 w-5/12 rounded-md bg-gray-300 "></div>
            <div className="h-6 w-full rounded-md bg-gray-300 "></div>
          </div>
        </div>
      </div>
    </>
  )
}

const PlayerSkeletonLoader = () => {
  return (
    <>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-3 mx-5 px-10">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-[#292734] text-white rounded-3xl pl-6 pb-4 mt-6 max-w-72 h-70 group hover:duration-500 hover:ease-in-out block"
          >
            <div className="flex flex-row justify-between">
              <div className="w-[140px] h-[140px] relative bg-gray-300 animate-pulse"></div>
              <button className="bg-purple-600 w-16 h-10 rounded-tr-3xl rounded-bl-3xl hover:scale-105 hover:duration-500 hover:ease-in-out animate-pulse"></button>
            </div>
            <div>
              <h3 className="text-lg font-semibold bg-gray-300 w-2/3 mt-2 animate-pulse">&nbsp;</h3>
              <div className="bg-gray-300 animate-pulse w-20 h-5 mt-2"></div>
              <div className="font-sans bg-gray-300 animate-pulse w-2/3 h-4 mt-2"></div>
              <div className="bg-gray-300 animate-pulse w-16 h-4 mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

const SliderSkeletonLoader = () => (
  <div className="w-full overflow-hidden">
    <div className="flex select-none duration-0 min-w-max">
      {[...Array(10)].map((_, index) => (
        <div tabIndex={index} className="p-3 duration-500 ease-in-out cursor-pointer hover:scale-105" key={index}>
          <div className="relative w-[170px] h-[250px] bg-gray-300 animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
)

const NotificateSkeletonLoader = () => (
  <div className="w-full overflow-hidden">
    <div className="w-full flex flex-col select-none duration-0 min-w-max">
      {[...Array(2)].map((_, index) => (
        <div
          tabIndex={index}
          className="w-full h-[150px] mt-3 p-3 duration-500 ease-in-out cursor-pointer bg-gray-100 hover:scale-105"
          key={index}
        >
          <div className="relative w-full h-2/3 bg-gray-300 animate-pulse"></div>
          <div className="w-full h-1/3 flex justify-around mt-2">
            <div className="relative w-1/3 h-2/3 bg-gray-300 animate-pulse"></div>
            <div className="relative w-1/3 h-2/3 bg-gray-300 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const TableSkeletonLoader = () => {
  const skeletonRowCount = 2

  return (
    <table className="w-full text-center">
      <thead>
        <tr>
          <th className="py-2">Top</th>
          <th className="py-2">Tên</th>
          <th className="py-2">Số tiền</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: skeletonRowCount }, (_, index) => (
          <tr key={index} className="">
            <td className="py-2">
              <Shimmer width={30} height={40} />
            </td>
            <td className="py-2">
              <div className="min-w-[150px] flex justify-center items-center gap-2">
                <div className="relative w-8 h-8">
                  <Shimmer width={8} height={8} />
                </div>
                <Shimmer width={100} height={10} />
              </div>
            </td>
            <td className="py-2">
              <div className="flex items-center justify-center">
                <Shimmer width={40} height={40} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const CategoryGridSkeleton = () => {
  const skeletonData = Array(5).fill(null) // Replace 5 with the number of grid items

  return (
    <div className="w-full h-full px-6 overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-5 pb-5 place-items-center">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="my-8">
            <div className="relative w-[170px] h-[230px]">
              <div className="skeleton-image"></div>
            </div>
            <div className="skeleton-text"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export {
  PostSkeletonLoader,
  CommentSkeletonLoader,
  PlayerSkeletonLoader,
  SliderSkeletonLoader,
  NotificateSkeletonLoader,
  TableSkeletonLoader,
  CategoryGridSkeleton,
}
