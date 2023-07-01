import { Earth, EveryUser } from '@icon-park/react'

import { ReactNode, useContext, useState } from 'react'

import Head from 'next/head'

import CommunityPost from './components/community-post'
import FollowingPost from './components/following-post'
import GeneralPost from './components/general-post'

import { LoginModal } from '~/components/header/login-modal.component'
import { AppLayout, SocketTokenContext } from '~/components/layouts/app-layout/app-layout'

interface CommunityProps {
  postTypeName: string
  icon: ReactNode
  postTypeChildren: ReactNode
}

const postTypeData: CommunityProps[] = [
  {
    postTypeName: 'Chung',
    icon: <Earth theme="outline" size="18" fill="#FFFFFF" strokeLinejoin="bevel" />,
    postTypeChildren: <GeneralPost />,
  },
  {
    postTypeName: 'Đang theo dõi',
    icon: <EveryUser theme="outline" size="18" fill="#FFFFFF" strokeLinejoin="bevel" />,
    postTypeChildren: <FollowingPost />,
  },
]

const CommunityContainer = () => {
  const { socketToken } = useContext(SocketTokenContext)
  const [isModalLoginVisible, setIsModalLoginVisible] = useState(false)
  const [socialSelected, setSocialSelected] = useState<CommunityProps>({
    postTypeName: 'Chung',
    icon: <Earth theme="outline" size="18" fill="#FFFFFF" strokeLinejoin="bevel" />,
    postTypeChildren: <GeneralPost />,
  })

  const handleCreatePost = () => {
    if (socketToken) {
      console.log('123')
    } else {
      setIsModalLoginVisible(true)
    }
  }

  return (
    <>
      <div>
        <LoginModal isModalLoginVisible={isModalLoginVisible} setIsModalLoginVisible={setIsModalLoginVisible} />
      </div>
      <div className="min-h-screen" style={{ margin: '0 70px' }}>
        <div className="grid grid-cols-10 gap-10 text-white">
          <div className="col-span-2 sticky top-50">
            <div className="flex flex-col gap-10 sticky top-20">
              <div className="p-10 bg-zinc-800 rounded-3xl">
                <div className="flex flex-col gap-5">
                  {postTypeData.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-3 rounded-xl gap-2 cursor-pointer hover:bg-gray-700
                      ${socialSelected.postTypeName === item.postTypeName ? 'bg-gray-700' : ''}`}
                      onClick={() => setSocialSelected(item)}
                    >
                      {item.icon}
                      <p className="text-xl font-semibold">{item.postTypeName}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div
                  className="rounded-full w-full text-white bg-purple-700 py-2 font-semibold text-2xl hover:scale-105 text-center cursor-pointer"
                  onClick={handleCreatePost}
                >
                  Create post
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-5">{socialSelected.postTypeChildren}</div>
          <div className="col-span-3"></div>
        </div>
      </div>
    </>
  )
}

export default CommunityContainer
