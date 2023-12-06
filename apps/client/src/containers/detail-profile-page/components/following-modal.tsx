import { CloseSmall } from '@icon-park/react'
import { Modal } from '@ume/ui'

import { useEffect, useRef, useState } from 'react'

import Image from 'next/legacy/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { CommentSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

const FollowingModal = ({ isFollowingModalVisible, setIsFollowingModalVisible }) => {
  const router = useRouter()
  const slug = router.query

  const [follwingData, setFollwingData] = useState<any>([])
  const [page, setPage] = useState<string>('1')

  const containerRef = useRef<HTMLDivElement>(null)

  const {
    data: following,
    isLoading: loadingFollowing,
    isFetching: fetchingFollowing,
  } = trpc.useQuery(['booking.getFollowingByUserSlug', { slug: slug.profileId!.toString(), page: page }], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    onSuccess(data) {
      setFollwingData((prevData) => [...(prevData || []), ...(data?.data?.row ?? [])])
    },
  })

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current

        const isAtEnd = scrollTop + clientHeight >= scrollHeight

        if (isAtEnd && Number(following?.data.count) > 10 * Number(page)) {
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

  const followingModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: () => setIsFollowingModalVisible(false),
    title: <p className="text-white">Đang theo dõi</p>,
    show: isFollowingModalVisible,
    form: (
      <div ref={containerRef} className="h-[500px] text-white overflow-y-scroll custom-scrollbar p-3">
        {loadingFollowing && !fetchingFollowing ? (
          <CommentSkeletonLoader />
        ) : (
          <>
            {(follwingData.length ?? 0) > 0 ? (
              follwingData.map((data) => (
                <Link key={data?.id} href={`profile/${data?.user?.slug ?? data?.userId}`}>
                  <div className="flex items-center justify-between p-2 m-5 rounded-xl hover:bg-gray-700">
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
                      <p className="text-lg font-semibold">{data?.user?.name}</p>
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
        {fetchingFollowing ? <CommentSkeletonLoader /> : ''}
      </div>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={() => setIsFollowingModalVisible(false)}
        onKeyDown={(e) => e.key === 'Enter' && setIsFollowingModalVisible(false)}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })

  return <>{followingModal}</>
}
export default FollowingModal
