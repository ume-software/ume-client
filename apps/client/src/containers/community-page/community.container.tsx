import { CloseSmall, Earth, EveryUser, Lock, Plus } from '@icon-park/react'
import { Modal } from '@ume/ui'
import { useAuth } from '~/contexts/auth'

import { ReactNode, useId, useState } from 'react'

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
    key: 'General',
    postTypeName: 'Chung',
    icon: <Earth theme="outline" size="18" fill="#FFFFFF" strokeLinejoin="bevel" />,
    postTypeChildren: <GeneralPost />,
  },
  {
    key: 'Following',
    postTypeName: 'Đang theo dõi',
    icon: <EveryUser theme="outline" size="18" fill="#FFFFFF" strokeLinejoin="bevel" />,
    postTypeChildren: <FollowingPost />,
  },
]

const CommunityContainer = () => {
  const index = useId()

  const { user, isAuthenticated } = useAuth()

  const [isModalLoginVisible, setIsModalLoginVisible] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [socialSelected, setSocialSelected] = useState<CommunityProps>({
    key: 'General',
    postTypeName: 'Chung',
    icon: <Earth theme="outline" size="18" fill="#FFFFFF" strokeLinejoin="bevel" />,
    postTypeChildren: <GeneralPost />,
  })

  const handleClose = () => {
    setIsModalVisible(false)
  }

  const CreatePostModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    title: <p className="text-white">Tạo bài viết</p>,
    show: isModalVisible,
    customModalCSS: 'top-32',
    form: <CreatePost handleClose={handleClose} />,
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={handleClose}
        onKeyDown={(e) => e.key === 'Enter' && handleClose()}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })

  const handleCreatePost = () => {
    setIsModalVisible(!!user || isAuthenticated)
    setIsModalLoginVisible(!(user ?? isAuthenticated))
  }

  return (
    <>
      <div>
        <LoginModal isModalLoginVisible={isModalLoginVisible} setIsModalLoginVisible={setIsModalLoginVisible} />
      </div>
      {isModalVisible && CreatePostModal}
      <div className="min-h-screen 2xl:ml-[170px] 2xl:mr-[100px] mx-[70px]">
        <div className="grid grid-cols-10 gap-10 text-white">
          <div className="relative col-span-6 xl:col-span-2">
            <div className="flex xl:flex-col xl:items-start items-center gap-10 xl:border-none border-b-2 border-white border-opacity-30 xl:sticky fixed xl:top-20 top-16 left-0 right-[90px] z-[5]">
              <div className="flex items-center justify-between w-full gap-2 px-20 py-2 xl:block xl:px-5 xl:py-8 xl:bg-zinc-800 bg-umeBackground xl:rounded-2xl">
                <div className="flex gap-5 xl:flex-col">
                  {postTypeData.map((item) => (
                    <div
                      key={index}
                      className={`flex items-center p-3 rounded-xl cursor-pointer hover:bg-gray-700
                      ${item.key == 'Following' && !user && 'justify-between opacity-30'}
                      ${socialSelected.key === item.key ? 'bg-gray-700' : ''}`}
                      onClick={() => {
                        if (item.key == 'Following' && !(!!user || isAuthenticated)) {
                          setIsModalLoginVisible(true)
                        } else {
                          setSocialSelected(item)
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
                      {item.key == 'Following' && !(!!user || isAuthenticated) && (
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
                <div
                  className="rounded-full w-full min-w-[200px] text-white bg-purple-700 py-2 font-medium xl:text-xl lg:text-lg text-md hover:scale-105 text-center cursor-pointer"
                  onClick={handleCreatePost}
                  onKeyDown={() => {}}
                >
                  Tạo bài viết
                </div>
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
