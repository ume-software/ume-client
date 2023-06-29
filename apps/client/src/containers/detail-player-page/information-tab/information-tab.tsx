import { Down, Gamepad, People, Right } from '@icon-park/react'
import { CustomDrawer } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'
import Chat from '~/containers/chat/chat.container'

import { useContext, useState } from 'react'

import { notification } from 'antd'
import Image from 'next/legacy/image'

import BookingPlayer from '../booking/booking-player.container'
import GamePlayed from './game'
import PersonalInformation from './personal-information'

import { LoginModal } from '~/components/header/login-modal.component'
import { DrawerContext, SocketTokenContext, UserContext } from '~/components/layouts/app-layout/app-layout'

import { trpc } from '~/utils/trpc'

const InformationTab = (props: { data }) => {
  const { socketToken, setSocketToken } = useContext(SocketTokenContext)
  const { userContext } = useContext(UserContext)
  const [isModalLoginVisible, setIsModalLoginVisible] = useState(false)
  const { childrenDrawer, setChildrenDrawer } = useContext(DrawerContext)
  const [gamesToggle, setGamesToggle] = useState(false)
  const [gameSelected, setGameSelected] = useState(-1)
  const createNewChatChannel = trpc.useMutation(['chatting.createNewChatChannel'])

  const handleGamesToggle = () => {
    setGamesToggle(!gamesToggle)
  }

  const handleSelected = (index) => {
    setGameSelected(index)
  }

  const handleChatOpen = () => {
    if (socketToken) {
      try {
        createNewChatChannel.mutate(
          {
            receiverId: props.data.userId,
          },
          {
            onSuccess: (data) => {
              setChildrenDrawer(<Chat playerId={data.data._id} />)
            },
            onError: (error) => {
              console.error(error)
              notification.error({
                message: 'Create New Channel Fail',
                description: 'Create New Channel Fail. Please try again!',
                placement: 'bottomLeft',
              })
            },
          },
        )
      } catch (error) {
        console.error('Failed to create booking:', error)
      }
    } else {
      setIsModalLoginVisible(true)
    }
  }
  const handleOrderOpen = () => {
    if (socketToken) {
      setChildrenDrawer(<BookingPlayer data={props.data} />)
    } else {
      setIsModalLoginVisible(true)
    }
  }

  return (
    <>
      <div>
        <LoginModal isModalLoginVisible={isModalLoginVisible} setIsModalLoginVisible={setIsModalLoginVisible} />
      </div>
      <div className="grid w-full grid-cols-10 gap-10 px-10">
        <div className="col-span-2">
          <div className="sticky p-10 bg-zinc-800 rounded-3xl top-20">
            <div className="flex flex-col gap-5">
              <div
                className={`flex items-center p-3 rounded-xl gap-2 cursor-pointer hover:bg-gray-700 ${
                  gameSelected < 0 ? 'bg-gray-700' : ''
                }`}
                onClick={() => handleSelected(-1)}
              >
                <People theme="outline" size="18" fill="#fff" />
                <p className="text-xl font-semibold ">Đôi chút về tui</p>
              </div>
              <div className="flex flex-col gap-5 cursor-pointer">
                <div className="flex flex-row items-center gap-2 p-3" onClick={handleGamesToggle}>
                  <Gamepad theme="outline" size="18" fill="#fff" />
                  <p className="text-xl font-semibold">Game tui chơi</p>
                  {gamesToggle ? (
                    <Down theme="outline" size="20" fill="#fff" />
                  ) : (
                    <Right theme="outline" size="20" fill="#fff" />
                  )}
                </div>
                <div
                  className={`pl-5 gap-3 ${
                    gamesToggle
                      ? 'flex flex-col items-start h-[500px] overflow-y-scroll overflow-x-hidden hide-scrollbar'
                      : 'hidden'
                  }`}
                >
                  {props.data.providerSkills?.map((item, index) => (
                    <div
                      key={index}
                      className={`flex lg:flex-row flex-col items-center group gap-3 hover:bg-gray-700 p-1 rounded-xl ${
                        gameSelected === index ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => handleSelected(index)}
                    >
                      <Image src={item.skill.imageUrl} alt="Game Image" width={60} height={80} />
                      <div className="max-w-[150px] min-w-[150px]">
                        <p className="font-semibold text-lg text-white z-[4] truncate group-hover:w-fit">
                          {item.skill.name}
                        </p>
                        <p className="font-semibold text-md text-white opacity-30 z-[4] truncate group-hover:w-fit">
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
              <GamePlayed data={props.data.providerSkills[gameSelected]} />
            )}
          </div>
        </div>
        <div className="col-span-3">
          <div className="sticky flex flex-col gap-3 top-20">
            <div className="relative w-full h-[450px] bg-zinc-800 rounded-3xl p-10">
              <Image
                className="absolute rounded-xl"
                layout="fill"
                objectFit="cover"
                src={props.data?.avatarUrl || ImgForEmpty}
                alt="Empty Image"
              />
            </div>
            {userContext?.id != props.data.userId ? (
              <div className="flex flex-col gap-5 my-10">
                <CustomDrawer
                  customOpenBtn={`rounded-full w-full text-purple-700 border-2 border-purple-700 py-2 font-semibold text-2xl cursor-pointer hover:scale-105 text-center`}
                  openBtn={<div onClick={handleChatOpen}>Chat</div>}
                  token={!!socketToken}
                >
                  {childrenDrawer}
                </CustomDrawer>

                <CustomDrawer
                  drawerTitle="Xác nhận đặt"
                  customOpenBtn="rounded-full w-full text-white bg-purple-700 py-2 font-semibold text-2xl cursor-pointer hover:scale-105 text-center"
                  openBtn={<div onClick={handleOrderOpen}>Order</div>}
                  token={!!socketToken}
                >
                  {childrenDrawer}
                </CustomDrawer>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
export default InformationTab
