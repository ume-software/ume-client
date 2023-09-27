import { Menu, Transition } from '@headlessui/react'
import { Dot, Female, Jump, Male, More, Pencil, PersonalPrivacy, Plus, ShareTwo } from '@icon-park/react'
import cover from 'public/cover.png'
import TestImage4 from 'public/cover.png'
import detailBackground from 'public/detail-cover-background.png'
import ImgForEmpty from 'public/img-for-empty.png'

import { Fragment, ReactElement, ReactNode, useState } from 'react'

import Image, { ImageProps, StaticImageData } from 'next/legacy/image'

import AlbumTab from '../album-tab/album-tab'
import FeedsTab from '../feeds-tab'
import InformationTab from '../information-tab/information-tab'

interface TabDataProps {
  label: string
  children: ReactElement
}

interface MoreButtonDataProps {
  label: string
  icon?: ReactElement
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

const moreButtonDatas: MoreButtonDataProps[] = [
  {
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
  { value: 'ORTHER', icon: <Jump theme="outline" size="20" fill="#771cac" /> },
  { value: 'PRIVATE', icon: <PersonalPrivacy theme="outline" size="20" fill="#f7761c" /> },
]

const PlayerInformation = (props: { data }) => {
  const tabDatas: TabDataProps[] = [
    {
      label: `Thông tin cá nhân`,
      children: <InformationTab data={props.data || ImgForEmpty} />,
    },
    {
      label: `Album`,
      children: <AlbumTab id={props.data.userId.toString()} />,
    },
    {
      label: `Khoảnh khắc`,
      children: <FeedsTab datas={feedData} />,
    },
  ]
  const [selectedTab, setSelectedTab] = useState('Thông tin cá nhân')

  const handleChangeTab = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = (e.target as HTMLElement).dataset.tab
    if (typeof target !== 'string') {
      return
    }
    setSelectedTab(target)
  }

  return (
    <>
      <div style={{ height: '380px', margin: '0 70px' }}>
        <div className="absolute top-16 left-0" style={{ width: '100%', height: '416px' }}>
          <Image layout="fill" src={detailBackground} alt="background"></Image>
        </div>
        <div className="h-full flex flex-col justify-end gap-5">
          <div className="flex flex-row justify-between md:items-center items-baseline pl-7 pr-7">
            <div className="flex md:flex-row md:gap-x-8 flex-col gap-y-2" style={{ zIndex: 2 }}>
              <div style={{ width: 194, height: 182, position: 'relative' }}>
                <Image
                  className="absolute rounded-full"
                  layout="fill"
                  objectFit="cover"
                  src={props.data?.avatarUrl}
                  alt="avatar"
                />
              </div>
              <div className="text-white flex flex-col gap-y-2">
                <p className="text-white text-4xl font-medium">{props.data?.name}</p>
                <div className="flex flex-row gap-3">
                  <div className="bg-gray-700 p-2 rounded-full flex items-center gap-1">
                    {valueGenders.map((gender) => (
                      <>{gender.value == props.data.user.gender && gender.icon}</>
                    ))}
                    <p>16</p>
                  </div>
                  <div className="bg-gray-700 p-2 rounded-full flex items-center gap-1">
                    <Dot theme="multi-color" size="24" fill={'#54AF45'} />
                    <p>Đang hoạt động</p>
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
                        <div key={index} className="hover:bg-purple-700 hover:text-white group rounded-md pl-2 pr-2 ">
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
            {tabDatas.map((item, index) => (
              <a
                href="#tab"
                className={`text-white xl:text-3xl text-xl font-medium p-4 ${
                  item.label == selectedTab ? 'border-b-4 border-purple-700' : ''
                }`}
                key={index}
                onClick={handleChangeTab}
                data-tab={item.label}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="p-5">
        {tabDatas.map((item, index) => {
          return (
            <p className="text-white" key={index} hidden={selectedTab !== item.label}>
              <div className="flex justify-center my-10">{item.children}</div>
            </p>
          )
        })}
      </div>
    </>
  )
}
export default PlayerInformation
