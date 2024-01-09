import { PhoneOff } from '@icon-park/react'
import { useAuth } from '~/contexts/auth'
import { getEnv } from '~/env'

import { useEffect, useState } from 'react'

import AgoraRTC from 'agora-rtc-sdk-ng'
import { isNil } from 'lodash'
import { useRouter } from 'next/router'
import { CallResponse } from 'ume-chatting-service-openapi'
import { UserInformationResponse } from 'ume-service-openapi'

import { VideoPlayer } from './video-player'

import { trpc } from '~/utils/trpc'

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

const VideoRoom = () => {
  const router = useRouter()
  const slug = router.query

  const expireAgoraTime = Math.floor(Date.now() / 1000) + 86400

  const { isAuthenticated } = useAuth()
  const [userInfo, setUserInfo] = useState<UserInformationResponse | null>(null)
  const { isFetching, isLoading } = trpc.useQuery(['identity.identityInfo'], {
    onSuccess(data) {
      setUserInfo(data.data)
    },
    onError() {},
    enabled: isAuthenticated,
  })

  const [users, setUsers] = useState<any[]>([])
  const [tracks, setTracks] = useState<any[]>([])
  const [localTracks, setLocalTracks] = useState<any[]>([])
  const [isJoinChannel, setIsJoinChannel] = useState<boolean>(false)

  const [myUid, setMyUid] = useState<number>(0)

  const [rtcAgora, setRtcAgora] = useState<CallResponse>()
  trpc.useQuery(
    [
      'chatting.getTokenForVideoCall',
      { channelId: slug.channelId?.toString() ?? '', privilegeExpireTime: expireAgoraTime },
    ],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 0,
      refetchOnMount: false,
      onSuccess(data) {
        setRtcAgora(data.data)
      },
      enabled: isNil(client.channelName) && isNil(slug.tk),
    },
  )

  useEffect(() => {
    if (!isFetching && !isLoading && !userInfo) {
      router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType)
    setIsJoinChannel(true)

    if (mediaType === 'video') {
      setUsers((prevUsers) => [...prevUsers, user])
    }

    if (mediaType === 'audio') {
      // user.audioTrack.play()
    }
  }

  const handleUserLeft = (user) => {
    setUsers((prevUsers) => [...prevUsers.filter((prevUser) => prevUser.uid !== user.uid)])
    setIsJoinChannel(false)
  }

  const handleLeaveChannel = () => {
    for (let localTrack of localTracks) {
      localTrack.stop()
      localTrack.close()
    }
    router.replace('/')
  }

  useEffect(() => {
    client.on('user-published', handleUserJoined)
    client.on('user-left', handleUserLeft)

    client.disableDualStream()

    if (slug.tk?.toString() && slug.uid?.toString() && !isJoinChannel) {
      const uid = Number(decodeURIComponent(slug.uid?.toString()) ?? 0)
      const rtcAgoraToken = decodeURIComponent(slug.tk?.toString()) ?? ''
      setMyUid(uid)
      try {
        client
          .join(getEnv().agoraAppID, slug.channelId?.toString() ?? '', rtcAgoraToken, uid)
          .then((uid) => Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid]))
          .then(([tracks, uid]) => {
            const [audioTrack, videoTrack] = tracks
            setLocalTracks(tracks)
            setUsers((previousUsers) => [
              ...previousUsers,
              {
                uid,
                videoTrack,
                audioTrack,
              },
            ])
            setIsJoinChannel(true)
            setTracks([audioTrack, videoTrack])
            if (audioTrack && videoTrack) {
              client.publish(tracks)
            }
          })
      } catch (error) {
        console.log(error)
      }
    } else if (rtcAgora && !isJoinChannel && isNil(client.channelName)) {
      const uid: any = rtcAgora?.uid ?? 0
      const rtcAgoraToken = rtcAgora?.rtcToken ?? null
      setMyUid(uid)
      try {
        client
          .join(getEnv().agoraAppID, slug.channelId?.toString() ?? '', rtcAgoraToken, uid)
          .then((uid) => Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid]))
          .then(([tracks, uid]) => {
            const [audioTrack, videoTrack] = tracks
            setLocalTracks(tracks)
            setUsers((previousUsers) => [
              ...previousUsers,
              {
                uid,
                videoTrack,
                audioTrack,
              },
            ])
            setIsJoinChannel(true)
            setTracks([audioTrack, videoTrack])
            if (audioTrack && videoTrack) {
              client.publish(tracks)
            }
          })
      } catch (error) {
        console.log(error)
      }
    } else {
      client.leave()
    }

    return () => {
      for (let localTrack of localTracks) {
        localTrack.stop()
        localTrack.close()
      }
      if (isJoinChannel && tracks.length > 0) {
        client.off('user-published', handleUserJoined)
        client.off('user-unpublished', handleUserLeft)
        if (client.channelName) {
          client.unpublish(tracks).then(() => {
            setTracks([])
            setIsJoinChannel(false)
            client.leave()
          })
        } else {
          setIsJoinChannel(false)
          client.leave()
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rtcAgora, slug.tk, slug.uid])

  function removeDuplicates(arr) {
    return arr.filter((item, index, self) => {
      const firstIndex = self.findIndex((i) => i.uid === item.uid)
      return index === firstIndex
    })
  }

  return (
    <div className="min-h-screen text-white mt-32">
      <div className="grid grid-cols-6 pl-10 pr-20 mb-10">
        {removeDuplicates(users).map((user) => (
          <div key={user.uid.toString()} className={`2xl:col-span-3 lg:col-span-2 col-span-1 px-5 rounded-lg`}>
            <VideoPlayer user={user} myUid={myUid} />
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <div
          className="p-5 ml-10 mr-20 my-10 rounded-full bg-red-500 cursor-pointer"
          onClick={() => handleLeaveChannel()}
          onKeyDown={() => {}}
        >
          <PhoneOff theme="outline" size="25" fill="#FFF" strokeLinejoin="bevel" />
        </div>
      </div>
    </div>
  )
}
export default VideoRoom
