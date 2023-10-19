import { CloseSmall } from '@icon-park/react'
import { Button, Modal } from '@ume/ui'
import { ActionEnum } from '~/enumVariable/enumVariable'

import { useEffect, useState } from 'react'

import { Switch, notification } from 'antd'
import {
  CreateVoucherRequestRecipientTypeEnum,
  VoucherPagingResponse,
  VoucherResponse,
  VoucherResponseStatusEnum,
} from 'ume-service-openapi'

import VourcherModal from './voucher-modal'

import ConfirmForm from '~/components/confirm-form/confirmForm'
import { TableSkeletonLoader } from '~/components/skeleton-load'
import Table from '~/components/table/table'

import { trpc } from '~/utils/trpc'

interface IEnumType {
  key: string | number
  label: string
  [key: string]: any
}
const mappingRecipientType: IEnumType[] = [
  { key: CreateVoucherRequestRecipientTypeEnum.All, label: 'Tất cả' },
  { key: CreateVoucherRequestRecipientTypeEnum.FirstTimeBooking, label: 'Người lần đầu thuê' },
  { key: CreateVoucherRequestRecipientTypeEnum.PreviousBooking, label: ' Người đã từng thuê' },
  { key: CreateVoucherRequestRecipientTypeEnum.SelectiveBooker, label: ' Top 5 người thuê' },
  { key: CreateVoucherRequestRecipientTypeEnum.Top10Booker, label: ' Top 10 người thuê' },
  { key: CreateVoucherRequestRecipientTypeEnum.Top5Booker, label: 'Người đặt chọn' },
]

const mappingStatus: IEnumType[] = [
  { key: VoucherResponseStatusEnum.Approved, label: 'Chấp nhận', color: '#008000', textColor: '#FFF' },
  { key: VoucherResponseStatusEnum.Rejected, label: 'Từ chối', color: '#FF0000', textColor: '#FFF' },
  { key: VoucherResponseStatusEnum.Pending, label: 'Chờ duyệt', color: '#FFFF00', textColor: '#000' },
]

const Voucher = () => {
  const [page, setPage] = useState<string>('1')
  const [voucherForProvider, setVoucherForProvider] = useState<VoucherPagingResponse | undefined>(undefined)
  const [voucherForProviderArray, setVoucherForProviderArray] = useState<any[] | undefined>(undefined)
  const { isLoading: isVoucherLoading } = trpc.useQuery(
    ['identity.providerGetSelfVoucher', { page: page, limit: '10' }],
    {
      onSuccess(data) {
        setVoucherForProvider(data.data)
      },
    },
  )
  const [voucherSelected, setVoucherSelected] = useState<VoucherResponse | undefined>(undefined)
  const updateVoucher = trpc.useMutation(['identity.providerUpdateVoucher'])
  const utils = trpc.useContext()

  const [isModalConfirmationVisible, setIsModalConfirmationVisible] = useState<boolean>(false)
  const [modalStatus, setModalStatus] = useState<string>(ActionEnum.CREATE)
  const [idSelectedVoucher, setIdSelectedVoucher] = useState<string>('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isVoucherActive, setIsVoucherActive] = useState(false)

  const handleClose = () => {
    setIsModalVisible(false)
  }

  useEffect(() => {
    const resultArray = voucherForProvider?.row?.map((voucher) => {
      const voucherArray = Object.values(voucher)

      const newVoucherArray = [
        <span key={voucherArray[0]}>
          <p>{voucherArray[8]}</p>
          <p className="opacity-30">{voucherArray[6]}</p>
        </span>,
        voucherArray[9],
        voucherArray[16],
        new Date(voucherArray[22]).toLocaleDateString('en-GB'),
        new Date(voucherArray[23]).toLocaleDateString('en-GB'),
        <div className="flex justify-center" key={voucherArray[0]}>
          <p
            className={`w-fit px-2 py-1 text-lg font-semibold rounded-xl text-[${
              mappingStatus.find((statusType) => statusType.key == voucherArray[28])?.textColor
            }] bg-[${mappingStatus.find((statusType) => statusType.key == voucherArray[28])?.color}]`}
          >
            {mappingStatus.find((statusType) => statusType.key == voucherArray[28])?.label}
          </p>
        </div>,
        <>{mappingRecipientType.find((receipientType) => receipientType.key == voucherArray[25])?.label}</>,
        <Switch
          key={voucherArray[0]}
          className="bg-gray-600"
          checked={voucherArray[14]}
          onClick={(e) => {
            setIsVoucherActive(e)
            setIsModalConfirmationVisible(true)
            setIdSelectedVoucher(voucherArray[0])
          }}
          disabled={!(voucherArray[28] == VoucherResponseStatusEnum.Approved)}
        />,
      ]
      return newVoucherArray
    })
    setVoucherForProviderArray(resultArray)
  }, [voucherForProvider])

  const handleViewVoucherDetail = (index?: number) => {
    if (voucherForProvider?.row) {
      setVoucherSelected(voucherForProvider?.row[index ?? 0])
      setModalStatus(ActionEnum.VIEW)
      setIsModalVisible(true)
    }
  }

  const handleUpdateVoucherDetail = (index?: number) => {
    if (voucherForProvider?.row) {
      setVoucherSelected(voucherForProvider?.row[index ?? 0])
      setModalStatus(ActionEnum.UPDATE)
      setIsModalVisible(true)
    }
  }

  const VoucherModal = Modal.useDisplayPost({
    onOK: () => {},
    onClose: handleClose,
    title: (
      <p className="text-white">
        {modalStatus == ActionEnum.CREATE ? 'Tạo mới khuyến mãi' : 'Thông tin chi tiết khuyến mãi'}
      </p>
    ),
    show: isModalVisible,
    customModalCSS: 'w-fit top-5 overflow-y-auto custom-scrollbar',
    form: (
      <>
        <VourcherModal
          handleCloseModalVoucher={handleClose}
          actionModal={modalStatus}
          voucherSelected={voucherSelected}
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

  const handleCloseComfirmModal = () => {
    setIsModalConfirmationVisible(false)
  }
  const handleChangeStatusVoucher = (voucherId: string) => {
    if (voucherId != '') {
      updateVoucher.mutate(
        { id: voucherId, body: { isActivated: isVoucherActive } },
        {
          onSuccess() {
            setIsModalConfirmationVisible(false)
            notification.success({
              message: `${isVoucherActive ? 'Kích hoạt thành công!' : 'Hủy kích hoạt thành công!'}`,
              description: `${isVoucherActive ? 'Khuyến mãi đã được kích hoạt' : 'Khuyến mãi đã được hủy kích hoạt'}`,
              placement: 'bottomLeft',
            })
            utils.invalidateQueries('identity.providerGetSelfVoucher')
          },
          onError() {
            notification.error({
              message: 'Cập nhật thất bại',
              description: 'Cập nhật thất bại. Vui lòng thử lại sau!',
              placement: 'bottomLeft',
            })
          },
        },
      )
    }
  }

  const confirmModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleCloseComfirmModal,
    show: isModalConfirmationVisible,
    form: (
      <>
        <ConfirmForm
          title="Thay đổi thông tin khuyến mãi"
          description="Bạn có chấp nhận thay đổi thông tin khuyến mãi này hay không?"
          onClose={handleCloseComfirmModal}
          onOk={() => {
            handleChangeStatusVoucher(idSelectedVoucher)
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

  return (
    <>
      {isModalConfirmationVisible && confirmModal}
      {isModalVisible && VoucherModal}
      <div className="w-full px-10">
        <p className="text-4xl font-bold">Khuyến mãi</p>
        <div className="flex flex-col gap-5 mt-10 pr-5 space-y-10">
          <div className="flex flex-col gap-3">
            <div className="flex items-end justify-between">
              <p className="text-xl font-bold">Danh sách khuyến mãi của tôi</p>
              <Button
                isActive={true}
                isOutlinedButton={true}
                customCSS="py-2 px-7 rounded-xl hover:scale-105"
                type="button"
                onClick={() => {
                  setIsModalVisible(true)
                  setModalStatus(ActionEnum.CREATE)
                  setVoucherSelected(undefined)
                }}
              >
                Tạo khuyến mãi
              </Button>
            </div>
            {!isVoucherLoading && voucherForProviderArray ? (
              <Table
                dataHeader={['Tên', 'Mô tả', 'Loại', 'Bắt đầu', 'Kết thúc', 'Trạng thái', 'Đối tượng', 'Kích hoạt']}
                dataBody={voucherForProviderArray}
                page={page}
                setPage={setPage}
                limit={'10'}
                totalItem={voucherForProvider?.count ?? 0}
                contentItem="khuyến mãi"
                watchAction={true}
                onWatch={(id) => handleViewVoucherDetail(id)}
                editAction={true}
                onEdit={(id) => {
                  handleUpdateVoucherDetail(id)
                }}
                deleteAction={false}
                onDelete={() => {}}
              />
            ) : (
              <>
                <TableSkeletonLoader />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
export default Voucher
