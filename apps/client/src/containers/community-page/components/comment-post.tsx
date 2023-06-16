import { Like, Send } from '@icon-park/react'
import { Input, InputWithAffix, InputWithButton } from '@ume/ui'

import { useState } from 'react'

import { formatDistanceToNow } from 'date-fns'
import Image from 'next/legacy/image'
import Link from 'next/link'

import { CommentSkeletonLoader } from '~/components/skeleton-load'
import { TimeFormat } from '~/components/time-format'

import { trpc } from '~/utils/trpc'

const CommmentPost = (props) => {
  const [commnetPostData, setCommnetPostData] = useState<any>([])
  const {
    data: commentPostByID,
    isLoading: loadingCommentPostByID,
    isFetching: fetchingCommentPostByID,
  } = trpc.useQuery(['community.getCommentPostByID', props.postID], {
    refetchOnReconnect: 'always',
    onSuccess(data) {
      setCommnetPostData(data?.data?.row)
    },
  })

  const handleSendComment = () => {}

  return (
    <>
      <div>
        <div className="h-[500px] text-white overflow-y-scroll hide-scrollbar p-3">
          {loadingCommentPostByID ? (
            <CommentSkeletonLoader />
          ) : (
            <>
              {commnetPostData.map((data) => (
                <Link key={data.id} href={`#${data.user.slug}`}>
                  <div className="flex items-start gap-3 m-5 p-1 rounded-xl">
                    <div className="relative min-w-[50px] min-h-[50px]">
                      <Image
                        className="absolute rounded-full"
                        layout="fill"
                        objectFit="cover"
                        src={data.user.avatarUrl}
                        alt="Provider Image"
                      />
                    </div>
                    <div className="flex flex-col items-start justify-start gap-2 p-2 rounded-xl bg-[#47474780]">
                      <div>
                        <p className="font-semibold text-lg">{data.user.name}</p>
                        <p className="font-normal text-md opacity-40">{TimeFormat({ date: data.createdAt })}</p>
                      </div>
                      <div>{data.content}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
        <div className="p-3">
          <InputWithButton
            className="outline-none border-none focus:outline-[#6d3fe0] max-h-10 rounded-2xl"
            placeholder="Bình luận"
            position={'right'}
            component={
              <div
                className="flex items-center cursor-pointer rounded-full bg-gray-700 p-2"
                onClick={handleSendComment}
              >
                <Send theme="filled" size="25" fill="#FFFFFF" strokeLinejoin="bevel" />
              </div>
            }
          />
        </div>
      </div>
    </>
  )
}
export default CommmentPost
