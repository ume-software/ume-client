import { CheckOne, Delete, Eyes, ReduceOne, Write } from '@icon-park/react'
import { Button } from '@ume/ui'

import React, { useState } from 'react'

import { Table, Tag, notification } from 'antd'
import Image from 'next/image'

import EmptyErrorPic from '../../../../../public/empty_error.png'
import VourcherModalUpdate from '../vourcher-modal/vourcher-modal-update'
import VourcherModalView from '../vourcher-modal/vourcher-modal-view'

import BanModal from '~/components/modal-base/ban-modal'
import ComfirmModal from '~/components/modal-base/comfirm-modal'

import { trpc } from '~/utils/trpc'

const tableDataMapping = (data?) => {
  const list: {}[] = []
  if (data) {
    data.map((item) => {
      const rowItem = {
        key: item.id,
        ...item,
      }
      list.push(rowItem)
    })
  }
  return list
}

const mappingRecipientType = {
  ALL: 'Tất cả',
  FIRST_TIME_BOOKING: 'Người lần đầu thuê',
  PREVIOUS_BOOKING: ' Người đã từng thuê',
  TOP_5_BOOKER: ' Top 5 người thuê',
  TOP_10_BOOKER: ' Top 10 người thuê',
}

const mappingType = {
  DISCOUNT: 'Giảm giá',
  CASHBACK: 'Hoàn tiền',
}
const AdminVoucherTable = ({ data }) => {
  const listData = tableDataMapping(data?.row)
  const [voucherModalData, setVoucherModalData] = useState()
  const [openVourcherModalView, setOpenVourcherModalView] = useState(false)
  const [openVourcherModalUpdate, setOpenVourcherModalUpdate] = useState(false)
  const [selectedVoucher, setSelectedVoucher] = useState<any>()
  const utils = trpc.useContext()
  const [isActivated, setIsActivate] = useState()
  const updateVoucher = trpc.useMutation(['voucher.updateVoucherAdmin'])
  const [openConfirm, setOpenConfirm] = useState(false)

  function closeVourcherModalView() {
    setOpenVourcherModalView(false)
  }
  function closeVourcherModalUpdate() {
    setOpenVourcherModalUpdate(false)
  }

  function openModalHandle(action, record) {
    setVoucherModalData(record)
    switch (action) {
      case 'view':
        setOpenVourcherModalView(true)
        break
      case 'update':
        setOpenVourcherModalUpdate(true)
        break
    }
  }

  function handleOpenConfirm(record) {
    setSelectedVoucher(record.key)
    setIsActivate(record.isActivated)
    setOpenConfirm(true)
  }
  const handlecloseConfirm = () => {
    setOpenConfirm(false)
  }

  function handleConfirmFunction() {
    try {
      updateVoucher.mutate(
        { id: selectedVoucher, voucherUpdate: { isActivated: isActivated } },
        {
          onSuccess(data, variables, context) {
            if (data.success) {
              if (isActivated) {
                notification.success({
                  message: 'Dừng hoạt động thành công!',
                  description: 'Khuyến mãi đã bị dừng hoạt động',
                  placement: 'bottomLeft',
                })
              } else {
                notification.success({
                  message: 'Kích hoạt thành công!',
                  description: 'Khuyến mãi đã được kích hoạt lại',
                  placement: 'bottomLeft',
                })
              }

              utils.invalidateQueries('voucher.getAllVoucher')
            }
          },
        },
      )
    } catch (e) {
      console.error(e)
    }
    setOpenConfirm(false)
  }
  const columns = [
    {
      title: 'Tên',
      key: 'name',
      render: (record) => (
        <div className="max-w-[9rem]">
          <p> {record.name}</p>
          <p className="text-gray-400"> {record.code}</p>
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: <div className="w-full flex justify-center">Loại</div>,
      dataIndex: 'type',
      key: 'type',
      render: (type) => <div className="w-full flex justify-center ">{mappingType[type]}</div>,
    },
    {
      title: <div className="w-full flex justify-center">Giá trị</div>,
      key: 'discountValue',
      render: (record) => {
        if (record.discountUnit == 'PERCENT')
          return <div className="w-full flex justify-center">{record.discountValue + '%'}</div>
        else if (record.discountUnit == 'CASH')
          return <div className="w-full flex justify-center">{record.discountValue + ' xu'}</div>
      },
    },
    {
      title: <div className="w-full flex justify-center">Bắt đầu</div>,
      key: 'startDate',
      dataIndex: 'startDate',
      render: (date) => <div className="w-full flex justify-center">{new Date(date).toLocaleDateString('en-GB')}</div>,
    },
    {
      title: <div className="w-full flex justify-center">Kết thúc</div>,
      key: 'endDate',
      dataIndex: 'endDate',
      render: (date) => <div className="w-full flex justify-center">{new Date(date).toLocaleDateString('en-GB')}</div>,
    },
    {
      title: <div className="w-full flex justify-center">Đối tượng</div>,
      key: 'recipientType',
      dataIndex: 'recipientType',
      render: (text) => <div className="w-full flex justify-center">{mappingRecipientType[text]}</div>,
    },
    {
      title: '',
      key: 'action',
      render: (record) => {
        console.log(record)

        return (
          <>
            <div className="flex max-w-[6rem]">
              <Button isActive={false}>
                <Eyes
                  onClick={() => {
                    openModalHandle('view', record.key)
                  }}
                  className="p-2 mr-2 rounded-full hover:bg-gray-500"
                  theme="outline"
                  size="18"
                  fill="#fff"
                />
              </Button>
              <Button isActive={false}>
                <Write
                  onClick={() => {
                    openModalHandle('update', record.key)
                  }}
                  className="p-2 rounded-full hover:bg-gray-500"
                  theme="outline"
                  size="18"
                  fill="#1677ff"
                />
              </Button>
              <Button isActive={false} onClick={() => handleOpenConfirm(record)}>
                {record.isActivated ? (
                  <ReduceOne className="rounded-full hover:bg-gray-500 p-2" theme="outline" size="20" fill="#ff0000" />
                ) : (
                  <CheckOne className="rounded-full hover:bg-gray-500 p-2" theme="outline" size="20" fill="#22c55e" />
                )}
              </Button>
              {/* <Delete className="p-2 rounded-full hover:bg-gray-500" theme="outline" size="18" fill="#ff0000" /> */}
            </div>
          </>
        )
      },
    },
  ]

  let locale = {
    emptyText: (
      <div className="flex items-center justify-center w-full h-full">
        <Image height={600} alt="empty data" src={EmptyErrorPic} />
      </div>
    ),
  }

  return (
    <div className="mt-5 ">
      <Table locale={locale} pagination={false} columns={columns} dataSource={listData} />
      {openVourcherModalView && (
        <VourcherModalView
          vourcherId={voucherModalData}
          closeFunction={closeVourcherModalView}
          openValue={openVourcherModalView}
        />
      )}
      {openVourcherModalUpdate && (
        <VourcherModalUpdate
          vourcherId={voucherModalData}
          closeFunction={closeVourcherModalUpdate}
          openValue={openVourcherModalUpdate}
        />
      )}
      <ComfirmModal
        closeFunction={handlecloseConfirm}
        openValue={openConfirm}
        isComfirmFunction={handleConfirmFunction}
        titleValue={isActivated ? 'Xác nhận dừng hoạt động' : 'Xác nhận mở hoạt động'}
      >
        <div className="text-white p-4">
          Bạn có chắc chắn muốn {!isActivated ? ' mở hoạt động ' : ' dừng hoạt động '} khuyến mãi này?
        </div>
      </ComfirmModal>
    </div>
  )
}

export default AdminVoucherTable
