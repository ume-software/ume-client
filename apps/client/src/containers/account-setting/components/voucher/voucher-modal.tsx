import { CloseSmall, Plus } from '@icon-park/react'
import { Button, FormInput, Input, Modal, TextArea } from '@ume/ui'
import { uploadImageBooking } from '~/apis/upload-media'
import { VoucherRecipientType, VoucherType } from '~/enumVariable/enumVariable'

import * as React from 'react'
import { useRef, useState } from 'react'

import { Select, Space, notification } from 'antd'
import { FormikErrors, useFormik } from 'formik'
import { values } from 'lodash'
import Image from 'next/legacy/image'
import {
  CreateVoucherRequestDiscountUnitEnum,
  CreateVoucherRequestRecipientTypeEnum,
  CreateVoucherRequestTypeEnum,
} from 'ume-service-openapi'
import * as Yup from 'yup'

import MenuForVoucher from './menu-voucher'

import ConfirmForm from '~/components/confirm-form/confirmForm'

import { trpc } from '~/utils/trpc'

const { Option } = Select

interface IVourcherModalCreateProps {
  closeFunction: any
  openValue: boolean
}
interface IFormValues {
  vourcherCode: string
  imageSource: string
  description: string
  numVoucher: number
  numVoucherInDay: number
  minimize: number
  endDate: string
  applyTime: Array<any>
  name: string
  typeVoucher: any
  discountUnit: any
  audience: any
  content: string // chua co trong API
  selectedImage: any
  status: any
  numUserCanUse: number
  numUserCanUseInDay: number
}
interface IEnumType {
  key: string
  label: string
}

const mappingRecipientType: IEnumType[] = [
  { key: VoucherRecipientType.ALL, label: 'Tất cả' },
  { key: VoucherRecipientType.FIRST_TIME_BOOKING, label: 'Người lần đầu thuê' },
  { key: VoucherRecipientType.PREVIOUS_BOOKING, label: ' Người đã từng thuê' },
  { key: VoucherRecipientType.SELECTIVE_BOOKER, label: ' Top 5 người thuê' },
  { key: VoucherRecipientType.TOP_10_BOOKER, label: ' Top 10 người thuê' },
  { key: VoucherRecipientType.TOP_5_BOOKER, label: 'Người đặt chọn' },
]

const voucherType: IEnumType[] = [
  { key: VoucherType.DISCOUNT, label: 'Giảm giá' },
  { key: VoucherType.CASHBACK, label: 'Hoàn tiền' },
]

export default function VourcherModalCreate({ closeFunction, openValue }: IVourcherModalCreateProps) {
  const issuer = 'ADMIN'
  const today = new Date().toISOString().split('T')[0]
  const [isSubmiting, setSubmiting] = useState(false)

  const form = useFormik({
    initialValues: {
      vourcherCode: '',
      imageSource: '',
      description: '',
      numVoucher: 0,
      numVoucherInDay: 0,
      minimize: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      applyTime: [],
      name: '',
      typeVoucher: voucherType[0].key,
      discountUnit: CreateVoucherRequestDiscountUnitEnum.Percent,
      audience: mappingRecipientType[0],
      content: '',
      selectedImage: null,
      status: undefined,
      numUserCanUse: 0,
      numUserCanUseInDay: 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name là bắt buộc'),
      typeVoucher: Yup.string().required('Loại là bắt buộc'),
      discountUnit: Yup.string().required('discountUnit là bắt buộc'),
      audience: Yup.string().required('Đối tượng là bắt buộc'),
    }),
    onSubmit: (values, { resetForm }) => {
      setSubmiting(true)
      openConfirmModal()
      resetForm()
    },
  })

  const imageInputRef = useRef<HTMLInputElement>(null)
  const [isModalConfirmationVisible, setIsModalConfirmationVisible] = useState(false)
  const providerCreateVoucher = trpc.useMutation(['identity.providerCreateVoucher'])

  const checkFieldRequỉed =
    form.values.name && form.values.typeVoucher && form.values.discountUnit && form.values.audience

  function clearData() {
    form.resetForm()
  }
  function closeHandle() {
    setIsModalConfirmationVisible(false)
    clearData()
    closeFunction()
  }
  const handleMediaChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        form.setFieldValue('selectedImage', file)
        form.setFieldValue('imageSource', URL.createObjectURL(file))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    if (imageInputRef) {
      imageInputRef.current?.click()
    }
  }

  const handleChangeApplyDay = (dayText) => {
    form.setFieldValue('applyTime', dayText)
  }
  function handleTypeVoucher(value: IEnumType) {
    form.setFieldValue('typeVoucher', value)
  }
  function filterOptionTypeVoucher(input, option) {
    return (option?.label ?? '').toUpperCase().includes(input.toUpperCase())
  }

  function handleRecipientType(value) {
    form.setFieldValue('audience', value)
  }

  function filterOptionRecipientType(input, option) {
    return (option?.label ?? '').toUpperCase().includes(input.toUpperCase())
  }

  function handleDisCountUnit(value) {
    form.setFieldValue('discountUnit', value)
  }

  function filterOptionDisCountUnit(input, option) {
    return (option?.label ?? '').toUpperCase().includes(input.toUpperCase())
  }

  function openConfirmModalCancel() {
    setIsModalConfirmationVisible(true)
  }
  function openConfirmModal() {
    setIsModalConfirmationVisible(true)
  }

  const handleClose = () => {
    setIsModalConfirmationVisible(false)
  }

  const confirmModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    show: isModalConfirmationVisible,
    form: (
      <>
        <ConfirmForm
          title="Thay đổi thông tin cá nhân"
          description="Bạn có chấp nhận thay đổi thông tin cá nhân hay không?"
          onClose={handleClose}
          onOk={() => {}}
        />
      </>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <>
        <CloseSmall
          onClick={handleClose}
          onKeyDown={(e) => e.key === 'Enter' && handleClose()}
          tabIndex={1}
          className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
          theme="outline"
          size="24"
          fill="#FFFFFF"
        />
      </>
    ),
  })

  async function submitHandle() {
    if (await checkFieldRequỉed()) {
      const imgURL = await uploadImage()
      try {
        const req = {
          code: form.values.vourcherCode,
          image: imgURL.imageUrl,
          // content: form.values.content,
          description: form.values.description,
          numberIssued: form.values.numVoucher,
          dailyNumberIssued: form.values.numVoucherInDay,
          numberUsablePerBooker: form.values.numUserCanUse,
          dailyUsageLimitPerBooker: form.values.numUserCanUseInDay,
          maximumDiscountValue: form.values.minimize,
          startDate: new Date(createAt).toISOString(),
          endDate: new Date(form.values.endDate).toISOString(),
          applyISODayOfWeek: form.values.applyTime,
        }
        let reqWithValuesNotNull = {
          name: form.values.name,
          type: form.values.typeVoucher,
          discountUnit: form.values.discountUnit,
          recipientType: form.values.audience,
          isHided: true,
        }
        for (let key in req) {
          if (req[key]) {
            reqWithValuesNotNull[key] = req[key]
          }
        }
        console.log(reqWithValuesNotNull)

        providerCreateVoucher.mutate(reqWithValuesNotNull, {
          onSuccess: (data) => {
            if (data.success) {
              notification.success({
                message: 'Tạo thành công!',
                description: 'đã được tạo thành công.',
                placement: 'bottomLeft',
              })
            } else {
              notification.error({
                message: 'Tạo thất bại!',
                description: 'Tạo không thành công.',
                placement: 'bottomLeft',
              })
            }
          },
        })
      } catch (error) {
        console.error('Failed to post voucher:', error)
      }
    }
    closeHandle()
  }
  function closeHandleSmall() {
    openConfirmModalCancel()
  }

  const uploadImage = async () => {
    let imageUrl = ''
    try {
      if (form.values.selectedImage) {
        const formData = new FormData()
        formData.append('image', form.values.selectedImage)
        const responseData = await uploadImageBooking(formData)
        if (responseData?.data?.data?.results) {
          responseData?.data?.data?.results.map((image) => {
            imageUrl = image
          })
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    }
    return { imageUrl }
  }

  return (
    <>
      <form onSubmit={form.handleSubmit} className="min-w-[1250px] flex flex-col mb-4 gap-y-4">
        <div className="flex-col w-auto bg-[#15151B] mt-5 px-4">
          <div className="flex w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
            <div className="w-1/5 pr-4 mt-10">
              <div
                className={`
                w-36 h-52 overflow-hidden rounded-2xl bg-[#413F4D]
                ${
                  !form.values.imageSource &&
                  ' flex items-center justify-center border-dashed border-2 border-[#FFFFFF80]'
                }
                `}
                onClick={handleImageClick}
              >
                {form.values.imageSource && (
                  <Image
                    className="overflow-hidden rounded-2xl"
                    width={144}
                    height={208}
                    src={form.values.imageSource}
                    alt=""
                    objectFit="cover"
                  />
                )}
                {!form.values.imageSource && (
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
            <div className="flex flex-col justify-end w-2/5 ">
              <div className="w-full h-12 text-white">
                Tên:
                <div className="inline-block w-2/3 ">
                  <FormInput
                    name="name"
                    className={`bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30 ${
                      form.errors.name && form.touched.name ? 'placeholder:text-red-500' : ''
                    }`}
                    placeholder={!!form.errors.name && form.touched.name ? form.errors.name : 'Nhập Tên '}
                    disabled={false}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    value={form.values.name}
                    error={!!form.errors.name && form.touched.name}
                    errorMessage={''}
                  />
                </div>
              </div>
              <div className="h-12 text-white">
                Mã:
                <div className="inline-block w-2/3 ">
                  <FormInput
                    name="vourcherCode"
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30"
                    placeholder="Mã: SUPPERSALE"
                    disabled={false}
                    onChange={(e) => {
                      e.target.value = e.target.value.toUpperCase()
                      form.handleChange(e)
                    }}
                    onBlur={form.handleBlur}
                    value={form.values.vourcherCode}
                    error={!!form.errors.vourcherCode && form.touched.vourcherCode}
                    errorMessage={form.errors.vourcherCode}
                    type="text"
                  />
                </div>
              </div>
              <div className="h-12 text-white">
                Người phát hành: <span className="font-bold">{issuer}</span>
              </div>
            </div>
            <div className="flex flex-col justify-end w-2/5 ">
              <div className="h-12 text-white">
                Ngày phát hành:
                <div className="inline-block w-1/3 ">
                  <FormInput
                    name="startDate"
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30"
                    type="date"
                    pattern="\d{2}/\d{2}/\d{4}"
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    value={form.values.startDate}
                    error={!!form.errors.startDate && form.touched.startDate}
                    errorMessage={form.errors.startDate}
                    min={today}
                    required
                  />
                </div>
              </div>
              <div className="h-12 text-white">
                Ngày kết thúc:
                <div className="inline-block w-1/3 ">
                  <FormInput
                    name="endDate"
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30"
                    type="date"
                    pattern="\d{2}/\d{2}/\d{4}"
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    value={form.values.endDate}
                    error={!!form.errors.endDate && form.touched.endDate}
                    errorMessage={form.errors.endDate}
                    min={form.values.startDate}
                    required
                  />
                </div>
              </div>
              <div className="h-12 text-white">
                {form.values.status && 'Trạng thái: <span className="font-bold">{status}</span>'}
              </div>
            </div>
          </div>

          <div className="flex w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
            <div className="flex flex-col justify-end w-3/5 mt-5">
              <div className="h-12 text-white">
                Số lượng phát hành:
                <div className="inline-block w-1/5 ">
                  <FormInput
                    name="numVoucher"
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30"
                    placeholder="Số Lượng"
                    onBlur={form.handleBlur}
                    value={form.values.numVoucher}
                    error={!!form.errors.numVoucher && form.touched.numVoucher}
                    errorMessage={form.errors.numVoucher}
                    disabled={false}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      if (!isNaN(newValue) && newValue >= 0) {
                        e.target.value = newValue.toString()
                      } else {
                        e.target.value = '0'
                      }
                      form.handleChange(e)
                    }}
                    type="number"
                    min={0}
                    max={100000}
                  />
                </div>
              </div>

              <div className="h-12 text-white">
                Số lượng tối đa một người có thể dùng:
                <div className="inline-block w-1/5 ">
                  <FormInput
                    name="numUserCanUse"
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30"
                    placeholder="Số Lượng"
                    value={form.values.numUserCanUse}
                    onBlur={form.handleBlur}
                    error={!!form.errors.numUserCanUse && form.touched.numUserCanUse}
                    errorMessage={form.errors.numUserCanUse}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      if (!isNaN(newValue) && newValue >= 0) {
                        e.target.value = newValue.toString()
                      } else {
                        e.target.value = '0'
                      }
                      form.handleChange(e)
                    }}
                    type="number"
                    min={0}
                    max={100000}
                  />
                </div>
              </div>
              <div className="flex items-center gap-5 text-white">
                Loại:
                <MenuForVoucher
                  buttonTitle={voucherType.find((item) => item.key == form.values.typeVoucher)?.label}
                  buttonCustomCss="min-w-[100px] bg-gray-700"
                  datas={voucherType}
                  chooseData={voucherType.filter((item) => item.key == form.values.typeVoucher)}
                  onChange={(e) => handleTypeVoucher(e.key)}
                />
              </div>
              <div className="h-12 text-white">
                Thời gian áp dụng trong tuần:
                <Select
                  mode="multiple"
                  placeholder="Chọn ngày"
                  defaultValue={form.values.applyTime}
                  onChange={handleChangeApplyDay}
                  optionLabelProp="label"
                  style={{
                    minWidth: '8rem',
                    marginLeft: '1rem',
                  }}
                >
                  <Option value={1} label="T2">
                    <Space>
                      <span role="img" aria-label="T2">
                        T2
                      </span>
                      Thứ 2
                    </Space>
                  </Option>
                  <Option value={2} label="T3">
                    <Space>
                      <span role="img" aria-label="T3">
                        T3
                      </span>
                      Thứ 3
                    </Space>
                  </Option>
                  <Option value={3} label="T4">
                    <Space>
                      <span role="img" aria-label="T4">
                        T4
                      </span>
                      Thứ 4
                    </Space>
                  </Option>
                  <Option value={4} label="T5">
                    <Space>
                      <span role="img" aria-label="T5">
                        T5
                      </span>
                      Thứ 5
                    </Space>
                  </Option>
                  <Option value={5} label="T6">
                    <Space>
                      <span role="img" aria-label="T6">
                        T6
                      </span>
                      Thứ 6
                    </Space>
                  </Option>
                  <Option value={6} label="T7">
                    <Space>
                      <span role="img" aria-label="T7">
                        T7
                      </span>
                      Thứ 7
                    </Space>
                  </Option>
                  <Option value={7} label="CN">
                    <Space>
                      <span role="img" aria-label="CN">
                        CN
                      </span>
                      Chủ Nhật
                    </Space>
                  </Option>
                </Select>
              </div>
            </div>
            <div className="flex flex-col justify-end w-2/5 ">
              <div className="h-12 text-white">
                Số lượng phát hành mỗi ngày:
                <div className="inline-block w-1/3 ">
                  <FormInput
                    name="numVoucherInDay"
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30"
                    placeholder="Số Lượng"
                    value={form.values.numVoucherInDay}
                    onBlur={form.handleBlur}
                    error={!!form.errors.numVoucherInDay && form.touched.numVoucherInDay}
                    errorMessage={form.errors.numVoucherInDay}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      if (!isNaN(newValue) && newValue >= 0) {
                        e.target.value = newValue.toString()
                      } else {
                        e.target.value = '0'
                      }
                      form.handleChange(e)
                    }}
                    type="number"
                    min={0}
                    max={100000}
                  />
                </div>
              </div>
              <div className="h-12 text-white">
                Số lượng tối đa người dùng trong ngày:
                <div className="inline-block w-1/3 ">
                  <FormInput
                    name="numUserCanUseInDay"
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30"
                    placeholder="Số Lượng"
                    value={form.values.numUserCanUseInDay}
                    onBlur={form.handleBlur}
                    error={!!form.errors.numUserCanUseInDay && form.touched.numUserCanUseInDay}
                    errorMessage={form.errors.numUserCanUseInDay}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      if (!isNaN(newValue) && newValue >= 0) {
                        e.target.value = newValue.toString()
                      } else {
                        e.target.value = '0'
                      }
                      form.handleChange(e)
                    }}
                    type="number"
                    min={0}
                    max={100000}
                  />
                </div>
              </div>
              <div className="h-12 text-white">
                Giảm tối đa:
                <div className="inline-block w-1/4 ">
                  <FormInput
                    name="minimize"
                    className="bg-[#413F4D]  border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30"
                    placeholder="Số Lượng"
                    value={form.values.minimize}
                    onBlur={form.handleBlur}
                    error={!!form.errors.minimize && form.touched.minimize}
                    errorMessage={form.errors.minimize}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      if (!isNaN(newValue) && newValue >= 0) {
                        e.target.value = newValue.toString()
                      } else {
                        e.target.value = '0'
                      }
                      form.handleChange(e)
                    }}
                    type="number"
                    min={0}
                    max={100}
                  />
                </div>
                <div className="inline-block w-1/4 ml-1 ">
                  <Select
                    showSearch
                    placeholder="Loại"
                    optionFilterProp="children"
                    onChange={handleDisCountUnit}
                    filterOption={filterOptionDisCountUnit}
                    defaultValue={form.values.discountUnit}
                    style={{
                      minWidth: '4rem',
                      marginLeft: '1rem',
                    }}
                    options={[
                      {
                        value: CreateVoucherRequestDiscountUnitEnum.Percent,
                        label: '%',
                      },
                      {
                        value: CreateVoucherRequestDiscountUnitEnum.Cash,
                        label: 'k/VND',
                      },
                    ]}
                  />
                </div>
              </div>
              <div className="h-12 text-white">
                Đối tượng:
                <Select
                  showSearch
                  placeholder="Loại"
                  optionFilterProp="children"
                  onChange={handleRecipientType}
                  filterOption={filterOptionRecipientType}
                  defaultValue={form.values.audience}
                  style={{
                    minWidth: '8rem',
                    marginLeft: '1rem',
                  }}
                  options={[
                    {
                      value: CreateVoucherRequestRecipientTypeEnum.All,
                      label: mappingRecipientType.ALL,
                    },
                    {
                      value: CreateVoucherRequestRecipientTypeEnum.FirstTimeBooking,
                      label: mappingRecipientType.FIRST_TIME_BOOKING,
                    },
                    {
                      value: CreateVoucherRequestRecipientTypeEnum.PreviousBooking,
                      label: mappingRecipientType.PREVIOUS_BOOKING,
                    },
                    {
                      value: CreateVoucherRequestRecipientTypeEnum.SelectiveBooker,
                      label: mappingRecipientType.SELECTIVE_BOOKER,
                    },
                    {
                      value: CreateVoucherRequestRecipientTypeEnum.Top10Booker,
                      label: mappingRecipientType.TOP_10_BOOKER,
                    },
                    {
                      value: CreateVoucherRequestRecipientTypeEnum.Top5Booker,
                      label: mappingRecipientType.TOP_5_BOOKER,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
            <div className="flex flex-col justify-end mt-5">
              <div className="flex h-32 text-white">
                <span className="w-16 mr-4">Mô tả: </span>
                <TextArea
                  name="description"
                  className="bg-[#413F4D] w-4/5"
                  rows={5}
                  value={form.values.description}
                  onChange={form.handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center pb-4 mt-6">
          <Button customCSS="mx-6 px-4 py-1 border-2 hover:scale-110" onClick={openConfirmModalCancel}>
            Hủy
          </Button>
          <Button
            customCSS={`mx-6 px-4 py-1 border-2  ${
              form.isValid && form.values.name != '' && 'hover:scale-110 bg-[#7463F0] border-[#7463F0]'
            }`}
            onClick={(e) => {
              e.preventDefault()
              openConfirmModal()
            }}
            isDisable={!form.isValid || form.values.name === ''}
          >
            Tạo
          </Button>
        </div>
      </form>

      {isModalConfirmationVisible && confirmModal}
    </>
  )
}
