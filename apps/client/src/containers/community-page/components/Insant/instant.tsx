import { useCallback, useEffect, useRef, useState } from 'react'

import { InstantCardPagingResponse } from 'ume-service-openapi'

import InstantCard from './instant-card'

import { PostSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

const Instant = () => {
  const limit = '20'
  const [page, setPage] = useState<string>('1')

  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [instantCards, setInstantCards] = useState<InstantCardPagingResponse['row'] | undefined>(undefined)
  const {
    data: instantCardData,
    isLoading: isIntantCardLoading,
    isFetching: isIntantCardFetching,
  } = trpc.useQuery(['community.getInstantCard', { limit: limit, page: page }], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    onSuccess(data) {
      setInstantCards((prevData) => [...(prevData ?? []), ...(data.data.row ?? [])])
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
      const isAtEnd = scrollPosition >= scrollHeight * 0.8

      if (isAtEnd && Number(instantCardData?.data.count) > Number(limit) * Number(page)) {
        setPage(String(Number(page) + 1))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition])

  return (
    <>
      {isIntantCardLoading && !isIntantCardFetching ? (
        <PostSkeletonLoader />
      ) : (
        <div ref={containerRef} className="grid grid-cols-2">
          {instantCards && (instantCards.length ?? 0) > 0 ? (
            instantCards?.map((instantCard) => (
              <div key={instantCard.id} className="xl:col-span-1 col-span-2 p-3">
                <InstantCard data={instantCard} />
              </div>
            ))
          ) : (
            <p>Chưa có tìm kiếm nào</p>
          )}
        </div>
      )}
      {isIntantCardFetching && <PostSkeletonLoader />}
    </>
  )
}
export default Instant
