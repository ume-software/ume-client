import { Like } from '@icon-park/react'

import { useEffect, useState } from 'react'

import Image from 'next/legacy/image'
import Link from 'next/link'

import { CommentSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

const LikePost = (props: { postID: string }) => {
  const [likePostData, setLikePostData] = useState<any>([])
  const {
    data: likePostByID,
    isLoading: loadingLikePostByID,
    isFetching: fetchingLikePostByID,
  } = trpc.useQuery(['community.getLikePostByID', props.postID], {
    refetchOnReconnect: 'always',
    onSuccess(data) {
      setLikePostData(data?.data?.row)
    },
  })
  console.log({ likePostData })

  return (
    <>
      <div className="h-[500px] text-white overflow-y-scroll custom-scrollbar p-3">
        {loadingLikePostByID ? (
          <CommentSkeletonLoader />
        ) : (
          <>
            {likePostData.map((data) => (
              <Link key={data.id} href={`#${data.user.slug}`}>
                <div className="flex justify-between items-center m-5 p-2 rounded-xl hover:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="relative w-[50px] h-[50px]">
                      <Image
                        className="absolute rounded-full"
                        layout="fill"
                        objectFit="cover"
                        src={data.user.avatarUrl}
                        alt="Provider Image"
                      />
                    </div>
                    <p className="font-semibold text-lg">{data.user.name}</p>
                  </div>
                  <div>
                    <Like theme="filled" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </>
  )
}
export default LikePost
