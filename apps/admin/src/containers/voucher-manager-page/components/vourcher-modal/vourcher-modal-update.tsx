import { Plus } from '@icon-park/react'
import { Button, FormInput, Input, TextArea } from '@ume/ui'
import empty_img from 'public/empty_error.png'
import { uploadImageVoucher } from '~/api/upload-media'
import useDebounce from '~/hooks/adminDebounce'

import * as React from 'react'
import { useRef, useState } from 'react'

import { Select, notification } from 'antd'
import { FormikErrors, useFormik } from 'formik'
import Image from 'next/legacy/image'
import {
  CheckExistedResponse,
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
    onSuccess(data) {
      setVoucherDetails(data.data)
    },
  })

  const updateVoucherAdmin = trpc.useMutation(['voucher.updateVoucherAdmin'])
  const MAX_NUMBER = '100000'
  const MAX_NUMBER_DISCOUNT = '100000000'
  const ImageInit = voucherDetails?.image ?? empty_img
  const nameInit = voucherDetails?.name ?? ''
  const vourcherCodeInit = voucherDetails?.code ?? ''
  const issuer = voucherDetails?.admin?.name ?? voucherDetails?.provider?.name ?? ''
  const approverInit = voucherDetails?.admin?.name ?? ''
  const statusInit = voucherDetails?.status ?? ''
  const startDateInit = voucherDetails?.startDate ? new Date(voucherDetails?.startDate).toISOString().split('T')[0] : ''
  const endDateInit = voucherDetails?.endDate ? new Date(voucherDetails?.endDate).toISOString().split('T')[0] : ''
  const numVoucherInit = voucherDetails?.numberIssued ?? 0
  const numUserCanUseInit = voucherDetails?.numberUsablePerBooker ?? 0
  const typeVoucherInit = voucherDetails?.type ?? ''
  const applyTimeInit = voucherDetails?.applyISODayOfWeek ?? []
  const numVoucherInDayInit = voucherDetails?.dailyNumberIssued ?? 0
  const numUserCanUseInDayInit = voucherDetails?.dailyUsageLimitPerBooker ?? ''
  const minimizeInit = voucherDetails?.discountValue ?? 0
  const audienceInit = voucherDetails?.recipientType ?? 0
  const descriptionInit = voucherDetails?.description ?? ''
  const contentInit = 'SOME THING WRONG'
  const discountUnitInit = voucherDetails?.discountUnit
  const minimumBookingDurationForUsageInit = voucherDetails?.minimumBookingDurationForUsage ?? 0
  const minimumBookingTotalPriceForUsageInit = voucherDetails?.minimumBookingTotalPriceForUsage ?? 0
  const maximumDiscountValueInit = voucherDetails?.maximumDiscountValue ?? 0

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
    content: string
    selectedImage: any
    status: any
    numUserCanUse: number
    numUserCanUseInDay: number
    minimumBookingDurationForUsage: number
    minimumBookingTotalPriceForUsage: number
    maximumDiscountValue: number
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
      startDate: startDateInit,
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
      minimumBookingDurationForUsage: minimumBookingDurationForUsageInit,
      minimumBookingTotalPriceForUsage: minimumBookingTotalPriceForUsageInit,
      maximumDiscountValue: maximumDiscountValueInit,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Tên là bắt buộc'),
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
  React.useEffect(() => {
    if (updateVoucherAdmin) {
      form.resetForm({
        values: {
          vourcherCode: vourcherCodeInit,
          imageSource: ImageInit,
          description: descriptionInit,
          numVoucher: numVoucherInit,
          numVoucherInDay: numVoucherInDayInit,
          minimize: minimizeInit,
          endDate: endDateInit,
          startDate: startDateInit,
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
          minimumBookingDurationForUsage: minimumBookingDurationForUsageInit,
          minimumBookingTotalPriceForUsage: minimumBookingTotalPriceForUsageInit,
          maximumDiscountValue: maximumDiscountValueInit,
        },
      })
    }
  }, [endDateInit])

  const [adminCheckVoucherCodeExisted, setAdminCheckVoucherCodeExisted] = useState<CheckExistedResponse>()
  const debouncedValue = useDebounce<string>(form.values.vourcherCode, 500)
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
        if (debouncedValue != vourcherCodeInit) setAdminCheckVoucherCodeExisted(data.data)
      },
    },
  )
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

  function checkFieldRequỉed() {
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
  async function submitHandle() {
    setOpenConfirm(false)
    setIsCreate(false)
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
        discountValue: [parseFloat(form.values.minimize.toString().replace(/,/g, '')), minimizeInit],
        endDate: [convertToIsoDate(form.values.endDate), convertToIsoDate(endDateInit)],
        startDate: [convertToIsoDate(form.values.startDate), convertToIsoDate(startDateInit)],
        applyISODayOfWeek: [form.values.applyTime, applyTimeInit],
        name: [form.values.name, nameInit],
        type: [form.values.typeVoucher, typeVoucherInit],
        discountUnit: [form.values.discountUnit, discountUnitInit],
        recipientType: [form.values.audience, audienceInit],
        minimumBookingDurationForUsage: [
          form.values.minimumBookingDurationForUsage,
          minimumBookingDurationForUsageInit,
        ],
        minimumBookingTotalPriceForUsage: [
          parseFloat(form.values.minimumBookingTotalPriceForUsage.toString().replace(/,/g, '')),
          minimumBookingTotalPriceForUsageInit,
        ],

        maximumDiscountValue: [
          parseFloat(form.values.maximumDiscountValue.toString().replace(/,/g, '')),
          maximumDiscountValueInit,
        ],
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
              })
              utils.invalidateQueries('voucher.getAllVoucher')
              closeHandle()
            },
            onError: (err) => {
              notification.error({
                message: 'Chỉnh sửa Khuyến mãi không thành công!',
                description: err.message,
              })
            },
          })
        } catch (error) {
          notification.error({
            message: 'Chỉnh sửa Khuyến mãi không thành công!',
            description: 'Gặp lỗi khi chỉnh sửa',
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
  function isDisableButton() {
    return (
      !form.isValid ??
      !form.dirty ??
      (adminCheckVoucherCodeExisted?.isExisted ? debouncedValue !== vourcherCodeInit : false)
    )
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
                  onKeyDown={() => {}}
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
                  <span className="w-8">*Tên:</span>
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

                <div className="flex h-12 text-white">
                  <span className="w-8"> Mã:</span>
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
                    {adminCheckVoucherCodeExisted?.isExisted && debouncedValue != vourcherCodeInit && (
                      <div className="w-full ml-4 text-xs text-red-500">Mã đã tồn tại</div>
                    )}
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
                  Ngày phát hành:
                  <div className="inline-block w-1/3 ">
                    <FormInput
                      name="startDate"
                      className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30"
                      type="date"
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
                      min={startDateInit}
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
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      value={form.values.endDate}
                      error={!!form.errors.endDate && form.touched.endDate}
                      errorMessage={form.errors.endDate}
                      min={endDateInit > form.values.startDate ? endDateInit : form.values.startDate}
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
                          }
                        } else {
                          e.target.value = '1'
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
                        if (!isNaN(newValue) && newValue >= 1) {
                          if (newValue > parseInt(form.values.numVoucher + '')) {
                            e.target.value = form.values.numVoucher + ''
                          } else {
                            e.target.value = newValue.toString()
                          }
                        } else {
                          e.target.value = '1'
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
                <div className="h-12 text-white">
                  Khuyến mãi dùng cho hóa đơn tối thiểu:
                  <div className="inline-block w-1/5 ml-4 ">
                    <FormInput
                      name="minimumBookingTotalPriceForUsage"
                      className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30"
                      placeholder="Số Lượng"
                      value={formatNumberWithCommas(form.values.minimumBookingTotalPriceForUsage)}
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
                  <span className="text-xs italic"> đ</span>
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
                          e.target.value = '1'
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
                        if (!isNaN(newValue) && newValue >= 1) {
                          if (newValue > parseInt(form.values.numVoucherInDay + '')) {
                            e.target.value = form.values.numVoucherInDay + ''
                          } else {
                            e.target.value = newValue.toString()
                          }
                        } else {
                          e.target.value = '1'
                        }
                        form.handleChange(e)
                      }}
                      type="number"
                      min={0}
                      max={100000}
                    />
                  </div>
                </div>
                <div className="flex items-baseline h-12 text-white">
                  <span className="h-8">Giảm :</span>
                  <div
                    className={`inline-block  ml-1 ${
                      form.values.discountUnit === CreateVoucherRequestDiscountUnitEnum.Cash ? 'w-3/12' : 'w-2/12'
                    }`}
                  >
                    <FormInput
                      name="minimize"
                      className="bg-[#413F4D]  border-2 border-[rgb(255,255,255)] h-8 border-opacity-30"
                      placeholder="Số Lượng"
                      value={
                        form.values.discountUnit === CreateVoucherRequestDiscountUnitEnum.Cash
                          ? formatNumberWithCommas(form.values.minimize)
                          : form.values.minimize
                      }
                      onBlur={form.handleBlur}
                      error={!!form.errors.minimize && form.touched.minimize}
                      errorMessage={form.errors.minimize}
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
                            e.target.value = '1'
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
                    />
                  </div>
                  <div className="inline-block w-2/12 ml-1 ">
                    <Select
                      showSearch
                      placeholder="Loại"
                      optionFilterProp="children"
                      onChange={handleDisCountUnit}
                      filterOption={filterOptionDisCountUnit}
                      value={form.values.discountUnit}
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
            <Button customCSS="mx-6 px-4 py-1 border-2 hover:scale-110" onClick={openConfirmModalCancel}>
              Hủy
            </Button>
            <Button
              customCSS={`mx-6 px-4 py-1 border-2  ${
                !isDisableButton() && 'hover:scale-110 bg-[#7463F0] border-[#7463F0]'
              }`}
              onClick={(e) => {
                if (updateVoucherAdmin.isLoading) {
                  return
                } else {
                  e.preventDefault()
                  openConfirmModal()
                }
              }}
              isDisable={isDisableButton()}
              isLoading={updateVoucherAdmin.isLoading}
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
