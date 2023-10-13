import { CloseSmall } from '@icon-park/react'
import { Button, Modal } from '@ume/ui'

import { useEffect, useState } from 'react'

import { VoucherPagingResponse } from 'ume-service-openapi'

import VourcherModalCreate from './voucher-modal'

import Table from '~/components/table/table'

import { trpc } from '~/utils/trpc'

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
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleClose = () => {
    setIsModalVisible(false)
  }

  useEffect(() => {
    const resultArray = voucherForProvider?.row?.map((voucher) => {
      const voucherArray = Object.values(voucher)
      const newVoucherArray = [
        <span>
          <p>{voucherArray[8]}</p>
          <p className="opacity-30">{voucherArray[6]}</p>
        </span>,
        voucherArray[9],
        voucherArray[15],
        new Date(voucherArray[21]).toLocaleDateString('en-GB'),
        new Date(voucherArray[22]).toLocaleDateString('en-GB'),
        voucherArray[27],
        voucherArray[24],
      ]
      return newVoucherArray
    })
    setVoucherForProviderArray(resultArray)
  }, [voucherForProvider])

  const handleViewVoucherDetail = () => {
    console.log('asdasdasdasd')
  }

  const createNewVoucher = Modal.useDisplayPost({
    onOK: () => {},
    onClose: handleClose,
    title: <p className="text-white">Tạo mới khuyến mãi</p>,
    show: isModalVisible,
    customModalCSS: 'w-fit top-5 overflow-y-auto custom-scrollbar',
    form: (
      <>
        <VourcherModalCreate handleCloseModalVoucher={handleClose} />
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

  return (
    <>
      {isModalVisible && createNewVoucher}
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
                onClick={() => setIsModalVisible(true)}
              >
                Tạo khuyến mãi
              </Button>
            </div>
            {!isVoucherLoading && voucherForProviderArray && (
              <Table
                dataHeader={['Tên', 'Mô tả', 'Loại', 'Bắt đầu', 'Kết thúc', 'Trạng thái', 'Đối tượng']}
                dataBody={voucherForProviderArray}
                page={page}
                setPage={setPage}
                limit={'10'}
                totalItem={voucherForProvider?.count ?? 0}
                contentItem="khuyến mãi"
                watchAction={true}
                onWatch={handleViewVoucherDetail}
                deleteAction={false}
                onDelete={() => {}}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
export default Voucher
