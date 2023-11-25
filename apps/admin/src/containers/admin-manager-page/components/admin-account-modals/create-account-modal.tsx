import { Plus } from '@icon-park/react'
import { Button, FormInput, Input } from '@ume/ui'
import { uploadImageAdminAccount, uploadImageVoucher } from '~/api/upload-media'

import { useRef, useState } from 'react'

import { Select, Space, notification } from 'antd'
import { useFormik } from 'formik'
import Image from 'next/legacy/image'
import * as Yup from 'yup'

import ModalBase from '~/components/modal-base'
import ComfirmModal from '~/components/modal-base/comfirm-modal'

import { trpc } from '~/utils/trpc'

interface ICreateAdminProps {
  closeFunction: any | undefined
  openValue: boolean
}
const { Option } = Select

const CreateAccountModal = ({ openValue, closeFunction }: ICreateAdminProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const utils = trpc.useContext()
  const [openConfirm, setOpenConfirm] = useState(false)
  const [isCreate, setIsCreate] = useState<boolean>(false)
  const createAdminAccount = trpc.useMutation(['admin.createAdminAccount'])
  const form = useFormik({
    initialValues: {
      avatarUrl: '',
      name: '',
      userName: '',
      dob: new Date().toISOString().split('T')[0],
      gender: 'OTHER',
      phone: '',
      selectedImage: null,
      email: '',
      password: '',
      roles: ['ADMIN'],
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Tên là bắt buộc'),
      userName: Yup.string().required('Tên đăng nhập là bắt buộc'),
      password: Yup.string().required('Mật khẩu là bắt buộc'),
      gender: Yup.string().required('Giới tính là bắt buộc'),
    }),
    onSubmit: (values, { resetForm }) => {
      openConfirmModal()
      resetForm()
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
        message: 'Tạo thất bại!',
        description: 'Lưu ảnh tài khoản không thành công.',
      })
      console.error('Error uploading image:', error)
    }
    return { imageUrl }
  }

  async function submitHandle() {
    const imgURL = await uploadImage()
    try {
      const input = {
        name: form.values.name,
        dob: new Date(form.values.dob).toISOString(),
        gender: form.values.gender,
        avatarUrl: imgURL.imageUrl,
        email: form.values.email,
        phone: form.values.phone,
        username: form.values.userName,
        password: form.values.password,
        roles: form.values.roles,
      }
      createAdminAccount.mutate(input, {
        onSuccess: (data) => {
          if (data.success) {
            notification.success({
              message: 'Tạo thành công!',
              description: 'Tài khoản đã được tạo thành công.',
            })
            closeHandle()
          }
        },
        onError: () => {
          notification.error({
            message: 'Tạo thất bại!',
            description: 'Tạo tài khoản không thành công.',
          })
        },
      })
      utils.invalidateQueries('admin.getAdminAccountList')
    } catch (error) {
      console.error('Failed to post voucher:', error)
    }
  }

  function clearData() {
    form.resetForm()
  }
  function closeComfirmFormHandle() {
    setOpenConfirm(false)
    setIsCreate(false)
  }
  function closeHandle() {
    setOpenConfirm(false)
    clearData()
    closeFunction()
  }
  function openConfirmModalCancel() {
    setOpenConfirm(true)
  }
  function openConfirmModal() {
    setIsCreate(true)
    setOpenConfirm(true)
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
    return !form.isValid || form.values.name == ''
  }
  function closeHandleSmall() {
    openConfirmModalCancel()
  }

  return (
    <ModalBase
      width={'60%'}
      titleValue="Tạo tài khoản quản trị viên"
      openValue={openValue}
      closeFunction={closeHandleSmall}
      className="w-auto bg-black"
    >
      <div className="m-7">
        <form autoComplete="off" onSubmit={form.handleSubmit} className="text-white grid grid-cols-5">
          <div className="col-span-2 ">
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
                  src={form.values.avatarUrl}
                  alt=""
                  objectFit="cover"
                />
              )}
              {!form.values.avatarUrl && (
                <div className="flex items-center justify-center w-full h-full hover:scale-150">
                  <Plus className="" theme="filled" size="24" fill="#ffffff" />
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
              <label className="col-span-2 flex items-center" htmlFor="name">
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
              <label className="col-span-2 flex items-center" htmlFor="userName">
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
              <label className="col-span-2 flex items-center" htmlFor="password">
                *Mật khẩu
              </label>
              <FormInput
                name="password"
                type="password"
                placeholder={form.errors.password ? form.errors.password : '*******'}
                onBlur={form.handleBlur}
                value={form.values.password}
                error={!!form.errors.password && form.touched.password}
                errorMessage={''}
                onChange={form.handleChange}
                disabled={false}
                className={`bg-[#413F4D] border-2 col-span-4 border-[#FFFFFF] w-[80%] ml-2 h-8  border-opacity-30 ${
                  form.errors.password && form.touched.password ? 'placeholder:text-red-500' : ''
                }`}
              />
            </div>
            <div className="grid grid-cols-6 mb-3">
              <label className="col-span-2 flex items-center" htmlFor="gender">
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
              <label className="col-span-2 flex items-center" htmlFor="roles">
                Role
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
                  {
                    value: 'ADMIN',
                    label: 'Admin',
                  },
                ]}
              ></Select>
            </div>
            <div className="grid grid-cols-6 mb-3">
              <label className="col-span-2 flex items-center" htmlFor="dob">
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
              <label className="col-span-2 flex items-center" htmlFor="email">
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
              <label className="col-span-2 flex items-center" htmlFor="phone">
                Số điện thoại
              </label>
              <Input
                name="phone"
                placeholder={'0912345678'}
                onBlur={form.handleBlur}
                value={form.values.phone}
                onChange={form.handleChange}
                disabled={false}
                className={`bg-[#413F4D] border-2 col-span-4 border-[#FFFFFF] w-[80%] ml-2 h-8  border-opacity-30`}
              />
            </div>
          </div>
          <div className="col-span-5 flex justify-center pb-4 mt-10">
            <Button
              customCSS={`mx-6 px-4 py-1 border-2  ${
                !isDisableButton() && 'hover:scale-110 bg-[#7463F0] border-[#7463F0]'
              }`}
              onClick={(e) => {
                openConfirmModal()
              }}
              isDisable={isDisableButton()}
            >
              Tạo
            </Button>
          </div>
        </form>
      </div>
      {openConfirm && (
        <ComfirmModal
          closeFunction={closeComfirmFormHandle}
          openValue={true}
          isComfirmFunction={isCreate ? submitHandle : closeHandle}
          titleValue={isCreate ? 'Xác nhận Tạo' : 'Xác nhận hủy'}
        ></ComfirmModal>
      )}
    </ModalBase>
  )
}

export default CreateAccountModal
