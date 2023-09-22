/* eslint-disable jsx-a11y/alt-text */
import { Menu, Transition } from '@headlessui/react'
import { Check, Pencil } from '@icon-park/react'
import { Button, Input } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'

import { Fragment, useEffect, useState } from 'react'

import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import { UserInformationResponse } from 'ume-service-openapi'

import { SkeletonForAccountSetting } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

interface GenderProps {
  key: string | undefined
  name: string
}

interface AccountSettingProps {
  avatarUrl: string | undefined
  dob: string | undefined
  email: string | undefined
  gender: GenderProps
  isVerified: boolean | undefined
  latestOnline: null
  name: string | undefined
  phone: string | undefined
  slug: object | undefined
  username: string | undefined
}

const genderData: GenderProps[] = [
  { key: 'MALE', name: 'Male' },
  { key: 'FEMALE', name: 'Female' },
  { key: 'ORTHER', name: 'Khác' },
  { key: 'PRIVATE', name: 'Ẩn' },
]

const EditProfile = () => {
  const [userSettingData, setUserSettingData] = useState<UserInformationResponse | undefined>(undefined)
  const { isLoading: isLoadingUserSettingData, isFetching: isFetchingUserSettingData } = trpc.useQuery(
    ['identity.identityInfo'],
    {
      onSuccess(data) {
        setUserSettingData(data.data)
      },
    },
  )
  const [settingAccount, setSettingAccount] = useState<AccountSettingProps>({
    avatarUrl: undefined,
    dob: undefined,
    email: undefined,
    gender: genderData.find((gender) => gender.key == userSettingData?.gender!) || genderData[0],
    isVerified: undefined,
    latestOnline: null,
    name: undefined,
    phone: undefined,
    slug: undefined,
    username: undefined,
  })
  const inforChange: boolean =
    userSettingData?.name == settingAccount.name &&
    userSettingData?.avatarUrl == settingAccount.avatarUrl &&
    userSettingData?.dob == settingAccount.dob &&
    userSettingData?.gender == settingAccount.gender.key &&
    userSettingData?.phone == settingAccount.phone &&
    userSettingData?.slug == settingAccount.slug

  const handleReturnIniState = () => {
    setSettingAccount({
      avatarUrl: userSettingData?.avatarUrl,
      dob: userSettingData?.dob,
      email: userSettingData?.email,
      gender: genderData.find((gender) => gender.key == userSettingData?.gender!) || genderData[0],
      isVerified: userSettingData?.isVerified,
      latestOnline: null,
      name: userSettingData?.name,
      phone: userSettingData?.phone,
      slug: userSettingData?.slug,
      username: userSettingData?.username,
    })
  }

  useEffect(() => {
    handleReturnIniState()
  }, [userSettingData])

  return (
    <div className="w-full px-10">
      <p className="text-4xl font-bold">Thông tin cá nhân</p>
      {!isLoadingUserSettingData && userSettingData && settingAccount ? (
        <>
          <div className="w-full flex flex-col items-center gap-5 p-10">
            <div className="w-full flex justify-start items-center gap-24">
              <div className="relative p-2">
                <Image
                  className="rounded-lg"
                  width={250}
                  height={300}
                  objectFit="cover"
                  src={userSettingData.avatarUrl || ImgForEmpty}
                  alt="Personal Image"
                />
                <div className="absolute right-0 bottom-0 p-2 bg-zinc-800 hover:bg-gray-700 rounded-full">
                  <Pencil theme="filled" size="25" fill="#FFFFFF" strokeLinejoin="bevel" />
                </div>
              </div>
              <div>
                <p className="opacity-30 py-2 border-b mb-5">Thông tin hồ sơ</p>
                <div className="flex flex-col gap-6">
                  <div className="space-y-2">
                    <label>Tên</label>
                    <Input
                      className={`${
                        settingAccount.name == userSettingData.name ? 'bg-zinc-800' : 'bg-gray-700'
                      } border border-white`}
                      value={settingAccount.name}
                      onChange={(e) => setSettingAccount((prevData) => ({ ...prevData, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Đường dẫn của bạn</label>
                    <Input
                      className={`${
                        settingAccount.slug == userSettingData.slug ? 'bg-zinc-800' : 'bg-gray-700'
                      } border border-white`}
                      placeholder="nguyen_van_a"
                      value={settingAccount.slug}
                      onChange={(e) => setSettingAccount((prevData) => ({ ...prevData, slug: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="space-y-2">
                      <label>Email</label>
                      <Input className="bg-zinc-800 focus:outline-none" value={userSettingData.email} readOnly />
                    </div>
                    <div className="space-y-2">
                      <label>Số điện thoại</label>
                      <Input
                        className={`${
                          settingAccount.phone == userSettingData.phone ? 'bg-zinc-800' : 'bg-gray-700'
                        } border border-white`}
                        value={settingAccount.phone}
                        onChange={(e) => setSettingAccount((prevData) => ({ ...prevData, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="space-y-2">
                      <label>Ngày sinh</label>
                      <Input
                        type="date"
                        className={`${
                          settingAccount.dob == userSettingData.dob ? 'bg-zinc-800' : 'bg-gray-700'
                        } border border-white`}
                        value={settingAccount.dob}
                        onChange={(e) => setSettingAccount((prevData) => ({ ...prevData, dob: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label>Giới tính</label>
                      <div className="w-fit relative">
                        <Menu>
                          <Menu.Button>
                            <button
                              className={`min-w-[110px] text-xl font-semibold px-8 py-2 ${
                                settingAccount.gender.key == userSettingData.gender ? 'bg-zinc-800' : 'bg-gray-700'
                              } hover:bg-gray-700 rounded-xl`}
                            >
                              {settingAccount.gender.name}
                            </button>
                          </Menu.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-400"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-400"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items
                              className="absolute right-0 left-0 p-2 mt-2 origin-top-right bg-[#292734] divide-y divide-gray-100 rounded-xl shadow-lg w-fit ring-1 ring-black ring-opacity-5 focus:outline-none"
                              style={{ zIndex: 5 }}
                            >
                              <div className="flex flex-col gap-2" style={{ zIndex: 10 }}>
                                {genderData.map((genData, index) => (
                                  <div
                                    className={`flex gap-5 items-center ${
                                      genData.key === settingAccount.gender.key ? 'bg-gray-700' : ''
                                    } hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                                    key={index}
                                    onClick={() => setSettingAccount((prevData) => ({ ...prevData, gender: genData }))}
                                  >
                                    <p className="text-mg font-semibold">{genData.name}</p>
                                    <div>
                                      {genData.key === settingAccount.gender.key ? (
                                        <Check theme="filled" size="10" fill="#FFFFFF" strokeLinejoin="bevel" />
                                      ) : (
                                        ''
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label>Xác minh danh tính</label>
                    <div>
                      {userSettingData.isVerified ? (
                        <div className="flex items-center justify-between">
                          <div className="w-fit bg-green-600 p-2 text-white rounded-lg">Đã xác minh</div>{' '}
                          <Button isDisabled={true} isOutlinedButton={true} customCSS="p-2 hover:scale-105">
                            Xem hình ảnh xác minh
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="w-fit bg-red-600 p-2 text-white rounded-lg">Chưa xác minh</div>
                          <Button isDisabled={true} isOutlinedButton={true} customCSS="p-2 hover:scale-105">
                            Xác minh danh tính
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-10 mt-20">
              {!inforChange && (
                <>
                  <Button
                    isDisabled={false}
                    isOutlinedButton={true}
                    customCSS="w-[100px] text-xl p-2 hover:scale-105"
                    onClick={() => handleReturnIniState()}
                  >
                    Hủy
                  </Button>
                  <Button isDisabled={true} isOutlinedButton={true} customCSS="w-[100px] text-xl p-2 hover:scale-105">
                    Thay đổi
                  </Button>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <SkeletonForAccountSetting />
      )}
    </div>
  )
}
export default EditProfile
