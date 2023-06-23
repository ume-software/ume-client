import { Menu, Transition } from '@headlessui/react'
import { CloseSmall, Comment, Like, More, ShareTwo, TipsOne } from '@icon-park/react'
import { Modal } from '@ume/ui'

import { Fragment, ReactNode, useState } from 'react'

import Image from 'next/legacy/image'

import CommmentPost from './comment-post'
import LikePost from './like-post'
import PostByID from './post-by-ID'
import PostImageLayout from './post-image-layout'

import { TimeFormat } from '~/components/time-format'

const CommunityPost = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [titleForm, setTitleForm] = useState<ReactNode>(<></>)
  const [modalForm, setModalForm] = useState<ReactNode>(<></>)
  const [isPostModal, setIsPostModal] = useState(false)

  const handleClose = () => {
    setIsModalVisible(false)
  }

  const InforPostModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    title: titleForm,
    show: isModalVisible,
    form: modalForm,
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
  const PostModal = Modal.useDisplayPost({
    onOK: () => {},
    onClose: handleClose,
    title: titleForm,
    show: isModalVisible,
    form: <PostByID postData={props.data} />,
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

  const handleLikeOpen = () => {
    setTitleForm(<p className="text-white">Lượt thích</p>)
    setModalForm(<LikePost postID={props.data?.id} />)
    setIsModalVisible(true)
    setIsPostModal(false)
  }
  const handleCommentOpen = () => {
    setTitleForm(<p className="text-white">Bình luận</p>)
    setModalForm(<CommmentPost postID={props.data?.id} />)
    setIsModalVisible(true)
    setIsPostModal(false)
  }
  const handleOpenImageModal = () => {
    setTitleForm(<p className="text-white">Hình ảnh</p>)
    setIsModalVisible(true)
    setIsPostModal(true)
  }

  return (
    <div className="bg-zinc-800 rounded-xl mb-10 p-5">
      {isPostModal ? PostModal : InforPostModal}
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <div className="relative w-[70px] h-[70px]">
            <Image
              className="absolute rounded-full"
              layout="fill"
              objectFit="cover"
              src={props.data?.user.avatarUrl}
              alt="Provider Image"
            />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-xl">{props.data?.user.name}</p>
            <p className="font-normal text-lg opacity-40">{TimeFormat({ date: props.data?.createdAt })}</p>
          </div>
        </div>
        <div>
          <div className="relative">
            <Menu>
              <div>
                <Menu.Button>
                  <More theme="outline" size="25" fill="#FFFFFF" strokeLinejoin="bevel" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-400"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-400"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute w-56 pt-1 pb-1 origin-top-right bg-white divide-y divide-gray-200 rounded-md shadow-lg right-0 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <Menu.Item as={'div'}>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <TipsOne theme="outline" size="20" fill="#333" className="mr-3" strokeLinejoin="bevel" />
                        Report
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item as={'div'}>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <TipsOne theme="outline" size="20" fill="#333" className="mr-3" strokeLinejoin="bevel" />
                        Report
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
      <div className="flex mt-2">
        <div className="w-full flex flex-col gap-2">
          <p className="font-normal text-lg">{props.data?.content}</p>
          <div className="cursor-pointer" onClick={handleOpenImageModal}>
            <PostImageLayout key={props.data?.id} data={props.data?.thumbnails} />
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex justify-between p-2">
          <div className="font-semibold text-lg opacity-30 cursor-pointer hover:opacity-100" onClick={handleLikeOpen}>
            {props.data?.likeCount} lượt thích
          </div>
          <div
            className="font-semibold text-lg opacity-30 cursor-pointer hover:opacity-100"
            onClick={handleCommentOpen}
          >
            {props.data?.commentCount} bình luận
          </div>
        </div>
        <div className="w-full grid grid-cols-6 p-1 border-gray-700 border-y-2">
          <div className="col-span-2">
            <div className="flex justify-center items-center p-1 gap-2 rounded-lg cursor-pointer hover:bg-gray-700">
              <Like theme="outline" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />
              Thích
            </div>
          </div>
          <div className="col-span-2">
            <div
              className="flex justify-center items-center p-1 gap-2 rounded-lg cursor-pointer hover:bg-gray-700"
              onClick={handleCommentOpen}
            >
              <Comment theme="outline" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />
              Bình luận
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex justify-center items-center p-1 gap-2 rounded-lg cursor-pointer hover:bg-gray-700">
              <ShareTwo theme="outline" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />
              Chia sẻ
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CommunityPost
