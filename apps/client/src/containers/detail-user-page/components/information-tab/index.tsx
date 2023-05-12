import { Down, Gamepad, People, Right, Star } from '@icon-park/react'
import ImgForEmpty from 'public/img-for-empty.png'

import { useState } from 'react'

import Image, { ImageProps, StaticImageData } from 'next/legacy/image'

import GamePlayed from './game'
import PersonalInformation from './personal-information'

interface gamesProps {
  name: string
  src: any
  images?: ImageProps[]
  description?: string
}

interface informationTabProps {
  title?: string
  content?: string
  reviews?: {
    name: string
    rate: number
    serviceUsed: string[]
    comment: string
  }[]
}

const gamesDatas: gamesProps[] = [
  {
    src: ImgForEmpty,
    name: 'Valorant',
    images: [ImgForEmpty, ImgForEmpty, ImgForEmpty],
    description: 'Valorant description',
  },
  {
    src: ImgForEmpty,
    name: 'Valorant',
  },
  {
    src: ImgForEmpty,
    name: 'Valorant',
  },
  {
    src: ImgForEmpty,
    name: 'Game gì đó tên dài vl asdasdasfdad',
    images: [ImgForEmpty, ImgForEmpty, ImgForEmpty],
    description: 'Game gì đó tên dài vl asdasdasfdad description',
  },
]

const informationTabDatas: informationTabProps = {
  title: 'Hé lô các bạn',
  content: `Xin chào các user thân yêu đã ghé thăm playerduo của Mìn nha.
            Cả nhà thân yêu ơi, nt fb cả pld không thấy Mìn trả lời thì gọi Mìn nha: 0935623471 Cảm ơn ạ
            ❥Nhận: >Liên Minh, Farmtogether, TFTsvViet, TFT sv NA,cờ tỷ phú,audition.
            >Mở nhạc theo yêu cầu, mở phim theo yêu cầu (có tài khoản netflix).
            >Call video = x4 x5 x6 x7 x8 x9 x10 x11 x12 x13 x14 x15 x16
            ❥Không nhận: Các game bắn súng và không nhận hát ( Đơn giản vì em mù âm nhạc).
            ❥Sở thích: Anime, phim, chơi game,....
            ❥Tính tình hiền lành,thật thà và ngoan ngoãn như cún.
            ❥Không nợ, không donate sau. Vì niềm zui đôi bên.
            ❥Khách mến thì cho Tiểu Mìn xin 1 phiếu theo dõi trên Playerduo nhen.
            ❥Thời gian rảnh: Từ khi ngủ dậy.
            ❥❥❥Nhắn tin playerduo không được thì vui lòng gửi tin vào fb này giúp Mìn nha: https://www.facebook.com/1212dobietai`,
  reviews: [
    {
      name: 'Chu',
      rate: 5.0,
      serviceUsed: ['chat', 'game', 'xxx'],
      comment: 'Ngon',
    },
    {
      name: 'Chu',
      rate: 5,
      serviceUsed: ['chat', 'game', 'xxx'],
      comment: 'Ngon',
    },
  ],
}

const InformationTab = (props) => {
  const [gamesToggle, setGamesToggle] = useState(false)
  const [gameSelected, setGameSeleccted] = useState(-1)

  const handleGamesToggle = () => {
    console.log({ gamesToggle })

    setGamesToggle(!gamesToggle)
  }

  const handleSelected = (index) => {
    setGameSeleccted(index)
  }

  return (
    <>
      <div className="w-full grid grid-cols-10 gap-10 px-10">
        <div className="col-span-2">
          <div className="bg-zinc-800 rounded-3xl p-10">
            <div className="flex flex-col gap-5">
              <div
                className={`flex items-center p-3 rounded-xl gap-2 cursor-pointer ${
                  gameSelected < 0 ? 'bg-gray-700' : ''
                }`}
                onClick={() => handleSelected(-1)}
              >
                <People theme="outline" size="18" fill="#fff" />
                <p className="font-nunito font-semibold text-xl">Đôi chút về tui</p>
              </div>
              <div className="flex flex-col gap-5 cursor-pointer">
                <div className="flex flex-row items-center p-3 gap-2" onClick={handleGamesToggle}>
                  <Gamepad theme="outline" size="18" fill="#fff" />
                  <p className="font-nunito font-semibold text-xl">Game tui chơi</p>
                  {gamesToggle ? (
                    <Down theme="outline" size="20" fill="#fff" />
                  ) : (
                    <Right theme="outline" size="20" fill="#fff" />
                  )}
                </div>
                <div className={`pl-5 gap-3 ${gamesToggle ? 'flex flex-col items-start' : 'hidden'}`}>
                  {gamesDatas.map((item, index) => (
                    <div
                      key={index}
                      className={`flex flex-row items-center gap-3 hover:bg-gray-700 p-1 rounded-xl ${
                        gameSelected == index ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => handleSelected(index)}
                    >
                      <Image src={item.src} alt="Game Image" width={60} height={60}></Image>
                      <p
                        className="font-nunito font-semibold text-xl truncate"
                        style={{ width: '200px', height: '28px', zIndex: 4 }}
                      >
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-5">
          <div className="flex flex-col gap-8">
            {gameSelected < 0 ? (
              <PersonalInformation datas={informationTabDatas} />
            ) : (
              <GamePlayed datas={gamesDatas[gameSelected]} />
            )}
          </div>
        </div>
        <div className="col-span-3">
          <div className="flex flex-col gap-10">
            <div className="bg-zinc-800 rounded-3xl p-10">
              <Image src={ImgForEmpty} alt="Empty Image"></Image>
            </div>
            <div className="my-10 flex flex-col gap-5">
              <button
                type="button"
                className="rounded-full w-full text-purple-700 border-2 border-purple-700 py-2 font-nunito font-bold text-2xl hover:-translate-y-1"
              >
                Chat
              </button>
              <button
                type="button"
                className="rounded-full w-full text-white bg-purple-700 py-2 font-nunito font-bold text-2xl hover:-translate-y-1"
              >
                Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default InformationTab
