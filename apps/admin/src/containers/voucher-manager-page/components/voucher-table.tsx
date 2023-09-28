import { Delete, Eyes, ReduceOne, Write } from '@icon-park/react'

import React, { useState } from 'react'

import { Table, Tag } from 'antd'
import Image from 'next/image'

import EmptyErrorPic from '../../../../public/empty_error.png'

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

const VoucherTable = ({ data }) => {
  const [openUserDetail, setOpenUserDetail] = useState(false)
  const [openBanUser, setOpenBanUser] = useState(false)
  const [userDetails, setUserDetails] = useState<{}>()

  const listData = tableDataMapping(data?.row)
  const handleOpenUserDetails = (record) => {
    setUserDetails(record)

    setOpenUserDetail(true)
  }
  const handlecloseUserDetails = () => {
    setOpenUserDetail(false)
  }

  const handleOpenBan = (record) => {
    setOpenBanUser(true)
  }
  const handlecloseBan = () => {
    setOpenBanUser(false)
  }

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Loại',
      dataIndex: 'discountUnit',
      key: 'discountUnit',
    },
    {
      title: 'Giá trị',
      dataIndex: 'discountValue',
      key: 'discountValue',
    },
    {
      title: 'Bắt đầu',
      key: 'startDate',
      dataIndex: 'startDate',
      render: (date) => <div className="flex justify-center">{new Date(date).toLocaleDateString('en-GB')}</div>,
    },
    {
      title: 'Kết thúc',
      key: 'endDate',
      dataIndex: 'endDate',
      render: (date) => <div className="flex justify-center">{new Date(date).toLocaleDateString('en-GB')}</div>,
    },
    {
      title: 'Đối tượng',
      key: 'recipientType',
      dataIndex: 'recipientType',
    },
    {
      title: '',
      key: 'action',
      render: (record) => {
        return (
          <>
            <div className="flex">
              <Eyes
                onClick={() => handleOpenUserDetails(record)}
                className="p-2 mr-2 rounded-full hover:bg-gray-500"
                theme="outline"
                size="18"
                fill="#85ea2d"
              />
              <Write className="p-2 rounded-full hover:bg-gray-500" theme="outline" size="18" fill="#fff" />
              <Delete
                onClick={() => handleOpenBan(record)}
                className="p-2 rounded-full hover:bg-gray-500"
                theme="outline"
                size="18"
                fill="#ff0000"
              />
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
      {/* <ComfirmModal
        closeFunction={closeComfirmFormHandle}
        openValue={openConfirm}
        isComfirmFunction={handleBanProvider}
        titleValue={!isBanned ? 'Xác nhận chặn' : 'Xác nhận bỏ chặn'}
      >
        {content === '' && <div className="mx-4 text-yellow-500">Lý do trống</div>}
      </ComfirmModal> */}
    </div>
  )
}

export default VoucherTable
