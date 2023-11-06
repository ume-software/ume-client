import ImgForEmpty from 'public/img-for-empty.png'

import { useCallback, useEffect, useRef, useState } from 'react'

import Image from 'next/legacy/image'
import { PostPagingResponse } from 'ume-service-openapi'

import PostItem from './post-item'

import { trpc } from '~/utils/trpc'

const PostTab = (props: { providerId: string }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  const [page, setPage] = useState<string>('1')
  const [postByUserSlug, setPostByUserSlug] = useState<PostPagingResponse['row'] | undefined>(undefined)
  const {
    data: postByUserSlugData,
    isLoading: isPostByUserSlugLoading,
    isFetching: isPostByUserSlugFetching,
  } = trpc.useQuery(['booking.getPostByUserSlug', { userSlug: props.providerId, page: page }], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    onSuccess(data) {
      setPostByUserSlug((prevData) => [...(prevData ?? []), ...(data?.data?.row ?? [])])
    },
  })
  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onScroll = useCallback(() => {
    const { scrollY } = window
    setScrollPosition(scrollY)
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      const { scrollHeight } = containerRef.current
      const isAtEnd = scrollPosition >= scrollHeight - 500
      if (isAtEnd && Number(postByUserSlugData?.data?.count) > 8 * Number(page)) {
        setPage(String(Number(page) + 1))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition])

  return (
    <>
      <div ref={containerRef} className="w-full h-screen 2xl:mt-3 mt-0 text-center px-10">
        {(isPostByUserSlugLoading ?? isPostByUserSlugFetching) && postByUserSlug ? (
          <>
            <div className="w-full grid grid-cols-8 gap-10">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="w-[100%] h-[350px] col-span-2">
                  <div className="w-full h-full animate-pulse flex-row items-center justify-center rounded-xl bg-gray-300"></div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="w-full grid grid-cols-8 gap-10">
              {(postByUserSlug?.length ?? 0) > 0 ? (
                postByUserSlug?.map((data, index) => <PostItem key={index} data={data} />)
              ) : (
                <div className="col-span-full flex justify-center">
                  <div className="w-[70%]">
                    <Image src={ImgForEmpty} alt="EmptyImage" />
                    <p className="text-xl font-semibold text-center">Chưa có bài viết</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
export default PostTab
