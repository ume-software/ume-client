import { CheckOne, Eyes, ReduceOne, Write } from '@icon-park/react'
import { Button } from '@ume/ui'
import EmptyErrorPic from 'public/empty_error.png'

import React, { useState } from 'react'

import { Table, Tag, notification } from 'antd'
import Image from 'next/image'

import ServicesModalUpdate from './services-modal/services-modal-update'
import ServicesModalView from './services-modal/services-modal-view'

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
const ServicesTable = ({ servicesList, isLoading }) => {
  const utils = trpc.useContext()
  const listData = tableDataMapping(servicesList?.row)
  const [servicesModalData, setServicesModalData] = useState<any>()
  const [openServicesModalView, setOpenServicesModalView] = useState(false)
  const [openServicesModalUpdate, setOpenServicesModalUpdate] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [isActivated, setIsActivate] = useState()

  const columns = [
    {
      title: <div className="flex justify-center w-full">Hình ảnh</div>,
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => (
        <div className="flex justify-center w-full">
          <Image src={imageUrl} width={70} height={100} alt={imageUrl} className="rounded-lg" />
        </div>
      ),
    },
    {
      title: 'Tên',
      key: 'name',
      render: (record) => (
        <div>
          <p>{record.name}</p>
          <p>{record.viName}</p>
        </div>
      ),
    },

    {
      title: 'Số người dùng',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: <div className="flex items-center justify-center">Trạng thái</div>,
      key: 'isBanned',
      dataIndex: 'isBanned',
      render: (text) => (
        <div className="flex items-center justify-center">
          {!text ? (
            <Tag className="px-3 py-2 m-0 text-white bg-green-500 rounded-lg">Hoạt động</Tag>
          ) : (
            <Tag className="px-3 py-2 m-0 text-white bg-red-500 rounded-lg">Tạm dừng</Tag>
          )}
        </div>
      ),
    },
    {
      title: <div className="flex items-center justify-center">Ngày tạo</div>,
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (date) => <div className="flex justify-center">{new Date(date).toLocaleDateString('en-GB')}</div>,
    },
    {
      title: '',
      key: 'action',
      render: (record) => {
        return (
          <>
            <div className="flex justify-end w-full">
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
              <Button isActive={false} onClick={() => {}}>
                {record.isActivated ? (
                  <ReduceOne className="p-2 rounded-full hover:bg-gray-500" theme="outline" size="20" fill="#ff0000" />
                ) : (
                  <CheckOne className="p-2 rounded-full hover:bg-gray-500" theme="outline" size="20" fill="#22c55e" />
                )}
              </Button>
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
  function closeModalView() {
    setOpenServicesModalView(false)
  }
  function closeModalUpdate() {
    setOpenServicesModalUpdate(false)
  }
  function openModalHandle(action, record) {
    setServicesModalData(record)
    switch (action) {
      case 'view':
        setOpenServicesModalView(true)
        break
      case 'update':
        setOpenServicesModalUpdate(true)
        break
    }
  }
  const handlecloseConfirm = () => {
    setOpenConfirm(false)
  }
  function handleConfirmFunction() {}

  return (
    <div className="mt-5 ">
      <Table loading={isLoading} locale={locale} pagination={false} columns={columns} dataSource={listData} />
      {openServicesModalView && (
        <ServicesModalView
          idService={servicesModalData}
          closeFunction={closeModalView}
          openValue={openServicesModalView}
        />
      )}
      {openServicesModalUpdate && (
        <ServicesModalUpdate
          idService={servicesModalData}
          closeFunction={closeModalUpdate}
          openValue={openServicesModalUpdate}
        />
      )}
      <ComfirmModal
        closeFunction={handlecloseConfirm}
        openValue={openConfirm}
        isComfirmFunction={handleConfirmFunction}
        titleValue={isActivated ? 'Xác nhận dừng hoạt động' : 'Xác nhận mở hoạt động'}
      >
        <div className="p-4 text-white">
          Bạn có chắc chắn muốn {!isActivated ? ' mở hoạt động ' : ' dừng hoạt động '} Dịch vụ này?
        </div>
      </ComfirmModal>
    </div>
  )
}

export default ServicesTable
