import { CheckSmall, CloseSmall, Plus } from '@icon-park/react'
import { Button, Modal } from '@ume/ui'
import BidvLogo from 'public/bidv-logo.png'
import ImgForEmpty from 'public/img-for-empty.png'
import MomoLogo from 'public/momo-logo.png'
import TpbankLogo from 'public/tpbank-logo.png'
import VnPayLogo from 'public/vnpay-logo.png'
import ZaloPayLogo from 'public/zalopay-logo.png'
import 'swiper/swiper-bundle.css'
import { useAuth } from '~/contexts/auth'
import { ActionEnum } from '~/enumVariable/enumVariable'

import { useEffect, useState } from 'react'

import { Switch } from 'antd'
import Image, { StaticImageData } from 'next/legacy/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { UserPaymentSystemRequestPlatformEnum, UserPaymentSystemResponse } from 'ume-service-openapi'

import ServiceForm from './service-form'
import UserPaymentPlatform from './user-payment-platform'
import UserRequestWithdraw from './user-request-withdraw'

import { SliderSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

interface PaymentPlatform {
  key: string
  imgSrc: StaticImageData
}

const paymentPlat: PaymentPlatform[] = [
  { key: UserPaymentSystemRequestPlatformEnum.Momo, imgSrc: MomoLogo },
  { key: UserPaymentSystemRequestPlatformEnum.Bidv, imgSrc: BidvLogo },
  { key: UserPaymentSystemRequestPlatformEnum.Tpb, imgSrc: TpbankLogo },
  { key: UserPaymentSystemRequestPlatformEnum.Vnpay, imgSrc: VnPayLogo },
  { key: UserPaymentSystemRequestPlatformEnum.Zalopay, imgSrc: ZaloPayLogo },
]

const BecomeProvider = () => {
  const { user } = useAuth()
  const [checked, setChecked] = useState<boolean>(false)
  const [actionModal, setActionModal] = useState(ActionEnum.CREATE)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [paymentAccount, setPaymentAccount] = useState<UserPaymentSystemResponse | undefined>(undefined)
  const { data: userPaymentPlatformData, isLoading: isUserPaymentPlatformLoading } = trpc.useQuery([
    'identity.getUserPaymentSystems',
  ])
  const registerBecomeProvider = trpc.useMutation(['identity.registerBecomeProvider'])

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

  const handleClose = () => {
    setIsModalVisible(false)
  }

  const UserPaymentPlatformModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    title: <p className="text-white">Tài khoản rút tiền</p>,
    show: isModalVisible,
    form: (
      <>
        {actionModal == ActionEnum.CREATE ? (
          <UserPaymentPlatform handleCloseUserPaymentPlatform={handleClose} paymentAccount={paymentAccount} />
        ) : (
          <UserRequestWithdraw
            handleCloseUserPaymentPlatform={handleClose}
            userPaymentPlatformData={userPaymentPlatformData?.data.row}
          />
        )}
      </>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: false,
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

  const handleViewPaymentAccount = (paymentAcc: UserPaymentSystemResponse) => {
    setPaymentAccount(paymentAcc)
    setIsModalVisible(true)
  }

  return (
    <>
      {isModalVisible && UserPaymentPlatformModal}
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
          <div className="flex flex-col gap-10">
            <div className="space-y-5">
              <div className="w-full flex justify-between items-end">
                <p className="text-md font-semibold">Tài khoản rút tiền</p>
                <Button
                  customCSS="text-md py-2 px-5 rounded-xl hover:scale-105"
                  isActive={true}
                  isOutlinedButton={true}
                  onClick={() => {
                    setActionModal(ActionEnum.WITHDRAW)
                    setPaymentAccount(undefined)
                    setIsModalVisible(true)
                  }}
                >
                  Yêu cầu rút tiền
                </Button>
              </div>
              {!isUserPaymentPlatformLoading ? (
                <div className="relative">
                  <Swiper spaceBetween={20} slidesPerView="auto" mousewheel={true} direction="horizontal">
                    {userPaymentPlatformData?.data?.row?.map((paymentPlatform) => (
                      <SwiperSlide
                        className="max-w-fit duration-500 ease-in-out cursor-pointer hover:scale-105"
                        key={paymentPlatform.id}
                        onClick={() => handleViewPaymentAccount(paymentPlatform)}
                      >
                        <div
                          className={`flex items-center gap-5 border-2 border-white border-opacity-30 rounded-2xl p-3`}
                        >
                          <div className="relative w-[130px] h-[130px]">
                            <Image
                              key={paymentPlatform.id}
                              className="absolute rounded-xl pointer-events-none object-cover"
                              layout="fill"
                              src={
                                paymentPlat.find((paymentPlat) => paymentPlat.key == paymentPlatform.platform)
                                  ?.imgSrc ?? ImgForEmpty
                              }
                              alt={paymentPlatform.platform}
                            />
                          </div>
                          <div className="">
                            <span className="flex gap-3">
                              <p className="text-white opacity-30">Nền tảng:</p> {paymentPlatform.platform}
                            </span>
                            <span className="flex gap-3">
                              <p className="text-white opacity-30">Số tài khoản:</p> {paymentPlatform.platformAccount}
                            </span>
                            <span className="flex gap-3">
                              <p className="text-white opacity-30">Người nhận:</p> {paymentPlatform.beneficiary}
                            </span>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="absolute h-full flex items-center pl-3 top-0 right-0 bg-umeBackground z-10">
                    <Button
                      customCSS={`text-sm p-2 hover:scale-105 rounded-xl`}
                      type="button"
                      isActive={true}
                      isOutlinedButton={true}
                      onClick={() => {
                        setActionModal(ActionEnum.CREATE)
                        setPaymentAccount(undefined)
                        setIsModalVisible(true)
                      }}
                    >
                      <Plus theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                      <p>Thêm tài khoản</p>
                    </Button>
                  </div>
                </div>
              ) : (
                <SliderSkeletonLoader />
              )}
            </div>
            {checked && (
              <div className="space-y-3">
                <p className="text-md font-semibold">Dịch vụ</p>
                <ServiceForm />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
export default BecomeProvider
