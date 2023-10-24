/* eslint-disable jsx-a11y/alt-text */
import { Menu, Transition } from '@headlessui/react'
import { Check, CheckOne, CloseSmall, Pencil } from '@icon-park/react'
import { Button, Input, Modal } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'
import { uploadImageBooking } from '~/apis/upload-media'
import { GenderEnum } from '~/enumVariable/enumVariable'

import { FormEvent, Fragment, useEffect, useRef, useState } from 'react'

import { notification } from 'antd'
import Image from 'next/legacy/image'
import { UserInformationResponse } from 'ume-service-openapi'

import ConfirmForm from '~/components/confirm-form/confirmForm'
import { SkeletonForAccountSetting } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

interface GenderProps {
  key: GenderEnum
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
  slug: string | undefined
  username: string | undefined
}

interface SelectedImageProps {
  avatarURL: string | undefined
  frontVertificationImage: string | undefined
  backVertificationImage: string | undefined
  faceImage: string | undefined
}

const genderData: GenderProps[] = [
  { key: GenderEnum.MALE, name: 'Nam' },
  { key: GenderEnum.FEMALE, name: 'Nữ' },
  { key: GenderEnum.OTHER, name: 'Khác' },
  { key: GenderEnum.PRIVATE, name: 'Ẩn' },
]

const EditProfile = () => {
  const today = new Date().toISOString().split('T')[0]
  const [userSettingData, setUserSettingData] = useState<UserInformationResponse | undefined>(undefined)
  const { isLoading: isLoadingUserSettingData } = trpc.useQuery(['identity.identityInfo'], {
    onSuccess(data) {
      setUserSettingData(data.data)
    },
  })
  const utils = trpc.useContext()

  const updateInformation = trpc.useMutation(['identity.updateUserProfile'])
  const userKYC = trpc.useMutation(['identity.userKYC'])

  const [selectedImage, setSelectedImage] = useState<SelectedImageProps>({
    avatarURL: undefined,
    frontVertificationImage: undefined,
    backVertificationImage: undefined,
    faceImage: undefined,
  })

  const [isModalConfirmationVisible, setIsModalConfirmationVisible] = useState(false)
  const [isModalVertificationVisible, setIsModaVertificationlVisible] = useState(false)

  const editAccountInforFormRef = useRef<HTMLFormElement>(null)

  const [settingAccount, setSettingAccount] = useState<AccountSettingProps>({
    avatarUrl: undefined,
    dob: undefined,
    email: undefined,
    gender: genderData.find((gender) => gender.key == userSettingData?.gender!) ?? genderData[0],
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

  const handleReturnInitState = () => {
    setSettingAccount({
      avatarUrl: userSettingData?.avatarUrl,
      dob: userSettingData?.dob,
      email: userSettingData?.email,
      gender: genderData.find((gender) => gender.key == userSettingData?.gender!) ?? genderData[0],
      isVerified: userSettingData?.isVerified,
      latestOnline: null,
      name: userSettingData?.name,
      phone: userSettingData?.phone,
      slug: userSettingData?.slug,
      username: userSettingData?.username,
    })
  }

  const handleClose = () => {
    setIsModalConfirmationVisible(false)
    setIsModaVertificationlVisible(false)
  }

  const handleImageChange = (event, index: number) => {
    const file = event.target.files[0]

    if (file) {
      switch (index) {
        case 0:
          setSelectedImage((image) => ({
            ...image,
            avatarURL: URL.createObjectURL(file),
          }))
          break
        case 1:
          setSelectedImage((image) => ({
            ...image,
            frontVertificationImage: URL.createObjectURL(file),
          }))
          break
        case 2:
          setSelectedImage((image) => ({
            ...image,
            backVertificationImage: URL.createObjectURL(file),
          }))
          break
        case 3:
          setSelectedImage((image) => ({
            ...image,
            faceImage: URL.createObjectURL(file),
          }))
          break
        default:
          break
      }
    } else {
      notification.error({
        message: 'File ảnh bị lỗi',
        description: 'Vui lòng kiểm tra lại file ảnh!',
        placement: 'bottomLeft',
      })
    }
  }

  const handleUploadImage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    if (selectedImage.frontVertificationImage && selectedImage.backVertificationImage && selectedImage.faceImage) {
      try {
        const responseData = await uploadImageBooking(formData)
        if (responseData?.data?.data?.results) {
          userKYC.mutate(
            {
              frontSideCitizenIdImageUrl: responseData.data.data.results[0],
              backSideCitizenIdImageUrl: responseData.data.data.results[1],
              portraitImageUrl: responseData.data.data.results[2],
            },
            {
              onSuccess() {
                setSelectedImage((image) => ({
                  ...image,
                  frontVertificationImage: undefined,
                  backVertificationImage: undefined,
                  faceImage: undefined,
                }))
                setIsModaVertificationlVisible(false)
                utils.invalidateQueries('identity.identityInfo')
                notification.success({
                  message: 'Cập nhật thông tin thành công',
                  description: 'Thông tin vừa được cập nhật',
                  placement: 'bottomLeft',
                })
              },
              onError() {
                notification.error({
                  message: 'Cập nhật thông tin thất bại',
                  description: 'Có lỗi trong quá tring cập nhật thông tin. Vui lòng thử lại sau!',
                  placement: 'bottomLeft',
                })
              },
            },
          )
        } else {
          notification.error({
            message: 'Cập nhật thông tin thất bại',
            description: 'Có lỗi trong quá tring cập nhật thông tin. Vui lòng thử lại sau!',
            placement: 'bottomLeft',
          })
        }
      } catch (error) {
        notification.error({
          message: 'Cập nhật thông tin thất bại',
          description: 'Có lỗi trong quá tring cập nhật thông tin. Vui lòng thử lại sau!',
          placement: 'bottomLeft',
        })
      }
    } else {
      notification.warning({
        message: 'Thiếu ảnh',
        description: 'Vui lòng cung cấp đủ hình ảnh!',
        placement: 'bottomLeft',
      })
    }
  }

  const handleUpdateInformation = async () => {
    if (editAccountInforFormRef.current) {
      if (selectedImage.avatarURL) {
        const formData = new FormData(editAccountInforFormRef.current)
        const responseData = await uploadImageBooking(formData)

        if (responseData?.data?.data?.results) {
          try {
            updateInformation.mutate(
              {
                avatarUrl: String(responseData.data.data.results),
                dob: settingAccount.dob ?? undefined,
                gender: settingAccount.gender.key,
                name: settingAccount.name?.trim(),
                slug: settingAccount.slug?.trim() ?? undefined,
              },
              {
                onSuccess() {
                  setSelectedImage((image) => ({
                    ...image,
                    avatarURL: undefined,
                  }))
                  setIsModalConfirmationVisible(false)
                  utils.invalidateQueries('identity.identityInfo')
                  notification.success({
                    message: 'Cập nhật thông tin thành công',
                    description: 'Thông tin vừa được cập nhật',
                    placement: 'bottomLeft',
                  })
                },
              },
            )
          } catch (error) {
            notification.error({
              message: 'Cập nhật thông tin thất bại',
              description: 'Có lỗi trong quá tring cập nhật thông tin. Vui lòng thử lại sau!',
              placement: 'bottomLeft',
            })
          }
        } else {
          notification.error({
            message: 'Cập nhật thông tin thất bại',
            description: 'Có lỗi trong quá tring cập nhật thông tin. Vui lòng thử lại sau!',
            placement: 'bottomLeft',
          })
        }
      } else {
        try {
          updateInformation.mutate(
            {
              dob: settingAccount.dob ?? undefined,
              gender: settingAccount.gender.key,
              name: settingAccount.name?.trim(),
              slug: settingAccount.slug?.trim() ?? undefined,
            },
            {
              onSuccess() {
                utils.invalidateQueries('identity.identityInfo')
                setIsModalConfirmationVisible(false)
                notification.success({
                  message: 'Cập nhật thông tin thành công',
                  description: 'Thông tin vừa được cập nhật',
                  placement: 'bottomLeft',
                })
              },
            },
          )
        } catch (error) {
          notification.error({
            message: 'Cập nhật thông tin thất bại',
            description: 'Có lỗi trong quá tring cập nhật thông tin. Vui lòng thử lại sau!',
            placement: 'bottomLeft',
          })
        }
      }
    }
  }

  const confirmModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    show: isModalConfirmationVisible,
    form: (
      <>
        <ConfirmForm
          title="Thay đổi thông tin cá nhân"
          description="Bạn có chấp nhận thay đổi thông tin cá nhân hay không?"
          onClose={handleClose}
          onOk={() => {
            handleUpdateInformation()
          }}
        />
      </>
    ),
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

  useEffect(() => {
    handleReturnInitState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSettingData])

  const vertificationModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    show: isModalVertificationVisible,
    customModalCSS: 'top-0 overflow-y-auto custom-scrollbar',
    closeWhenClickOutSide: true,
    form: (
      <>
        <form
          className="min-h-[75%] max-h-[95%] flex flex-col justify-between px-5 pb-5 gap-5 overflow-y-auto custom-scrollbar"
          onSubmit={handleUploadImage}
        >
          <div className="text-xl text-white font-bold pb-3 border-b border-opacity-30">Xác minh danh tính</div>
          <p className="text-white opacity-50">*Dùng ảnh CCCD hoặc Passport</p>
          <div className="min-h-[75%] max-h-full flex flex-col gap-10 text-md text-white overflow-y-auto custom-scrollbar">
            <div>
              <label>Ảnh mặt trước</label>
              <div className="relative">
                <div className="relative w-full h-[300px] bg-white bg-opacity-30 rounded-xl">
                  {!selectedImage.frontVertificationImage && (
                    <div className="w-full h-full absolute flex justify-center items-center top-0 left-0 right-0 bottom-0 border-dashed border-2 border-white rounded-xl z-10">
                      <p className="text-white text-4xl font-bold">+</p>
                    </div>
                  )}
                  <Image
                    className="rounded-lg"
                    layout="fill"
                    objectFit="scale-down"
                    src={selectedImage.frontVertificationImage ? selectedImage.frontVertificationImage : ImgForEmpty}
                    alt="Personal Image"
                  />
                </div>
                <input
                  className="absolute w-full h-full top-0 left-0 opacity-0 z-20 cursor-pointer"
                  type="file"
                  name="files"
                  onChange={(e) => handleImageChange(e, 1)}
                />
              </div>
            </div>
            <div>
              <label>Ảnh mặt sau</label>
              <div className="relative">
                <div className="relative w-full h-[300px] bg-white bg-opacity-30 rounded-xl">
                  <div className="w-full h-full absolute flex justify-center items-center top-0 left-0 right-0 bottom-0 border-dashed border-2 border-white rounded-xl z-10">
                    <p className="text-white text-4xl font-bold">+</p>
                  </div>
                  <Image
                    className="rounded-lg"
                    layout="fill"
                    objectFit="scale-down"
                    src={selectedImage.backVertificationImage ? selectedImage.backVertificationImage : ImgForEmpty}
                    alt="Personal Image"
                  />
                </div>
                <input
                  className="absolute w-full h-full top-0 left-0 opacity-0 z-20 cursor-pointer"
                  type="file"
                  name="files"
                  onChange={(e) => handleImageChange(e, 2)}
                />
              </div>
            </div>
            <div>
              <label>Ảnh khuôn mặt</label>
              <div className="relative">
                <div className="relative w-full h-[300px] bg-white bg-opacity-30 rounded-xl">
                  <div className="w-full h-full absolute flex justify-center items-center top-0 left-0 right-0 bottom-0 border-dashed border-2 border-white rounded-xl z-10">
                    <p className="text-white text-4xl font-bold">+</p>
                  </div>
                  <Image
                    className="rounded-lg"
                    layout="fill"
                    objectFit="scale-down"
                    src={selectedImage.faceImage ? selectedImage.faceImage : ImgForEmpty}
                    alt="Personal Image"
                  />
                </div>
                <input
                  className="absolute w-full h-full top-0 left-0 opacity-0 z-20 cursor-pointer"
                  type="file"
                  name="files"
                  onChange={(e) => handleImageChange(e, 3)}
                />
              </div>
            </div>
          </div>
          <div className="min-h-[50px] flex justify-around items-start">
            <Button
              isActive={false}
              isOutlinedButton={true}
              customCSS="w-[100px] text-xl p-2 rounded-xl hover:scale-105"
              onClick={() => handleClose()}
            >
              Hủy
            </Button>

            <Button
              customCSS="w-[150px] text-xl p-2 rounded-xl hover:scale-105"
              type="submit"
              isActive={true}
              isOutlinedButton={true}
            >
              Xác minh
            </Button>
          </div>
        </form>
      </>
    ),
    backgroundColor: '#15151b',
    closeButtonOnConner: (
      <>
        <CloseSmall
          onClick={handleClose}
          onKeyDown={(e) => e.key === 'Enter' && handleClose()}
          tabIndex={1}
          className="bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
          theme="outline"
          size="24"
          fill="#FFFFFF"
        />
      </>
    ),
  })

  return (
    <div className="w-full px-10">
      <p className="text-4xl font-bold">Thông tin cá nhân</p>
      {!isLoadingUserSettingData && userSettingData && settingAccount ? (
        <>
          <form
            ref={editAccountInforFormRef}
            onSubmit={handleUpdateInformation}
            className="w-full flex flex-col items-center gap-5 p-10"
          >
            <div className="w-full flex justify-start items-center gap-24">
              <div className="relative p-2 bg-gray-700 rounded-lg">
                <div className="w-[250px] h-[300px]">
                  <Image
                    className="rounded-lg"
                    layout="fill"
                    objectFit="cover"
                    src={selectedImage.avatarURL ? selectedImage.avatarURL : userSettingData.avatarUrl ?? ImgForEmpty}
                    alt="Personal Image"
                  />
                </div>
                <div className="absolute right-0 bottom-0 p-2 bg-zinc-800 hover:bg-gray-700 rounded-full">
                  <Pencil theme="filled" size="25" fill="#FFFFFF" strokeLinejoin="bevel" />
                  <input
                    className="absolute w-full h-full top-0 left-0 opacity-0 z-20"
                    type="file"
                    name="files"
                    onChange={(e) => handleImageChange(e, 0)}
                  />
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
                      } border border-white border-opacity-30`}
                      value={settingAccount.name}
                      onChange={(e) => setSettingAccount((prevData) => ({ ...prevData, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Đường dẫn của bạn</label>
                    <Input
                      className={`${
                        settingAccount.slug == userSettingData.slug ? 'bg-zinc-800' : 'bg-gray-700'
                      } border border-white border-opacity-30`}
                      placeholder="nguyen_van_a"
                      value={settingAccount.slug}
                      onChange={(e) => {
                        setSettingAccount((prevData) => ({ ...prevData, slug: e.target.value.replace(/ /g, '-') }))
                      }}
                      disabled={!!settingAccount.slug}
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
                        } border border-white border-opacity-30`}
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
                        } border border-white border-opacity-30`}
                        max={today}
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
                          <div className="w-fit flex items-center gap-2 bg-green-600 py-2 px-4 text-white rounded-md">
                            <CheckOne theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" /> Đã xác minh
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="w-fit bg-red-600 p-2 px-5 text-white rounded-md">Chưa xác minh</div>
                          <Button
                            isActive={true}
                            isOutlinedButton={true}
                            customCSS="py-2 px-7 rounded-xl hover:scale-105"
                            type="button"
                            onClick={() => {
                              setIsModaVertificationlVisible(true)
                            }}
                          >
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
              {(!inforChange || selectedImage.avatarURL) && (
                <>
                  <Button
                    isActive={false}
                    isOutlinedButton={true}
                    type="button"
                    customCSS="w-[100px] text-xl p-2 rounded-xl hover:scale-105"
                    onClick={() => handleReturnInitState()}
                  >
                    Hủy
                  </Button>
                  <Button
                    customCSS="w-[100px] text-xl p-2 rounded-xl hover:scale-105"
                    type="button"
                    isActive={true}
                    isOutlinedButton={true}
                    onClick={() => {
                      setIsModalConfirmationVisible(true)
                    }}
                  >
                    Thay đổi
                  </Button>
                </>
              )}
            </div>
            {isModalConfirmationVisible && confirmModal}
          </form>
          {isModalVertificationVisible && vertificationModal}
        </>
      ) : (
        <SkeletonForAccountSetting />
      )}
    </div>
  )
}
export default EditProfile
