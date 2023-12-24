import { Plus } from '@icon-park/react'
import { Button, FormInput, TextArea } from '@ume/ui'
import { uploadImageVoucher } from '~/api/upload-media'
import useDebounce from '~/hooks/adminDebounce'

import * as React from 'react'
import { useRef, useState } from 'react'

import { Select, Space, notification } from 'antd'
import { FormikErrors, useFormik } from 'formik'
import Image from 'next/legacy/image'
import {
  CheckExistedResponse,
  CreateVoucherRequestDiscountUnitEnum,
  CreateVoucherRequestRecipientTypeEnum,
  CreateVoucherRequestTypeEnum,
} from 'ume-service-openapi'
import * as Yup from 'yup'

import ModalBase from '~/components/modal-base'
import ComfirmModal from '~/components/modal-base/comfirm-modal'

import { trpc } from '~/utils/trpc'

const { Option } = Select

export interface IVourcherModalCreateProps {
  closeFunction: any
  openValue: boolean
}

export default function VourcherModalCreate({ closeFunction, openValue }: IVourcherModalCreateProps) {
  const titleValue = 'Thông Tin Khuyến Mãi'
  const issuer = 'ADMIN'
  const MAX_NUMBER = '100000'
  const MAX_NUMBER_DISCOUNT = '100000000'
  const [startDate, setstartDate] = useState<any>(new Date().toLocaleDateString('en-GB'))
  const [isSubmiting, setSubmiting] = useState(false)
  const utils = trpc.useContext()
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
    content: string
    selectedImage: any
    status: any
    numUserCanUse: number
    numUserCanUseInDay: number
  }

  const form = useFormik({
    initialValues: {
      vourcherCode: '',
      imageSource: '',
      description: '',
      numVoucher: 0,
      numVoucherInDay: 0,
      minimize: 0,
      endDate: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      applyTime: [],
      name: '',
      typeVoucher: CreateVoucherRequestTypeEnum.Discount,
      discountUnit: CreateVoucherRequestDiscountUnitEnum.Percent,
      audience: CreateVoucherRequestRecipientTypeEnum.All,
      content: '',
      selectedImage: null,
      status: '',
      numUserCanUse: 0,
      numUserCanUseInDay: 0,
      minimumBookingDurationForUsage: 0,
      minimumBookingTotalPriceForUsage: 0,
      maximumDiscountValue: 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Tên là bắt buộc'),
      typeVoucher: Yup.string().required('Loại là bắt buộc'),
      discountUnit: Yup.string().required('discountUnit là bắt buộc'),
      audience: Yup.string().required('Đối tượng là bắt buộc'),
      numUserCanUse: Yup.number().moreThan(0),
      numUserCanUseInDay: Yup.number().moreThan(0),
      numVoucher: Yup.number().moreThan(0),
      numVoucherInDay: Yup.number().moreThan(0),
      minimize: Yup.number().moreThan(0),
      vourcherCode: Yup.string().required('Mã là bắt buộc'),
    }),
    onSubmit: (values, { resetForm }) => {
      setSubmiting(true)
      openConfirmModal()
      resetForm()
    },
  })
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

  const imageInputRef = useRef<HTMLInputElement>(null)
  const [openConfirm, setOpenConfirm] = React.useState(false)
  const [isCreate, setIsCreate] = useState<boolean>(false)
  const createNewVoucherAdmin = trpc.useMutation(['voucher.createNewVoucherAdmin'])
  const debouncedValue = useDebounce<string>(form.values.vourcherCode, 500)
  const [adminCheckVoucherCodeExisted, setAdminCheckVoucherCodeExisted] = useState<CheckExistedResponse>()
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
  const handleMediaChange = (e) => {
    const file = e.target.files?.[0]
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
  function handleTypeVoucher(value) {
    form.setFieldValue('typeVoucher', value)
  }
  function filterOptionTypeVoucher(input, option) {
    return (option?.label ?? '').toUpperCase().includes(input.toUpperCase())
  }
  trpc.useQuery(
    [
      'voucher.adminCheckVoucherCodeExisted',
      {
        code: debouncedValue + '',
      },
    ],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 0,
      refetchOnMount: true,
      onSuccess(data) {
        setAdminCheckVoucherCodeExisted(data.data)
      },
    },
  )

  function handleRecipientType(value) {
    form.setFieldValue('audience', value)
  }

  function filterOptionRecipientType(input, option) {
    return (option?.label ?? '').toUpperCase().includes(input.toUpperCase())
  }

  function handleDisCountUnit(value) {
    form.setFieldValue('minimize', '0')
    form.setFieldValue('discountUnit', value)
  }

  function filterOptionDisCountUnit(input, option) {
    return (option?.label ?? '').toUpperCase().includes(input.toUpperCase())
  }

  function openConfirmModalCancel() {
    setOpenConfirm(true)
  }
  function openConfirmModal() {
    setIsCreate(true)
    setOpenConfirm(true)
  }

  function checkFieldRequired() {
    if (form.values.name && form.values.typeVoucher && form.values.discountUnit && form.values.audience) {
      return true
    } else {
      return false
    }
  }
  function convertToIsoDate(inputDate) {
    if (inputDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return inputDate
    }
    const parts = inputDate.split('-')
    if (parts.length === 3) {
      const year = parts[0]
      const month = parts[1]
      const day = parts[2]
      const isoDate = `${year}-${month}-${day}`
      return isoDate
    } else {
      throw new Error('Invalid date format')
    }
  }
  function convertToDate(inputDate) {
    const parts = inputDate.split('/')
    const reversedDate = parts[2] + '-' + parts[1] + '-' + parts[0]
    const newDate = new Date(reversedDate)
    return newDate
  }
  function convertToIsoStartDate(startDate) {
    let endDateTime = new Date(startDate)
    endDateTime.setHours(0, 0, 0)
    let isoDate = endDateTime.toISOString()
    return isoDate
  }
  function convertToIsoEndDate(endDate) {
    let endDateTime = new Date(endDate)
    endDateTime.setHours(23, 59, 59)
    let isoDate = endDateTime.toISOString()
    return isoDate
  }

  async function submitHandle() {
    setOpenConfirm(false)
    setIsCreate(false)
    if (await checkFieldRequired()) {
      const imgURL = await uploadImage()
      try {
        const req = {
          code: form.values.vourcherCode,
          image: imgURL.imageUrl,
          description: form.values.description,
          numberIssued: form.values.numVoucher,
          dailyNumberIssued: form.values.numVoucherInDay,
          numberUsablePerBooker: form.values.numUserCanUse,
          dailyUsageLimitPerBooker: form.values.numUserCanUseInDay,
          discountValue: parseFloat(form.values.minimize.toString().replace(/,/g, '')),
          startDate: convertToIsoDate(form.values.startDate),
          endDate: convertToIsoDate(form.values.endDate),
          applyISODayOfWeek: form.values.applyTime,
          minimumBookingDurationForUsage: form.values.minimumBookingDurationForUsage,
          minimumBookingTotalPriceForUsage: parseFloat(
            form.values.minimumBookingTotalPriceForUsage.toString().replace(/,/g, ''),
          ),
          maximumDiscountValue: parseFloat(form.values.maximumDiscountValue.toString().replace(/,/g, '')),
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
            if (key == 'startDate') {
              reqWithValuesNotNull[key] = convertToIsoStartDate(req[key])
            } else if (key == 'endDate') {
              reqWithValuesNotNull[key] = convertToIsoEndDate(req[key])
            } else {
              reqWithValuesNotNull[key] = req[key]
            }
          }
        }
        console.log(reqWithValuesNotNull)

        createNewVoucherAdmin.mutate(reqWithValuesNotNull, {
          onSuccess: (data) => {
            if (data.success) {
              notification.success({
                message: 'Tạo thành công!',
                description: 'Khuyến mãi đã được tạo thành công.',
              })
              utils.invalidateQueries('voucher.getAllVoucher')
              closeHandle()
            }
          },
          onError: () => {
            notification.error({
              message: 'Tạo thất bại!',
              description: 'Tạo không thành công.',
            })
          },
        })
      } catch (error) {
        console.error('Failed to post voucher:', error)
      }
    }
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
        const responseData = await uploadImageVoucher(formData)
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
  function isDisableButton() {
    return !form.isValid || form.values.name == '' || (adminCheckVoucherCodeExisted?.isExisted ? true : false)
  }
  function formatNumberWithCommas(number) {
    return number.toLocaleString('en-US', {
      currency: 'VND',
    })
  }

  return (
    <div>
      <form onSubmit={form.handleSubmit} className="flex flex-col mb-4 gap-y-4">
        <ModalBase
          titleValue={titleValue}
          closeFunction={closeHandleSmall}
          openValue={openValue}
          className="w-auto bg-black"
          width={1100}
          isdestroyOnClose={true}
        >
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
                <div className="flex w-full h-12 text-white">
                  <span className="min-w-[3rem]">*Tên:</span>
                  <div className="inline-block w-2/3 ml-4">
                    <FormInput
                      name="name"
                      className={`bg-[#413F4D] border-2 border-[#FFFFFF] h-8  border-opacity-30 ${
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
                <div className="flex h-12 text-white ">
                  <span className="min-w-[3rem]"> *Mã:</span>
                  <div className="inline-block w-2/3 h-12 ml-4">
                    <FormInput
                      name="vourcherCode"
                      className={`bg-[#413F4D] border-2 border-[#FFFFFF] h-8  border-opacity-30 ${
                        form.errors.vourcherCode && form.touched.vourcherCode ? 'placeholder:text-red-500' : ''
                      }`}
                      placeholder={
                        !!form.errors.vourcherCode && form.touched.vourcherCode
                          ? form.errors.vourcherCode
                          : 'Mã: SUPPERSALE '
                      }
                      disabled={false}
                      onChange={(e) => {
                        e.target.value = e.target.value.toUpperCase()
                        form.handleChange(e)
                      }}
                      onBlur={form.handleBlur}
                      value={form.values.vourcherCode}
                      error={!!form.errors.vourcherCode && form.touched.vourcherCode}
                      errorMessage={''}
                      type="text"
                    />
                    {adminCheckVoucherCodeExisted?.isExisted && (
                      <div className="w-full ml-4 text-xs text-red-500">Mã đã tồn tại</div>
                    )}
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
                      onChange={(e) => {
                        if (e.target.value > form.values.endDate) {
                          form.setFieldValue('endDate', e.target.value)
                        }
                        form.handleChange(e)
                      }}
                      onBlur={form.handleBlur}
                      value={form.values.startDate}
                      error={!!form.errors.startDate && form.touched.startDate}
                      errorMessage={form.errors.startDate}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
                <div className="h-12 text-white">
                  Ngày kết thúc:
                  <div className="inline-block w-1/3 ml-3">
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
                <div className="h-12 text-white">{/* Trạng thái: <span className="font-bold">{status}</span> */}</div>
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
                      errorMessage={undefined}
                      disabled={false}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value)
                        if (!isNaN(newValue) && newValue >= 1) {
                          if (newValue > parseInt(MAX_NUMBER)) {
                            e.target.value = MAX_NUMBER
                          } else {
                            e.target.value = newValue.toString()
                            if (form.values.numUserCanUse > newValue) {
                              form.setFieldValue('numUserCanUse', newValue)
                            }
                            if (form.values.numVoucherInDay > newValue) {
                              form.setFieldValue('numVoucherInDay', newValue)
                            }
                            if (parseInt(form.values.numUserCanUseInDay + '') > newValue) {
                              form.setFieldValue('numUserCanUseInDay', newValue)
                            }
                          }
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
                      errorMessage={undefined}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value)
                        if (!isNaN(newValue) && newValue >= 1) {
                          if (newValue > parseInt(form.values.numVoucher + '')) {
                            e.target.value = form.values.numVoucher + ''
                          } else {
                            e.target.value = newValue.toString()
                            if (parseInt(form.values.numUserCanUseInDay + '') > newValue) {
                              form.setFieldValue('numUserCanUseInDay', newValue)
                            }
                          }
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
                  Loại:
                  <Select
                    showSearch
                    placeholder="Loại"
                    optionFilterProp="children"
                    onChange={handleTypeVoucher}
                    filterOption={filterOptionTypeVoucher}
                    defaultValue={form.values.typeVoucher}
                    style={{
                      minWidth: '8rem',
                      marginLeft: '1rem',
                    }}
                    options={[
                      {
                        value: CreateVoucherRequestTypeEnum.Discount,
                        label: mappingType.DISCOUNT,
                      },
                      {
                        value: CreateVoucherRequestTypeEnum.Cashback,
                        label: mappingType.CASHBACK,
                      },
                    ]}
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
                <div className="h-12 text-white">
                  Khuyến mãi dùng cho hóa đơn tối thiểu:
                  <div className="inline-block w-1/5 ">
                    <FormInput
                      name="minimumBookingTotalPriceForUsage"
                      className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30"
                      placeholder="Số Lượng"
                      value={form.values.minimumBookingTotalPriceForUsage}
                      onBlur={form.handleBlur}
                      error={
                        !!form.errors.minimumBookingTotalPriceForUsage && form.touched.minimumBookingTotalPriceForUsage
                      }
                      errorMessage={form.errors.minimumBookingTotalPriceForUsage}
                      onChange={(e) => {
                        const rawValue = e.target.value
                        const newValue = parseFloat(rawValue.replace(/,/g, ''))
                        if (!isNaN(newValue) && newValue >= 0) {
                          if (newValue > parseFloat(MAX_NUMBER_DISCOUNT)) {
                            e.target.value = formatNumberWithCommas(parseFloat(MAX_NUMBER_DISCOUNT))
                          } else {
                            e.target.value = formatNumberWithCommas(newValue)
                          }
                        } else {
                          e.target.value = '0'
                        }
                        form.handleChange(e)
                      }}
                    />
                  </div>
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
                      errorMessage={undefined}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value)

                        if (!isNaN(newValue) && newValue >= 1) {
                          if (newValue > parseInt(form.values.numVoucher + '')) {
                            e.target.value = form.values.numVoucher + ''
                          } else {
                            e.target.value = newValue.toString()
                            if (parseInt(form.values.numUserCanUseInDay + '') > newValue) {
                              form.setFieldValue('numUserCanUseInDay', newValue)
                            }
                          }
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
                      errorMessage={undefined}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value)
                        if (!isNaN(newValue) && newValue >= 1) {
                          if (
                            newValue > parseInt(form.values.numVoucherInDay + '') ||
                            newValue > parseInt(form.values.numUserCanUse + '')
                          ) {
                            if (parseInt(form.values.numVoucherInDay + '') < parseInt(form.values.numUserCanUse + '')) {
                              e.target.value = form.values.numVoucherInDay + ''
                            } else {
                              e.target.value = form.values.numUserCanUse + ''
                            }
                          } else {
                            e.target.value = newValue.toString()
                          }
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
                <div className="flex items-baseline w-full h-12 text-white">
                  <span className="h-8">Giảm:</span>
                  <div
                    className={`inline-block  ml-1 ${
                      form.values.discountUnit == CreateVoucherRequestDiscountUnitEnum.Percent ? 'w-2/12' : 'w-3/12'
                    }`}
                  >
                    <FormInput
                      name="minimize"
                      className="bg-[#413F4D]  border-2 border-[#FFFFFF] h-8 border-opacity-30 "
                      placeholder="Số Lượng"
                      value={form.values.minimize}
                      onBlur={form.handleBlur}
                      error={!!form.errors.minimize && form.touched.minimize}
                      errorMessage={undefined}
                      onChange={(e) => {
                        if (form.values.discountUnit == CreateVoucherRequestDiscountUnitEnum.Percent) {
                          const newValue = parseInt(e.target.value)
                          if (!isNaN(newValue) && newValue >= 1) {
                            if (newValue > parseInt('100')) {
                              e.target.value = '100'
                            } else {
                              e.target.value = newValue.toString()
                            }
                          } else {
                            e.target.value = '0'
                          }
                          form.handleChange(e)
                        } else {
                          const rawValue = e.target.value
                          const newValue = parseFloat(rawValue.replace(/,/g, ''))
                          if (!isNaN(newValue) && newValue >= 0) {
                            if (newValue > parseFloat(MAX_NUMBER_DISCOUNT)) {
                              e.target.value = formatNumberWithCommas(parseFloat(MAX_NUMBER_DISCOUNT))
                            } else {
                              e.target.value = formatNumberWithCommas(newValue)
                            }
                          } else {
                            e.target.value = '0'
                          }
                          form.handleChange(e)
                        }
                      }}
                      type="text"
                    />
                  </div>
                  <div className="inline-block w-2/12 ml-1">
                    <Select
                      showSearch
                      placeholder="Loại"
                      optionFilterProp="children"
                      onChange={handleDisCountUnit}
                      filterOption={filterOptionDisCountUnit}
                      defaultValue={form.values.discountUnit}
                      style={{
                        minWidth: '2rem',
                      }}
                      options={[
                        {
                          value: CreateVoucherRequestDiscountUnitEnum.Percent,
                          label: '%',
                        },
                        {
                          value: CreateVoucherRequestDiscountUnitEnum.Cash,
                          label: 'VND',
                        },
                      ]}
                    />
                  </div>
                  {form.values.discountUnit == CreateVoucherRequestDiscountUnitEnum.Percent && (
                    <div className="flex items-center justify-end w-6/12">
                      <span className="">Giảm Tối Đa:</span>
                      <div className="inline-block w-6/12 ml-1 mr-1">
                        <FormInput
                          name="maximumDiscountValue"
                          className="bg-[#413F4D]  border-2 border-[#FFFFFF] h-8 border-opacity-30"
                          placeholder=""
                          value={formatNumberWithCommas(form.values.maximumDiscountValue)}
                          onBlur={form.handleBlur}
                          error={!!form.errors.maximumDiscountValue && form.touched.maximumDiscountValue}
                          errorMessage={form.errors.maximumDiscountValue}
                          onChange={(e) => {
                            const rawValue = e.target.value
                            const newValue = parseFloat(rawValue.replace(/,/g, ''))
                            if (!isNaN(newValue) && newValue >= 0) {
                              if (newValue > parseFloat(MAX_NUMBER_DISCOUNT)) {
                                e.target.value = formatNumberWithCommas(parseFloat(MAX_NUMBER_DISCOUNT))
                              } else {
                                e.target.value = formatNumberWithCommas(newValue)
                              }
                            } else {
                              e.target.value = '0'
                            }
                            form.handleChange(e)
                          }}
                          type="text"
                        />
                      </div>
                      <span className="text-xs italic"> đ</span>
                    </div>
                  )}
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
                <div className="h-12 text-white">
                  Khuyến mãi dùng cho hóa đơn có giờ tối thiểu:
                  <div className="inline-block w-1/5 ">
                    <FormInput
                      name="minimumBookingDurationForUsage"
                      className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30"
                      placeholder="Số Lượng"
                      value={form.values.minimumBookingDurationForUsage}
                      onBlur={form.handleBlur}
                      error={
                        !!form.errors.minimumBookingDurationForUsage && form.touched.minimumBookingDurationForUsage
                      }
                      errorMessage={form.errors.minimumBookingDurationForUsage}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value)
                        if (!isNaN(newValue) && newValue >= 0) {
                          if (newValue > parseInt('24')) {
                            e.target.value = '24'
                          } else {
                            e.target.value = newValue.toString()
                          }
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
              </div>
            </div>
            <div className="w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
              <div className="flex flex-col justify-end mt-5">
                <div className="flex h-32 text-white">
                  <span className="w-16 mr-4">Mô tả: </span>
                  <TextArea
                    name="description"
                    className="bg-[#413F4D] w-4/5 max-h-[140px]"
                    rows={5}
                    value={form.values.description}
                    onChange={form.handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center pb-4 mt-6">
            <Button
              customCSS={`mx-6 px-4 py-1 border-2 hover:scale-110 bg-red-500 border-red-500`}
              onClick={openConfirmModalCancel}
            >
              Hủy
            </Button>
            <Button
              isActive={false}
              customCSS={`mx-6 px-4 py-1 border-2  ${
                !isDisableButton() && 'hover:scale-110 bg-[#7463F0] border-[#7463F0]'
              }`}
              onClick={(e) => {
                if (createNewVoucherAdmin.isLoading) {
                  return
                } else {
                  e.preventDefault()
                  openConfirmModal()
                }
              }}
              isDisable={isDisableButton()}
              isLoading={createNewVoucherAdmin.isLoading}
            >
              {'Tạo'}
            </Button>
          </div>
        </ModalBase>
      </form>

      {openConfirm && (
        <ComfirmModal
          closeFunction={closeComfirmFormHandle}
          openValue={true}
          isComfirmFunction={isCreate ? submitHandle : closeHandle}
          titleValue={isCreate ? 'Xác nhận Tạo' : 'Xác nhận hủy'}
        ></ComfirmModal>
      )}
    </div>
  )
}
