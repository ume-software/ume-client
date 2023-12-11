import { CheckSmall, CloseSmall } from '@icon-park/react'

import { Switch } from 'antd'

import { CommentSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

const EditNotificated = () => {
  const { data: userSettingData, isLoading: isLoadingUserSettingData } = trpc.useQuery(['identity.identityInfo'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
  })

  const updateInformation = trpc.useMutation(['identity.updateUserProfile'])

  return (
    <div className="w-full px-10">
      <p className="text-4xl font-bold">Cài đặt thông báo</p>
      {!isLoadingUserSettingData ? (
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
              checkedChildren={<CheckSmall theme="outline" size="23" fill="#fff" strokeLinejoin="bevel" />}
              unCheckedChildren={<CloseSmall theme="outline" size="23" fill="#fff" strokeLinejoin="bevel" />}
              checked={userSettingData?.data?.isAllowNotificationToEmail}
            />
          </div>

          <div>
            <p className="text-xl opacity-30">Âm thanh thông báo</p>
            <div className="flex items-center justify-between gap-5 py-10 border-b border-white border-opacity-30">
              <p className="text-lg">Âm thanh thông báo tin nhắn</p>
              <Switch
                className="bg-red-600"
                checkedChildren={<CheckSmall theme="outline" size="23" fill="#fff" strokeLinejoin="bevel" />}
                unCheckedChildren={<CloseSmall theme="outline" size="23" fill="#fff" strokeLinejoin="bevel" />}
                checked={userSettingData?.data?.isAllowNotificationMessage}
              />
            </div>
            {/* <div className="flex items-center justify-between gap-5 py-10 border-b border-white border-opacity-30">
            <p className="text-lg">Âm thanh thông báo cuộc gọi</p>
            <Switch
              className="bg-red-600"
              checkedChildren={<CheckSmall theme="outline" size="23" fill="#fff" strokeLinejoin="bevel" />}
              unCheckedChildren={<CloseSmall theme="outline" size="23" fill="#fff" strokeLinejoin="bevel" />}
              defaultChecked
            />
          </div> */}
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
