import detailBackground from 'public/detail-cover-background.png'
import ImgForEmpty from 'public/img-for-empty.png'
import logo from 'public/logo.png'

import React from 'react'

import Image from 'next/legacy/image'

const PageLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen animate-spin rounded-xl p-5">
      <Image width={130} height={130} alt="logo-ume" src={logo} layout="fixed" />
    </div>
  )
}

const PostSkeletonLoader = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center flex-1 w-full">
        <div className="flex-row items-center justify-center w-full p-6 space-x-1 border animate-pulse rounded-xl ">
          <div className="flex flex-col space-y-2">
            <div className="w-3/12 h-6 bg-gray-300 rounded-md "></div>
            <div className="w-5/12 h-6 bg-gray-300 rounded-md "></div>
            <div className="w-9/12 h-6 bg-gray-300 rounded-md "></div>
            <div className="w-full bg-gray-300 rounded-md h-30 "></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center flex-1 w-full">
        <div className="flex-row items-center justify-center w-full p-6 space-x-1 border animate-pulse rounded-xl ">
          <div className="flex flex-col space-y-2">
            <div className="w-3/12 h-6 bg-gray-300 rounded-md "></div>
            <div className="w-5/12 h-6 bg-gray-300 rounded-md "></div>
            <div className="w-9/12 h-6 bg-gray-300 rounded-md "></div>
            <div className="w-full bg-gray-300 rounded-md h-30 "></div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CommentSkeletonLoader = () => {
  return (
    <>
      <div className="flex flex-col items-center flex-1 w-full">
        <div className="flex-row items-center justify-center w-full p-6 space-x-1 border animate-pulse rounded-xl ">
          <div className="flex flex-col space-y-2">
            <div className="w-5/12 h-6 bg-gray-300 rounded-md "></div>
            <div className="w-full h-6 bg-gray-300 rounded-md "></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center flex-1 w-full">
        <div className="flex-row items-center justify-center w-full p-6 space-x-1 border animate-pulse rounded-xl ">
          <div className="flex flex-col space-y-2">
            <div className="w-5/12 h-6 bg-gray-300 rounded-md "></div>
            <div className="w-full h-6 bg-gray-300 rounded-md "></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center flex-1 w-full">
        <div className="flex-row items-center justify-center w-full p-6 space-x-1 border animate-pulse rounded-xl ">
          <div className="flex flex-col space-y-2">
            <div className="w-5/12 h-6 bg-gray-300 rounded-md "></div>
            <div className="w-full h-6 bg-gray-300 rounded-md "></div>
          </div>
        </div>
      </div>
    </>
  )
}

const PlayerSkeletonLoader = () => {
  return (
    <div className="grid gap-3 px-10 mx-5 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="bg-[#292734] text-white rounded-3xl pl-6 pb-4 mt-6 w-full h-72 group hover:duration-500 hover:ease-in-out block"
        >
          <div className="flex flex-row justify-between">
            <div className="w-[140px] h-[140px] relative bg-gray-300 animate-pulse"></div>
            <button className="w-16 h-10 bg-purple-600 rounded-tr-3xl rounded-bl-3xl hover:scale-105 hover:duration-500 hover:ease-in-out animate-pulse"></button>
          </div>
          <div>
            <h3 className="w-2/3 mt-2 text-lg font-semibold bg-gray-300 animate-pulse">&nbsp;</h3>
            <div className="w-20 h-5 mt-2 bg-gray-300 animate-pulse"></div>
            <div className="w-2/3 h-4 mt-2 font-sans bg-gray-300 animate-pulse"></div>
            <div className="w-16 h-4 mt-2 bg-gray-300 animate-pulse"></div>
          </div>
          <div className="flex justify-end pr-6">
            <div className="w-16 h-4 mt-2 bg-gray-300 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
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
    <div className="flex flex-col w-full select-none duration-0 min-w-max">
      {[...Array(2)].map((_, index) => (
        <div
          tabIndex={index}
          className="w-full h-[150px] mt-3 p-3 duration-500 ease-in-out cursor-pointer bg-gray-700 rounded-lg hover:scale-105"
          key={index}
        >
          <div className="relative w-full bg-gray-500 h-2/3 animate-pulse"></div>
          <div className="flex justify-around w-full mt-2 h-1/3">
            <div className="relative w-1/3 bg-gray-500 h-2/3 animate-pulse"></div>
            <div className="relative w-1/3 bg-gray-500 h-2/3 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const TableSkeletonLoader = () => {
  const skeletonRowCount = 2

  return (
    <div className="p-3 border border-gray-300 rounded-2xl animate-pulse">
      <table className="w-full text-center">
        <thead>
          <tr>
            <th className="w-full py-2">
              <div className="relative w-full h-[40px] bg-gray-300 animate-pulse"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: skeletonRowCount }, (_, index) => (
            <tr key={index} className="">
              <td className="w-full py-2">
                <div className="flex items-center justify-center bg-gray-300 animate-pulse">
                  <span className="w-full h-[40px]" />
                </div>
              </td>
              <td className="w-full py-2">
                <div className="flex items-center justify-center bg-gray-300 animate-pulse">
                  <span className="w-full h-[40px]" />
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
    <div className="flex-row items-center justify-center w-full h-full border-2 border-gray-300 animate-pulse rounded-xl">
      <div className="flex flex-col gap-2 pb-5 pl-5 pr-5">
        <CommentSkeletonLoader />
      </div>
    </div>
  )
}

const ChatSkeleton = () => {
  return (
    <div className="grid w-full h-full grid-cols-10 pl-5 pr-5">
      <div className="col-span-3">
        <div className="w-full h-10 mb-5 bg-gray-300 rounded animate-pulse"></div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="mb-5 animate-pulse">
            <div className="w-full h-12 mb-2 bg-gray-300 rounded"></div>
            <div className="w-2/3 h-4 mb-1 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
      <div className="col-span-7">
        <div className="flex flex-col gap-2 pb-5 pl-5 pr-5">
          <CommentSkeletonLoader />
        </div>
      </div>
    </div>
  )
}

const SkeletonForAccountSetting = () => {
  return (
    <div className="skeleton-loader animate-pulse">
      <div className="flex items-center w-full gap-24 p-10">
        <div className="flex items-center justify-start gap-24">
          <div className="skeleton-avatar w-[250px] h-[300px] rounded-lg bg-gray-300"></div>
        </div>
        <div className="w-full space-y-4 skeleton-content">
          <div className="w-1/2 bg-gray-300 skeleton-line h-7"></div>
          <div className="w-3/4 bg-gray-300 skeleton-line h-7"></div>
          <div className="w-1/2 bg-gray-300 skeleton-line h-7"></div>
          <div className="w-4/5 bg-gray-300 skeleton-line h-7"></div>
          <div className="w-2/3 bg-gray-300 skeleton-line h-7"></div>
          <div className="w-1/3 bg-gray-300 skeleton-line h-7"></div>
          <div className="w-4/5 bg-gray-300 skeleton-line h-7"></div>
        </div>
      </div>
      <div className="flex justify-center gap-10 mt-20">
        <div className="w-20 h-8 bg-gray-300 rounded-lg skeleton-button"></div>
        <div className="w-20 h-8 bg-gray-300 rounded-lg skeleton-button"></div>
      </div>
    </div>
  )
}

const SkeletonDetailProvider = () => {
  return (
    <>
      <div style={{ height: '380px', margin: '0 150px' }}>
        <div className="absolute left-0 top-16" style={{ width: '100%', height: '416px' }}>
          <Image layout="fill" src={detailBackground} alt="background" />
        </div>
        <div className="flex flex-col justify-end h-full gap-5">
          <div className="flex flex-row items-baseline justify-between pb-5 md:items-center px-7">
            <div className="flex flex-col md:flex-row md:gap-x-8 gap-y-2" style={{ zIndex: 2 }}>
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
      <div className="mx-[150px]">
        <div className="grid w-full h-screen grid-cols-9 gap-10 px-10 mt-10">
          <div className="col-span-2">
            <BGFullGridSkeleton />
          </div>
          <div className="col-span-5">
            <BGFullGridSkeleton />
          </div>
          <div className="col-span-2">
            <BGFullGridSkeleton />
          </div>
        </div>
      </div>
    </>
  )
}

const SkeletonProviderService = () => {
  return (
    <div className="grid w-full max-h-screen grid-cols-4 gap-5">
      <div className="col-span-2">
        <BGFullGridSkeleton />
      </div>
      <div className="col-span-2">
        <BGFullGridSkeleton />
      </div>
      <div className="col-span-2">
        <BGFullGridSkeleton />
      </div>
      <div className="col-span-2">
        <BGFullGridSkeleton />
      </div>
    </div>
  )
}

export {
  PageLoading,
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
  SkeletonProviderService,
}
