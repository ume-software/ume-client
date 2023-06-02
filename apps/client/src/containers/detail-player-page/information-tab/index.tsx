import { Down, Gamepad, People, Right, Star } from '@icon-park/react'
import { CustomDrawer } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'
import Chat from '~/containers/chat/chat.container'

import { useContext, useState } from 'react'

import Image, { ImageProps, StaticImageData } from 'next/legacy/image'

import BookingPlayer from '../booking/booking-player.container'
import GamePlayed from './game'
import PersonalInformation from './personal-information'

import { drawerContext } from '~/components/layouts/app-layout/app-layout'

const InformationTab = (props: { data }) => {
  const { childrenDrawer, setChildrenDrawer } = useContext(drawerContext)
  const [gamesToggle, setGamesToggle] = useState(false)
  const [gameSelected, setGameSelected] = useState(-1)

  const handleGamesToggle = () => {
    setGamesToggle(!gamesToggle)
  }

  const handleSelected = (index) => {
    setGameSelected(index)
  }
  const handleChatOpen = () => {
    setChildrenDrawer(<Chat data={props.data} />)
  }
  const handleOrderOpen = () => {
    setChildrenDrawer(<BookingPlayer data={props.data} />)
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
                  {props.data.providerSkills.map((item, index) => (
                    <div
                      key={index}
                      className={`flex lg:flex-row flex-col items-center gap-3 hover:bg-gray-700 p-1 rounded-xl ${
                        gameSelected === index ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => handleSelected(index)}
                    >
                      <Image src={item.skill.imageUrl} alt="Game Image" width={60} height={60} />
                      <div className="w-[200px] truncate">
                        <p className="font-nunito font-semibold text-lg text-white z-[4]">{item.skill.name}</p>
                        <p className="font-nunito font-semibold text-md text-white opacity-30 z-[4]">
                          {item.defaultCost}U / 1h
                        </p>
                      </div>
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
              <PersonalInformation key={props.data.id} data={props.data} />
            ) : (
              <div className="bg-zinc-800 rounded-3xl p-10">
                <div className="flex flex-col gap-10">
                  <GamePlayed datas={props.data.providerSkills[gameSelected]} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-3">
          <div className="flex flex-col gap-3">
            <div className="relative w-full h-[450px] bg-zinc-800 rounded-3xl p-10">
              <Image
                className="absolute rounded-xl"
                layout="fill"
                objectFit="cover"
                src={props.data?.avatarUrl || ImgForEmpty}
                alt="Empty Image"
              />
            </div>
            <div className="my-10 flex flex-col gap-5">
              <CustomDrawer
                customOpenBtn={`rounded-full w-full text-purple-700 border-2 border-purple-700 py-2 font-nunito font-bold text-2xl hover:scale-105 text-center`}
                openBtn={<div onClick={handleChatOpen}>Chat</div>}
              >
                {childrenDrawer}
              </CustomDrawer>

              <CustomDrawer
                drawerTitle="Xác nhận đặt"
                customOpenBtn="rounded-full w-full text-white bg-purple-700 py-2 font-nunito font-bold text-2xl hover:scale-105 text-center"
                openBtn={<div onClick={handleOrderOpen}>Order</div>}
              >
                {childrenDrawer}
              </CustomDrawer>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default InformationTab