import { Menu, Transition } from '@headlessui/react'
import {
  Alarm,
  Check,
  CloseSmall,
  CopyOne,
  Dot,
  Down,
  Female,
  Lock,
  Male,
  More,
  PaperMoneyTwo,
  ShareTwo,
} from '@icon-park/react'
import { Button, InputWithAffix, Modal, TextArea } from '@ume/ui'
import detailBackground from 'public/detail-cover-background.png'
import ImgForEmpty from 'public/img-for-empty.png'
import lgbtIcon from 'public/rainbow-flag-11151.svg'
import { useAuth } from '~/contexts/auth'

import { Fragment, ReactElement, useEffect, useState } from 'react'

import { ConfigProvider, Tooltip, message, notification, theme } from 'antd'
import { parse } from 'cookie'
import { Formik } from 'formik'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import {
  CreateReportUserRequestReasonTypeEnum,
  ProviderConfigResponseStatusEnum,
  UserInformationResponse,
  UserInformationResponseGenderEnum,
} from 'ume-service-openapi'
import * as Yup from 'yup'

import AlbumTab from './album-tab/album-tab'
import InformationTab from './information-tab/information-tab'
import PostTab from './post-tab'

import ConfirmForm from '~/components/confirm-form/confirm-form'
import { LoginModal } from '~/components/header/login-modal.component'
import { SkeletonDetailProvider } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

interface TabDataProps {
  key: string
  label: string
  icon?: ReactElement
  [key: string]: any
}

interface DonateProps {
  donateValue: string
  donateContent?: string
}

const reportType: TabDataProps[] = [
  { key: CreateReportUserRequestReasonTypeEnum.Cheating, label: 'Gian lận' },
  { key: CreateReportUserRequestReasonTypeEnum.AbusiveLanguage, label: 'Lạm dụng ngôn ngữ và hành vi gây khó chịu' },
  { key: CreateReportUserRequestReasonTypeEnum.SpamOrHarassment, label: 'Spam hoặc quấy rối' },
  {
    key: CreateReportUserRequestReasonTypeEnum.InappropriateContent,
    label: 'Hình ảnh không phù hợp hoặc vi phạm đạo đức',
  },
  { key: CreateReportUserRequestReasonTypeEnum.ViolentOrDiscriminatoryBehavior, label: 'Hành vi bạo lực hoặc kỳ thị' },
  { key: CreateReportUserRequestReasonTypeEnum.FakeAccountOrScam, label: 'Tài khoản giả mạo hoặc lừa đảo' },
  {
    key: CreateReportUserRequestReasonTypeEnum.IllegalTransactions,
    label: 'Giao dịch bất hợp pháp hoặc không an toàn',
  },
]

const moreButtonDatas: TabDataProps[] = [
  {
    key: 'Report',
    label: 'Tố cáo',
    icon: (
      <Alarm
        className={`transition-opacity opacity-0 group-hover:opacity-100 group-hover:translate-x-3 duration-300`}
        theme="outline"
        size="20"
        fill="#fff"
      />
    ),
  },
  {
    key: 'Donate',
    label: 'Tặng quà',
    icon: (
      <PaperMoneyTwo
        className={`transition-opacity opacity-0 group-hover:opacity-100 group-hover:translate-x-3 duration-300`}
        theme="outline"
        size="20"
        fill="#fff"
      />
    ),
  },
  {
    key: 'Share',
    label: 'Copy đường dẫn',
    icon: (
      <CopyOne
        className={`transition-opacity opacity-0 group-hover:opacity-100 group-hover:translate-x-3 duration-300`}
        theme="outline"
        size="20"
        fill="#fff"
      />
    ),
  },
  {
    key: 'ShareToFacebook',
    label: 'Chia sẻ đến Facebook',
    icon: (
      <ShareTwo
        className={`transition-opacity opacity-0 group-hover:opacity-100 group-hover:translate-x-3 duration-300`}
        theme="outline"
        size="20"
        fill="#fff"
      />
    ),
  },
]

const tabDatas: TabDataProps[] = [
  {
    key: 'Service',
    label: `Dịch vụ`,
  },
  {
    key: 'Album',
    label: `Ảnh`,
  },
  {
    key: 'Post',
    label: `Bài viết`,
  },
]

const DetailProfileContainer = () => {
  const router = useRouter()
  const basePath = router.asPath.split('?')[0]
  const slug = router.query

  const accessToken = parse(document.cookie).accessToken

  const { isAuthenticated, user } = useAuth()
  const [isModalLoginVisible, setIsModalLoginVisible] = useState(false)

  const [messageApi, contextHolder] = message.useMessage()
  const [providerDetail, setProviderDetail] = useState<UserInformationResponse | undefined>(undefined)
  const [donationValues, setDonationValues] = useState<DonateProps>({ donateValue: '1,000' })
  const [isModalReportVisible, setIsModalReportVisible] = useState<boolean>(false)
  const [isMenuShow, setIsMenuShow] = useState<boolean>(false)
  const [isModalDonationVisible, setIsModalDonationVisible] = useState<boolean>(false)
  const [isModalConfirmationVisible, setIsModalConfirmationVisible] = useState<boolean>(false)
  const [reportTypeFilter, setReportTypeFilter] = useState<TabDataProps[]>(reportType)
  const { isLoading: isProviderDetailLoading } = trpc.useQuery(['booking.getUserBySlug', slug.profileId!.toString()], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    onSuccess(data) {
      if (data.data.id) {
        setProviderDetail(data.data)
      } else {
        router.replace('/404')
      }
    },
    onError() {
      router.replace('/404')
    },
    enabled: !!slug.profileId!.toString(),
  })

  const balance = trpc.useQuery(['identity.account-balance'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    enabled: isAuthenticated,
  })

  const donationForRecipient = trpc.useMutation(['booking.donationForRecipient'])
  const reportUser = trpc.useMutation(['booking.postReportUser'])
  const utils = trpc.useContext()

  const [selectedTab, setSelectedTab] = useState<TabDataProps>(
    tabDatas.find((tab) => {
      return tab.key.toString() == slug.tab?.toString()
    }) ?? tabDatas[0],
  )

  useEffect(() => {
    if (!providerDetail?.isProvider) {
      setSelectedTab(tabDatas[1])
    } else {
      setSelectedTab(tabDatas[0])
    }
  }, [providerDetail])

  const handleChangeTab = (item: TabDataProps) => {
    router.replace(
      {
        pathname: basePath,
        query: { tab: item.key },
      },
      undefined,
      { shallow: true },
    )
    setSelectedTab(item)
  }

  const caculateAge = (dateOfBirth: string | undefined) => {
    if (dateOfBirth) {
      const currentDate = new Date().getFullYear()
      const dob = new Date(dateOfBirth).getFullYear()

      const age = Math.floor(currentDate - dob)

      return age
    } else {
      return 1
    }
  }

  const handleMenuButtonAction = (item: TabDataProps) => {
    if (item.key == 'Share') {
      navigator.clipboard.writeText(window.location.href)
      messageApi.open({
        type: 'success',
        content: 'Copy đường dẫn thành công',
        duration: 2,
      })
    } else if (item.key == 'ShareToFacebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
      messageApi.open({
        type: 'success',
        content: 'Mở facebook thành công',
        duration: 2,
      })
    } else if (item.key == 'Donate') {
      if (providerDetail && (isAuthenticated || user || accessToken)) {
        setIsModalDonationVisible(true)
      } else {
        setIsModalLoginVisible(true)
      }
    } else if (item.key == 'Report') {
      if (providerDetail && (isAuthenticated || user || accessToken)) {
        setIsModalReportVisible(true)
      } else {
        setIsModalLoginVisible(true)
      }
    }
  }

  const handleCloseDonationModal = () => {
    setIsModalDonationVisible(false)
  }
  const handleCloseComfirmModal = () => {
    setIsModalConfirmationVisible(false)
  }

  const confirmModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleCloseComfirmModal,
    show: isModalConfirmationVisible,
    form: (
      <>
        <ConfirmForm
          title="Donate cho nhà cung cấp"
          description="Bạn có chấp nhận donate cho nhà cung cấp này hay không?"
          onClose={handleCloseComfirmModal}
          onOk={() => {
            donationForRecipient.mutate(
              {
                recipientId: providerDetail?.id ?? '',
                amount: Number(donationValues.donateValue.replace(/,/g, '')),
                message: donationValues.donateContent,
              },
              {
                onSuccess() {
                  notification.success({
                    message: 'Donate thành công!',
                    description: 'Nhà cung cấp đã nhận được tấm lòng của bạn :>',
                    placement: 'bottomLeft',
                  })
                  utils.invalidateQueries('identity.account-balance')
                  handleCloseComfirmModal()
                  handleCloseDonationModal()
                },
                onError() {
                  notification.error({
                    message: 'Donate thất bại!',
                    description: 'Có lỗi trong hệ thống của chúng tôi. Vui lòng thử lại sau :<',
                    placement: 'bottomLeft',
                  })
                },
              },
            )
          }}
        />
      </>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <>
        <CloseSmall
          onClick={handleCloseComfirmModal}
          onKeyDown={(e) => e.key === 'Enter' && handleCloseComfirmModal()}
          tabIndex={1}
          className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
          theme="outline"
          size="24"
          fill="#FFFFFF"
        />
      </>
    ),
  })

  const validationSchema = Yup.object().shape({
    donateValue: Yup.string().required('Xin hãy nhập số tiền').min(1).max(7, 'Chỉ được nhập nhiều nhất 7 chữ số'),
  })

  const donateModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleCloseDonationModal,
    title: <p className="text-white">Tặng quà</p>,
    show: isModalDonationVisible,
    form: (
      <>
        <Formik
          initialValues={{
            donateValue: '1,000',
            donateContent: undefined,
          }}
          onSubmit={(values) => {
            setDonationValues({ donateValue: values.donateValue, donateContent: values.donateContent })
          }}
          validationSchema={validationSchema}
        >
          {({ handleSubmit, handleChange, handleBlur, values, errors, setFieldValue }) => (
            <div className="flex flex-col gap-5 p-10 text-white">
              <div className="space-y-2">
                <label>Tiền quà: </label>
                <InputWithAffix
                  placeholder="Tiền donate"
                  value={values.donateValue}
                  name="donateValue"
                  type="text"
                  onChange={(e) => {
                    const inputValue = e.target.value.replace(/,/g, '')
                    const numericValue = parseFloat(inputValue)
                    const formattedValue = isNaN(numericValue) ? '0' : numericValue.toLocaleString()

                    setFieldValue('donateValue', formattedValue)
                  }}
                  className="w-full max-h-[50px] bg-zinc-800 border border-white border-opacity-30 rounded-xl my-2"
                  styleInput={`bg-zinc-800 rounded-xl border-none focus:outline-none`}
                  position="right"
                  component={<span className="text-xs italic"> đ</span>}
                  autoComplete="off"
                  onBlur={handleBlur}
                />
                {!!errors.donateValue && <p className="pl-3 text-xs text-red-500">{errors.donateValue}</p>}
              </div>
              <div className="space-y-2">
                <label>Nội dung: </label>
                <TextArea
                  name="donateContent"
                  className="bg-zinc-800 w-full max-h-[140px]"
                  rows={5}
                  value={values.donateContent}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full text-center">
                <Button
                  customCSS={`text-md py-2 px-5 rounded-xl ${
                    !errors.donateValue ? 'hover:scale-105' : 'opacity-30 cursor-not-allowed'
                  }`}
                  type="button"
                  isActive={!errors.donateValue}
                  isOutlinedButton={true}
                  onClick={() => {
                    if (
                      (balance.data?.data.totalBalanceAvailable ?? 0) > Number(values.donateValue.replace(/,/g, ''))
                    ) {
                      handleSubmit()
                      setIsModalConfirmationVisible(true)
                    } else {
                      notification.warning({
                        message: 'Tài khoản không đủ',
                        description: 'Bạn không có đủ tiền. Vui lòng nạp thêm!',
                        placement: 'bottomLeft',
                      })
                    }
                  }}
                >
                  Chấp nhận
                </Button>
              </div>
            </div>
          )}
        </Formik>
      </>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={handleCloseDonationModal}
        onKeyDown={() => {}}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })

  const reportModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: () => setIsModalReportVisible(false),
    title: <p className="text-white">Tố cáo</p>,
    show: isModalReportVisible,
    form: (
      <>
        <Formik
          initialValues={{
            reasonType: reportType[0].key,
            content: '',
          }}
          onSubmit={(values) => {
            reportUser.mutate(
              {
                slug: providerDetail?.id ?? '',
                reasonType: values.reasonType as any,
                content: values.content,
              },
              {
                onSuccess() {
                  setIsModalReportVisible(false)
                  notification.success({
                    message: 'Gửi tố cáo thành công',
                    description: 'Tố cáo của bạn đã được gửi',
                    placement: 'bottomLeft',
                  })
                },
                onError() {
                  notification.error({
                    message: 'Gửi tố cáo thất bại',
                    description: 'Gửi tố cáo thất bại. Vui lòng thử lại sau!',
                    placement: 'bottomLeft',
                  })
                },
              },
            )
          }}
          validationSchema={Yup.object().shape({
            reasonType: Yup.string().required('Xin hãy nhập loại tố cáo'),
            content: Yup.string().required('Xin hãy nhập lý do'),
          })}
        >
          {({ handleSubmit, handleChange, handleBlur, values, errors, setFieldValue }) => (
            <div className="flex flex-col gap-5 p-10 text-white">
              <div className="space-y-2">
                <label>Loại tố cáo: </label>
                <InputWithAffix
                  placeholder="Tiền donate"
                  value={reportType.find((reason) => values.reasonType == reason.key)?.label}
                  name="reasonType"
                  type="text"
                  onChange={(e) => {
                    handleChange(e)
                    setReportTypeFilter(
                      reportType.filter(
                        (rpType) =>
                          rpType.key.toLocaleLowerCase().includes(values.reasonType.toLocaleLowerCase()) ||
                          rpType.label.toLocaleLowerCase().includes(values.reasonType.toLocaleLowerCase()),
                      ),
                    )
                  }}
                  className={`w-full max-h-[50px] bg-zinc-800 border ${
                    errors.reasonType ? 'border-red-500' : 'border-white border-opacity-30'
                  } rounded-xl my-2`}
                  styleInput={`bg-zinc-800 rounded-xl border-none focus:outline-none`}
                  position="right"
                  component={<Down theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />}
                  autoComplete="off"
                  onClick={() => {
                    setIsMenuShow(true)
                    setReportTypeFilter(reportType)
                  }}
                  onBlur={handleBlur}
                />
                <div className="relative w-full">
                  <Menu>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-400"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-400"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                      show={isMenuShow}
                    >
                      <Menu.Items
                        className="absolute right-0 left-0 p-2 origin-top-right bg-[#292734] divide-y divide-gray-100 rounded-xl shadow-lg w-full max-h-[200px] overflow-y-auto ring-1 ring-black ring-opacity-5 focus:outline-none custom-scrollbar"
                        style={{ zIndex: 5 }}
                      >
                        <div
                          className="flex flex-col gap-2"
                          style={{ zIndex: 10 }}
                          onMouseLeave={() => setIsMenuShow(false)}
                        >
                          {reportTypeFilter.map((rpTy, index) => (
                            <div
                              key={index}
                              className={`flex gap-5 items-center ${
                                values.reasonType == rpTy.key ? 'bg-gray-700' : ''
                              } hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                              onClick={() => {
                                setFieldValue('reasonType', rpTy.key)
                                setIsMenuShow(false)
                              }}
                              onKeyDown={() => {}}
                            >
                              <p className="font-semibold text-mg">{rpTy.label}</p>
                              <div>
                                {values.reasonType == rpTy.key ? (
                                  <Check theme="filled" size="10" fill="#FFFFFF" strokeLinejoin="bevel" />
                                ) : (
                                  ''
                                )}
                              </div>
                            </div>
                          ))}

                          {!((reportTypeFilter ?? []).length > 0) && (
                            <p className="text-md font-normal">Không có kết quả</p>
                          )}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                {!!errors.reasonType && <p className="pl-3 text-xs text-red-500">{errors.reasonType}</p>}
              </div>
              <div className="space-y-2">
                <label>Nội dung: </label>
                <TextArea
                  name="content"
                  className={`bg-zinc-800 w-full max-h-[140px] rounded-xl border ${
                    errors.content ? 'border-red-500' : 'border-white border-opacity-30'
                  }`}
                  rows={5}
                  value={values.content}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {!!errors.content && <p className="pl-3 text-xs text-red-500">{errors.content}</p>}
              </div>
              <div className="w-full text-center">
                <Button
                  customCSS={`text-md py-2 px-5 rounded-xl ${
                    !(errors.content || errors.reasonType) ? 'hover:scale-105' : 'opacity-30 cursor-not-allowed'
                  }`}
                  type="button"
                  isActive={!errors.content}
                  isOutlinedButton={true}
                  onClick={() => handleSubmit()}
                >
                  Gửi
                </Button>
              </div>
            </div>
          )}
        </Formik>
      </>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={() => setIsModalReportVisible(false)}
        onKeyDown={() => {}}
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
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        {contextHolder}
      </ConfigProvider>
      <LoginModal isModalLoginVisible={isModalLoginVisible} setIsModalLoginVisible={setIsModalLoginVisible} />

      {isModalReportVisible && reportModal}
      {isModalDonationVisible && donateModal}
      {isModalConfirmationVisible && confirmModal}

      {!providerDetail && isProviderDetailLoading ? (
        <SkeletonDetailProvider />
      ) : (
        <>
          <div style={{ height: '380px', margin: '0 70px' }}>
            <div className="absolute left-0 top-16" style={{ width: '100%', height: '416px' }}>
              <Image layout="fill" src={detailBackground} alt="background" />
            </div>
            <div className="flex flex-col justify-end h-full gap-5">
              <div className="flex flex-row items-baseline justify-between pb-5 md:items-center px-7">
                <div className="flex flex-col md:flex-row md:gap-x-8 gap-y-2" style={{ zIndex: 2 }}>
                  <div style={{ width: 194, height: 182, position: 'relative' }}>
                    <Image
                      className="absolute rounded-full"
                      layout="fill"
                      objectFit="cover"
                      src={providerDetail?.avatarUrl ?? ImgForEmpty}
                      alt="avatar"
                    />
                  </div>
                  <div className="flex flex-col my-5 text-white gap-y-2">
                    <p className="text-3xl font-medium text-white">{providerDetail?.name}</p>
                    <div className="flex flex-row items-center gap-3">
                      <div className="flex items-center gap-2 p-2 bg-gray-700 rounded-full">
                        <div>
                          {providerDetail?.gender == UserInformationResponseGenderEnum.Male && (
                            <Male theme="outline" size="20" fill="#3463f9" />
                          )}
                          {providerDetail?.gender == UserInformationResponseGenderEnum.Female && (
                            <Female theme="outline" size="20" fill="#f70a34" />
                          )}
                          {providerDetail?.gender == UserInformationResponseGenderEnum.Other && (
                            <div className="flex items-center">
                              <Image width={30} height={20} alt="lgbt-icon" src={lgbtIcon} layout="fixed" />
                            </div>
                          )}
                          {providerDetail?.gender == UserInformationResponseGenderEnum.Private && (
                            <Lock theme="outline" size="20" fill="#f7761c" />
                          )}
                        </div>
                        <p>{caculateAge(providerDetail?.dob)}</p>
                      </div>
                      <Tooltip placement="bottomLeft" title={`${providerDetail?.isOnline ? 'Online' : 'Offline'}`}>
                        <div className="flex items-center gap-1 p-2 bg-gray-700 rounded-full">
                          <Dot theme="multi-color" size="24" fill={providerDetail?.isOnline ? '#008000' : '#FF0000'} />
                          {providerDetail?.isOnline ? (
                            <>
                              <p>
                                {providerDetail?.providerConfig?.status == ProviderConfigResponseStatusEnum.Activated &&
                                  'Sẵn sàng'}
                              </p>
                              <p>
                                {providerDetail?.providerConfig?.status == ProviderConfigResponseStatusEnum.Busy &&
                                  'Bận'}
                              </p>
                              <p>
                                {providerDetail?.providerConfig?.status ==
                                  ProviderConfigResponseStatusEnum.StoppedAcceptingBooking && 'Ngừng nhận đơn'}
                              </p>
                            </>
                          ) : (
                            'Offline'
                          )}
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                <div className="relative flex flex-col items-center justify-start" style={{ zIndex: 5 }}>
                  <Menu>
                    <div>
                      <Menu.Button>
                        <More
                          className="flex flex-row items-center bg-gray-700 rounded-full cursor-pointer"
                          theme="filled"
                          size="25"
                          fill="#FFFFFF"
                          strokeLinejoin="bevel"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-400"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-400"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 p-2 origin-top-right bg-umeHeader divide-y divide-gray-200 rounded-md shadow-lg w-fit top-7 ring-1 ring-black ring-opacity-30 focus:outline-none">
                        <div className="flex flex-col gap-2 w-max">
                          {moreButtonDatas.map((item) => (
                            <Fragment key={item.key}>
                              {user?.id == providerDetail?.id ? (
                                item.key != 'Donate' &&
                                item.key != 'Report' && (
                                  <div
                                    className="p-2 cursor-pointer rounded-t-md hover:bg-gray-700 text-white group border-b-2 border-white last:border-none last:rounded-md"
                                    onClick={() => {
                                      handleMenuButtonAction(item)
                                    }}
                                    onKeyDown={() => {}}
                                  >
                                    <div className="flex items-center justify-between gap-2 rounded-md duration-300 scale-x-100 group-hover:scale-x-95 group-hover:-translate-x-2">
                                      <div>{item.label}</div>
                                      {item.icon}
                                    </div>
                                  </div>
                                )
                              ) : (
                                <div
                                  className="p-2 cursor-pointer rounded-t-md hover:bg-gray-700 text-white group border-b-2 border-white last:border-none last:rounded--md"
                                  onClick={() => {
                                    handleMenuButtonAction(item)
                                  }}
                                  onKeyDown={() => {}}
                                >
                                  <div className="flex items-center justify-between gap-2 rounded-md duration-300 scale-x-100 group-hover:scale-x-95 group-hover:-translate-x-2">
                                    <div>{item.label}</div>
                                    {item.icon}
                                  </div>
                                </div>
                              )}
                            </Fragment>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>

              <div className="flex flex-row gap-10" style={{ zIndex: 2 }}>
                {tabDatas.map((item) => (
                  <Fragment key={item.key}>
                    {providerDetail?.isProvider ? (
                      <span
                        className={`text-white xl:text-2xl text-xl font-medium p-4 cursor-pointer ${
                          item.key == selectedTab.key ? 'border-b-4 border-purple-700' : ''
                        }`}
                        onClick={() => handleChangeTab(item)}
                        data-tab={item.label}
                        onKeyDown={() => {}}
                      >
                        {item.label}
                      </span>
                    ) : (
                      item.key != 'Service' && (
                        <span
                          className={`text-white xl:text-2xl text-xl font-medium p-4 cursor-pointer ${
                            item.key == selectedTab.key ? 'border-b-4 border-purple-700' : ''
                          }`}
                          onClick={() => handleChangeTab(item)}
                          data-tab={item.label}
                          onKeyDown={() => {}}
                        >
                          {item.label}
                        </span>
                      )
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
          <div className="p-5">
            <span className="text-white">
              <div className="flex justify-center my-10">
                {providerDetail?.isProvider && selectedTab.key == 'Service' && <InformationTab data={providerDetail} />}
                {selectedTab.key == 'Album' && <AlbumTab data={providerDetail!} />}
                {selectedTab.key == 'Post' && <PostTab providerId={providerDetail!.slug} />}
              </div>
            </span>
          </div>
        </>
      )}
    </>
  )
}
export default DetailProfileContainer
