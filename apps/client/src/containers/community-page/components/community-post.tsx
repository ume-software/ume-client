import { CloseSmall, Comment, Like } from '@icon-park/react'
import { Modal } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'
import { useAuth } from '~/contexts/auth'

import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react'

import Image from 'next/legacy/image'
import Link from 'next/link'
import { PostResponse } from 'ume-service-openapi'

import CommmentPost from './comment-post'
import LikePost from './like-post'
import PostByID from './post-by-ID'
import PostImageLayout from './post-image-layout'

import { LoginModal } from '~/components/header/login-modal.component'
import { TimeFormat } from '~/components/time-format'

import { trpc } from '~/utils/trpc'

interface CommunityPostProps {
  data: PostResponse
  idPostArray?: string[]
  setIdPostArray?: Dispatch<SetStateAction<string[]>>
}

const CommunityPost = (props: CommunityPostProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [titleForm, setTitleForm] = useState<ReactNode>(<></>)
  const [modalForm, setModalForm] = useState<ReactNode>(<></>)
  const [isPostModal, setIsPostModal] = useState<boolean>(false)
  const [isLikePost, setIsLikePost] = useState<boolean>(props.data.isLike)
  const [postComment, setPostComment] = useState<number>(0)
  const { isAuthenticated } = useAuth()
  const [isModalLoginVisible, setIsModalLoginVisible] = useState<boolean>(false)
  const postRef = useRef<HTMLDivElement>(null)
  const likeForPostId = trpc.useMutation(['community.likeForPostId'])
  const unLikeForPostId = trpc.useMutation(['community.unlikeForPostId'])

  useEffect(() => {
    if (postRef.current) {
      const { height, top, bottom } = postRef.current.getBoundingClientRect()

      if (top <= 0 && bottom > 200) {
        if (-top < height * 0.85) {
          if (!props?.idPostArray?.includes(props?.data?.id) && props.setIdPostArray) {
            props?.setIdPostArray((prev) => [...prev, props?.data?.id])
          }
        }
      }
    }
  })

  const handleClose = () => {
    setIsModalVisible(false)
  }

  const InforPostModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    title: titleForm,
    show: isModalVisible,
    customModalCSS: 'top-32',
    form: modalForm,
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
  const PostModal = Modal.useDisplayPost({
    onOK: () => {},
    onClose: handleClose,
    title: titleForm,
    show: isModalVisible,
    form: <PostByID postId={props.data.id} />,
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

  const handleLikeOpen = () => {
    setTitleForm(<p className="text-white">Lượt thích</p>)
    setModalForm(<LikePost postID={props.data?.id} />)
    setIsModalVisible(true)
    setIsPostModal(false)
  }
  const handleCommentOpen = () => {
    setTitleForm(<p className="text-white">Bình luận</p>)
    setModalForm(<CommmentPost postID={props.data?.id} postComment={postComment} setPostComment={setPostComment} />)
    setIsModalVisible(true)
    setIsPostModal(false)
  }
  const handleOpenImageModal = () => {
    setTitleForm(<p className="text-white">Hình ảnh</p>)
    setIsModalVisible(true)
    setIsPostModal(true)
  }
  const handleLikePost = () => {
    if (isAuthenticated) {
      if (isLikePost) {
        unLikeForPostId.mutate(props?.data?.id, {
          onSuccess: () => {
            setIsLikePost(false)
          },
        })
      } else {
        likeForPostId.mutate(props?.data?.id, {
          onSuccess: () => {
            setIsLikePost(true)
          },
        })
      }
    } else {
      setIsModalLoginVisible(true)
    }
  }

  return (
    <>
      <div>
        <LoginModal isModalLoginVisible={isModalLoginVisible} setIsModalLoginVisible={setIsModalLoginVisible} />
      </div>
      <div ref={postRef} className="p-5 mb-10 bg-zinc-800 rounded-xl">
        {isPostModal ? PostModal : InforPostModal}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Link
              href={`profile/${props.data.user.slug ?? props.data.userId}`}
              className="relative xl:w-[70px] xl:h-[70px] lg:w-[60px] lg:h-[60px] w-[50px] h-[50px] cursor-pointer"
            >
              <Image
                className="absolute rounded-full"
                layout="fill"
                objectFit="cover"
                src={props.data?.user.avatarUrl ?? ImgForEmpty}
                alt="Provider Image"
              />
            </Link>
            <div className="flex flex-col">
              <Link
                href={`profile/${props.data.user.slug ?? props.data.userId}`}
                className="xl:text-xl lg:text-lg text-md font-semibold cursor-pointer hover:underline"
              >
                {props.data?.user.name}
              </Link>
              <p className="xl:text-lg lg:text-md text-sm font-normal opacity-40">
                {TimeFormat({ date: props.data?.createdAt })}
              </p>
            </div>
          </div>
        </div>
        <div className="flex mt-2">
          <div className="flex flex-col w-full gap-2">
            <p className="xl:text-lg text-md font-normal">{props.data?.content}</p>
            <div className="cursor-pointer" onClick={handleOpenImageModal} onKeyDown={() => {}}>
              <PostImageLayout data={props.data?.thumbnails} />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between gap-10 p-2">
            <div
              className="font-medium truncate cursor-pointer text-md opacity-30 hover:opacity-100"
              onClick={handleLikeOpen}
              onKeyDown={() => {}}
            >
              {isLikePost ? (
                <>Bạn{props.data?.likeCount === 0 ? ' đã thích' : ` và ${props.data?.likeCount} người khác đã thích`}</>
              ) : (
                `${props.data?.likeCount} lượt thích`
              )}
            </div>
            <div
              className="font-medium truncate cursor-pointer text-md opacity-30 hover:opacity-100"
              onClick={handleCommentOpen}
              onKeyDown={() => {}}
            >
              {props.data?.commentCount + postComment} bình luận
            </div>
          </div>
          <div className="grid w-full grid-cols-4 p-1 border-gray-700 border-y-2">
            <div className="col-span-2">
              <div
                className={`flex justify-center items-center p-1 gap-2 rounded-lg cursor-pointer hover:bg-gray-700 ${
                  isLikePost ? 'text-purple-600' : ''
                }`}
                onClick={handleLikePost}
                onKeyDown={() => {}}
              >
                {isLikePost ? (
                  <Like theme="filled" size="20" fill="#7e22ce" strokeLinejoin="bevel" />
                ) : (
                  <Like theme="outline" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />
                )}
                Thích
              </div>
            </div>
            <div className="col-span-2">
              <div
                className="flex items-center justify-center gap-2 p-1 rounded-lg cursor-pointer hover:bg-gray-700"
                onClick={handleCommentOpen}
                onKeyDown={() => {}}
              >
                <Comment theme="outline" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />
                Bình luận
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default CommunityPost
