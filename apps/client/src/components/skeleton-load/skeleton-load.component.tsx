import detailBackground from 'public/detail-cover-background.png'
import ImgForEmpty from 'public/img-for-empty.png'

import React from 'react'

import Image from 'next/legacy/image'

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
    <div className="border border-gray-300 rounded-2xl p-3 animate-pulse">
      <table className="w-full text-center">
        <thead>
          <tr>
            <th className="py-2">
              <div className="relative w-[100px] h-[40px] bg-gray-300 animate-pulse"></div>
            </th>
            <th className="py-2">
              <div className="relative w-[100px] h-[40px] bg-gray-300 animate-pulse"></div>
            </th>
            <th className="py-2">
              <div className="relative w-[100px] h-[40px] bg-gray-300 animate-pulse"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: skeletonRowCount }, (_, index) => (
            <tr key={index} className="">
              <td className="py-2">
                <div className="flex items-center justify-center bg-gray-300 animate-pulse">
                  <span className="w-[100px] h-[40px]" />
                </div>
              </td>
              <td className="py-2">
                <div className="min-w-[150px] flex justify-center items-center gap-2 bg-gray-300 animate-pulse">
                  <div className="relative w-8 h-8">
                    <span className="w-[100px] h-[40px]" />
                  </div>
                  <span className="w-[100px] h-[40px] bg-gray-300 animate-pulse" />
                </div>
              </td>
              <td className="py-2">
                <div className="flex items-center justify-center bg-gray-300 animate-pulse">
                  <span className="w-[100px] h-[40px]" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const CategoryGridSkeleton = () => {
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

const BGFullGridSkeleton = () => {
  return (
    <div className="w-full h-full animate-pulse flex-row items-center justify-center rounded-xl border-2 border-gray-300">
      <div className="flex flex-col pl-5 pr-5 pb-5 gap-2">
        <CommentSkeletonLoader />
      </div>
    </div>
  )
}

const ChatSkeleton = () => {
  return (
    <>
      <div className="w-full h-full grid grid-cols-10 pl-5 pr-5">
        <div className="col-span-3">
          <div className="animate-pulse w-full h-10 bg-gray-300 rounded mb-5"></div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse mb-5">
              <div className="w-full h-12 bg-gray-300 rounded mb-2"></div>
              <div className="w-2/3 h-4 bg-gray-300 rounded mb-1"></div>
            </div>
          ))}
        </div>
        <div className="col-span-7">
          <div className="flex flex-col pl-5 pr-5 pb-5 gap-2">
            <CommentSkeletonLoader />
          </div>
        </div>
      </div>
    </>
  )
}

const SkeletonForAccountSetting = () => {
  return (
    <>
      <div className="skeleton-loader animate-pulse">
        <div className="w-full flex items-center gap-24 p-10">
          <div className="flex justify-start items-center gap-24">
            <div className="skeleton-avatar w-[250px] h-[300px] rounded-lg bg-gray-300"></div>
          </div>
          <div className="w-full skeleton-content space-y-4">
            <div className="skeleton-line w-1/2 h-7 bg-gray-300"></div>
            <div className="skeleton-line w-3/4 h-7 bg-gray-300"></div>
            <div className="skeleton-line w-1/2 h-7 bg-gray-300"></div>
            <div className="skeleton-line w-4/5 h-7 bg-gray-300"></div>
            <div className="skeleton-line w-2/3 h-7 bg-gray-300"></div>
            <div className="skeleton-line w-1/3 h-7 bg-gray-300"></div>
            <div className="skeleton-line w-4/5 h-7 bg-gray-300"></div>
          </div>
        </div>
        <div className="flex justify-center gap-10 mt-20">
          <div className="skeleton-button w-20 h-8 bg-gray-300 rounded-lg"></div>
          <div className="skeleton-button w-20 h-8 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </>
  )
}

const SkeletonDetailProvider = () => {
  return (
    <>
      <div style={{ height: '380px', margin: '0 70px' }}>
        <div className="absolute top-16 left-0" style={{ width: '100%', height: '416px' }}>
          <Image layout="fill" src={detailBackground} alt="background" />
        </div>
        <div className="h-full flex flex-col justify-end gap-5">
          <div className="flex flex-row justify-between md:items-center items-baseline px-7 pb-5">
            <div className="flex md:flex-row md:gap-x-8 flex-col gap-y-2" style={{ zIndex: 2 }}>
              <div style={{ width: 194, height: 182, position: 'relative' }}>
                <Image
                  className="absolute rounded-full"
                  layout="fill"
                  objectFit="cover"
                  src={ImgForEmpty}
                  alt="avatar"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid mt-10 w-full h-screen grid-cols-10 gap-10 px-10">
        <div className="col-span-2">
          <BGFullGridSkeleton />
        </div>
        <div className="col-span-5">
          <BGFullGridSkeleton />
        </div>
        <div className="col-span-3">
          <BGFullGridSkeleton />
        </div>
      </div>
    </>
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
  BGFullGridSkeleton,
  ChatSkeleton,
  SkeletonForAccountSetting,
  SkeletonDetailProvider,
}
