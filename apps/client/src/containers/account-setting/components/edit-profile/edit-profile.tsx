import { Menu, Transition } from '@headlessui/react'
import { Check, CheckOne, CloseSmall, Info, Pencil } from '@icon-park/react'
import { Button, FormInput, Input, Modal } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'
import { uploadImage } from '~/apis/upload-media'
import { GenderEnum } from '~/enumVariable/enumVariable'
import useDebounce from '~/hooks/useDebounce'

import { Fragment, useEffect, useRef, useState } from 'react'

import { Tooltip, notification } from 'antd'
import { useFormik } from 'formik'
import Image from 'next/legacy/image'
import * as Yup from 'yup'

import { KYCFormStep } from './kyc-form'

import ConfirmForm from '~/components/confirm-form/confirm-form'
import { SkeletonForAccountSetting } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

interface GenderProps {
  key: GenderEnum
  name: string
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

  const { data: userSettingData, isLoading: isLoadingUserSettingData } = trpc.useQuery(['identity.identityInfo'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
  })
  const utils = trpc.useContext()

  const updateInformation = trpc.useMutation(['identity.updateUserProfile'])

  const [selectedImage, setSelectedImage] = useState<SelectedImageProps>({
    avatarURL: undefined,
    frontVertificationImage: undefined,
    backVertificationImage: undefined,
    faceImage: undefined,
  })

  const [isModalConfirmationVisible, setIsModalConfirmationVisible] = useState(false)
  const [isModalVertificationVisible, setIsModalVertificationVisible] = useState(false)

  const editAccountInforFormRef = useRef<HTMLFormElement>(null)

  const vietnamesePhoneNumberRegExp = /^(0)\d{9}$/

  const form = useFormik({
    initialValues: {
      avatarUrl: '',
      dob: '',
      email: '',
      gender: genderData[0],
      isVerified: false,
      latestOnline: null,
      name: '',
      phone: '',
      slug: '',
      username: '',
    },
    validationSchema: Yup.object({
      phone: Yup.string().matches(vietnamesePhoneNumberRegExp, 'Định dạng không hợp lệ'),
    }),
    onSubmit(values) {
      setIsModalConfirmationVisible(true)
    },
  })
  const handleImageChange = (event, index: number) => {
    const file = event.target.files[0]

    if (file) {
      switch (index) {
        case 0:
          setSelectedImage((image) => ({
            ...image,
            avatarURL: URL.createObjectURL(file),
          }))
          form.setFieldValue('avatarUrl', URL.createObjectURL(file))
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

  const handleResetForm = () => {
    if (!isLoadingUserSettingData && userSettingData) {
      form.setValues({
        avatarUrl: userSettingData?.data?.avatarUrl ?? '',
        dob: userSettingData?.data?.dob?.split('T')[0] ?? '',
        email: userSettingData?.data?.email ?? '',
        gender: genderData.find((gender) => gender.key == userSettingData?.data?.gender) ?? genderData[0],
        isVerified: userSettingData?.data?.isVerified,
        latestOnline: null,
        name: userSettingData?.data?.name ?? '',
        phone: userSettingData?.data?.phone ?? '',
        slug: userSettingData?.data?.slug ?? '',
        username: userSettingData?.data?.username ?? '',
      })
    }
  }

  useEffect(() => {
    handleResetForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSettingData])

  const debouncedValue = useDebounce<string>(form.values.slug, 500)
  const { data: checkSlugUserData } = trpc.useQuery(['identity.checkSlugUser', debouncedValue], {
    enabled: !!form.values.slug,
  })

  const inforChange: boolean =
    (userSettingData?.data?.name ?? '') == form.values.name &&
    (userSettingData?.data?.avatarUrl ?? '') == form.values.avatarUrl &&
    (userSettingData?.data?.dob?.split('T')[0] ?? '') == form.values.dob &&
    (userSettingData?.data?.gender ?? '') == form.values.gender.key &&
    (userSettingData?.data?.phone ?? '') == form.values.phone &&
    (userSettingData?.data?.slug ?? '') == form.values.slug

  const handleClose = () => {
    setIsModalConfirmationVisible(false)
    setIsModalVertificationVisible(false)
  }

  const handleUpdateInformation = async () => {
    if (editAccountInforFormRef.current) {
      if (selectedImage.avatarURL) {
        const formData = new FormData(editAccountInforFormRef.current)
        const file = formData.get('files')
        const image = new FormData()
        if (file instanceof File) {
          image.append('file', file, file.name)
          const responseData = await uploadImage(image)

          if (responseData?.data?.data?.results) {
            try {
              updateInformation.mutate(
                {
                  avatarUrl: String(responseData.data.data.results),
                  dob: form.values.dob,
                  gender: form.values.gender.key,
                  name: form.values.name?.trim(),
                  slug: form.values.slug?.trim(),
                  phone: form.values.phone,
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
        }
      } else {
        try {
          updateInformation.mutate(
            {
              dob: form.values.dob,
              gender: form.values.gender.key,
              name: form.values.name?.trim(),
              slug: form.values.slug?.trim(),
              phone: form.values.phone,
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
            description: 'Có lỗi trong quá trình cập nhật thông tin. Vui lòng thử lại sau!',
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
      <ConfirmForm
        title="Thay đổi thông tin cá nhân"
        description="Bạn có chấp nhận thay đổi thông tin cá nhân hay không?"
        onClose={handleClose}
        onOk={() => {
          handleUpdateInformation()
        }}
      />
    ),
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

  const vertificationModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    show: isModalVertificationVisible,
    customModalCSS: 'top-0 overflow-y-auto custom-scrollbar',
    closeWhenClickOutSide: true,
    form: (
      <KYCFormStep
        handleClose={handleClose}
        setIsModalVertificationVisible={setIsModalVertificationVisible}
        setSelectedImage={setSelectedImage}
        handleImageChange={handleImageChange}
        selectedImage={selectedImage}
      />
    ),
    backgroundColor: '#15151b',
    closeButtonOnConner: (
      <CloseSmall
        onClick={handleClose}
        onKeyDown={(e) => e.key === 'Enter' && handleClose()}
        tabIndex={1}
        className="bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })

  return (
    <div className="w-full px-10">
      <p className="text-4xl font-bold">Thông tin cá nhân</p>
      {!isLoadingUserSettingData && userSettingData?.success ? (
        <>
          <form
            ref={editAccountInforFormRef}
            onSubmit={form.handleSubmit}
            className="flex flex-col items-center w-full gap-5 p-10"
          >
            <div className="flex items-center justify-start w-full gap-24">
              <div className="relative p-2 bg-gray-700 rounded-lg">
                <div className="w-[250px] h-[300px]">
                  <Image
                    className="rounded-lg"
                    layout="fill"
                    objectFit="cover"
                    src={
                      selectedImage.avatarURL
                        ? selectedImage.avatarURL
                        : form.values.avatarUrl != ''
                        ? form.values.avatarUrl
                        : ImgForEmpty
                    }
                    alt="Personal Image"
                  />
                </div>
                <div className="absolute bottom-0 right-0 p-2 rounded-full bg-zinc-800 hover:bg-gray-700">
                  <Pencil theme="filled" size="25" fill="#FFFFFF" strokeLinejoin="bevel" />
                  <input
                    className="absolute top-0 left-0 z-20 w-full h-full opacity-0"
                    type="file"
                    name="files"
                    onChange={(e) => handleImageChange(e, 0)}
                  />
                </div>
              </div>
              <div>
                <p className="py-2 mb-5 border-b opacity-30">Thông tin hồ sơ</p>
                <div className="flex flex-col gap-6">
                  <div className="space-y-2">
                    <label>Tên</label>
                    <FormInput
                      name="name"
                      className={`${
                        form.values.name == (userSettingData.data?.name ?? '') ? 'bg-zinc-800' : 'bg-gray-700'
                      } border border-white border-opacity-30`}
                      value={form.values.name}
                      onChange={(e) => form.handleChange(e)}
                      onBlur={form.handleBlur}
                      error={!!form.errors.name && form.touched.name}
                      errorMessage={''}
                      autoComplete="off"
                    />
                    {!!form.errors.name && form.touched.name && (
                      <p className="text-xs text-red-500">{form.errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-end gap-3">
                      Đường dẫn của bạn{' '}
                      {!userSettingData.data?.slug && (
                        <p className="text-xs font-semibold text-red-600 opacity-80">
                          *( Chỉ được cập nhật một lần duy nhất )
                        </p>
                      )}
                    </label>
                    <FormInput
                      name="slug"
                      className={`${
                        form.values.slug == (userSettingData.data?.slug ?? '') ? 'bg-zinc-800' : 'bg-gray-700'
                      } ${
                        !userSettingData.data?.slug
                          ? 'border border-white border-opacity-30'
                          : '!border-none !hover:border-none !focus:border-none outline-0'
                      }`}
                      placeholder="nguyen_van_a"
                      value={form.values.slug}
                      onChange={(e) => {
                        const updatedValue = e.target.value.replace(/ /g, '-')
                        e.target.value = updatedValue
                        form.handleChange(e)
                      }}
                      onBlur={form.handleBlur}
                      disabled={!!userSettingData.data?.slug}
                      readOnly={!!userSettingData.data?.slug}
                      error={(!!form.errors.slug && form.touched.slug) || checkSlugUserData?.data.isExisted}
                      errorMessage={undefined}
                    />
                    {!!form.errors.slug && form.touched.slug && (
                      <p className="text-xs text-red-500">{form.errors.slug}</p>
                    )}
                    {!userSettingData.data?.slug && checkSlugUserData?.data.isExisted && (
                      <p className="text-xs text-red-500">Đường dẫn này đãn được sử dụng</p>
                    )}
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="space-y-2">
                      <label>Email</label>
                      <Input
                        name="email"
                        className="bg-zinc-800 focus:outline-none text-slate-200"
                        value={form.values.email}
                        disabled
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <label>Số điện thoại</label>
                      <FormInput
                        type="text"
                        name="phone"
                        className={`${
                          form.values.phone == (userSettingData.data?.phone ?? '') ? 'bg-zinc-800' : 'bg-gray-700'
                        } border border-white border-opacity-30`}
                        value={form.values.phone}
                        onChange={(e) => form.handleChange(e)}
                        onBlur={form.handleBlur}
                        error={!!form.errors.phone && form.touched.phone}
                        errorMessage={''}
                        autoComplete="off"
                      />
                      {!!form.errors.phone && form.touched.phone && (
                        <p className="text-xs text-red-500">{form.errors.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="space-y-2">
                      <label>Ngày sinh</label>
                      <FormInput
                        name="dob"
                        type="date"
                        className={`${
                          form.values.dob == (userSettingData.data?.dob?.split('T')[0] ?? '')
                            ? 'bg-zinc-800'
                            : 'bg-gray-700'
                        } border border-white border-opacity-30`}
                        max={today}
                        value={form.values.dob}
                        onChange={(e) => form.handleChange(e)}
                        onBlur={form.handleBlur}
                        error={!!form.errors.dob && form.touched.dob}
                        errorMessage={''}
                      />
                      {!!form.errors.dob && form.touched.dob && (
                        <p className="text-xs text-red-500">{form.errors.dob}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label>Giới tính</label>
                      <div className="relative w-fit">
                        <Menu>
                          <Menu.Button>
                            <button
                              className={`min-w-[110px] text-xl font-semibold px-8 py-2 ${
                                form.values.gender.key == userSettingData.data?.gender ? 'bg-zinc-800' : 'bg-gray-700'
                              } hover:bg-gray-700 rounded-xl`}
                              type="button"
                            >
                              {form.values.gender.name}
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
                                      genData.key === form.values.gender.key ? 'bg-gray-700' : ''
                                    } hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                                    key={index}
                                    onClick={() => {
                                      form.setFieldValue('gender', genData)
                                    }}
                                    onKeyDown={() => {}}
                                  >
                                    <p className="font-semibold text-mg">{genData.name}</p>
                                    <div>
                                      {genData.key === form.values.gender.key ? (
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
                      {userSettingData.data?.isVerified ? (
                        <div className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-3xl w-fit">
                          Đã xác minh
                          <CheckOne theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex p-2 px-5 text-white bg-red-600 rounded-3xl w-fit">
                            Chưa xác minh
                            <Tooltip
                              title={
                                <div className="text-black">
                                  Bạn cần xác minh danh tính
                                  <br />
                                  để mở chế độ nhà cung cấp
                                </div>
                              }
                              color="#fff"
                            >
                              <Info theme="outline" size="24" fill="#fff" className="mb-1 ml-2" />
                            </Tooltip>
                          </div>
                          <Button
                            isActive={true}
                            isOutlinedButton={true}
                            customCSS="py-2 px-7 rounded-xl hover:scale-105"
                            type="button"
                            onClick={() => {
                              setIsModalVertificationVisible(true)
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
                    customCSS="w-[130px] text-xl p-2 rounded-xl hover:scale-105"
                    onClick={() => handleResetForm()}
                  >
                    Hủy
                  </Button>
                  <Button
                    customCSS="w-[130px] text-xl p-2 rounded-xl hover:scale-105"
                    type="button"
                    isActive={true}
                    isOutlinedButton={true}
                    onClick={() => {
                      if (vietnamesePhoneNumberRegExp.test(form.values.phone)) {
                        setIsModalConfirmationVisible(true)
                      }
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
