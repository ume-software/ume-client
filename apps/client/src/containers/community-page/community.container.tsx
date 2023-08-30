import { CloseSmall, Earth, EveryUser } from '@icon-park/react'
import { Modal } from '@ume/ui'

import { ReactNode, useContext, useState } from 'react'

import CreatePost from './components/create-post'
import FollowingPost from './components/following-post'
import GeneralPost from './components/general-post'
import TopDonate from './components/top-donate'

import { LoginModal } from '~/components/header/login-modal.component'
import { SocketTokenContext } from '~/components/layouts/app-layout/app-layout'

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
    closeButtonOnConner: (
      <>
        <CloseSmall
          onClick={handleClose}
          onKeyDown={(e) => e.key === 'Enter' && handleClose()}
          tabIndex={1}
          className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
          theme="outline"
          size="24"
          fill="#FFFFFF"
        />
      </>
    ),
  })

  const handleCreatePost = () => {
    if (socketToken) {
      setIsModalVisible(true)
    } else {
      setIsModalLoginVisible(true)
    }
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
            <div className="flex flex-col gap-10 sticky top-20">
              <div className="p-10 bg-zinc-800 rounded-2xl">
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
                  Tạo bài viết
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-5">{socialSelected.postTypeChildren}</div>
          <div className="col-span-3">
            <div className="sticky top-20">
              <TopDonate />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CommunityContainer
