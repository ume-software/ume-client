import { CheckSmall, CloseSmall } from '@icon-park/react'
import { useAuth } from '~/contexts/auth'

import { useState } from 'react'

import { Switch } from 'antd'
import { isNil } from 'lodash'
import { UserInformationResponse } from 'ume-service-openapi'

import { CommentSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

const EditNotificated = () => {
  const [userInfo, setUserInfo] = useState<UserInformationResponse>()
  const { logout, isAuthenticated } = useAuth()
  trpc.useQuery(['identity.identityInfo'], {
    onSuccess(data) {
      setUserInfo(data.data)
    },
    onError() {
      logout()
    },
    enabled: isAuthenticated,
  })

  const updateInformation = trpc.useMutation(['identity.updateUserProfile'])

  return (
    <div className="w-full px-10">
      <div className="flex items-center gap-3">
        <p className="text-4xl font-bold">Cài đặt thông báo</p>
        {updateInformation.isLoading && (
          <div className="flex items-center justify-center">
            <span
              className={`spinner h-5 w-5 animate-spin rounded-full border-[3px] border-r-transparent border-white}`}
            />
          </div>
        )}
      </div>
      {!!userInfo ? (
        <div className="w-[80%] mt-10 px-5 space-y-10">
          <div className="flex items-center justify-between gap-5 py-10 border-b border-white border-opacity-30">
            <div className="flex flex-col gap-2">
              <p className="text-lg">Nhận thông tin qua email</p>
              <span className="w-4/5 text-sm opacity-50">
                Nhận các thông tin khuyến mãi, giải đấu, các sự kiện qua email
              </span>
            </div>
            <Switch
              className="bg-red-600"
              checked={userInfo?.isAllowNotificationToEmail}
              onClick={(value) => {
                updateInformation.mutate(
                  { ...userInfo, isAllowNotificationToEmail: value },
                  {
                    onSuccess() {
                      const updatedUserInfor = {
                        ...userInfo,
                        isAllowNotificationToEmail: value,
                      }
                    },
                  },
                )
              }}
            />
          </div>

          <div>
            <p className="text-xl opacity-30">Âm thanh thông báo</p>
            <div className="flex items-center justify-between gap-5 py-10 border-b border-white border-opacity-30">
              <p className="text-lg">Âm thanh thông báo tin nhắn</p>
              <Switch
                className="bg-red-600"
                checked={userInfo?.isAllowNotificationMessage}
                onClick={(value) => {
                  updateInformation.mutate(
                    { ...userInfo, isAllowNotificationMessage: value },
                    {
                      onSuccess() {
                        const updatedUserInfor = {
                          ...userInfo,
                          isAllowNotificationMessage: value,
                        }
                      },
                    },
                  )
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <CommentSkeletonLoader />
        </div>
      )}
    </div>
  )
}
export default EditNotificated
