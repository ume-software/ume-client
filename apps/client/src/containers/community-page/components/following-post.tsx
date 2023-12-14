import { useAuth } from '~/contexts/auth'

import { useCallback, useEffect, useRef, useState } from 'react'

import { isNil } from 'lodash'
import { PostResponse, UserInformationResponse } from 'ume-service-openapi'

import CommunityPost from './community-post'

import { PostSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

const FollowingPost = () => {
  const [suggestPostData, setSuggestPostData] = useState<PostResponse[] | undefined>(undefined)
  const [scrollPosition, setScrollPosition] = useState(0)

  const [userInfo, setUserInfo] = useState<UserInformationResponse>()
  trpc.useQuery(['identity.identityInfo'], {
    onSuccess(data) {
      setUserInfo(data.data)
    },
    onError() {
      sessionStorage.removeItem('accessToken')
      sessionStorage.removeItem('refeshToken')
    },
    enabled: isNil(userInfo),
  })

  const { isAuthenticated } = useAuth()

  const containerRef = useRef<HTMLDivElement>(null)
  const [idPostArray, setIdPostArray] = useState<string[]>([])
  const {
    isLoading: loadingSuggestPost,
    isFetching: fetchingSuggestPost,
    refetch: refetchSuggestPost,
  } = trpc.useQuery(['community.getSuggestPostFollowing'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    onSuccess(data) {
      setSuggestPostData((prevData) => [...(prevData ?? []), ...(data?.data?.row ?? [])])
    },
  })
  const watchedPost = trpc.useMutation(['community.watchedPost'])

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onScroll = useCallback(() => {
    const { scrollY } = window
    setScrollPosition(scrollY)
  }, [])

  useEffect(() => {
    if (containerRef?.current) {
      const containerHeight = containerRef?.current?.offsetHeight
      if (scrollPosition > containerHeight * 0.85) {
        refetchSuggestPost()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition])

  useEffect(() => {
    if (isAuthenticated && idPostArray.length > 0) {
      watchedPost.mutate(idPostArray[idPostArray.length - 1])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idPostArray])

  return (
    <>
      {userInfo ? (
        <>
          {loadingSuggestPost && suggestPostData === undefined ? (
            <PostSkeletonLoader />
          ) : (
            <div ref={containerRef}>
              {suggestPostData?.map((data, index) => (
                <div key={index}>
                  <CommunityPost data={data} idPostArray={idPostArray} setIdPostArray={setIdPostArray} />
                </div>
              ))}
            </div>
          )}
          {(loadingSuggestPost ?? fetchingSuggestPost) && <PostSkeletonLoader />}
        </>
      ) : (
        <p>Hãy đăng nhập để xem người bạn theo dõi</p>
      )}
    </>
  )
}

export default FollowingPost
