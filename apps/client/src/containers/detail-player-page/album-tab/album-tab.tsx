import ImgForEmpty from 'public/img-for-empty.png'

import { useEffect, useState } from 'react'

import Image from 'next/legacy/image'
import { DetailAlbumResponse } from 'ume-openapi-booking'

import AlbumImage from './album-image'

import { trpc } from '~/utils/trpc'

const AlbumTab = (props: { id: string }) => {
  const [album, setAlbum] = useState<DetailAlbumResponse[] | undefined>()

  const { data: albumData, isLoading: loadingAlbum } = trpc.useQuery(
    ['booking.getAblumByProviderSlug', { slug: props.id }],
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

  const left: JSX.Element[] = []
  const middle: JSX.Element[] = []
  const right: JSX.Element[] = []

  useEffect(() => {
    if (album && album.length > 0) {
      album.forEach((data, index) => {
        const imgSrc = <AlbumImage key={index} data={data.url} />
        let newIndex = index + 1
        if (newIndex % 3 == 0) {
          right.push(imgSrc)
        } else if (newIndex % 2 == 0) {
          left.push(imgSrc)
        } else {
          middle.push(imgSrc)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [album])

  return (
    <>
      <div className="grid grid-cols-3 gap-4 px-10">
        {album && album.length > 0 ? (
          <>
            <div className="flex flex-col gap-8">{left.map((item) => item)}</div>
            <div className="flex flex-col gap-8">{middle.map((item) => item)}</div>
            <div className="flex flex-col gap-8">{right.map((item) => item)}</div>
          </>
        ) : (
          <div className="mt-3 col-span-3">
            <Image src={ImgForEmpty} alt="EmptyImage" />
          </div>
        )}
      </div>
    </>
  )
}
export default AlbumTab
