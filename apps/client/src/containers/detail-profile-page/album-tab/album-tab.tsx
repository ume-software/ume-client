import { CloseSmall } from '@icon-park/react'
import { Modal } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'
import PostByID from '~/containers/community-page/components/post-by-ID'

import { ReactNode, useState } from 'react'

import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import { DetailAlbumResponse, UserInformationResponse } from 'ume-service-openapi'

import { trpc } from '~/utils/trpc'

const AlbumTab = (props: { data: UserInformationResponse }) => {
  const router = useRouter()
  const slug = router.query

  const [album, setAlbum] = useState<DetailAlbumResponse[] | undefined>()
  const [formPost, setFormPost] = useState<ReactNode>(<></>)

  const { isLoading: isLoadingAlbum } = trpc.useQuery(
    ['booking.getAlbumByUserSlug', { slug: slug.profileId?.toString() || props.data.slug }],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 0,
      refetchOnMount: true,
      onSuccess(data) {
        setAlbum(data.data.row)
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
      <>
        <CloseSmall
          onClick={handleClose}
          onKeyDown={(e) => e.key === 'Enter' && handleClose()}
          tabIndex={1}
          className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
          theme="outline"
          size="24"
          fill="#FFFFFF"
        />
      </>
    ),
  })

  const handleOpenImageModal = (postId: string) => {
    setFormPost(<PostByID postId={postId} />)
    setIsPostModal(true)
  }

  return (
    <>
      {isPostModal && PostModal}
      <div className="w-full px-10">
        {album && album.length > 0 ? (
          <>
            <div className="w-full grid grid-cols-8 gap-10">
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
          </>
        ) : (
          <div className="w-full h-screen mt-3 text-center">
            {isLoadingAlbum ? (
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
              <Image src={ImgForEmpty} alt="EmptyImage" />
            )}
          </div>
        )}
      </div>
    </>
  )
}
export default AlbumTab
