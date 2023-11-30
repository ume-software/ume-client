import { Plus, Search } from '@icon-park/react'
import { Button, Input } from '@ume/ui'

import React, { useState } from 'react'

import { notification } from 'antd'
import Head from 'next/head'
import { PrismaWhereConditionType, prismaWhereConditionToJsonString } from 'query-string-prisma-ume'

import { trpc } from '~/utils/trpc'

const BannerManagerContainer = () => {
  const [banners, setBanners] = useState<any | undefined>()
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)

  const mappingListWithKeys = (data) => {
    const transactionsWithKeys = data.row.map((item) => ({
      ...item,
      key: item.id,
    }))
    setCount(data.count)
    setBanners(transactionsWithKeys)
  }

  const listQuerry: PrismaWhereConditionType<any> = Object.assign({})
  const LIMIT = '10'
  const ORDER = [{ createdAt: 'asc' }]
  const SELECT = ['$all']
  const { isLoading } = trpc.useQuery(
    [
      'banner.getBannerList',
      {
        limit: LIMIT,
        page: page.toString(),
        where: prismaWhereConditionToJsonString(listQuerry, ['isUndefined']),
        order: JSON.stringify(ORDER),
        select: JSON.stringify(SELECT),
      },
    ],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      onSuccess(data) {
        mappingListWithKeys(data?.data as any)
      },
      onError(error: any) {
        notification.error({
          message: 'Lỗi khi lấy data',
          description: error.message,
        })
      },
    },
  )

  console.log(banners)

  return (
    <div>
      <Head>
        <title>UME | Banner Manager</title>
      </Head>
      <div className="pb-10">
        <div className="flex justify-between items-center">
          <span className="content-title">Quản lý banner</span>
          <Button customCSS="bg-[#7463f0] px-3 rounded-2xl active:bg-gray-600 py-2" onClick={() => {}}>
            <Plus theme="outline" size="24" fill="#fff" />
            Tạo banner
          </Button>
        </div>

        <div className="flex justify-end my-5 text-gray-500">
          {10 * (page - 1) + 1}-{page * 10 > count!! ? count : page * 10} trên {count} banner
        </div>
        {/* <CommonTable
          locate={locale}
          columns={columns}
          data={adminList}
          loading={isLoading}
          total={count}
          page={page}
          setPage={setPage}
        /> */}
        {/* {selectedAdmin && (
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
        )} */}
        {/* {idAdmin && (
          <ViewAccountModal id={idAdmin} openValue={openViewAdmin} closeFunction={closeAdminViewModalHandle} />
        )}
        {idAdmin && (
          <UpdateAccountModal id={idAdmin} openValue={openUpdateAdmin} closeFunction={closeAdminUpdateModalHandle} />
        )}
        {openCreateAdmin && <CreateAccountModal openValue={openCreateAdmin} closeFunction={closeCreateAdminHandle} />} */}
      </div>
    </div>
  )
}

export default BannerManagerContainer
