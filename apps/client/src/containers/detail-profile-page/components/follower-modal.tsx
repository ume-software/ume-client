import { CloseSmall } from '@icon-park/react'
import { Modal } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'

import { useEffect, useRef, useState } from 'react'

import Image from 'next/legacy/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { UserInformationPagingResponse } from 'ume-service-openapi'

import { CommentSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

const FollowerModal = ({ isFollowerModalVisible, setIsFollowerModalVisible }) => {
  const router = useRouter()
  const slug = router.query

  const [follwerData, setFollwerData] = useState<UserInformationPagingResponse['row']>(undefined)
  const [page, setPage] = useState<string>('1')

  const containerRef = useRef<HTMLDivElement>(null)

  const {
    data: follower,
    isLoading: loadingFollower,
    isFetching: fetchingFollower,
  } = trpc.useQuery(['booking.getFollowerByUserSlug', { slug: String(slug.profileId ?? ''), page: page }], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    onSuccess(data) {
      setFollwerData((prevData) => [
        ...(prevData?.filter((newProviderFilter) =>
          prevData?.find((itemPrevData) => itemPrevData.id != newProviderFilter.id),
        ) ?? []),
        ...(data?.data?.row ?? []),
      ])
    },
  })

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current

        const isAtEnd = scrollTop + clientHeight >= scrollHeight

        if (isAtEnd && Number(follower?.data.count) > 10 * Number(page)) {
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

  const followerModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: () => setIsFollowerModalVisible(false),
    title: <p className="text-white">Người theo dõi</p>,
    show: isFollowerModalVisible,
    form: (
      <div ref={containerRef} className="h-[500px] text-white overflow-y-scroll custom-scrollbar p-3">
        {loadingFollower && !fetchingFollower ? (
          <CommentSkeletonLoader />
        ) : (
          <>
            {(follwerData?.length ?? 0) > 0 ? (
              follwerData?.map((data) => (
                <Link
                  key={data?.id}
                  href={`/profile/${data?.slug ?? data?.id}`}
                  onClick={() => {
                    setIsFollowerModalVisible(false)
                    setFollwerData(undefined)
                  }}
                >
                  <div className="flex items-center justify-between p-2 m-5 rounded-xl hover:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="relative w-[50px] h-[50px]">
                        <Image
                          className="absolute rounded-full"
                          layout="fill"
                          objectFit="cover"
                          src={data?.avatarUrl ?? ImgForEmpty}
                          alt="Provider Image"
                        />
                      </div>
                      <p className="text-lg font-semibold">{data?.name}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="h-full flex justify-center items-center">
                <p className="text-lg text-white font-semibold opacity-50">Chưa có người theo dõi</p>
              </div>
            )}
          </>
        )}
        {fetchingFollower ? <CommentSkeletonLoader /> : ''}
      </div>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={() => setIsFollowerModalVisible(false)}
        onKeyDown={(e) => e.key === 'Enter' && setIsFollowerModalVisible(false)}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })
  return <>{followerModal}</>
}
export default FollowerModal
