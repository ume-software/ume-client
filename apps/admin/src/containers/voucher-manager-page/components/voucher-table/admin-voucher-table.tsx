import { Delete, Eyes, ReduceOne, Write } from '@icon-park/react'

import React, { useState } from 'react'

import { Table, Tag } from 'antd'
import Image from 'next/image'

import EmptyErrorPic from '../../../../../public/empty_error.png'
import VourcherModalUpdate from '../vourcher-modal/vourcher-modal-update'
import VourcherModalView from '../vourcher-modal/vourcher-modal-view'

import BanModal from '~/components/modal-base/ban-modal'
import ComfirmModal from '~/components/modal-base/comfirm-modal'

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
          return <div className="w-full flex justify-center">{record.discountValue + 'Coin'}</div>
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
            <div className="flex max-w-[6rem]">
              <Eyes
                onClick={() => {
                  openModalHandle('view', record.key)
                }}
                className="p-2 mr-2 rounded-full hover:bg-gray-500"
                theme="outline"
                size="18"
                fill="#85ea2d"
              />
              <Write
                onClick={() => {
                  openModalHandle('update', record.key)
                }}
                className="p-2 rounded-full hover:bg-gray-500"
                theme="outline"
                size="18"
                fill="#fff"
              />
              <Delete className="p-2 rounded-full hover:bg-gray-500" theme="outline" size="18" fill="#ff0000" />
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
    </div>
  )
}

export default AdminVoucherTable
