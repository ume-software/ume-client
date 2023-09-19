import { Down, Gamepad, People, Right } from '@icon-park/react'
import { CustomDrawer } from '@ume/ui'
import coin from 'public/coin-icon.png'
import ImgForEmpty from 'public/img-for-empty.png'
import Chat from '~/containers/chat/chat.container'
import { useAuth } from '~/contexts/auth'

import { useContext, useEffect, useState } from 'react'

import { notification } from 'antd'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import { GetProfileProviderBySlugResponse, ProviderSkillResponse } from 'ume-service-openapi'

import BookingPlayer from '../booking/booking-player.container'
import GamePlayed from './game'
import PersonalInformation from './personal-information'

import { LoginModal } from '~/components/header/login-modal.component'
import { DrawerContext } from '~/components/layouts/app-layout/app-layout'

import { trpc } from '~/utils/trpc'

const InformationTab = (props: { data: GetProfileProviderBySlugResponse }) => {
  const router = useRouter()
  const basePath = router.asPath.split('?')[0]
  const slug = router.query

  const { isAuthenticated } = useAuth()
  const { user } = useAuth()
  const [isModalLoginVisible, setIsModalLoginVisible] = useState(false)
  const { childrenDrawer, setChildrenDrawer } = useContext(DrawerContext)
  const [gamesToggle, setGamesToggle] = useState(true)
  const [gameSelected, setGameSelected] = useState<string | undefined>(slug.serviceId?.toString() ?? undefined)

  const createNewChatChannel = trpc.useMutation(['chatting.createNewChatChannel'])

  const selectedSkill = props.data?.providerSkills!.find(
    (providerSkill) => gameSelected == providerSkill.skillId || gameSelected == providerSkill.skill?.slug,
  )!

  const handleGamesToggle = () => {
    setGamesToggle(!gamesToggle)
  }

  const handleSelected = (skillId: string | undefined) => {
    router.replace(
      {
        pathname: basePath,
        query: { tab: slug.tab, serviceId: skillId },
      },
      undefined,
      {
        shallow: true,
      },
    )

    setGameSelected(skillId)
  }

  const handleChatOpen = async () => {
    if (isAuthenticated) {
      try {
        await createNewChatChannel.mutate(
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
    if (isAuthenticated) {
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
                  !gameSelected ? 'bg-gray-700' : ''
                }`}
                onClick={() => handleSelected(undefined)}
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
                  {props.data?.providerSkills?.map((item) => (
                    <div
                      key={item.id}
                      className={`flex lg:flex-row flex-col items-center group gap-3 hover:bg-gray-700 p-1 rounded-xl ${
                        gameSelected == item.skillId || gameSelected == item.skill?.slug ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => handleSelected(item.skillId)}
                    >
                      <Image src={item?.skill?.imageUrl || ImgForEmpty} alt="Game Image" width={60} height={80} />
                      <div className="max-w-[150px] min-w-[150px]">
                        <p className="font-semibold text-lg text-white z-[4] truncate group-hover:w-fit">
                          {item?.skill?.name}
                        </p>
                        <div className="flex items-center">
                          <Image src={coin} width={20} height={20} alt="coin" />
                          <p className="font-semibold text-md text-white opacity-30 z-[4] truncate group-hover:w-fit">
                            {item.defaultCost} / 1h
                          </p>
                        </div>
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
            {selectedSkill && gameSelected ? (
              <GamePlayed data={selectedSkill} />
            ) : (
              <PersonalInformation key={props.data?.id} data={props.data} />
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
            {user?.id != props.data?.userId ? (
              <div className="flex flex-col gap-5 my-10">
                <CustomDrawer
                  customOpenBtn={`rounded-full w-full text-purple-700 border-2 border-purple-700 py-2 font-semibold text-2xl cursor-pointer hover:scale-105 text-center`}
                  openBtn={<div onClick={handleChatOpen}>Chat</div>}
                  token={isAuthenticated}
                >
                  {childrenDrawer}
                </CustomDrawer>

                <CustomDrawer
                  drawerTitle="Xác nhận đặt"
                  customOpenBtn="rounded-full w-full text-white bg-purple-700 py-2 font-semibold text-2xl cursor-pointer hover:scale-105 text-center"
                  openBtn={<div onClick={handleOrderOpen}>Order</div>}
                  token={isAuthenticated}
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
