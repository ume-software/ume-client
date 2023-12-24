import { CheckOne, CloseOne, Eyes, Plus, ReduceOne, Search, Write } from '@icon-park/react'
import { Button, Input } from '@ume/ui'
import EmptyErrorPic from 'public/empty_error.png'
import { getItem } from '~/hooks/localHooks'

import React, { useState } from 'react'

import { Tag, notification } from 'antd'
import { ColumnsType } from 'antd/es/table'
import Head from 'next/head'
import Image from 'next/image'
import { PrismaWhereConditionType, prismaWhereConditionToJsonString } from 'query-string-prisma-ume'
import { AdminGetUserResponseResponse, AdminInformationResponse } from 'ume-service-openapi'

import CreateAccountModal from './components/admin-account-modals/create-account-modal'
import UpdateAccountModal from './components/admin-account-modals/update-account-modal'
import ViewAccountModal from './components/admin-account-modals/view-account-modal'

import CommonTable from '~/components/common-table/Table'
import FilterDropdown from '~/components/filter-dropdown'
import { genderFilterItems, mappingGender } from '~/components/filter-items'
import ComfirmModal from '~/components/modal-base/comfirm-modal'

import { trpc } from '~/utils/trpc'

interface LooseObject {
  [key: string]: any
}
type tableProps = {
  key: string
  adminRoles: []
  avatarUrl: string
  createdAt: string
  deletedAt: string
  isActivated: boolean
  dob: string
  email: string
  gender: string
  id: string
  name: string
  phone: string
  updatedAt: string
  username: string
}

const userStatusFilterItems = [
  {
    key: 'all',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Tất cả
      </Tag>
    ),
  },
  {
    key: 'true',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Hoạt động
      </Tag>
    ),
  },
  {
    key: 'false',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Tạm dừng
      </Tag>
    ),
  },
]

const mappingUserStatus = {
  all: 'Tất cả',
  true: 'Hoạt động',
  false: 'Tạm dừng',
}
const UserManager = () => {
  const updateAdmin = trpc.useMutation(['admin.updateAdminAccount'])
  const utils = trpc.useContext()
  const [adminList, setAdminList] = useState<AdminInformationResponse | undefined>()
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)
  const [filter, setFilter] = useState({
    gender: 'ALL',
    isActivated: 'all',
    search: '',
  })
  const [searchChange, setSearchChange] = useState('')
  const [openCreateAdmin, setOpenCreateAdmin] = useState(false)
  const [openViewAdmin, setOpenViewAdmin] = useState(false)
  const [openUpdateAdmin, setOpenUpdateAdmin] = useState(false)
  const [idAdmin, setIdAdmin] = useState('')
  const [selectedAdmin, setSelectedAdmin] = useState<any>()
  const [openConfirm, setOpenConfirm] = useState(false)
  const adminInfo = getItem('user')

  const mappingListWithKeys = (data) => {
    const dataWithKeys = data.row.map((item) => ({
      ...item,
      key: item.id,
    }))
    setCount(data.count)
    setAdminList(dataWithKeys)
  }
  function openCreateAdminHandler() {
    setOpenCreateAdmin(true)
  }
  function closeCreateAdminHandle() {
    setOpenCreateAdmin(false)
  }
  function closeAdminViewModalHandle() {
    setOpenViewAdmin(false)
  }
  function closeAdminUpdateModalHandle() {
    setOpenUpdateAdmin(false)
  }

  const testQuerry: PrismaWhereConditionType<AdminGetUserResponseResponse> = Object.assign({
    name: {
      contains: filter.search,
      mode: 'insensitive',
    },
    gender: filter.gender !== 'ALL' ? filter.gender : undefined,
    isActivated: filter.isActivated !== 'all' ? (filter.isActivated == 'true' ? true : false) : undefined,
  })
  const ORDER = [{ createdAt: 'desc' }]
  const SELECT = ['$all', { adminRoles: ['$all'] }]

  const { isLoading } = trpc.useQuery(
    [
      'admin.getAdminAccountList',
      {
        page: page.toString(),
        where: prismaWhereConditionToJsonString(testQuerry, ['isUndefined']),
        order: JSON.stringify(ORDER),
        select: JSON.stringify(SELECT),
      },
    ],
    {
      onSuccess(data) {
        mappingListWithKeys(data?.data as any)
      },
    },
  )

  const handleFilter = (title, key) => {
    setPage(1)
    if (title == 'gender') {
      setFilter({
        ...filter,
        gender: key,
      })
    } else if (title == 'status') {
      setFilter({
        ...filter,
        isActivated: key,
      })
    }
  }

  const handleSearchChange = (e) => {
    if (e.target.value == '') {
      setPage(1)
      setFilter({
        ...filter,
        search: '',
      })
    }
    setSearchChange(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setPage(1)
      setFilter({
        ...filter,
        search: searchChange,
      })
    }
  }
  function openModalHandle(action, id) {
    setIdAdmin(id)
    switch (action) {
      case 'view':
        setOpenViewAdmin(true)
        break
      case 'update':
        setOpenUpdateAdmin(true)
        break
    }
  }

  function handleConfirmFunction() {
    try {
      updateAdmin.mutate(
        { id: selectedAdmin.id, updateDetails: { isActivated: !selectedAdmin.isActivated } },
        {
          onSuccess(data) {
            if (data.success) {
              if (selectedAdmin.isActivated) {
                notification.success({
                  message: 'Dừng hoạt động thành công!',
                  description: 'Tài khoản đã bị dừng hoạt động.',
                })
              } else {
                notification.success({
                  message: 'Kích hoạt thành công!',
                  description: 'Tài khoản đã được kích hoạt.',
                })
              }
              utils.invalidateQueries('admin.getAdminAccountList')
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

  function handleOpenConfirm(record) {
    setSelectedAdmin(record)
    setOpenConfirm(true)
  }
  const handlecloseConfirm = () => {
    setOpenConfirm(false)
  }
  const columns: ColumnsType<tableProps> = [
    {
      title: <div className="ml-3">Tên</div>,
      width: '15%',
      dataIndex: 'name',
      render(name) {
        return <div className="ml-3">{name}</div>
      },
    },
    {
      title: 'Email',
      width: '15%',
      dataIndex: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      width: '15%',
      align: 'center',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: '15%',
      align: 'center',
      render(createdAt) {
        return <div className="flex flex-col items-center">{new Date(createdAt).toLocaleDateString('en-GB')}</div>
      },
    },
    {
      title: <div className="flex items-center justify-center">Trạng thái</div>,
      key: 'isActivated',
      dataIndex: 'isActivated',
      render: (text) => (
        <div className="flex items-center justify-center">
          {text ? (
            <Tag className="px-3 py-2 m-0 text-white bg-green-500 rounded-lg">Hoạt động</Tag>
          ) : (
            <Tag className="px-3 py-2 m-0 text-white bg-red-500 rounded-lg">Tạm dừng</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Role',
      width: '15%',
      align: 'center',
      render(record) {
        return (
          <div className="flex justify-center items-center">
            {record.adminRoles?.map((item) => {
              return (
                <div key={item.id} className="mx-1 p-1 rounded-lg bg-white text-sx text-black font-bold max-w-[10rem]">
                  {item?.roleType}
                </div>
              )
            })}
          </div>
        )
      },
    },
    {
      title: '',
      width: '10%',
      align: 'center',
      render: (record) => {
        return (
          <div className="flex justify-around max-w-[10rem]">
            <Button isActive={false}>
              <Eyes
                onClick={() => {
                  openModalHandle('view', record.key)
                }}
                className="p-2 rounded-full hover:bg-gray-500"
                theme="outline"
                size="18"
                fill="#fff"
              />
            </Button>
            {record.adminRoles.some((item) => item.roleType === 'SUPER_ADMIN') ? (
              <Button isActive={false} className="pointer-events-none cursor-none">
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
            {record.adminRoles.some((item) => item.roleType === 'SUPER_ADMIN') ? (
              <Button isActive={false} className="pointer-events-none cursor-none">
                {record.isActivated ? (
                  <ReduceOne className="p-2 rounded-full opacity-40" theme="outline" size="20" fill="#fff" />
                ) : (
                  <CheckOne className="p-2 rounded-full opacity-40" theme="outline" size="20" fill="#fff" />
                )}
              </Button>
            ) : (
              <Button isActive={false} onClick={() => handleOpenConfirm(record)}>
                {record.isActivated ? (
                  <ReduceOne className="p-2 rounded-full hover:bg-gray-500" theme="outline" size="20" fill="#ff0000" />
                ) : (
                  <CheckOne className="p-2 rounded-full hover:bg-gray-500" theme="outline" size="20" fill="#85ea2d" />
                )}
              </Button>
            )}
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
  if (adminInfo?.adminRoles?.some((item) => item.roleType != 'SUPER_ADMIN')) {
    return (
      <div className="text-white w-full h-[600px] flex justify-center items-center">
        Bạn không được cấp phép vào trang web này!
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>UME | Admin Account Manager</title>
      </Head>
      <div className="pb-10">
        <div className="flex justify-between items-center">
          <span className="content-title">Quản lý quản trị viên</span>
          <Button
            isActive={false}
            customCSS="bg-[#7463f0] px-3 rounded-2xl active:bg-gray-600 py-2"
            onClick={openCreateAdminHandler}
          >
            <Plus theme="outline" size="24" fill="#fff" />
            Tạo tài khoản
          </Button>
        </div>
        <div className="flex flex-col my-10">
          <div className="flex items-center justify-between">
            <div className="flex">
              <FilterDropdown
                id={'gender'}
                CustomCss="w-[9rem]"
                title={`Giới tính: ${mappingGender[filter.gender]}`}
                items={genderFilterItems}
                handleFilter={handleFilter}
              />
              <FilterDropdown
                id={'status'}
                CustomCss="w-[12rem]"
                title={`Trạng thái: ${mappingUserStatus[filter.isActivated]}`}
                items={userStatusFilterItems}
                handleFilter={handleFilter}
              />
            </div>
            <div className="flex items-center rounded-lg bg-umeHeader border-2 border-white">
              <Search className=" active:bg-gray-700 p-2 rounded-full" theme="outline" size="24" fill="#fff" />
              <Input
                placeholder="Tìm kiếm tên quản trị viên"
                onKeyUp={handleKeyPress}
                value={searchChange}
                onChange={handleSearchChange}
                className="bg-umeHeader focus:outline-none"
                type="text"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mb-5 text-gray-500">
          {10 * (page - 1) + 1}-{page * 10 > count!! ? count : page * 10} trên {count} quản trị viên
        </div>
        <CommonTable
          locate={locale}
          columns={columns}
          data={adminList}
          loading={isLoading}
          total={count}
          page={page}
          setPage={setPage}
        />
        {selectedAdmin && (
          <ComfirmModal
            closeFunction={handlecloseConfirm}
            openValue={openConfirm}
            isComfirmFunction={handleConfirmFunction}
            titleValue={selectedAdmin.isActivated ? 'Xác nhận dừng hoạt động' : 'Xác nhận mở hoạt động'}
          >
            <div className="p-4 text-white">
              Bạn có chắc chắn muốn {!selectedAdmin.isActivated ? ' mở hoạt động ' : ' dừng hoạt động '} quản trị viên
              này?
            </div>
          </ComfirmModal>
        )}
        {idAdmin && (
          <ViewAccountModal id={idAdmin} openValue={openViewAdmin} closeFunction={closeAdminViewModalHandle} />
        )}
        {idAdmin && (
          <UpdateAccountModal id={idAdmin} openValue={openUpdateAdmin} closeFunction={closeAdminUpdateModalHandle} />
        )}
        {openCreateAdmin && <CreateAccountModal openValue={openCreateAdmin} closeFunction={closeCreateAdminHandle} />}
      </div>
    </div>
  )
}

export default UserManager
