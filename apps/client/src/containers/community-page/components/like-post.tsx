import { Like } from '@icon-park/react'

import { useEffect, useRef, useState } from 'react'

import Image from 'next/legacy/image'
import Link from 'next/link'

import { CommentSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

const LikePost = (props: { postID: string }) => {
  const [likePostData, setLikePostData] = useState<any>([])
  const [page, setPage] = useState<string>('1')
  const limit = '10'
  const containerRef = useRef<HTMLDivElement>(null)
  const {
    data: likePostByID,
    isLoading: loadingLikePostByID,
    isFetching: fetchingLikePostByID,
    refetch: refetchLikePostByID,
  } = trpc.useQuery(['community.getLikePostByID', { postId: props.postID, limit: limit, page: page }], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    onSuccess(data) {
      setLikePostData((prevData) => [...(prevData || []), ...(data?.data?.row || [])])
    },
  })

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current

        const isAtEnd = scrollTop + clientHeight >= scrollHeight

        if (isAtEnd && Number(likePostByID?.data.count) > Number(limit) * Number(page)) {
          setPage(String(Number(page) + 1))
        }
      }
    }

    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (containerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        containerRef.current.removeEventListener('scroll', handleScroll)
      }
    }
  })

  // useEffect(() => {
  //   if (page !== '1') {
  //     refetchLikePostByID()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [page])

  return (
    <>
      <div ref={containerRef} className="h-[500px] text-white overflow-y-scroll custom-scrollbar p-3">
        {loadingLikePostByID && !fetchingLikePostByID ? (
          <CommentSkeletonLoader />
        ) : (
          <>
            {likePostData.map((data) => (
              <Link key={data?.id} href={`#${data?.user?.slug}`}>
                <div className="flex justify-between items-center m-5 p-2 rounded-xl hover:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="relative w-[50px] h-[50px]">
                      <Image
                        className="absolute rounded-full"
                        layout="fill"
                        objectFit="cover"
                        src={data?.user?.avatarUrl}
                        alt="Provider Image"
                      />
                    </div>
                    <p className="font-semibold text-lg">{data?.user?.name}</p>
                  </div>
                  <div>
                    <Like theme="filled" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}
        {fetchingLikePostByID ? <CommentSkeletonLoader /> : ''}
      </div>
    </>
  )
}
export default LikePost
