import { CheckOne, CloseOne, Eyes, ReduceOne, Write } from '@icon-park/react'
import { Button } from '@ume/ui'

import React, { useState } from 'react'

import { Table, notification } from 'antd'
import Image from 'next/image'

import EmptyErrorPic from '../../../../../public/empty_error.png'
import VourcherModalUpdate from '../vourcher-modal/vourcher-modal-update'
import VourcherModalView from '../vourcher-modal/vourcher-modal-view'

import { mappingRecipientTypes, mappingVoucherType } from '~/components/filter-items'
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

const AdminVoucherTable = ({ data, isLoading }) => {
  const listData = tableDataMapping(data?.row)
  const [voucherModalData, setVoucherModalData] = useState<any>()
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
        { id: selectedVoucher, voucherUpdate: { isActivated: !isActivated } },
        {
          onSuccess(data) {
            if (data.success) {
              if (isActivated) {
                notification.success({
                  message: 'Dừng hoạt động thành công!',
                  description: 'Khuyến mãi đã bị dừng hoạt động.',
                })
              } else {
                notification.success({
                  message: 'Kích hoạt thành công!',
                  description: 'Khuyến mãi đã được kích hoạt.',
                })
              }

              utils.invalidateQueries('voucher.getAllVoucher')
            }
          },
          onError: (err) => {
            notification.error({
              message: 'Hành Động không thành công!',
              description: err.message,
            })
          },
        },
      )
    } catch (e) {
      console.error(e)
    }
    setOpenConfirm(false)
  }
  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
      title: <div className="flex justify-center w-full">Loại</div>,
      dataIndex: 'type',
      key: 'type',
      render: (type) => <div className="flex justify-center w-full ">{mappingVoucherType[type]}</div>,
    },
    {
      title: <div className="flex justify-center w-full">Giá trị</div>,
      key: 'discountValue',
      render: (record) => {
        if (record.discountUnit == 'PERCENT')
          return <div className="flex justify-center w-full">{record.discountValue + '%'}</div>
        else if (record.discountUnit == 'CASH')
          return (
            <div className="flex items-baseline justify-center w-full">
              {formatNumberWithCommas(parseInt(record.discountValue))}
              <span className="text-xs italic"> đ</span>
            </div>
          )
      },
    },
    {
      title: <div className="flex justify-center w-full">Bắt đầu</div>,
      key: 'startDate',
      dataIndex: 'startDate',
      render: (date) => <div className="flex justify-center w-full">{new Date(date).toLocaleDateString('en-GB')}</div>,
    },
    {
      title: <div className="flex justify-center w-full">Kết thúc</div>,
      key: 'endDate',
      dataIndex: 'endDate',
      render: (date) => <div className="flex justify-center w-full">{new Date(date).toLocaleDateString('en-GB')}</div>,
    },
    {
      title: <div className="flex justify-center w-full">Đối tượng</div>,
      key: 'recipientType',
      dataIndex: 'recipientType',
      render: (text) => <div className="flex justify-center w-full">{mappingRecipientTypes[text]}</div>,
    },
    {
      title: '',
      key: 'action',
      render: (record) => {
        return (
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
            {record.isPublished ? (
              <Button isActive={false} className="pointer-events-none ">
                <Write className="p-2 rounded-full opacity-40" theme="outline" size="18" fill="#fff" />
              </Button>
            ) : (
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
            )}

            <Button isActive={false} onClick={() => handleOpenConfirm(record)}>
              {record.isActivated ? (
                <CloseOne className="p-2 rounded-full hover:bg-gray-500" theme="outline" size="20" fill="#ff0000" />
              ) : (
                <CheckOne className="p-2 rounded-full hover:bg-gray-500" theme="outline" size="20" fill="#85ea2d" />
              )}
            </Button>
          </div>
        )
      },
    },
  ]

  const locale = {
    emptyText: (
      <div className="flex flex-col items-center justify-center w-full h-full text-2xl font-bold text-white">
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
        <div className="p-4 text-white">
          Bạn có chắc chắn muốn {!isActivated ? ' mở hoạt động ' : ' dừng hoạt động '} khuyến mãi này?
        </div>
      </ComfirmModal>
    </div>
  )
}

export default AdminVoucherTable
