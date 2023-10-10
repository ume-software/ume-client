import { CloseSmall } from '@icon-park/react'
import { Button, Modal } from '@ume/ui'

import { useState } from 'react'

import VourcherModalCreate from './voucher-modal'

import Table from '~/components/table/table'

import { trpc } from '~/utils/trpc'

const Voucher = () => {
  const [page, setPage] = useState<string>('1')
  const [voucherForProvider, setVoucherForProvider] = useState<any>(undefined)
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

  const createNewVoucher = Modal.useDisplayPost({
    onOK: () => {},
    onClose: handleClose,
    title: <p className="text-white">Tạo mới khuyến mãi</p>,
    show: isModalVisible,
    customModalCSS: 'w-fit top-5 overflow-y-auto custom-scrollbar',
    form: (
      <>
        <VourcherModalCreate />
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
            {!isVoucherLoading && (
              <Table
                dataHeader={['1', '2', '3']}
                dataBody={[
                  [
                    'apple',
                    <span>
                      asdasdsad <p>asdasdasd</p>
                      <p>asdasdasd</p>
                    </span>,
                    'cherry',
                  ],
                  ['dog', 'cat', undefined],
                  ['elephant', 'lion', 'zebra'],
                ]}
                pageCount={10}
                page={page}
                setPage={setPage}
                limit={'5'}
                totalItem={voucherForProvider?.count || 0}
                watchAction={true}
                deleteAction={false}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
export default Voucher
