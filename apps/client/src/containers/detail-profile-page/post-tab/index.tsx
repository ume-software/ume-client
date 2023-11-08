import { useCallback, useEffect, useRef, useState } from 'react'

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
    <div ref={containerRef} className="w-full h-screen px-10 mt-3 text-center">
      {(isPostByUserSlugLoading ?? isPostByUserSlugFetching) && postByUserSlug ? (
        <div className="grid w-full grid-cols-8 gap-10">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="w-[100%] h-[350px] col-span-2">
              <div className="flex-row items-center justify-center w-full h-full bg-gray-300 animate-pulse rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid w-full grid-cols-8 gap-10">
          {postByUserSlug?.map((data, index) => (
            <PostItem key={index} data={data} />
          ))}
        </div>
      )}
    </div>
  )
}
export default PostTab
