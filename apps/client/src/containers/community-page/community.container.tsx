import { Earth, EveryUser, Lock, Plus, UserToUserTransmission } from '@icon-park/react'
import { useAuth } from '~/contexts/auth'

import { ReactNode, useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import CreateInstantCard from './components/Insant/create-instant-card'
import Instant from './components/Insant/instant'
import CreatePost from './components/create-post'
import FollowingPost from './components/following-post'
import GeneralPost from './components/general-post'
import TopDonation from './components/top-donate'

import { LoginModal } from '~/components/header/login-modal.component'

interface CommunityProps {
  key: string
  postTypeName: string
  icon: ReactNode
  postTypeChildren: ReactNode
}

const postTypeData: CommunityProps[] = [
  {
    key: 'GeneralPost',
    postTypeName: 'Bài viết',
    icon: <Earth theme="outline" size="18" fill="#FFFFFF" strokeLinejoin="bevel" />,
    postTypeChildren: <GeneralPost />,
  },
  {
    key: 'Following',
    postTypeName: 'Đang theo dõi',
    icon: <EveryUser theme="outline" size="18" fill="#FFFFFF" strokeLinejoin="bevel" />,
    postTypeChildren: <FollowingPost />,
  },
  {
    key: 'Instant',
    postTypeName: 'Tìm bạn',
    icon: <UserToUserTransmission theme="outline" size="18" fill="#FFFFFF" strokeLinejoin="bevel" />,
    postTypeChildren: <Instant />,
  },
]

const CommunityContainer = () => {
  const router = useRouter()
  const basePath = router.asPath.split('?')[0]
  const slug = router.query

  const { user, isAuthenticated } = useAuth()

  const [isModalLoginVisible, setIsModalLoginVisible] = useState(false)
  const [isModalCreatePostVisible, setIsModalCreatePostVisible] = useState(false)
  const [isModalCreateInstantCardVisible, setIsModalCreateInstantCardVisible] = useState(false)
  const [socialSelected, setSocialSelected] = useState<CommunityProps>(
    postTypeData.find((postType) => postType.key == slug?.tab?.toString()) ?? postTypeData[0],
  )

  const handleChangeTab = (item: CommunityProps) => {
    router.replace(
      {
        pathname: basePath,
        query: { tab: item.key },
      },
      undefined,
      { shallow: true },
    )
  }

  useEffect(() => {
    setSocialSelected(
      isAuthenticated
        ? postTypeData.find((postType) => postType.key == slug?.tab?.toString()) ?? postTypeData[0]
        : postTypeData[0],
    )
  }, [isAuthenticated, slug?.tab])

  const handleCreatePost = () => {
    setIsModalCreatePostVisible(!!user || isAuthenticated)
    setIsModalLoginVisible(!(user ?? isAuthenticated))
  }
  const handleCreateInstantCard = () => {
    setIsModalCreateInstantCardVisible(!!user || isAuthenticated)
    setIsModalLoginVisible(!(user ?? isAuthenticated))
  }

  return (
    <>
      <LoginModal isModalLoginVisible={isModalLoginVisible} setIsModalLoginVisible={setIsModalLoginVisible} />
      <CreatePost
        isModalCreatePostVisible={isModalCreatePostVisible}
        setIsModalCreatePostVisible={setIsModalCreatePostVisible}
      />
      <CreateInstantCard
        isModalCreateInstantCardVisible={isModalCreateInstantCardVisible}
        setIsModalCreateInstantCardVisible={setIsModalCreateInstantCardVisible}
      />

      <div className="min-h-screen 2xl:ml-[170px] 2xl:mr-[100px] mx-[70px]">
        <div className="grid grid-cols-10 gap-10 text-white">
          <div className="relative col-span-6 xl:col-span-2">
            <div className="flex xl:flex-col xl:items-start items-center gap-10 xl:border-none border-b-2 border-white border-opacity-30 xl:sticky fixed xl:top-20 top-16 left-0 right-[90px] z-[5]">
              <div className="flex items-center justify-between w-full gap-2 px-20 py-2 xl:block xl:px-5 xl:py-8 xl:bg-zinc-800 bg-umeBackground xl:rounded-2xl">
                <div className="flex gap-5 xl:flex-col">
                  {postTypeData.map((item) => (
                    <div
                      key={item.key}
                      className={`flex items-center p-3 rounded-xl cursor-pointer hover:bg-gray-700
                      ${!(item.key == 'GeneralPost') && !user && 'justify-between opacity-30'}
                      ${socialSelected.key === item.key ? 'bg-gray-700' : ''}`}
                      onClick={() => {
                        if (!(item.key == 'GeneralPost') && !(!!user || isAuthenticated)) {
                          setIsModalLoginVisible(true)
                        } else {
                          handleChangeTab(item)
                        }
                      }}
                      onKeyDown={() => {}}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <p className="text-xs font-normal truncate xl:text-lg lg:text-sm lg:font-semibold 2xl:max-w-none max-w-[100px]">
                          {item.postTypeName}
                        </p>
                      </div>
                      {!(item.key == 'GeneralPost') && !(!!user || isAuthenticated) && (
                        <Lock className="justify-items-end" theme="outline" size="20" fill="#fff" />
                      )}
                    </div>
                  ))}
                </div>
                <div
                  className="flex items-center justify-center p-2 bg-purple-700 cursor-pointer xl:hidden rounded-xl"
                  onClick={handleCreatePost}
                  onKeyDown={() => {}}
                >
                  <Plus theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />
                </div>
              </div>
              <div className="hidden xl:block xl:w-full">
                {socialSelected.key != 'Instant' ? (
                  <div
                    className="rounded-full w-full min-w-[200px] text-white bg-purple-700 py-2 font-medium xl:text-xl lg:text-lg text-md hover:scale-105 text-center cursor-pointer"
                    onClick={handleCreatePost}
                    onKeyDown={() => {}}
                  >
                    Tạo bài viết
                  </div>
                ) : (
                  <div
                    className="rounded-full w-full min-w-[200px] text-white bg-purple-700 py-2 font-medium xl:text-xl lg:text-lg text-md hover:scale-105 text-center cursor-pointer"
                    onClick={handleCreateInstantCard}
                    onKeyDown={() => {}}
                  >
                    Tạo tìm kiếm
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-6 mt-5 xl:col-span-5 xl:mt-0">{socialSelected.postTypeChildren}</div>
          <div className="col-span-4 xl:col-span-3 max-w-[350px]">
            <div className="sticky xl:top-20 top-36">
              <TopDonation />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CommunityContainer
