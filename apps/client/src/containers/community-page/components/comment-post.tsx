/* eslint-disable react-hooks/exhaustive-deps */
import { Send } from '@icon-park/react'
import { InputWithButton } from '@ume/ui'
import { useAuth } from '~/contexts/auth'

import { Dispatch, SetStateAction, useEffect, useId, useRef, useState } from 'react'

import { parse } from 'cookie'
import { isNil } from 'lodash'
import Image from 'next/legacy/image'
import Link from 'next/link'
import { UserInformationResponse } from 'ume-service-openapi'

import { LoginModal } from '~/components/header/login-modal.component'
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
  const LIMIT = 10
  const [commnetPostData, setCommnetPostData] = useState<any>([])
  const [page, setPage] = useState<string>('1')

  const [userInfo, setUserInfo] = useState<UserInformationResponse>()

  trpc.useQuery(['identity.identityInfo'], {
    onSuccess(data) {
      setUserInfo(data.data)
    },
    onError() {
      sessionStorage.removeItem('accessToken')
      sessionStorage.removeItem('refeshToken')
    },
    enabled: isNil(userInfo),
  })
  const accessToken = sessionStorage.getItem('accessToken')

  const containerRef = useRef<HTMLDivElement>(null)
  const [comment, setComment] = useState('')
  const [isModalLoginVisible, setIsModalLoginVisible] = useState(false)
  const {
    data: commentPostByID,
    isLoading: loadingCommentPostByID,
    isFetching: fetchingCommentPostByID,
  } = trpc.useQuery(['community.getCommentPostByID', { postId: props.postID, limit: `${LIMIT}`, page: page }], {
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

        if (isAtEnd && Number(commentPostByID?.data.count) > LIMIT * Number(page)) {
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
    if (!!accessToken) {
      if (comment != '') {
        try {
          commentForPostId.mutate(
            { id: props.postID, commentPostRequest: { content: comment, parentCommentId: undefined } },
            {
              onSuccess: (data) => {
                if (data.success) {
                  setCommnetPostData((prevData) => [
                    {
                      user: {
                        slug: '',
                        avatarUrl: userInfo?.avatarUrl,
                        name: userInfo?.name,
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
                <>
                  <div className="flex items-start gap-3 p-1 m-5 rounded-xl">
                    <Link key={index} href={`profile/${data?.user?.slug ?? data?.userId}`}>
                      <div className="relative min-w-[50px] min-h-[50px]">
                        <Image
                          className="absolute rounded-full"
                          layout="fill"
                          objectFit="cover"
                          src={data?.user?.avatarUrl}
                          alt="Provider Image"
                        />
                      </div>
                    </Link>
                    <div>
                      <div className="flex flex-col items-start justify-start gap-2 p-2 rounded-xl bg-[#47474780]">
                        <Link key={index} href={`profile/${data?.user?.slug ?? data?.userId}`}>
                          <p className="text-lg font-semibold">{data?.user?.name}</p>
                        </Link>
                        <div>{data?.content}</div>
                      </div>
                      <p className="text-sm font-normal opacity-40">
                        {data?.createdAt ? TimeFormat({ date: data?.createdAt }) : ''}
                      </p>
                    </div>
                  </div>
                </>
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
                className="flex items-center p-2 bg-gray-700 rounded-full cursor-pointer"
                onClick={handleSendComment}
                onKeyDown={() => {}}
              >
                <Send theme="filled" size="25" fill="#FFFFFF" strokeLinejoin="bevel" />
              </div>
            }
            onKeyDown={handleKeyPress}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      </div>
    </>
  )
}
export default CommmentPost
