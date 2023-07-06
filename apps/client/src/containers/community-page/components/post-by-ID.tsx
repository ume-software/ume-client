import { Left, Right } from '@icon-park/react'

import { useState } from 'react'

import Image from 'next/legacy/image'

import { TimeFormat } from '~/components/time-format'

const PostByID = (props) => {
  const [imageIndex, setImageIndex] = useState(0)

  const thumbnailsLength = props.postData?.thumbnails?.length - 1

  const handleNextImage = () => {
    if (imageIndex < thumbnailsLength) {
      setImageIndex(imageIndex + 1)
    }
  }

  const handlePreviousImage = () => {
    if (imageIndex > 0 && thumbnailsLength > 0) {
      setImageIndex(imageIndex - 1)
    }
  }

  return (
    <>
      <div className="grid grid-cols-10">
        <div className="col-span-8">
          <div className="h-screen w-full relative">
            <Image
              src={props.postData?.thumbnails[imageIndex]?.url}
              alt={`${props.postData?.thumbnails[imageIndex]?.type}`}
              layout="fill"
              objectFit="contain"
            />

            <div className="absolute w-full px-10 top-[40%] flex justify-between">
              <div className="p-3 rounded-full hover:bg-gray-400" onClick={handlePreviousImage}>
                <Left theme="filled" size="35" fill="#FFFFFF" strokeLinejoin="bevel" />
              </div>
              <div className="p-3 rounded-full hover:bg-gray-400" onClick={handleNextImage}>
                <Right theme="filled" size="35" fill="#FFFFFF" strokeLinejoin="bevel" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 p-5 bg-zinc-800 text-white rounded-t-xl mr-9">
          <div className="flex gap-3 mb-5">
            <div className="relative w-[70px] h-[70px]">
              <Image
                className="absolute rounded-full"
                layout="fill"
                objectFit="cover"
                src={props.postData?.user.avatarUrl}
                alt="Provider Image"
              />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-xl">{props.postData?.user.name}</p>
              <p className="font-normal text-lg opacity-40">{TimeFormat({ date: props.postData?.createdAt })}</p>
            </div>
          </div>
          <div>
            <p className="font-normal text-lg">{props.postData?.content}</p>
          </div>
        </div>
      </div>
    </>
  )
}
export default PostByID
