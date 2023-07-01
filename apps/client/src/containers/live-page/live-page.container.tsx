import Link from 'next/link'
import ImgForEmpty from 'public/img-for-empty.png'

import { Tooltip } from 'antd'
import Head from 'next/head'
import Image from 'next/legacy/image'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'
import { trpc } from '~/utils/trpc'

interface livestreamProps {
  livePicture: string
  type: string
  imageUrl: string
  content: string
  name: string
  view: string
}

const LivePage = (props) => {
    const {
    data: streamChannels,
    isLoading: loadingStreamChannels,
    isFetching: isFetchingStreamChannels,
  } = trpc.useQuery(['streaming.getListStreamChannels', { limit: '8', page: '1' }], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
  })
  if (loadingStreamChannels) {
    return <></>
  }

  return (
    <div>
      <Head>
        <title>UME | Phát Trực Tiếp</title>
      </Head>
      <AppLayout {...props}>
        <div className="dark:text-white flex flex-col mx-16">
          <div className="flex justify-between my-10">
            <p className="text-4xl font-bold">Các phòng phát trực tiếp</p>
            <div className="rounded-full p-5 text-white bg-purple-700 py-2 font-semibold text-2xl cursor-pointer hover:scale-105 text-center">
              Tạo phòng
            </div>
          </div>
          <div className="grid grid-cols-4">
            {streamChannels?.data.row && streamChannels.data.row.map((data, index) => 
         {
          console.log("datag ? d.host?.userInfomation?.sluata.host?.userInfomation?.slug :  data.host?.user_id => ",data.host.userInfomation.slug||data.host.userId)
          return    (
               <Link key={data._id} href={`/live/${data.host.userInfomation.slug||data.host.userId}`}>
                <div className="col-span-1 cursor-pointer p-5">
                  <div className="relative">
                    <div className="relative w-full h-[200px] bg-zinc-800 rounded-3xl p-10">
                      <Image
                        className="absolute rounded-xl"
                        layout="fill"
                        objectFit="cover"
                        src={data.thumbnailUrl || ImgForEmpty}
                        alt="Empty Image"
                      />
                    </div>
                    <div
                      className={`absolute top-5 left-5 py-1 px-3 text-mdfont-semibold rounded-lg ${
                        'Live'== 'Live' ? 'bg-red-700' : 'bg-purple-700'
                      }`}
                    >
                      {'Live'}
                    </div>
                  </div>
                  <div className="flex gap-5 pt-3">
                    <div>
                      <div className="relative w-14 h-14">
                        <Image
                          className="absolute rounded-full"
                          layout="fill"
                          objectFit="cover"
                          src={data.host.userInfomation.avatarUrl || ImgForEmpty}
                          alt="avatar"
                        />
                      </div>
                    </div>
                    <div className="w-full flex flex-col items-start justify-center truncate">
                      <Tooltip placement="topLeft" title={data.title} arrow={false}>
                        <p className="text-lg">{data.description}</p>
                      </Tooltip>
                      <p className="text-xl font-semibold opacity-30">
                        {data.host.userInfomation.name} - {100} viewers
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            )
         }
         )}
          </div>
        </div>
      </AppLayout>
    </div>
  )
}

export default LivePage
