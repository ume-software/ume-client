import { CheckOne, CloseOne, Eyes } from '@icon-park/react'

import React, { useState } from 'react'

import { Table, Tag, notification } from 'antd'
import Image from 'next/image'

import EmptyErrorPic from '../../../../../public/empty_error.png'
import VourcherModalView from '../vourcher-modal/vourcher-modal-view'

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
const mappingStatus = {
  APPROVED: <Tag className="bg-green-600 rounded-lg text-white px-2 py-1 m-0">Đã duyệt</Tag>,
  PENDING: <Tag className="bg-yellow-600 rounded-lg text-white px-2 py-1 m-0">Chờ duyệt</Tag>,
  REJECTED: <Tag className="bg-red-600 rounded-lg text-white px-2 py-1 m-0">Bị từ chối</Tag>,
}

const mappingType = {
  DISCOUNT: 'Giảm giá',
  CASHBACK: 'Hoàn tiền',
}

const ApproveProviderVoucherTable = ({ data, isLoading }) => {
  const listData = tableDataMapping(data?.row)
  const utils = trpc.useContext()
  const [openConfirm, setOpenConfirm] = useState(false)
  const [openVourcherModalView, setOpenVourcherModalView] = useState(false)
  const [voucherModalData, setVoucherModalData] = useState()
  const updateVoucher = trpc.useMutation(['voucher.updateVoucherAdmin'])
  const [approveItem, setApproveItem] = useState({
    voucher: '',
    status: 'PENDING',
  })
  function closeVourcherModalView() {
    setOpenVourcherModalView(false)
  }

  function openModalHandle(record) {
    setVoucherModalData(record.key)
    setOpenVourcherModalView(true)
  }
  function handleOpenComfirm(rowVoucher, changedStatus) {
    setApproveItem({
      voucher: rowVoucher.key,
      status: changedStatus,
    })
    setOpenConfirm(true)
  }

  function handleCloseComfirm() {
    setOpenConfirm(false)
  }
  function handleApproval() {
    try {
      updateVoucher.mutate(
        { id: approveItem.voucher, voucherUpdate: { status: approveItem.status } },
        {
          onSuccess(data, variables, context) {
            if (data.success) {
              if (approveItem.status == 'APPROVED') {
                notification.success({
                  message: 'Duyệt khuyến mãi thành công!',
                  description: 'Khuyến mãi đã được chấp nhận',
                  placement: 'bottomLeft',
                })
              } else {
                notification.success({
                  message: 'Từ chối khuyến mãi thành công!',
                  description: 'Khuyến mãi đã bị từ chối',
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
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <div className="min-w-max">{mappingType[type]}</div>,
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
        return (
          <>
            <div className="flex justify-center items-center max-w-[5rem]">
              <Eyes
                onClick={() => {
                  openModalHandle(record)
                }}
                className="p-2 rounded-full hover:bg-gray-500"
                theme="outline"
                size="18"
                fill="#fff"
              />

              <div className="flex">
                <CheckOne
                  onClick={() => {
                    handleOpenComfirm(record, 'APPROVED')
                  }}
                  className="p-2 rounded-full hover:bg-gray-500"
                  theme="outline"
                  size="18"
                  fill="#85ea2d"
                />

                <CloseOne
                  onClick={() => {
                    handleOpenComfirm(record, 'REJECTED')
                  }}
                  className="p-2 rounded-full hover:bg-gray-600"
                  theme="outline"
                  size="18"
                  fill="#ff0000"
                />
              </div>
            </div>
          </>
        )
      },
    },
  ]

  const locale = {
    emptyText: (
      <div className="flex flex-col items-center justify-center w-full h-full font-bold text-2xl text-white">
        <Image height={600} alt="empty data" src={EmptyErrorPic} />
        Không có data
      </div>
    ),
  }

  return (
    <div className="mt-5 ">
      <Table loading={isLoading} locale={locale} pagination={false} columns={columns} dataSource={listData} />
      {openVourcherModalView && (
        <VourcherModalView
          vourcherId={voucherModalData}
          closeFunction={closeVourcherModalView}
          openValue={openVourcherModalView}
        />
      )}
      <ComfirmModal
        closeFunction={handleCloseComfirm}
        openValue={openConfirm}
        isComfirmFunction={handleApproval}
        titleValue={`Xác nhận ${approveItem.status == 'APPROVED' ? 'duyệt' : 'từ chối'}`}
      >
        <div className="text-white p-4 text-center">
          Bạn có chắc chắn muốn {approveItem.status == 'APPROVED' ? 'duyệt' : 'từ chối'} mã khuyến mãi này không?
        </div>
      </ComfirmModal>
    </div>
  )
}

export default ApproveProviderVoucherTable
