import { Like, Send } from '@icon-park/react'
import { Input, InputWithAffix, InputWithButton } from '@ume/ui'

import { Dispatch, SetStateAction, useContext, useState } from 'react'

import { formatDistanceToNow } from 'date-fns'
import Image from 'next/legacy/image'
import Link from 'next/link'

import { LoginModal } from '~/components/header/login-modal.component'
import { SocketTokenContext } from '~/components/layouts/app-layout/app-layout'
import { CommentSkeletonLoader } from '~/components/skeleton-load'
import { TimeFormat } from '~/components/time-format'

import { trpc } from '~/utils/trpc'

interface CommentPostProps {
  postID: string
  postComment: number
  setPostComment: Dispatch<SetStateAction<number>>
}

const CommmentPost = (props: CommentPostProps) => {
  const [commnetPostData, setCommnetPostData] = useState<any>([])
  const [comment, setComment] = useState('')
  const [isModalLoginVisible, setIsModalLoginVisible] = useState(false)
  const { socketToken } = useContext(SocketTokenContext)
  const {
    data: commentPostByID,
    isLoading: loadingCommentPostByID,
    isFetching: fetchingCommentPostByID,
    refetch: refetchCommentPostByID,
  } = trpc.useQuery(['community.getCommentPostByID', props.postID], {
    refetchOnReconnect: 'always',
    onSuccess(data) {
      setCommnetPostData(data?.data?.row)
    },
  })
  const commentForPostId = trpc.useMutation(['community.commentForPostId'])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendComment()
    }
  }

  const handleSendComment = () => {
    if (socketToken) {
      if (comment != '') {
        try {
          commentForPostId.mutate(
            { id: props.postID, commentPostRequest: { content: comment, parentCommentId: '' } },
            {
              onSuccess: (data) => {
                if (data.success) {
                  refetchCommentPostByID().then((data) => {
                    setCommnetPostData(data.data?.data.row)
                  })
                  props.setPostComment(props.postComment + 1)
                  setComment('')
                }
              },
            },
          )
        } catch (error) {
          console.error('Failed to post comment:', error)
        }
      }
    } else {
      setIsModalLoginVisible(true)
    }
  }

  return (
    <>
      <div>
        <LoginModal isModalLoginVisible={isModalLoginVisible} setIsModalLoginVisible={setIsModalLoginVisible} />
      </div>
      <div>
        <div className="h-[500px] text-white overflow-y-scroll custom-scrollbar p-3">
          {loadingCommentPostByID ? (
            <CommentSkeletonLoader />
          ) : (
            <>
              {commnetPostData.map((data) => (
                <Link key={data.id} href={`#${data?.user?.slug}`}>
                  <div className="flex items-start gap-3 m-5 p-1 rounded-xl">
                    <div className="relative min-w-[50px] min-h-[50px]">
                      <Image
                        className="absolute rounded-full"
                        layout="fill"
                        objectFit="cover"
                        src={data?.user?.avatarUrl}
                        alt="Provider Image"
                      />
                    </div>
                    <div>
                      <div className="flex flex-col items-start justify-start gap-2 p-2 rounded-xl bg-[#47474780]">
                        <p className="font-semibold text-lg">{data?.user?.name}</p>
                        <div>{data?.content}</div>
                      </div>
                      <p className="font-normal text-sm opacity-40">
                        {data?.createdAt ? TimeFormat({ date: data?.createdAt }) : ''}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
        <div className="p-3">
          <InputWithButton
            className="outline-none bg-[#413F4D] text-white border-none focus:outline-[#6d3fe0] max-h-10 rounded-2xl"
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
            onKeyPress={handleKeyPress}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      </div>
    </>
  )
}
export default CommmentPost
