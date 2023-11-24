import emptyPic from 'public/empty_error.png'

import React, { useState } from 'react'

import Image from 'next/legacy/image'
import { AdminInformationResponse } from 'ume-service-openapi'

import { mappingGender } from '~/components/filter-items'
import ModalBase from '~/components/modal-base'

import { trpc } from '~/utils/trpc'

interface IViewAdminProps {
  id: string
  closeFunction: any | undefined
  openValue: boolean
}
const mappingAdminStatus = {
  true: 'Hoạt động',
  false: 'Tạm dừng',
}
const ViewAccountModal = ({ id, openValue, closeFunction }: IViewAdminProps) => {
  const [adminDetails, setAdminDetails] = useState<any>()
  const SELECT = ['$all', { adminRoles: ['$all'] }]
  trpc.useQuery(
    [
      'admin.getAdminAccountDetails',
      {
        id: id,
        select: JSON.stringify(SELECT),
      },
    ],
    {
      onSuccess(data) {
        setAdminDetails(data?.data as any)
      },
    },
  )
  return (
    <ModalBase
      width={'60%'}
      titleValue="Chi tiết tài khoản quản trị viên"
      openValue={openValue}
      closeFunction={closeFunction}
      className="w-auto bg-black"
    >
      {adminDetails && (
        <div className="m-4 grid grid-cols-6 gap-2 text-white">
          <div className="col-span-2 flex justify-center">
            <Image
              className="rounded-lg"
              src={adminDetails.avatarUrl || emptyPic}
              objectFit="cover"
              width={144}
              height={208}
              alt="avatar"
            />
          </div>
          <div className="col-span-2 mt-5">
            <p className="my-2">
              <span className="font-bold">Tên: </span> {adminDetails.name}
            </p>
            <p className="my-2">
              <span className="font-bold">Ngày sinh: </span> {new Date(adminDetails.dob).toLocaleDateString('en-GB')}
            </p>
            <p className="my-2">
              <span className="font-bold">Giới tính: </span> {mappingGender[adminDetails.gender]}
            </p>
            <p className="my-2">
              <span className="font-bold">Email: </span> {adminDetails.email}
            </p>
          </div>
          <div className="col-span-2 mt-5">
            <p className="my-2">
              <span className="font-bold">Trạng thái: </span> {mappingAdminStatus[adminDetails.isActivated]}
            </p>
            <p className="my-2">
              <span className="font-bold">Roles: </span>{' '}
              {adminDetails.adminRoles?.map((item) => {
                if (adminDetails.adminRoles.length > 1) {
                  return (
                    <span className="p-1 rounded-lg bg-white text-black mx-1 font-bold" key={item.id}>
                      {item.roleType}{' '}
                    </span>
                  )
                } else return <span key={item.id}>{item.roleType} </span>
              })}
            </p>
            <p className="my-2">
              <span className="font-bold">Ngày tạo: </span>{' '}
              {new Date(adminDetails.createdAt).toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>
      )}
    </ModalBase>
  )
}

export default ViewAccountModal
