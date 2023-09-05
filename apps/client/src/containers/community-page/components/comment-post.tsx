import { Send } from '@icon-park/react'
import { InputWithButton } from '@ume/ui'

import { Dispatch, SetStateAction, useContext, useEffect, useId, useRef, useState } from 'react'

import Image from 'next/legacy/image'
import Link from 'next/link'

import { LoginModal } from '~/components/header/login-modal.component'
import { SocketTokenContext, UserContext } from '~/components/layouts/app-layout/app-layout'
import { CommentSkeletonLoader } from '~/components/skeleton-load'
import { TimeFormat } from '~/components/time-format'

import { trpc } from '~/utils/trpc'

interface CommentPostProps {
  postID: string
  postComment: number
  setPostComment: Dispatch<SetStateAction<number>>
}

const CommmentPost = (props: CommentPostProps) => {
  const index = useId()
  const [commnetPostData, setCommnetPostData] = useState<any>([])
  const [page, setPage] = useState<string>('1')
  const [limit] = useState<string>('10')
  const { userContext } = useContext(UserContext)
  const containerRef = useRef<HTMLDivElement>(null)
  const [comment, setComment] = useState('')
  const [isModalLoginVisible, setIsModalLoginVisible] = useState(false)
  const { socketToken } = useContext(SocketTokenContext)
  const {
    data: commentPostByID,
    isLoading: loadingCommentPostByID,
    isFetching: fetchingCommentPostByID,
  } = trpc.useQuery(['community.getCommentPostByID', { postId: props.postID, limit: limit, page: page }], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    onSuccess(data) {
      setCommnetPostData((prevData) => [...(prevData || []), ...(data?.data?.row ?? [])])
    },
  })
  const commentForPostId = trpc.useMutation(['community.commentForPostId'])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendComment()
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current

        const isAtEnd = scrollTop + clientHeight >= scrollHeight

        if (isAtEnd && Number(commentPostByID?.data.count) > Number(limit) * Number(page)) {
          setPage(String(Number(page) + 1))
        }
      }
    }

    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll)
      }
    }
  })

  const handleSendComment = () => {
    if (socketToken) {
      if (comment != '') {
        try {
          commentForPostId.mutate(
            { id: props.postID, commentPostRequest: { content: comment, parentCommentId: '' } },
            {
              onSuccess: (data) => {
                if (data.success) {
                  setCommnetPostData((prevData) => [
                    {
                      user: {
                        slug: '',
                        avatarUrl: userContext?.avatarUrl,
                        name: userContext?.name,
                      },
                      content: comment,
                      createdAt: Date.now(),
                    },
                    ...(prevData || []),
                  ])

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
        <div ref={containerRef} className="h-[500px] text-white overflow-y-scroll custom-scrollbar p-3">
          {loadingCommentPostByID && !fetchingCommentPostByID ? (
            <CommentSkeletonLoader />
          ) : (
            <>
              {commnetPostData.map((data) => (
                <Link key={index} href={`#${data?.user?.slug}`}>
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
          {fetchingCommentPostByID ? <CommentSkeletonLoader /> : ''}
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
