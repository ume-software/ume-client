import { Delete, Eyes, ReduceOne, Write } from '@icon-park/react'

import React, { useState } from 'react'

import { Table, Tag } from 'antd'
import Image from 'next/image'

import EmptyErrorPic from '../../../../public/empty_error.png'

import BanModal from '~/components/modal-base/ban-modal'

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
                className="mr-2 rounded-full hover:bg-gray-500 p-2"
                theme="outline"
                size="18"
                fill="#85ea2d"
              />
              <Write className="rounded-full hover:bg-gray-500 p-2" theme="outline" size="18" fill="#fff" />
              <Delete
                onClick={() => handleOpenBan(record)}
                className="rounded-full hover:bg-gray-500 p-2"
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
      <div className="w-full h-full flex justify-center items-center">
        <Image height={600} alt="empty data" src={EmptyErrorPic} />
      </div>
    ),
  }

  return (
    <div className=" mt-5">
      <Table locale={locale} pagination={false} columns={columns} dataSource={listData} />
      <BanModal name={'Que'} closeFunction={handlecloseBan} openValue={openBanUser} />
    </div>
  )
}

export default VoucherTable
