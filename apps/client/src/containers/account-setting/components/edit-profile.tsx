/* eslint-disable jsx-a11y/alt-text */
import { Pencil } from '@icon-park/react'

import { useContext, useState } from 'react'

import Image from 'next/legacy/image'
import { UserInfomationResponse } from 'ume-chatting-service-openapi'

import { UserContext } from '~/components/layouts/app-layout/app-layout'

import { trpc } from '~/utils/trpc'

const EditProfile = () => {
  const [userSettingData, setUserSettingData] = useState<UserInfomationResponse | undefined>(undefined)
  const { isLoading: isLoadingUserSettingData, isFetching: isFetchingUserSettingData } = trpc.useQuery(
    ['identity.identityInfo'],
    {
      onSuccess(data) {
        setUserSettingData(data.data)
      },
    },
  )

  console.log(userSettingData)

  return (
    <div className="w-full px-10">
      <p>Thông tin cá nhân</p>
      {!isLoadingUserSettingData && userSettingData ? (
        <div className="flex flex-col">
          <div className="relative w-[200px] h-[200px]">
            <Image
              className="absolute rounded-full"
              layout="fill"
              objectFit="cover"
              src={userSettingData.avatarUrl}
              alt="Personal Image"
            />
            <div className="absolute right-2 bottom-0 p-2 bg-zinc-800 hover:bg-gray-700 rounded-full">
              <Pencil theme="filled" size="25" fill="#FFFFFF" strokeLinejoin="bevel" />
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
export default EditProfile
