import { Earth, EveryUser } from '@icon-park/react'

import { useContext, useState } from 'react'

import Head from 'next/head'

import CommunityPost from './components/community-post'

import { LoginModal } from '~/components/header/login-modal.component'
import { AppLayout, SocketTokenContext } from '~/components/layouts/app-layout/app-layout'
import { PostSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

const CommunityPage = (props) => {
  const [socialSelected, setSocialSelected] = useState('General')
  const [suggestPostData, setSuggestPostData] = useState<any>([])
  const accessToken = window.localStorage.getItem('accessToken')
  const [isModalLoginVisible, setIsModalLoginVisible] = useState(false)
  const {
    data: suggestPost,
    isLoading: loadingSuggestPost,
    isFetching: fetchingSuggestPost,
  } = accessToken
    ? trpc.useQuery(['community.getSuggestPost'], {
        refetchOnReconnect: 'always',
        onSuccess(data) {
          setSuggestPostData(data?.data?.row)
        },
      })
    : trpc.useQuery(['community.getSuggestPostWithoutCookies'], {
        refetchOnReconnect: 'always',
        onSuccess(data) {
          setSuggestPostData(data?.data?.row)
        },
      })

  const handleCreatePost = () => {
    if (accessToken) {
      console.log('123')
    } else {
      setIsModalLoginVisible(true)
    }
  }

  return (
    <div>
      <Head>
        <title>UME | Cộng đồng</title>
      </Head>
      <AppLayout {...props}>
        <div>
          <LoginModal isModalLoginVisible={isModalLoginVisible} setIsModalLoginVisible={setIsModalLoginVisible} />
        </div>
        <div style={{ margin: '0 70px' }}>
          <div className="grid grid-cols-10 gap-10 text-white">
            <div className="col-span-2 sticky top-50">
              <div className="flex flex-col gap-10 sticky top-20">
                <div className="p-10 bg-zinc-800 rounded-3xl">
                  <div className="flex flex-col gap-5">
                    <div
                      className={`flex items-center p-3 rounded-xl gap-2 cursor-pointer hover:bg-gray-700
                      ${socialSelected === 'General' ? 'bg-gray-700' : ''}`}
                      onClick={() => setSocialSelected('General')}
                    >
                      <Earth theme="outline" size="18" fill="#FFFFFF" strokeLinejoin="bevel" />
                      <p className="text-xl font-semibold">Chung</p>
                    </div>
                    <div
                      className={`flex items-center p-3 rounded-xl gap-2 cursor-pointer hover:bg-gray-700
                      ${socialSelected === 'Following' ? 'bg-gray-700' : ''}`}
                      onClick={() => setSocialSelected('Following')}
                    >
                      <EveryUser theme="outline" size="18" fill="#FFFFFF" strokeLinejoin="bevel" />
                      <p className="text-xl font-semibold">Đang theo dõi</p>
                    </div>
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
            <div className="col-span-5">
              {loadingSuggestPost ? (
                <PostSkeletonLoader />
              ) : (
                suggestPostData?.map((data, index) => <CommunityPost key={index} data={data} />)
              )}
            </div>
            <div className="col-span-3"></div>
          </div>
        </div>
      </AppLayout>
    </div>
  )
}

export default CommunityPage
