import { Left, Right } from '@icon-park/react'
import ImgForEmpty from 'public/img-for-empty.png'

import { useState } from 'react'

import Image from 'next/legacy/image'
import { ThumbnailResponseTypeEnum } from 'ume-service-openapi'

import { TimeFormat } from '~/components/time-format'

import { trpc } from '~/utils/trpc'

const PostByID = (props: { postId: string }) => {
  const [imageIndex, setImageIndex] = useState(0)
  const getPostById = trpc.useQuery(['community.getPostByID', props.postId])

  const thumbnailsLength = (getPostById?.data?.data.thumbnails?.length ?? 1) - 1

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
            {getPostById?.data?.data?.thumbnails[imageIndex]?.type == ThumbnailResponseTypeEnum.Image ? (
              <Image
                src={getPostById?.data?.data?.thumbnails[imageIndex]?.url ?? ImgForEmpty}
                alt={`${getPostById?.data?.data?.thumbnails[imageIndex]?.type}`}
                layout="fill"
                objectFit="scale-down"
              />
            ) : (
              <div className="h-[90%] flex justify-center items-center">
                <video controls autoPlay>
                  <source src={getPostById?.data?.data?.thumbnails[imageIndex]?.url} type="video/mp4" />
                  <source src={getPostById?.data?.data?.thumbnails[imageIndex]?.url} type="video/ogg" />
                </video>
              </div>
            )}

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
        <div className="col-span-2 p-5 bg-zinc-800 text-white rounded-tl-xl mr-0">
          <div className="flex gap-3 mb-5">
            <div className="relative w-[70px] h-[70px]">
              <Image
                className="absolute rounded-full"
                layout="fill"
                objectFit="cover"
                src={getPostById?.data?.data?.user.avatarUrl ?? ImgForEmpty}
                alt="Provider Image"
              />
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-xl">{getPostById?.data?.data?.user.name}</p>
              <p className="font-normal text-lg opacity-40">
                {TimeFormat({ date: getPostById?.data?.data?.createdAt || 0 })}
              </p>
            </div>
          </div>
          <div>
            <p className="font-normal text-lg">{getPostById?.data?.data?.content}</p>
          </div>
        </div>
      </div>
    </>
  )
}
export default PostByID
