import { CloseSmall } from '@icon-park/react'
import { Modal } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'
import PostByID from '~/containers/community-page/components/post-by-ID'

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import { UserInformationResponse } from 'ume-service-openapi'

import { trpc } from '~/utils/trpc'

const AlbumTab = (props: { data: UserInformationResponse }) => {
  const router = useRouter()
  const slug = router.query

  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [page, setPage] = useState<string>('1')

  const [album, setAlbum] = useState<any>()
  const [formPost, setFormPost] = useState<ReactNode>(<></>)

  const {
    data: AlbumData,
    isLoading: isLoadingAlbum,
    isFetching: isAlbumFetching,
  } = trpc.useQuery(
    ['booking.getAlbumByUserSlug', { slug: slug.profileId?.toString() ?? props.data.slug, limit: '8', page: page }],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 0,
      refetchOnMount: true,
      onSuccess(data) {
        setAlbum((prevData) => [...(prevData ?? []), ...(data?.data?.row ?? [])])
      },
    },
  )
  const [isPostModal, setIsPostModal] = useState<boolean>(false)

  const handleClose = () => {
    setIsPostModal(false)
  }

  const PostModal = Modal.useDisplayPost({
    onOK: () => {},
    onClose: handleClose,
    title: <p className="text-white">Hình ảnh</p>,
    show: isPostModal,
    form: formPost,
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={handleClose}
        onKeyDown={(e) => e.key === 'Enter' && handleClose()}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })

  const handleOpenImageModal = (postId: string) => {
    setFormPost(<PostByID postId={postId} />)
    setIsPostModal(true)
  }

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
      if (isAtEnd && Number(AlbumData?.data.count) > 8 * Number(page)) {
        setPage(String(Number(page) + 1))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition])

  return (
    <>
      {isPostModal && PostModal}
      <div ref={containerRef} className="w-full px-10">
        {album && album.length > 0 ? (
          <div className="grid w-full grid-cols-8 gap-10">
            {album.map((item, index) => (
              <div
                className="w-[100%] h-[350px] place-content-center relative col-span-2 rounded-xl overflow-hidden border-2 border-white border-opacity-30 cursor-pointer"
                key={index}
                onClick={() => handleOpenImageModal(item.postId)}
              >
                <Image
                  className="absolute top-0 left-0 right-0"
                  layout="fill"
                  objectFit="cover"
                  src={item.url}
                  alt="Person Image"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-screen 2xl:mt-3 mt-0 text-center">
            {isLoadingAlbum ?? isAlbumFetching ? (
              <div className="grid w-full grid-cols-8 gap-10">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="w-[100%] h-[350px] col-span-2">
                    <div className="flex-row items-center justify-center w-full h-full bg-gray-300 animate-pulse rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-[70%]">
                  <Image src={ImgForEmpty} alt="EmptyImage" />
                  <p className="text-xl font-semibold text-center">Chưa có hình ảnh</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
export default AlbumTab
