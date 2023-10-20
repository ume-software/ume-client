import { Plus } from '@icon-park/react'
import { Button, FormInput, Input, TextArea } from '@ume/ui'
import empty_img from 'public/empty_error.png'
import { uploadImageVoucher } from '~/api/upload-media'

import * as React from 'react'
import { useRef, useState } from 'react'

import { Select, Space, notification } from 'antd'
import { FormikErrors, useFormik } from 'formik'
import Image from 'next/legacy/image'
import {
  CreateVoucherRequestDiscountUnitEnum,
  CreateVoucherRequestRecipientTypeEnum,
  CreateVoucherRequestTypeEnum,
  UpdateVoucherRequest,
  VoucherResponse,
} from 'ume-service-openapi'
import * as Yup from 'yup'

import ModalBase from '~/components/modal-base'
import ComfirmModal from '~/components/modal-base/comfirm-modal'

import { trpc } from '~/utils/trpc'

const { Option } = Select

export interface IVourcherModalUpdateProps {
  closeFunction: any
  openValue: boolean
  vourcherId?: any
}

export default function VourcherModalUpdate({ vourcherId, closeFunction, openValue }: IVourcherModalUpdateProps) {
  const [voucherDetails, setVoucherDetails] = useState<VoucherResponse>()
  const SELECT = [
    '$all',
    {
      admin: ['$all'],
      provider: ['$all'],
    },
  ]
  trpc.useQuery(['voucher.getVoucherDetails', { id: vourcherId, select: JSON.stringify(SELECT) }], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    // refetchOnMount: false,
    // refetchInterval: false,
    // refetchIntervalInBackground: false,
    onSuccess(data) {
      setVoucherDetails(data.data)
    },
  })

  const updateVoucherAdmin = trpc.useMutation(['voucher.updateVoucherAdmin'])
  const MAX_NUMBER = '100000'
  const ImageInit = voucherDetails?.image || empty_img
  const nameInit = voucherDetails?.name || ''
  const vourcherCodeInit = voucherDetails?.code || ''
  const issuer = voucherDetails?.admin?.name || voucherDetails?.provider?.name || ''
  const approverInit = voucherDetails?.admin?.name || ''
  const statusInit = voucherDetails?.status
  const createAt = voucherDetails?.createdAt ? new Date(voucherDetails?.createdAt).toLocaleDateString('en-GB') : ''
  const endDateInit = voucherDetails?.endDate ? new Date(voucherDetails?.endDate).toISOString().split('T')[0] : ''
  const numVoucherInit = voucherDetails?.numberIssued
  const numUserCanUseInit = voucherDetails?.numberUsablePerBooker
  const typeVoucherInit = voucherDetails?.type
  const applyTimeInit = voucherDetails?.applyISODayOfWeek
  const numVoucherInDayInit = voucherDetails?.dailyNumberIssued
  const numUserCanUseInDayInit = voucherDetails?.dailyUsageLimitPerBooker
  const minimizeInit = voucherDetails?.maximumDiscountValue
  const audienceInit = voucherDetails?.recipientType
  const descriptionInit = voucherDetails?.description
  const contentInit = 'SOME THING WRONG'
  const discountUnitInit = voucherDetails?.discountUnit
  const titleValue = 'Thông Tin Khuyến Mãi'
  const [isSubmiting, setSubmiting] = useState(false)
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
  const validate = (values: IFormValues): FormikErrors<IFormValues> => {
    const errors: FormikErrors<IFormValues> = {}
    return errors
  }
  const form = useFormik({
    initialValues: {
      vourcherCode: vourcherCodeInit,
      imageSource: ImageInit,
      description: descriptionInit,
      numVoucher: numVoucherInit,
      numVoucherInDay: numVoucherInDayInit,
      minimize: minimizeInit,
      endDate: endDateInit,
      applyTime: applyTimeInit,
      name: nameInit,
      typeVoucher: typeVoucherInit,
      discountUnit: discountUnitInit,
      audience: audienceInit,
      content: contentInit,
      selectedImage: null,
      status: statusInit,
      numUserCanUse: numUserCanUseInit,
      numUserCanUseInDay: numUserCanUseInDayInit,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name là bắt buộc'),
      typeVoucher: Yup.string().required('Loại là bắt buộc'),
      discountUnit: Yup.string().required('discountUnit là bắt buộc'),
      audience: Yup.string().required('Đối tượng là bắt buộc'),
      // email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      setSubmiting(true)
      openConfirmModal()
      resetForm()
    },
  })

  React.useEffect(() => {
    form.setFieldValue('vourcherCode', vourcherCodeInit)
    form.setFieldValue('imageSource', ImageInit)
    form.setFieldValue('description', descriptionInit)
    form.setFieldValue('numVoucher', numVoucherInit)
    form.setFieldValue('numVoucherInDay', numVoucherInDayInit)
    form.setFieldValue('minimize', minimizeInit)
    form.setFieldValue('endDate', endDateInit)
    form.setFieldValue('applyTime', applyTimeInit)
    form.setFieldValue('name', nameInit)
    form.setFieldValue('typeVoucher', typeVoucherInit)
    form.setFieldValue('discountUnit', discountUnitInit)
    form.setFieldValue('audience', audienceInit)
    form.setFieldValue('content', contentInit)
    form.setFieldValue('status', statusInit)
    form.setFieldValue('numUserCanUse', numUserCanUseInit)
    form.setFieldValue('numUserCanUseInDay', numUserCanUseInDayInit)
  }, [endDateInit])
  const mappingRecipientType = {
    ALL: 'Tất cả',
    FIRST_TIME_BOOKING: 'Người lần đầu thuê',
    PREVIOUS_BOOKING: ' Người đã từng thuê',
    TOP_5_BOOKER: ' Top 5 người thuê',
    TOP_10_BOOKER: ' Top 10 người thuê',
    SELECTIVE_BOOKER: 'Người đặt chọn',
  }
  const mappingType = {
    DISCOUNT: 'Giảm giá',
    CASHBACK: 'Hoàn tiền',
  }
  const utils = trpc.useContext()

  const imageInputRef = useRef<HTMLInputElement>(null)
  const [openConfirm, setOpenConfirm] = React.useState(false)
  const [isCreate, setIsCreate] = useState<boolean>(false)

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
  function handleTypeVoucher(value) {
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
    setOpenConfirm(true)
  }
  function openConfirmModal() {
    setIsCreate(true)
    setOpenConfirm(true)
  }

  function checkFieldRequỉed() {
    if (form.values.name && form.values.typeVoucher && form.values.discountUnit && form.values.audience) {
      return true
    } else {
      return false
    }
  }

  async function submitHandle() {
    const imgURL = await uploadImage()
    try {
      const req = {
        code: [form.values.vourcherCode, vourcherCodeInit],
        image: [form.values.selectedImage ? imgURL.imageUrl : ImageInit, ImageInit],
        description: [form.values.description, descriptionInit],
        numberIssued: [form.values.numVoucher, numVoucherInit],
        dailyNumberIssued: [form.values.numVoucherInDay, numVoucherInDayInit],
        numberUsablePerBooker: [form.values.numUserCanUse, numUserCanUseInit],
        dailyUsageLimitPerBooker: [form.values.numUserCanUseInDay, numUserCanUseInDayInit],
        maximumDiscountValue: [form.values.minimize, minimizeInit],
        endDate: [new Date(form.values.endDate).toISOString(), new Date(endDateInit).toISOString()],
        applyISODayOfWeek: [form.values.applyTime, applyTimeInit],
        name: [form.values.name, nameInit],
        type: [form.values.typeVoucher, typeVoucherInit],
        discountUnit: [form.values.discountUnit, discountUnitInit],
        recipientType: [form.values.audience, audienceInit],
      }
      let reqWithValuesNotNull = {}
      for (let key in req) {
        if (req[key][0] != req[key][1]) {
          reqWithValuesNotNull[key] = req[key][0]
        }
      }
      if (reqWithValuesNotNull) {
        try {
          let req = {
            id: vourcherId as string,
            voucherUpdate: reqWithValuesNotNull as UpdateVoucherRequest,
          }
          updateVoucherAdmin.mutate(req, {
            onSuccess: () => {
              notification.success({
                message: 'Chỉnh sửa Khuyến mãi thành công!',
                description: 'Khuyến mãi Đã được chỉnh sửa',
                placement: 'bottomLeft',
              })
              utils.invalidateQueries('voucher.getAllVoucher')
              closeHandle()
            },
          })
        } catch (error) {
          notification.error({
            message: 'Chỉnh sửa Khuyến mãi không thành công!',
            description: 'Gặp lỗi khi chỉnh sửa',
            placement: 'bottomLeft',
          })
          console.error('Failed to Handle update voucher:', error)
        }
      }
    } catch (error) {
      console.error('Failed to update voucher:', error)
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
                      src={form.values.imageSource!!}
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
                <div className="h-12 text-white">
                  Người duyệt: <span className="font-bold">{approverInit}</span>
                </div>
              </div>
              <div className="flex flex-col justify-end w-2/5 ">
                <div className="h-12 text-white">
                  Ngày phát hành: <span className="font-bold">{createAt}</span>
                </div>
                <div className="h-12 text-white">
                  Ngày kết thúc:
                  <div className="inline-block w-1/3 ">
                    <FormInput
                      name="endDate"
                      className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30"
                      type="date"
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      value={form.values.endDate}
                      error={!!form.errors.endDate && form.touched.endDate}
                      errorMessage={form.errors.endDate}
                      min={endDateInit}
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
                      errorMessage={form.errors.numVoucher}
                      disabled={false}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value)
                        if (!isNaN(newValue) && newValue >= 0) {
                          if (newValue > parseInt(MAX_NUMBER)) {
                            e.target.value = MAX_NUMBER
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
                          if (newValue > parseInt(MAX_NUMBER)) {
                            e.target.value = MAX_NUMBER
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
                <div className="h-12 text-white">
                  Loại:
                  <Select
                    showSearch
                    placeholder="Loại"
                    optionFilterProp="children"
                    onChange={handleTypeVoucher}
                    filterOption={filterOptionTypeVoucher}
                    value={form.values.typeVoucher}
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
                    onChange={handleChangeApplyDay}
                    optionLabelProp="label"
                    style={{
                      minWidth: '8rem',
                      marginLeft: '1rem',
                    }}
                    value={form.values.applyTime}
                    options={[
                      {
                        value: 1,
                        label: 'T2',
                      },
                      {
                        value: 2,
                        label: 'T3',
                      },
                      {
                        value: 3,
                        label: 'T4',
                      },
                      {
                        value: 4,
                        label: 'T5',
                      },
                      {
                        value: 5,
                        label: 'T6',
                      },
                      {
                        value: 6,
                        label: 'T7',
                      },
                      {
                        value: 7,
                        label: 'CN',
                      },
                    ]}
                  ></Select>
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
                          if (newValue > parseInt(MAX_NUMBER)) {
                            e.target.value = MAX_NUMBER
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
                          if (newValue > parseInt(MAX_NUMBER)) {
                            e.target.value = MAX_NUMBER
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
                          if (newValue > parseInt(MAX_NUMBER)) {
                            e.target.value = MAX_NUMBER
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
                      value={form.values.discountUnit}
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
                    value={form.values.audience}
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
              {'Sửa'}
            </Button>
          </div>
        </ModalBase>
      </form>
      {openConfirm && (
        <ComfirmModal
          closeFunction={closeComfirmFormHandle}
          openValue={true}
          isComfirmFunction={isCreate ? submitHandle : closeHandle}
          titleValue={isCreate ? 'Xác nhận Sửa' : 'Xác nhận hủy'}
        ></ComfirmModal>
      )}
    </div>
  )
}
