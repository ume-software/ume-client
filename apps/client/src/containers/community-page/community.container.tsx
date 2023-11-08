import { CloseSmall, Earth, EveryUser, Plus } from '@icon-park/react'
import { Modal } from '@ume/ui'
import { useAuth } from '~/contexts/auth'

import { ReactNode, useId, useState } from 'react'

import CreatePost from './components/create-post'
import FollowingPost from './components/following-post'
import GeneralPost from './components/general-post'
import TopDonation from './components/top-donate'

import { LoginModal } from '~/components/header/login-modal.component'

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
  const index = useId()
  const { isAuthenticated } = useAuth()
  const [isModalLoginVisible, setIsModalLoginVisible] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [socialSelected, setSocialSelected] = useState<CommunityProps>({
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
    setIsModalVisible(isAuthenticated)
    setIsModalLoginVisible(!isAuthenticated)
  }

  return (
    <>
      <div>
        <LoginModal isModalLoginVisible={isModalLoginVisible} setIsModalLoginVisible={setIsModalLoginVisible} />
      </div>
      {isModalVisible && CreatePostModal}
      <div className="min-h-screen" style={{ margin: '0 70px' }}>
        <div className="grid grid-cols-10 gap-10 text-white">
          <div className="col-span-2">
            <div className="sticky flex flex-col gap-10 top-20">
              <div className="p-10 bg-zinc-800 rounded-2xl">
                <div className="flex flex-col gap-5">
                  {postTypeData.map((item) => (
                    <div
                      key={index}
                      className={`flex items-center p-3 rounded-xl gap-2 cursor-pointer hover:bg-gray-700
                      ${socialSelected.postTypeName === item.postTypeName ? 'bg-gray-700' : ''}`}
                      onClick={() => setSocialSelected(item)}
                      onKeyDown={() => {}}
                    >
                      {item.icon}
                      <p className="xl:text-lg lg:text-sm text-xs lg:font-semibold font-normal truncate">
                        {item.postTypeName}
                      </p>
                    </div>
                  ))}
                </div>
                <div
                  className="xl:hidden bg-purple-700 p-2 rounded-xl flex justify-center items-center cursor-pointer"
                  onClick={handleCreatePost}
                  onKeyDown={() => {}}
                >
                  <Plus theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />
                </div>
              </div>
              <div className="xl:block hidden xl:w-full">
                <div
                  className="w-full py-2 text-xl font-medium text-center text-white bg-purple-700 rounded-full cursor-pointer hover:scale-105"
                  onClick={handleCreatePost}
                  onKeyDown={() => {}}
                >
                  Tạo bài viết
                </div>
              </div>
            </div>
          </div>
          <div className="xl:col-span-5 col-span-6 xl:mt-0 mt-5">{socialSelected.postTypeChildren}</div>
          <div className="xl:col-span-3 col-span-4">
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
