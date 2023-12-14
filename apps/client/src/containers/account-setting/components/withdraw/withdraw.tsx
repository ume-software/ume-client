/* eslint-disable react-hooks/exhaustive-deps */
import { CloseSmall, DeleteFive, Plus } from '@icon-park/react'
import { Button, Modal } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'
import 'swiper/swiper-bundle.css'
import { ActionEnum } from '~/enumVariable/enumVariable'
import { paymentPlat } from '~/enumVariable/platform'

import { useEffect, useId, useState } from 'react'

import { notification } from 'antd'
import { isNil } from 'lodash'
import Image from 'next/legacy/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { UserInformationResponse, UserPaymentSystemResponse } from 'ume-service-openapi'

import UserPaymentPlatform from './user-payment-platform'
import UserRequestWithdraw from './user-request-withdraw'

import ConfirmForm from '~/components/confirm-form/confirm-form'
import { SliderSkeletonLoader, TableSkeletonLoader } from '~/components/skeleton-load'
import Table from '~/components/table/table'

import { trpc } from '~/utils/trpc'

interface IEnumType {
  key: string | number
  label: string
  [key: string]: any
}

const mappingStatusWithdrawWithdraw: IEnumType[] = [
  { key: 'COMPLETED', label: 'Thành công', color: '#008000', textColor: '#FFF' },
  { key: 'REJECTED', label: 'Từ chối', color: '#FF0000', textColor: '#FFF' },
  { key: 'CANCEL', label: 'Hủy', color: '#FF0000', textColor: '#FFF' },
  { key: 'PENDING', label: 'Chờ duyệt', color: '#FFFF00', textColor: '#000' },
]

const Withdraw = () => {
  const index_id = useId()
  const [userInfo, setUserInfo] = useState<UserInformationResponse>()
  trpc.useQuery(['identity.identityInfo'], {
    onSuccess(data) {
      setUserInfo(data.data)
    },
    onError() {
      sessionStorage.removeItem('accessToken')
      sessionStorage.removeItem('refeshToken')
    },
    enabled: isNil(userInfo),
  })

  const [actionModal, setActionModal] = useState(ActionEnum.CREATE)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [paymentAccount, setPaymentAccount] = useState<UserPaymentSystemResponse | undefined>(undefined)
  const { data: userPaymentPlatformData, isLoading: isUserPaymentPlatformLoading } = trpc.useQuery([
    'identity.getUserPaymentSystems',
  ])

  const [isViewBillImage, setIsViewBillImage] = useState<boolean>(false)
  const [withdrawRequestArray, setWithdrawRequestArray] = useState<any[] | undefined>(undefined)
  const [withdrawRequestIds, setWithdrawRequestIds] = useState<string[]>([])
  const [windrawRequest, setWindrawRequest] = useState<any>(undefined)
  const [withdrawRequestPage, setWithdrawRequestPage] = useState<string>('1')
  const [actionConfirmModal, setActionConfirmModal] = useState(ActionEnum.CANCEL_WITHDRAW_REQ)
  const [isModalConfirmationVisible, setIsModalConfirmationVisible] = useState(false)

  const [idWithdraw, setIdWithdraw] = useState<string>('')
  const [withdrawDetail, setWithdrawDetail] = useState<any>(undefined)
  const [isModalWithdrawReqDetailVisible, setIsModalWithdrawReqDetailVisible] = useState(false)
  const limit = '10'
  const { isLoading: isWithdrawRequestLoading } = trpc.useQuery(
    ['identity.getWithdrawRequests', { limit, page: withdrawRequestPage }],
    {
      onSuccess(data) {
        setWindrawRequest(data.data)
      },
      enabled: userInfo?.isVerified,
    },
  )

  const cancelWithdrawRequests = trpc.useMutation(['identity.cancelWithdrawRequests'])
  const deletePaymentAcc = trpc.useMutation(['identity.deleteUserPaymentSystem'])
  const utils = trpc.useContext()

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

  const handleViewPaymentAccount = (paymentAcc: UserPaymentSystemResponse) => {
    setPaymentAccount(paymentAcc)
    setIsModalVisible(true)
  }
  const handleDeletePaymentAccount = (paymentAcc: UserPaymentSystemResponse) => {
    setPaymentAccount(paymentAcc)
    setActionConfirmModal(ActionEnum.DELETE_WITHDRAW_ACC)
    setIsModalConfirmationVisible(true)
  }

  useEffect(() => {
    const windrawRequestResultArray = windrawRequest?.row?.map((withdrawReq) => {
      const withdrawReqArray = Object.values(withdrawReq)
      setWithdrawRequestIds((prevWithdrawRequestId) => {
        const newWithdrawRequestId = [...prevWithdrawRequestId]
        newWithdrawRequestId.push(withdrawReqArray[0] as string)
        return newWithdrawRequestId
      })
      const newWithdrawArray = [
        (withdrawReqArray[14] as any).platform,
        (withdrawReqArray[14] as any).platformAccount,
        <span key={index_id + '1'} className="flex items-center justify-center gap-1">
          {((withdrawReqArray[5] ?? 0) as any).toLocaleString('en-US')}
          <p className="text-xs italic"> đ</p>
        </span>,
        <span key={index_id + '2'} className="flex items-center justify-center gap-1">
          {(withdrawReqArray[4] as any).toLocaleString('en-US')}
          <p className="text-xs italic"> VND</p>
        </span>,
        <div className="flex justify-center" key={index_id + '3'}>
          <p
            className={`w-fit px-2 py-1 text-lg font-semibold rounded-xl`}
            style={{
              background: `${
                mappingStatusWithdrawWithdraw.find((statusType) => statusType.key == withdrawReqArray[9])?.color
              }`,
              color: `${
                mappingStatusWithdrawWithdraw.find((statusType) => statusType.key == withdrawReqArray[9])?.textColor
              }`,
            }}
          >
            {mappingStatusWithdrawWithdraw.find((statusType) => statusType.key == withdrawReqArray[9])?.label}
          </p>
        </div>,
        new Date(withdrawReqArray[1] as any).toLocaleDateString('en-GB'),
      ]
      return newWithdrawArray
    })
    setWithdrawRequestArray(windrawRequestResultArray)
  }, [windrawRequest])

  const handleViewWithdrawDetail = (id: string) => {
    setWithdrawDetail(windrawRequest?.row && windrawRequest?.row?.find((wdReq) => wdReq.id == id))
    setIsModalWithdrawReqDetailVisible(true)
  }
  const handleCancelWithdrawDetail = (id: string) => {
    if (windrawRequest?.row?.find((itemWithdraw) => itemWithdraw.id == id)?.status == 'PENDING') {
      setActionConfirmModal(ActionEnum.CANCEL_WITHDRAW_REQ)
      setIdWithdraw(id)
      setIsModalConfirmationVisible(true)
    } else {
      notification.warning({
        message: 'Yêu cầu đã được xử lý rồi',
        description: 'Yêu cầu đã được xử lý rồi!',
        placement: 'bottomLeft',
      })
    }
  }

  const confirmModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: () => setIsModalConfirmationVisible(false),
    show: isModalConfirmationVisible,
    form: (
      <ConfirmForm
        title={`${
          actionConfirmModal === ActionEnum.CANCEL_WITHDRAW_REQ ? 'Hủy yêu cầu rút tiền' : 'Xóa tài khoản này'
        }`}
        description={`${
          actionConfirmModal === ActionEnum.CANCEL_WITHDRAW_REQ
            ? 'Bạn có chấp nhận hủy yêu cầu rút tiền này hay không?'
            : `Bạn có đồng ý xóa tài khoản: <<${paymentAccount?.platformAccount} - ${paymentAccount?.platform} - ${paymentAccount?.beneficiary}>> không?`
        }`}
        onClose={handleClose}
        isLoading={cancelWithdrawRequests.isLoading || deletePaymentAcc.isLoading}
        onOk={() => {
          actionConfirmModal === ActionEnum.CANCEL_WITHDRAW_REQ
            ? cancelWithdrawRequests.mutate(idWithdraw, {
                onSuccess() {
                  setIsModalConfirmationVisible(false)
                  setIsModalWithdrawReqDetailVisible(false)
                  utils.invalidateQueries(['identity.getWithdrawRequests'])
                  notification.success({
                    message: 'Hủy yêu cầu rút tiền thành công',
                    description: 'Yêu cầu rút tiền của bạn đã được hủy',
                    placement: 'bottomLeft',
                  })
                },
                onError() {
                  notification.error({
                    message: 'Hủy yêu cầu rút tiền thất bại',
                    description: 'Hủy yêu cầu rút tiền thất bại. Vui lòng thử lại sau!',
                    placement: 'bottomLeft',
                  })
                },
              })
            : deletePaymentAcc.mutate(paymentAccount?.id ?? '', {
                onSuccess() {
                  setIsModalConfirmationVisible(false)
                  setIsModalWithdrawReqDetailVisible(false)
                  utils.invalidateQueries(['identity.getUserPaymentSystems'])
                  notification.success({
                    message: 'Xóa tài khoản rút tiền thành công',
                    description: 'Tài khoản rút tiền của bạn đã được xóa',
                    placement: 'bottomLeft',
                  })
                },
                onError() {
                  notification.error({
                    message: 'Xóa tài khoản rút tiền thất bại',
                    description: 'Xóa tài khoản rút tiền thất bại. Vui lòng thử lại sau!',
                    placement: 'bottomLeft',
                  })
                },
              })
        }}
      />
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={() => setIsModalConfirmationVisible(false)}
        onKeyDown={(e) => e.key === 'Enter' && handleClose()}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })

  const withdrawRequestDetail = Modal.useEditableForm({
    onOK: () => {},
    onClose: () => setIsModalWithdrawReqDetailVisible(false),
    show: isModalWithdrawReqDetailVisible,
    customModalCSS: `${!(withdrawDetail?.status == 'PENDING') ? 'top-10 h-[90vh] ' : 'top-32 h-fit'} min-w-[500px]`,
    title: <p className="text-white">Chi tiết yêu cầu</p>,
    form: (
      <div className="h-full p-6 mt-3 overflow-y-auto custom-scrollbar">
        {withdrawDetail && (
          <>
            <div className="flex items-start justify-between pb-5 border-b-2 border-white border-opacity-30">
              <div className="flex items-center gap-2">
                <div className="relative w-[100px] h-[100px]">
                  <Image
                    className="absolute object-cover pointer-events-none rounded-xl"
                    layout="fill"
                    src={
                      paymentPlat.find((paymentPlat) => paymentPlat.key == withdrawDetail.userPaymentSystem.platform)
                        ?.imgSrc ?? ImgForEmpty
                    }
                    alt={withdrawDetail.userPaymentSystem.platform}
                  />
                </div>
                <div className="space-y-3 text-white">
                  <span className="flex gap-3">
                    <p className="text-white opacity-30">Nền tảng:</p> {withdrawDetail.userPaymentSystem.platform}
                  </span>
                  <span className="flex gap-3">
                    <p className="text-white opacity-30">Số tài khoản:</p>{' '}
                    {withdrawDetail.userPaymentSystem.platformAccount}
                  </span>
                  <span className="flex gap-3">
                    <p className="text-white opacity-30">Người nhận:</p> {withdrawDetail.userPaymentSystem.beneficiary}
                  </span>
                </div>
              </div>
              <div className="flex justify-center" key={index_id}>
                <p
                  className={`min-w-[120px] text-center px-2 py-1 text-lg font-semibold rounded-xl`}
                  style={{
                    background: `${
                      mappingStatusWithdrawWithdraw.find((statusType) => statusType.key == withdrawDetail.status)?.color
                    }`,
                    color: `${
                      mappingStatusWithdrawWithdraw.find((statusType) => statusType.key == withdrawDetail.status)
                        ?.textColor
                    }`,
                  }}
                >
                  {mappingStatusWithdrawWithdraw.find((statusType) => statusType.key == withdrawDetail.status)?.label}
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-5 text-white">
              <div className="flex justify-between py-1">
                <span className="flex items-center gap-1">
                  <p className="text-white opacity-30">Số tiền rút: </p>{' '}
                  {(withdrawDetail.amountBalance ?? 0).toLocaleString('en-US', {
                    currency: 'VND',
                  })}
                  <p className="text-xs italic"> đ</p>
                </span>
                <span className="flex items-center gap-1">
                  <p className="text-white opacity-30">Số tiền nhận được: </p>{' '}
                  {(withdrawDetail.amountMoney ?? 0).toLocaleString('en-US', {
                    currency: 'VND',
                  })}
                  <p className="text-xs italic"> VND</p>
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>
                  <p className="pb-1 text-white opacity-30">Ngày tạo:</p>
                  {new Date(withdrawDetail.createdAt).toLocaleString('en-US')}
                </span>
                <span>
                  <p className="pb-1 text-white opacity-30">Ngày cập nhật:</p>
                  {new Date(withdrawDetail.updatedAt).toLocaleString('en-US')}
                </span>
              </div>
            </div>
            {!(withdrawDetail?.status == 'PENDING') && (
              <div className="mt-5 space-y-5 text-white">
                <p className="text-white opacity-30">Hình ảnh chuyển tiền</p>
                <div className="flex justify-center">
                  <div
                    className="relative w-[220px] h-[330px]"
                    onClick={() => setIsViewBillImage(true)}
                    onKeyDown={() => {}}
                  >
                    <Image
                      className="absolute object-cover pointer-events-none rounded-xl"
                      layout="fill"
                      src={withdrawDetail?.billImageUrl ?? ImgForEmpty}
                      alt={'Bill widthdraw'}
                    />
                  </div>
                </div>
              </div>
            )}

            {withdrawDetail?.status == 'PENDING' && (
              <div className="flex justify-center gap-5 py-3 mt-10">
                <Button
                  customCSS={`text-md p-3 hover:scale-105 rounded-xl`}
                  type="button"
                  isActive={false}
                  isOutlinedButton={true}
                  onClick={() => {
                    setIsModalWithdrawReqDetailVisible(false)
                  }}
                >
                  Đóng
                </Button>
                <Button
                  customCSS={`text-md p-3 hover:scale-105 rounded-xl`}
                  type="button"
                  isActive={true}
                  isOutlinedButton={true}
                  onClick={() => {
                    handleCancelWithdrawDetail(withdrawDetail.id)
                  }}
                  isLoading={cancelWithdrawRequests.isLoading}
                >
                  Hủy yêu cầu
                </Button>
              </div>
            )}
          </>
        )}

        {isViewBillImage && (
          <div className="w-full h-full bg-black" onClick={() => setIsViewBillImage(false)} onKeyDown={() => {}}>
            <Image
              className="absolute object-cover pointer-events-none top-5 bottom-5 left-5 right-5 rounded-xl"
              layout="fill"
              src={withdrawDetail?.billImageUrl ?? ImgForEmpty}
              alt={'Bill widthdraw'}
            />
          </div>
        )}
      </div>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: false,
    closeButtonOnConner: (
      <CloseSmall
        onClick={() => setIsModalWithdrawReqDetailVisible(false)}
        onKeyDown={(e) => e.key === 'Enter' && setIsModalWithdrawReqDetailVisible(false)}
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
      {isModalVisible && UserPaymentPlatformModal}
      {isModalConfirmationVisible && confirmModal}
      {isModalWithdrawReqDetailVisible && withdrawRequestDetail}
      <div className="w-full px-10">
        <p className="text-4xl font-bold">Rút tiền</p>
        <div className="w-full px-5 mt-10 space-y-10">
          <div className="flex flex-col gap-10">
            <div className="space-y-5">
              <div className="flex items-end justify-between w-full">
                {(userPaymentPlatformData?.data?.row?.length ?? 0) > 0 && (
                  <>
                    <p className="font-semibold text-md">Tài khoản rút tiền</p>
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
                  </>
                )}
              </div>
              {!isUserPaymentPlatformLoading ? (
                <div className="relative pr-40">
                  <Swiper spaceBetween={20} slidesPerView="auto" mousewheel={true} direction="horizontal">
                    {userPaymentPlatformData?.data?.row?.map((paymentPlatform) => (
                      <SwiperSlide
                        className="duration-500 ease-in-out cursor-pointer max-w-fit hover:scale-105"
                        key={paymentPlatform.id}
                      >
                        <div className="flex items-start justify-between p-3 border-2 border-white border-opacity-30 rounded-2xl">
                          <div
                            className={`flex items-center gap-5`}
                            onClick={() => handleViewPaymentAccount(paymentPlatform)}
                            onKeyDown={() => {}}
                          >
                            <div className="relative w-[130px] h-[130px]">
                              <Image
                                key={paymentPlatform.id}
                                className="absolute object-cover pointer-events-none rounded-xl"
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
                          <DeleteFive
                            theme="outline"
                            size="20"
                            fill="#FFF"
                            strokeLinejoin="bevel"
                            className="p-2 rounded-full hover:bg-gray-700"
                            onClick={() => {
                              handleDeletePaymentAccount(paymentPlatform)
                            }}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="absolute top-0 right-0 z-10 flex items-center h-full pl-3 bg-umeBackground">
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
          </div>
          {!isWithdrawRequestLoading ? (
            <div className="mt-5">
              {userInfo?.isVerified && (
                <div className="flex flex-col gap-1">
                  <p className="text-xl font-bold">Yêu cầu rút tiền</p>
                  <Table
                    dataHeader={['Nền tảng', 'Số tài khoản', 'Số tiền rút', 'Số tiền nhận', 'Trạng thái', 'Ngày tạo']}
                    dataBody={withdrawRequestArray as any}
                    page={withdrawRequestPage}
                    setPage={setWithdrawRequestPage}
                    limit={limit}
                    totalItem={Number(windrawRequest?.count ?? 0)}
                    contentItem={'yêu cầu'}
                    watchAction={true}
                    onWatch={(index) => handleViewWithdrawDetail(withdrawRequestIds[index ?? 0] ?? '')}
                    editAction={false}
                    onEdit={() => {}}
                    deleteAction={true}
                    onDelete={(index) => {
                      handleCancelWithdrawDetail(withdrawRequestIds[index ?? 0] ?? '')
                    }}
                    complainAction={false}
                    onComplain={() => {}}
                  />
                </div>
              )}
            </div>
          ) : (
            <TableSkeletonLoader />
          )}
        </div>
      </div>
    </>
  )
}
export default Withdraw
