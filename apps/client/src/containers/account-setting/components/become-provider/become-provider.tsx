import { Menu, Transition } from '@headlessui/react'
import { Check, CheckSmall, CloseSmall, Voice, Write } from '@icon-park/react'
import { Button, Modal, TextArea } from '@ume/ui'
import 'swiper/swiper-bundle.css'
import { uploadAudio } from '~/apis/upload-media'
import { useAuth } from '~/contexts/auth'

import { Fragment, useEffect, useRef, useState } from 'react'

import { Switch, notification } from 'antd'
import { useFormik } from 'formik'
import { UpdateProviderProfileRequestStatusEnum } from 'ume-service-openapi'
import * as Yup from 'yup'

import ServiceForm from './service-form'

import ConfirmForm from '~/components/confirm-form/confirm-form'
import { SkeletonProviderService } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

interface IStatus {
  key: string
  label: string
  [key: string]: any
}

const mappingStatusOfProvider: IStatus[] = [
  {
    key: UpdateProviderProfileRequestStatusEnum.Activated,
    label: 'Sẵn sàng',
  },
  {
    key: UpdateProviderProfileRequestStatusEnum.Busy,
    label: 'Bận',
  },
  {
    key: UpdateProviderProfileRequestStatusEnum.StoppedAcceptingBooking,
    label: 'Ngừng nhận đơn',
  },
  {
    key: UpdateProviderProfileRequestStatusEnum.UnActivated,
    label: 'Chưa sẵn sàng',
  },
]

const BecomeProvider = () => {
  const { user } = useAuth()
  const [checked, setChecked] = useState<boolean>(false)

  const [isModalConfirmationVisible, setIsModalConfirmationVisible] = useState(false)
  const [audioSource, setAudioSource] = useState<string | undefined>(undefined)

  const { data: userSettingData, isLoading: isLoadingUserSettingData } = trpc.useQuery(
    ['identity.getUserBySlug', String(user?.slug ?? '')],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 0,
      refetchOnMount: true,
      enabled: !!user?.slug,
    },
  )
  const updateIntroduceProvider = trpc.useMutation(['identity.userUpdateProviderProfile'])
  const registerBecomeProvider = trpc.useMutation(['identity.registerBecomeProvider'])
  const utils = trpc.useContext()

  const updateIntroduceForProviderFormRef = useRef<HTMLFormElement>(null)

  const form = useFormik({
    initialValues: {
      voice: '',
      status: mappingStatusOfProvider[0].key,
      description: '',
    },
    validationSchema: Yup.object({
      description: Yup.string().required('Giới thiệu là yêu cầu'),
    }),
    onSubmit: () => {
      setIsModalConfirmationVisible(true)
    },
  })

  const handleResetForm = () => {
    form.setFieldValue('voice', userSettingData?.data.providerConfig?.voiceUrl)
    form.setFieldValue('status', userSettingData?.data.providerConfig?.status)
    form.setFieldValue('description', userSettingData?.data.providerConfig?.description)
    setAudioSource(userSettingData?.data.providerConfig?.voiceUrl)
  }

  useEffect(() => {
    if (userSettingData?.data.providerConfig) {
      handleResetForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userSettingData?.data.providerConfig?.voiceUrl,
    userSettingData?.data.providerConfig?.status,
    userSettingData?.data.providerConfig?.description,
    userSettingData?.data.providerConfig,
  ])

  useEffect(() => {
    if (user) setChecked(user?.isProvider)
  }, [user])

  const handleBecomeProvider = () => {
    checked
      ? registerBecomeProvider.mutate(undefined, {
          onSuccess() {
            setChecked(false)
          },
        })
      : registerBecomeProvider.mutate(undefined, {
          onSuccess() {
            setChecked(true)
          },
        })
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const fileURL = URL.createObjectURL(file)
      setAudioSource(fileURL)
      form.setFieldValue('voice', fileURL)
    }
  }

  const confirmModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: () => setIsModalConfirmationVisible(false),
    show: isModalConfirmationVisible,
    form: (
      <ConfirmForm
        title="Thay đổi giới thiệu"
        description="Bạn có chấp nhận thay đổi giới thiệu hay không?"
        onClose={() => setIsModalConfirmationVisible(false)}
        onOk={async () => {
          if (updateIntroduceForProviderFormRef.current) {
            const formData = new FormData(updateIntroduceForProviderFormRef.current)
            const responseData = await uploadAudio(formData.getAll('files'))
            if (responseData?.data.data.results) {
              updateIntroduceProvider.mutate(
                {
                  voiceUrl: responseData.data.data.results[0],
                  status: form.values.status as 'ACTIVATED' | 'UN_ACTIVATED' | 'STOPPED_ACCEPTING_BOOKING' | 'BUSY',
                  description: form.values.description,
                },
                {
                  onSuccess() {
                    setIsModalConfirmationVisible(false)
                    utils.invalidateQueries(['identity.getUserBySlug'])
                    notification.success({
                      message: 'Cập nhật giới thiệu thành công',
                      description: 'Giới thiệu của bạn đã được cập nhật',
                      placement: 'bottomLeft',
                    })
                  },
                  onError() {
                    notification.error({
                      message: 'Cập nhật giới thiệu thất bại',
                      description: 'Cập nhật giới thiệu thất bại. Vui lòng thử lại sau!',
                      placement: 'bottomLeft',
                    })
                  },
                },
              )
            } else {
              notification.warning({
                message: 'Chưa cập nhật âm thanh!',
                description: 'Vui lòng kiểm tra lại âm thanh.',
                placement: 'bottomLeft',
              })
            }
          } else {
            notification.warning({
              message: 'Vui lòng điền đủ thông tin',
              description: 'Vui lòng điền đủ thông tin giới thiệu.',
              placement: 'bottomLeft',
            })
          }
        }}
      />
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={() => setIsModalConfirmationVisible(false)}
        onKeyDown={(e) => e.key === 'Enter' && setIsModalConfirmationVisible(false)}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })

  return (
    <>
      {isModalConfirmationVisible && confirmModal}
      <div className="w-full px-10">
        <p className="text-4xl font-bold">Trở thành nhà cung cấp</p>

        <div className="w-full mt-10 px-5 space-y-10">
          <div className="flex items-center justify-between gap-5 py-10 border-b border-white border-opacity-30">
            <div className="flex flex-col gap-2">
              <p className="text-lg">Trở thành nhà cung cấp dịch vụ của chúng tôi</p>
              <span className="w-4/5 text-sm opacity-50">
                Trở thành nhà cung cấp để có thể mang lại nhiều lợi ích cho bạn như là kiếm tiền, gia tăng độ nổi
                tiếng,...
              </span>
            </div>
            <Switch
              className="bg-red-600"
              checkedChildren={<CheckSmall theme="outline" size="23" fill="#fff" strokeLinejoin="bevel" />}
              unCheckedChildren={<CloseSmall theme="outline" size="23" fill="#fff" strokeLinejoin="bevel" />}
              checked={checked}
              onChange={handleBecomeProvider}
            />
          </div>
          {!isLoadingUserSettingData ? (
            <form ref={updateIntroduceForProviderFormRef} onSubmit={form.handleSubmit} className="space-y-3">
              <p className="text-md font-semibold">Giới thiệu</p>
              <div className="py-5 px-7 rounded-2xl space-y-3 border-2 border-white border-opacity-30">
                <div className="flex justify-between">
                  <div className="flex items-center gap-5">
                    <label className="font-semibold">Giọng của bạn:</label>
                    {audioSource && (
                      <audio controls key={audioSource} className="h-7">
                        <source src={audioSource} />
                      </audio>
                    )}

                    <div className={`relative p-2 rounded-full bg-zinc-800 hover:bg-gray-700 cursor-pointer`}>
                      {form.values.voice ? (
                        <Write theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                      ) : (
                        <div className="min-w-[200px] flex items-center gap-2">
                          Thêm giọng của bạn
                          <Voice theme="filled" size="20" fill="#fff" strokeLinejoin="bevel" />
                        </div>
                      )}
                      <input
                        className="absolute top-0 left-0 z-20 w-full h-full cursor-pointer opacity-0"
                        type="file"
                        name="files"
                        onChange={(e) => handleFileChange(e)}
                        accept="audio/mp3,audio/*;capture=microphone"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <label className="font-semibold">Trạng thái:</label>
                    <div className="relative">
                      <Menu>
                        <Menu.Button>
                          <button className="min-w-[200px] text-xl font-semibold px-8 py-2 bg-[#292734] hover:bg-gray-700 rounded-xl">
                            {mappingStatusOfProvider.find((itemStatus) => itemStatus.key == form.values.status)?.label}
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
                          <Menu.Items className="min-w-[200px] absolute right-0 p-2 mt-1 origin-top-right bg-[#292734] divide-y divide-gray-100 rounded-xl shadow-lg w-full ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                            {mappingStatusOfProvider.map((itemStatus) => (
                              <Menu.Item as={'div'} key={itemStatus.key}>
                                <div
                                  className={`flex justify-between items-center px-2 rounded-lg hover:bg-gray-700 ${
                                    itemStatus.key == form.values.status ? 'bg-violet-500 text-white' : 'text-gray-900'
                                  }`}
                                >
                                  <button
                                    className={`text-white text-md font-semibold group flex w-full items-center rounded-md px-2 py-2`}
                                    name="status"
                                    onClick={() => form.setFieldValue('status', itemStatus.key)}
                                  >
                                    {itemStatus.label}
                                  </button>
                                  <div>
                                    {itemStatus.key == form.values.status ? (
                                      <Check theme="filled" size="10" fill="#FFFFFF" strokeLinejoin="bevel" />
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </div>
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold">Giới thiệu về bạn:</label>
                  <TextArea
                    name="description"
                    className={`${
                      form.values.description == (userSettingData?.data.providerConfig?.description ?? '')
                        ? 'bg-zinc-800'
                        : 'bg-gray-700'
                    } w-4/5 rounded-md`}
                    rows={5}
                    value={form.values.description}
                    onChange={form.handleChange}
                  />
                </div>
                {(form.values.voice != (userSettingData?.data.providerConfig?.voiceUrl ?? '') ||
                  form.values.status != userSettingData?.data.providerConfig?.status ||
                  form.values.description != (userSettingData?.data.providerConfig?.description ?? '')) && (
                  <div className="flex justify-end items-center gap-3">
                    <Button
                      isActive={false}
                      isOutlinedButton={true}
                      type="button"
                      customCSS="w-[100px] text-md p-2 rounded-xl hover:scale-105"
                      onClick={() => handleResetForm()}
                    >
                      Hủy
                    </Button>
                    <Button
                      customCSS="w-[100px] text-md p-2 rounded-xl hover:scale-105"
                      type="submit"
                      isActive={true}
                      isOutlinedButton={true}
                    >
                      Thay đổi
                    </Button>
                  </div>
                )}
              </div>
            </form>
          ) : (
            <SkeletonProviderService />
          )}
          {checked && (
            <div className="space-y-3">
              <p className="text-md font-semibold">Dịch vụ</p>
              <ServiceForm />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
export default BecomeProvider
