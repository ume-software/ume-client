import { Plus } from '@icon-park/react'
import { Button, FormInput, Input } from '@ume/ui'
import emptyPic from 'public/empty_error.png'
import { uploadImageAdminAccount } from '~/api/upload-media'

import React, { useEffect, useRef, useState } from 'react'

import { Select, notification } from 'antd'
import { useFormik } from 'formik'
import Image from 'next/legacy/image'
import { AdminInformationResponse } from 'ume-service-openapi'
import * as Yup from 'yup'

import ModalBase from '~/components/modal-base'
import ComfirmModal from '~/components/modal-base/comfirm-modal'

import { trpc } from '~/utils/trpc'

interface IUpdateAdminProps {
  id: string
  closeFunction: any | undefined
  openValue: boolean
}
const mappingAdminStatus = {
  true: 'Hoạt động',
  false: 'Tạm dừng',
}
const { Option } = Select

const UpdateAccountModal = ({ id, openValue, closeFunction }: IUpdateAdminProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const utils = trpc.useContext()
  const [isCreate, setIsCreate] = useState<boolean>(false)
  const [isChanged, setIsChanged] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const updateAdminAccount = trpc.useMutation(['admin.updateAdminAccount'])
  const [adminDetails, setAdminDetails] = useState<any>()
  const SELECT = ['$all', { adminRoles: ['$all'] }]
  useEffect(() => {
    if (adminDetails) {
      form.resetForm({
        values: {
          avatarUrl: '',
          name: (adminDetails?.name as string) ?? '',
          userName: (adminDetails?.username as string) ?? '',
          dob:
            new Date(adminDetails?.dob!! || null).toISOString().split('T')[0] ?? new Date().toISOString().split('T')[0],
          gender: adminDetails?.gender ?? 'OTHER',
          phone: adminDetails?.phone ?? '',
          selectedImage: null,
          email: adminDetails?.email ?? '',
          roles: adminDetails?.adminRoles ?? ['ADMIN'],
        },
      })
    }
  }, [adminDetails])
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

  function openCancelConfirmHandle() {
    setOpenConfirm(true)
  }

  function cancelConfirmHandle() {
    setOpenConfirm(false)
    setTimeout(function () {
      setIsCreate(false)
      clearData()
      closeFunction()
    }, 50)
  }

  function closeComfirmFormHandle() {
    setIsCreate(false)
    setOpenConfirm(false)
  }

  function openConfirmModal() {
    setIsCreate(true)
    setOpenConfirm(true)
  }

  function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false
    }

    return arr1.every((value) => arr2.includes(value))
  }
  function changedObjects(data, dataChanged) {
    const changes = {}
    for (let key in data) {
      if ((data.hasOwnProperty(key) && dataChanged.hasOwnProperty(key)) || key === 'adminRoles') {
        if (key == 'dob') {
          if (new Date(data[key]).toISOString().split('T')[0] != dataChanged[key]) {
            changes[key] = new Date(dataChanged[key]).toISOString()
          }
        } else if (key === 'avatarUrl' && dataChanged[key] === '') {
        } else if (dataChanged.imageUrl != null) {
          changes['avatarUrl'] = dataChanged.imageUrl
        } else if (key === 'adminRoles') {
          const formattedRoles = formatRoleType(data[key])
          if (!arraysAreEqual(formattedRoles, dataChanged.roles)) {
            changes['roles'] = dataChanged.roles
          }
        } else if (data[key] !== dataChanged[key]) {
          changes[key] = dataChanged[key]
        }
      }
    }

    return changes
  }
  const regexPhoneNumber = /^(84|0[3|5|7|8|9])+([0-9]{8})\b$/

  const form = useFormik({
    initialValues: {
      avatarUrl: '',
      name: (adminDetails?.name as string) ?? '',
      userName: (adminDetails?.username as string) ?? '',
      dob: new Date(adminDetails?.dob!! || null).toISOString().split('T')[0] ?? new Date().toISOString().split('T')[0],
      gender: adminDetails?.gender ?? 'OTHER',
      phone: adminDetails?.phone ?? '',
      selectedImage: null,
      email: adminDetails?.email ?? '',
      roles: formatRoleType(adminDetails?.adminRoles) ?? ['ADMIN'],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Tên là bắt buộc'),
      userName: Yup.string().required('Tên đăng nhập là bắt buộc'),
      roles: Yup.array().of(Yup.string().required('Vai trò là bắt buộc')).required('Vai trò là bắt buộc'),
      phone: Yup.string().matches(regexPhoneNumber, 'Số điện thoại không hợp lệ'),
    }),
    onSubmit: () => {
      openConfirmModal()
    },
  })

  const uploadImage = async () => {
    let imageUrl = ''
    try {
      if (form.values.selectedImage) {
        const formData = new FormData()
        formData.append('image', form.values.selectedImage)
        const responseData = await uploadImageAdminAccount(formData)
        if (responseData?.data?.data?.results) {
          responseData?.data?.data?.results.map((image) => {
            imageUrl = image
          })
        }
      }
    } catch (error) {
      notification.error({
        message: 'Cập nhật thất bại!',
        description: 'Lưu ảnh tài khoản không thành công.',
      })
      console.error('Error uploading image:', error)
    }
    return { imageUrl }
  }

  async function submitHandle() {
    const imgURL = await uploadImage()
    try {
      const updateDetails = changedObjects(adminDetails, form.values)
      updateAdminAccount.mutate(
        { id, updateDetails },
        {
          onSuccess: (data) => {
            if (data.success) {
              notification.success({
                message: 'Cập nhật thành công!',
                description: 'Tài khoản đã được cập nhật thành công.',
              })
              cancelConfirmHandle()
            }
          },
          onError: () => {
            notification.error({
              message: 'Cập nhật thất bại!',
              description: 'Cập nhật tài khoản không thành công.',
            })
          },
        },
      )
      utils.invalidateQueries('admin.getAdminAccountList')
    } catch (error) {
      console.error('Failed to patch voucher:', error)
    }
  }

  function clearData() {
    form.resetForm()
  }

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        form.setFieldValue('selectedImage', file)
        form.setFieldValue('avatarUrl', URL.createObjectURL(file))
      }
      reader.readAsDataURL(file)
    }
  }
  const handleImageClick = () => {
    if (imageInputRef) {
      imageInputRef.current?.click()
    }
  }

  function handleChangeGender(gender) {
    form.setFieldValue('gender', gender)
  }
  function handleChangeRole(role) {
    form.setFieldValue('roles', role)
  }

  function isDisableButton() {
    return !form.dirty || !form.isValid
  }

  function formatRoleType(roles) {
    return roles ? roles.map((item) => item.roleType) : []
  }

  return (
    <ModalBase
      width={'50%'}
      titleValue="Cập nhật tài khoản quản trị viên"
      openValue={openValue}
      closeFunction={openCancelConfirmHandle}
      className="w-auto bg-black"
    >
      <div className="m-7">
        <form autoComplete="off" onSubmit={form.handleSubmit} className="grid grid-cols-5 text-white">
          <div className="col-span-2">
            <div
              className={`
                w-36 h-52 overflow-hidden rounded-2xl bg-[#413F4D]
                ${
                  !form.values.avatarUrl &&
                  ' flex items-center justify-center border-dashed border-2 border-[#FFFFFF80]'
                }
                `}
              onClick={handleImageClick}
            >
              {form.values.avatarUrl && (
                <Image
                  className="overflow-hidden rounded-2xl"
                  width={144}
                  height={208}
                  src={form.values.avatarUrl || emptyPic}
                  alt=""
                  objectFit="cover"
                />
              )}
              {!form.values.avatarUrl && (
                <div className="flex items-center justify-center w-full h-full hover:scale-150">
                  {adminDetails && (
                    <Image src={adminDetails.avatarUrl || emptyPic} width={144} height={208} alt="" objectFit="cover" />
                  )}

                  {/* <Plus className="" theme="filled" size="24" fill="#ffffff" /> */}
                </div>
              )}
              <input
                className="w-0 opacity-0"
                type="file"
                name="files"
                accept="image/*"
                ref={imageInputRef}
                onChange={(e) => handleMediaChange(e)}
                multiple
              />
            </div>
          </div>
          <div className="col-span-3">
            <div className="grid grid-cols-6 mb-3">
              <label className="flex items-center col-span-2" htmlFor="name">
                *Họ và tên
              </label>
              <FormInput
                name="name"
                placeholder={form.errors.name ? form.errors.name : 'Nguyễn Văn An'}
                onBlur={form.handleBlur}
                value={form.values.name}
                error={!!form.errors.name && form.touched.name}
                errorMessage={''}
                onChange={form.handleChange}
                disabled={false}
                className={`bg-[#413F4D] border-2 col-span-4 border-[#FFFFFF] w-[80%] ml-2 h-8  border-opacity-30 ${
                  form.errors.name && form.touched.name ? 'placeholder:text-red-500' : ''
                }`}
              />
            </div>
            <div className="grid grid-cols-6 mb-3">
              <label className="flex items-center col-span-2" htmlFor="userName">
                *Tên đăng nhập
              </label>
              <FormInput
                name="userName"
                placeholder={form.errors.userName ? form.errors.userName : 'adminAnNV'}
                onBlur={form.handleBlur}
                value={form.values.userName}
                error={!!form.errors.userName && form.touched.userName}
                errorMessage={''}
                onChange={form.handleChange}
                disabled={false}
                className={`bg-[#413F4D] border-2 col-span-4 border-[#FFFFFF] w-[80%] ml-2 h-8  border-opacity-30 ${
                  form.errors.userName && form.touched.userName ? 'placeholder:text-red-500' : ''
                }`}
              />
            </div>
            <div className="grid grid-cols-6 mb-3">
              <label className="flex items-center col-span-2" htmlFor="gender">
                *Giới tính
              </label>
              <Select
                placeholder="Chọn giới tính"
                defaultValue={form.values.gender}
                value={form.values.gender}
                onChange={handleChangeGender}
                optionLabelProp="label"
                style={{
                  minWidth: '8rem',
                  marginLeft: '0.45rem',
                }}
                options={[
                  {
                    value: 'MALE',
                    label: 'Nam',
                  },
                  {
                    value: 'FEMALE',
                    label: 'Nữ',
                  },
                  {
                    value: 'OTHER',
                    label: 'Khác',
                  },
                  {
                    value: 'PRIVATE',
                    label: 'Ẩn',
                  },
                ]}
              ></Select>
            </div>
            <div className="grid grid-cols-6 mb-3">
              <label className="flex items-center col-span-2" htmlFor="roles">
                *Role
              </label>
              <Select
                placeholder="Chọn role"
                defaultValue={form.values.roles}
                value={form.values.roles}
                onChange={handleChangeRole}
                optionLabelProp="label"
                style={{
                  minWidth: '10rem',
                  marginLeft: '0.45rem',
                }}
                options={[
                  // {
                  //   value: 'SUPER_ADMIN',
                  //   label: 'Super Admin',
                  // },
                  {
                    value: 'ADMIN',
                    label: 'Admin',
                  },
                ]}
              ></Select>
            </div>
            <div className="grid grid-cols-6 mb-3">
              <label className="flex items-center col-span-2" htmlFor="dob">
                Ngày sinh
              </label>
              <Input
                type="date"
                name="dob"
                pattern="\d{2}/\d{2}/\d{4}"
                onBlur={form.handleBlur}
                value={form.values.dob}
                onChange={form.handleChange}
                max={new Date().toISOString().split('T')[0]}
                disabled={false}
                className={`bg-[#413F4D] border-2 col-span-4 border-[#FFFFFF] w-[50%] ml-2 h-8  border-opacity-30`}
              />
            </div>
            <div className="grid grid-cols-6 mb-3">
              <label className="flex items-center col-span-2" htmlFor="email">
                Email
              </label>
              <Input
                name="email"
                type="email"
                placeholder={'annv@gmail.com'}
                onBlur={form.handleBlur}
                value={form.values.email}
                onChange={form.handleChange}
                disabled={false}
                className={`bg-[#413F4D] border-2 col-span-4 border-[#FFFFFF] w-[80%] ml-2 h-8  border-opacity-30`}
              />
            </div>
            <div className="grid grid-cols-6 mb-3">
              <label className="flex items-center col-span-2" htmlFor="phone">
                Số điện thoại
              </label>
              <FormInput
                name="phone"
                placeholder={'0912345678'}
                onBlur={form.handleBlur}
                value={form.values.phone}
                error={!!form.errors.phone}
                errorMessage={''}
                onChange={form.handleChange}
                disabled={false}
                className={`bg-[#413F4D] border-2 col-span-4 border-[#FFFFFF] w-[80%] ml-2 h-8  border-opacity-30 ${
                  form.errors.phone && form.touched.phone ? 'placeholder:text-red-500' : ''
                }`}
              />
            </div>
          </div>
          <div className="flex justify-center col-span-5 pb-4 mt-10">
            <Button
              customCSS={`mx-6 px-4 py-1 border-2  ${
                !isDisableButton() && 'hover:scale-110 bg-[#7463F0] border-[#7463F0]'
              }`}
              onClick={(e) => {
                if (updateAdminAccount.isLoading) {
                  return
                } else {
                  e.preventDefault()
                  openConfirmModal()
                }
              }}
              isDisable={isDisableButton()}
            >
              Cập nhật
            </Button>
          </div>
        </form>
      </div>
      {openConfirm && (
        <ComfirmModal
          closeFunction={closeComfirmFormHandle}
          openValue={openConfirm}
          isComfirmFunction={isCreate ? submitHandle : cancelConfirmHandle}
          titleValue={isCreate ? 'Xác nhận Cập nhật' : 'Xác nhận hủy'}
        ></ComfirmModal>
      )}
    </ModalBase>
  )
}

export default UpdateAccountModal
