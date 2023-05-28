import { Dot, Male, More, Plus, ShareTwo } from '@icon-park/react'
import TestImage2 from 'public/16x16/ume-logo-black.png'
import TestImage1 from 'public/32x32/ume-logo-black.png'
import TestImage3 from 'public/categories_pic/league_of_legends.jpg'
import cover from 'public/cover.png'
import TestImage4 from 'public/cover.png'
import detailBackground from 'public/detail-cover-background.png'
import ImgForEmpty from 'public/img-for-empty.png'

import { ReactElement, useState } from 'react'

import Image, { ImageProps, StaticImageData } from 'next/legacy/image'

import AlbumTab from '../album-tab'
import FeedsTab from '../feeds-tab'
import InformationTab from '../information-tab'
import MoreTable from './more-table'

interface tabData {
  label: string
  children: ReactElement
}

interface morenButtonData {
  className?: string
  children?: {
    name: string
    icon?: ReactElement
  }
}

interface personalImageProps {
  src: string
}
interface feedProps {
  feedLink: string
  imgSrc: string | StaticImageData
  numberLike?: number
  numberCom?: number
}
const personalImageDatas: personalImageProps[] = [
  {
    src: 'https://www.shelterluv.com/sites/default/files/animal_pics/5789/2023/05/11/07/20230511075451.png',
  },
  {
    src: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr1OdSY02rL7B8t0vY_OHkQ1y_yadZY9dd5w&usqp=CAU`,
  },
  {
    src: `https://www.shelterluv.com/sites/default/files/animal_pics/5789/2023/05/11/07/20230511075451.png`,
  },
  {
    src: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr1OdSY02rL7B8t0vY_OHkQ1y_yadZY9dd5w&usqp=CAU`,
  },
  {
    src: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr1OdSY02rL7B8t0vY_OHkQ1y_yadZY9dd5w&usqp=CAU`,
  },
  {
    src: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr1OdSY02rL7B8t0vY_OHkQ1y_yadZY9dd5w&usqp=CAU`,
  },
  {
    src: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr1OdSY02rL7B8t0vY_OHkQ1y_yadZY9dd5w&usqp=CAU`,
  },
  {
    src: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS70aQuCJpUvEQn6UEdCUtZ9oWZhviLNDxQ_Q&usqp=CAU`,
  },
]

const feedData: feedProps[] = [
  {
    feedLink: '/1',
    imgSrc: TestImage1,
    numberLike: 2,
    numberCom: 1,
  },
  {
    feedLink: '/1',
    imgSrc: TestImage2,
    numberLike: 25,
    numberCom: 1,
  },
  {
    feedLink: '/1',
    imgSrc: TestImage3,
  },
  {
    feedLink: '/1',
    imgSrc: TestImage4,
    numberCom: 8,
  },
]

const morenButtonDatas: morenButtonData[] = [
  {
    className: 'hover:bg-gray-700 rounded-md pl-2 pr-2',
    children: { name: 'Chỉnh sửa thông tin' },
  },
  {
    className: 'hover:bg-gray-700 rounded-md pl-2 pr-2',
    children: { name: 'Thay đổi ảnh đại diện' },
  },
  { className: 'w-full bg-white h-0.5 rounded-all' },
  {
    children: {
      name: 'Follow',
      icon: (
        <Plus
          className={`transition-opacity opacity-0 group-hover:opacity-100 duration-200`}
          theme="outline"
          size="15"
          fill="#fff"
        />
      ),
    },
  },
  {
    children: {
      name: 'Chia sẻ đến Facebook',
      icon: (
        <ShareTwo
          className={`transition-opacity opacity-0 group-hover:opacity-100 duration-200`}
          theme="outline"
          size="15"
          fill="#fff"
        />
      ),
    },
  },
]

const PlayerInformation = (props: { data }) => {
  const tabDatas: tabData[] = [
    {
      label: `Thông tin cá nhân`,
      children: <InformationTab data={props.data || ImgForEmpty} />,
    },
    {
      label: `Album`,
      children: <AlbumTab datas={personalImageDatas} />,
    },
    {
      label: `Khoảnh khắc`,
      children: <FeedsTab datas={feedData}></FeedsTab>,
    },
  ]
  const [selectedTab, setSelectedTab] = useState('Thông tin cá nhân')
  const [actionModal, setActionModal] = useState(false)

  const handleChangeTab = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = (e.target as HTMLElement).dataset.tab
    if (typeof target !== 'string') {
      return
    }
    setSelectedTab(target)
  }

  const handleMoreButton = () => {
    setActionModal(!actionModal)
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
                <div className="flex flex-row justify-around gap-x-5">
                  <div className="bg-gray-700 p-2 rounded-full flex items-center gap-1">
                    <Male theme="outline" size="24" fill="#1CB3FF" />
                    <p>16</p>
                  </div>
                  <div className="bg-gray-700 p-2 rounded-full flex items-center gap-1">
                    <Dot theme="multi-color" size="24" fill={'#54AF45'} />
                    <p>Đang hoạt động</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col items-center justify-start" style={{ zIndex: 3 }}>
              <More
                className="flex flex-row items-center bg-gray-700 rounded-full cursor-pointer"
                theme="outline"
                size="30"
                fill="#FFFFFF"
                strokeLinejoin="bevel"
                onClick={handleMoreButton}
              />
              <div
                className={`absolute w-max top-10 bottom-auto text-white p-3 pt-5 border border-gray-300 bg-gray-900 rounded-xl gap-3 font-nunito font-medium text-20 ${
                  actionModal ? 'flex flex-col' : 'hidden'
                }`}
              >
                {morenButtonDatas.map((item) => (
                  <MoreTable>{item.children}</MoreTable>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-10" style={{ zIndex: 2 }}>
            {tabDatas.map((item, index) => (
              <>
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
              </>
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
