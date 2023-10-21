import ImgForEmpty from 'public/img-for-empty.png'

import { useId } from 'react'

import { Tooltip } from 'antd'
import Head from 'next/head'
import Image from 'next/legacy/image'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

interface livestreamProps {
  livePicture: string
  type: string
  imageUrl: string
  content: string
  name: string
  view: string
}

const livestreamData: livestreamProps[] = [
  {
    livePicture: 'https://cdn.pixabay.com/photo/2020/05/11/22/31/cat-5160456_960_720.png',
    imageUrl:
      'https://playerduo.net/api/upload-service/images/0403a59d-1ac6-43fd-8069-b6d669a4e97a__016e0cf0-fc0c-11ed-a657-a54d6be1d46a__player_avatar.jpg',
    type: 'Live',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    name: 'John Doe',
    view: '1000',
  },
  {
    livePicture:
      'https://playerduo.net/api/upload-service/images/3854718d-9f59-4fa6-bf01-f6312fdf5924__c8e2a870-02f3-11ee-a657-a54d6be1d46a__player_avatar.jpg',
    imageUrl:
      'https://playerduo.net/api/upload-service/images/77973581-d487-49a7-9de9-611a124af371__29069ca0-f7d4-11ed-a657-a54d6be1d46a__player_avatar.jpg',
    type: 'Live',
    content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    name: 'Jane Smith',
    view: '500',
  },
  {
    livePicture:
      'https://files.playerduo.net/production/images/852f7007-0d22-4a3a-9d7b-12fed963866f__a23443e0-bc3b-11ed-a19f-23a3b10d190e__player_avatar.jpg',
    imageUrl:
      'https://files.playerduo.net/production/images/852f7007-0d22-4a3a-9d7b-12fed963866f__a23443e0-bc3b-11ed-a19f-23a3b10d190e__player_avatar.jpg',
    type: 'Live',
    content: 'Join us for a live stream event!',
    name: 'Livestream 1',
    view: '1000',
  },
  {
    livePicture:
      'https://playerduo.net/api/upload-service/images/699fec71-1e10-4f16-90ee-3d729e9aa56d__3c832e90-d7a1-11ed-a19f-23a3b10d190e__player_avatar.jpg',
    imageUrl:
      'https://playerduo.net/api/upload-service/images/699fec71-1e10-4f16-90ee-3d729e9aa56d__3c832e90-d7a1-11ed-a19f-23a3b10d190e__player_avatar.jpg',
    type: 'Team',
    content: "Don't miss this exciting livestream!",
    name: 'Livestream 2',
    view: '500',
  },
  {
    livePicture:
      'https://playerduo.net/api/upload-service/images/75c40a5c-dbda-4ac3-9106-55d6d7ca9b0f__e592e5a0-002a-11ee-a657-a54d6be1d46a__player_avatar.jpg',
    imageUrl:
      'https://playerduo.net/api/upload-service/images/75c40a5c-dbda-4ac3-9106-55d6d7ca9b0f__e592e5a0-002a-11ee-a657-a54d6be1d46a__player_avatar.jpg',
    type: 'Live',
    content: 'Tune in to our live broadcast!',
    name: 'Livestream 3',
    view: '800',
  },
]

const LivePage = (props) => {
  const index = useId()
  return (
    <div>
      <Head>
        <title>UME | Phát Trực Tiếp</title>
      </Head>
      <AppLayout {...props}>
        <div className="flex flex-col mx-16 dark:text-white">
          <div className="flex justify-between my-10">
            <p className="text-4xl font-bold">Các phòng phát trực tiếp</p>
            <div className="p-5 py-2 text-2xl font-semibold text-center text-white bg-purple-700 rounded-full cursor-pointer hover:scale-105">
              Tạo phòng
            </div>
          </div>
          <div className="grid grid-cols-4">
            {livestreamData.map((data) => (
              <>
                <div key={index} className="col-span-1 p-5 cursor-pointer">
                  <div className="relative">
                    <div className="relative w-full h-[200px] bg-zinc-800 rounded-3xl p-10">
                      <Image
                        className="absolute rounded-xl"
                        layout="fill"
                        objectFit="cover"
                        src={data.livePicture || ImgForEmpty}
                        alt="Empty Image"
                      />
                    </div>
                    <div
                      className={`absolute top-5 left-5 py-1 px-3 text-mdfont-semibold rounded-lg ${
                        data.type == 'Live' ? 'bg-red-700' : 'bg-purple-700'
                      }`}
                    >
                      {data.type}
                    </div>
                  </div>
                  <div className="flex gap-5 pt-3">
                    <div>
                      <div className="relative w-14 h-14">
                        <Image
                          className="absolute rounded-full"
                          layout="fill"
                          objectFit="cover"
                          src={data.imageUrl || ImgForEmpty}
                          alt="avatar"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-center w-full truncate">
                      <Tooltip placement="topLeft" title={data.content} arrow={false}>
                        <p className="text-lg">{data.content}</p>
                      </Tooltip>
                      <p className="text-xl font-semibold opacity-30">
                        {data.name} - {data.view}viewers
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </AppLayout>
    </div>
  )
}

export default LivePage
