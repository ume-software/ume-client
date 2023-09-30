import { Menu, Transition } from '@headlessui/react'
import { Dot, Female, Jump, Lock, Male, More, Pencil, Plus, ShareTwo } from '@icon-park/react'
import cover from 'public/cover.png'
import TestImage4 from 'public/cover.png'
import detailBackground from 'public/detail-cover-background.png'
import ImgForEmpty from 'public/img-for-empty.png'
import lgbtIcon from 'public/rainbow-flag-11151.svg'

import { Fragment, ReactElement, ReactNode, useEffect, useState } from 'react'

import Image, { ImageProps, StaticImageData } from 'next/legacy/image'
import { useRouter } from 'next/router'
import { GetProfileProviderBySlugResponse, UserInformationResponse } from 'ume-service-openapi'

import AlbumTab from './album-tab/album-tab'
import FeedsTab from './feeds-tab'
import InformationTab from './information-tab/information-tab'

import { trpc } from '~/utils/trpc'

interface TabDataProps {
  key: string
  label: string
  icon?: ReactElement
  [key: string]: any
}

interface FeedProps {
  feedLink: string
  imgSrc: string | StaticImageData
  numberLike?: number
  numberCom?: number
}

interface valueGenderProps {
  value: string
  icon: ReactNode
}

const feedData: FeedProps[] = [
  {
    feedLink: '/1',
    imgSrc: ImgForEmpty,
    numberLike: 2,
    numberCom: 1,
  },
  {
    feedLink: '/1',
    imgSrc: ImgForEmpty,
    numberLike: 25,
    numberCom: 1,
  },
  {
    feedLink: '/1',
    imgSrc: ImgForEmpty,
  },
  {
    feedLink: '/1',
    imgSrc: TestImage4,
    numberCom: 8,
  },
]

const moreButtonDatas: TabDataProps[] = [
  {
    key: 'SettingInformation',
    label: 'Chỉnh sửa thông tin',
    icon: (
      <Pencil
        className={`transition-opacity opacity-0 group-hover:opacity-100 group-hover:translate-x-3 duration-300`}
        theme="outline"
        size="20"
        fill="#fff"
      />
    ),
  },
  {
    key: 'Follow',
    label: 'Follow',
    icon: (
      <Plus
        className={`transition-opacity opacity-0 group-hover:opacity-100 group-hover:translate-x-3 duration-300`}
        theme="outline"
        size="20"
        fill="#fff"
      />
    ),
  },
  {
    key: 'share',
    label: 'Chia sẻ đến Facebook',
    icon: (
      <ShareTwo
        className={`transition-opacity opacity-0 group-hover:opacity-100 group-hover:translate-x-3 duration-300`}
        theme="outline"
        size="20"
        fill="#fff"
      />
    ),
  },
]

const valueGenders: valueGenderProps[] = [
  {
    value: 'MALE',
    icon: <Male theme="outline" size="20" fill="#3463f9" />,
  },
  { value: 'FEMALE', icon: <Female theme="outline" size="20" fill="#f70a34" /> },
  {
    value: 'ORTHER',
    icon: (
      <div className="flex items-center">
        <Image width={30} height={20} alt="lgbt-icon" src={lgbtIcon} layout="fixed" />
      </div>
    ),
  },
  { value: 'PRIVATE', icon: <Lock theme="outline" size="20" fill="#f7761c" /> },
]
const tabDatas: TabDataProps[] = [
  {
    key: 'Service',
    label: `Dịch vụ`,
  },
  {
    key: 'Album',
    label: `Ảnh`,
  },
  {
    key: 'Post',
    label: `Bài viết`,
  },
]

const DetailProfileContainer = () => {
  const router = useRouter()
  const basePath = router.asPath.split('?')[0]
  const slug = router.query

  const [providerDetail, setProviderDetail] = useState<UserInformationResponse | undefined>(undefined)
  const { isLoading: isProviderDetailLoading, isFetching: isProviderDetailFetching } = trpc.useQuery(
    ['booking.getUserBySlug', slug.profileId!.toString()],
    {
      onSuccess(data) {
        if (data.data.id) {
          setProviderDetail(data.data)
        } else {
          router.replace('/404')
        }
      },
      onError() {
        router.replace('/404')
      },
    },
  )

  const [selectedTab, setSelectedTab] = useState<TabDataProps>(
    tabDatas.find((tab) => {
      return tab.key.toString() == slug.tab?.toString()
    }) || tabDatas[0],
  )

  const handleChangeTab = (item: TabDataProps) => {
    router.replace(
      {
        pathname: basePath,
        query: { tab: item.key },
      },
      undefined,
      { shallow: true },
    )
    setSelectedTab(item)
  }

  const caculateAge = (dateOfBirth: string | undefined) => {
    if (dateOfBirth) {
      const currentDate = new Date().getFullYear()
      const dob = new Date(dateOfBirth).getFullYear()

      const age = Math.floor(currentDate - dob)

      return age
    } else {
      return 1
    }
  }

  return (
    <>
      {providerDetail && isProviderDetailLoading ? (
        <></>
      ) : (
        <>
          <div style={{ height: '380px', margin: '0 70px' }}>
            <div className="absolute top-16 left-0" style={{ width: '100%', height: '416px' }}>
              <Image layout="fill" src={detailBackground} alt="background"></Image>
            </div>
            <div className="h-full flex flex-col justify-end gap-5">
              <div className="flex flex-row justify-between md:items-center items-baseline px-7 pb-5">
                <div className="flex md:flex-row md:gap-x-8 flex-col gap-y-2" style={{ zIndex: 2 }}>
                  <div style={{ width: 194, height: 182, position: 'relative' }}>
                    <Image
                      className="absolute rounded-full"
                      layout="fill"
                      objectFit="cover"
                      src={providerDetail?.avatarUrl || ImgForEmpty}
                      alt="avatar"
                    />
                  </div>
                  <div className="text-white flex flex-col gap-y-2 my-5">
                    <p className="text-white text-3xl font-medium">{providerDetail?.name}</p>
                    <div className="flex flex-row items-center gap-3">
                      <div className="bg-gray-700 p-2 rounded-full flex items-center gap-2">
                        <div>
                          {valueGenders.map((gender) => (
                            <div key={gender.value}>{gender.value == providerDetail?.gender && gender.icon}</div>
                          ))}
                        </div>
                        <p>{caculateAge(providerDetail?.dob)}</p>
                      </div>
                      <div className="bg-gray-700 p-2 rounded-full flex items-center gap-1">
                        <Dot theme="multi-color" size="24" fill={providerDetail?.isOnline ? '#008000' : '#FF0000'} />
                        <p>{providerDetail?.providerConfig?.status}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative flex flex-col items-center justify-start" style={{ zIndex: 5 }}>
                  <Menu>
                    <div>
                      <Menu.Button>
                        <More
                          className="flex flex-row items-center bg-gray-700 rounded-full cursor-pointer"
                          theme="filled"
                          size="25"
                          fill="#FFFFFF"
                          strokeLinejoin="bevel"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-400"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-400"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute w-fit right-0 p-3 top-7 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="w-max flex flex-col gap-2">
                          {moreButtonDatas.map((item, index) => (
                            <div
                              key={index}
                              className="hover:bg-purple-700 hover:text-white group rounded-md pl-2 pr-2 "
                            >
                              <div className="scale-x-100 group-hover:scale-x-95 flex items-center justify-between gap-2 group-hover:-translate-x-2 duration-300">
                                <a href="#">{item.label}</a>
                                {item.icon}
                              </div>
                            </div>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>

              <div className="flex flex-row gap-10" style={{ zIndex: 2 }}>
                {tabDatas.map((item) => (
                  <span
                    className={`text-white xl:text-2xl text-xl font-medium p-4 cursor-pointer ${
                      item.key == selectedTab.key ? 'border-b-4 border-purple-700' : ''
                    }`}
                    key={item.key}
                    onClick={() => handleChangeTab(item)}
                    data-tab={item.label}
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="p-5">
            <span className="text-white">
              <div className="flex justify-center my-10">
                {selectedTab.key == 'Service' && <InformationTab data={providerDetail!} />}
                {selectedTab.key == 'Album' && <AlbumTab data={providerDetail!} />}
                {selectedTab.key == 'Post' && <FeedsTab datas={feedData} />}
              </div>
            </span>
          </div>
        </>
      )}
    </>
  )
}
export default DetailProfileContainer
