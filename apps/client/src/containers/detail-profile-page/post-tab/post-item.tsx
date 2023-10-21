import { CloseSmall, Comment, Like } from '@icon-park/react'
import { Modal } from '@ume/ui'
import CommmentPost from '~/containers/community-page/components/comment-post'
import LikePost from '~/containers/community-page/components/like-post'
import PostByID from '~/containers/community-page/components/post-by-ID'
import PostImageLayout from '~/containers/community-page/components/post-image-layout'
import { useAuth } from '~/contexts/auth'

import { ReactNode, useState } from 'react'

import { PostResponse } from 'ume-service-openapi'

import { LoginModal } from '~/components/header/login-modal.component'

import { trpc } from '~/utils/trpc'

const PostItem = (props: { data: PostResponse }) => {
  const { isAuthenticated } = useAuth()

  const [formPost, setFormPost] = useState<ReactNode>(<></>)
  const [titleForm, setTitleForm] = useState<ReactNode>(<></>)
  const [isModalLoginVisible, setIsModalLoginVisible] = useState<boolean>(false)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [isPostModal, setIsPostModal] = useState<boolean>(false)
  const [isLikePost, setIsLikePost] = useState<boolean>(props.data.isLike)
  const [postLike, setPostLike] = useState<number>(0)
  const [postComment, setPostComment] = useState<number>(0)
  const likeForPostId = trpc.useMutation(['community.likeForPostId'])
  const unLikeForPostId = trpc.useMutation(['community.unlikeForPostId'])

  const handleClose = () => {
    setIsModalVisible(false)
  }

  const InforPostModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    title: titleForm,
    show: isModalVisible,
    form: formPost,
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
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
    show: isPostModal,
    form: formPost,
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
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

  const handleOpenImageModal = (postId: string) => {
    setTitleForm(<p className="text-white">Hình ảnh</p>)
    setFormPost(<PostByID postId={postId} />)
    setIsModalVisible(true)
    setIsPostModal(true)
  }
  const handleLikeOpen = () => {
    setTitleForm(<p className="text-white">Lượt thích</p>)
    setFormPost(<LikePost postID={props.data?.id} />)
    setIsModalVisible(true)
    setIsPostModal(false)
  }
  const handleCommentOpen = () => {
    setTitleForm(<p className="text-white">Bình luận</p>)
    setFormPost(<CommmentPost postID={props.data?.id} postComment={postComment} setPostComment={setPostComment} />)
    setIsModalVisible(true)
    setIsPostModal(false)
  }

  const handleLikePost = () => {
    if (isAuthenticated) {
      if (isLikePost) {
        unLikeForPostId.mutate(props?.data?.id, {
          onSuccess: () => {
            setIsLikePost(false)
            setPostLike(0)
          },
        })
      } else {
        likeForPostId.mutate(props?.data?.id, {
          onSuccess: () => {
            setIsLikePost(true)
            setPostLike(1)
          },
        })
      }
    } else {
      setIsModalLoginVisible(true)
    }
  }

  return (
    <>
      {isPostModal && isModalVisible && PostModal}
      {!isPostModal && isModalVisible && InforPostModal}
      <LoginModal isModalLoginVisible={isModalLoginVisible} setIsModalLoginVisible={setIsModalLoginVisible} />
      <div className="col-span-2">
        <div className="relative w-full flex justify-around">
          <div
            style={{
              width: '350px',
              height: '350px',
              overflow: 'hidden',
              background: 'white',
              borderRadius: 30,
              position: 'relative',
            }}
            onClick={() => handleOpenImageModal(props.data.id)}
          >
            <PostImageLayout data={props.data?.thumbnails} />
          </div>
          <div
            className="absolute bottom-5 left-0 pl-5 pt-2 pb-2 pr-3 rounded-r-xl flex gap-5"
            style={{ background: 'gray' }}
          >
            <div className="flex items-center gap-3 ">
              <Like
                theme={`${isLikePost ? 'filled' : 'outline'}`}
                size="25"
                fill={`${isLikePost ? '#7e22ce' : '#FFFFFF'}`}
                className="cursor-pointer"
                onClick={handleLikePost}
              />
              <p className="text-xl font-medium cursor-pointer" onClick={handleLikeOpen}>
                {(props.data.likeCount ?? 0) + postLike}
              </p>
            </div>
            <div className="flex items-center gap-3" onClick={handleCommentOpen}>
              <Comment theme="outline" size="25" fill="#FFFFFF" />
              <p className="text-xl font-medium cursor-pointer">{(props.data.commentCount ?? 0) + postComment}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default PostItem
