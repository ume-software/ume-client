import { CloseSmall, Plus } from '@icon-park/react'
import { Button, FormInput, Modal, TextArea } from '@ume/ui'
import { uploadImageBooking } from '~/apis/upload-media'
import { useAuth } from '~/contexts/auth'
import { ActionEnum } from '~/enumVariable/enumVariable'

import * as React from 'react'
import { useRef, useState } from 'react'

import { notification } from 'antd'
import { useFormik } from 'formik'
import Image from 'next/legacy/image'
import {
  CreateVoucherRequestDiscountUnitEnum,
  CreateVoucherRequestRecipientTypeEnum,
  CreateVoucherRequestTypeEnum,
  VoucherResponse,
  VoucherResponseStatusEnum,
} from 'ume-service-openapi'
import * as Yup from 'yup'

import MenuForVoucher from './menu-voucher'

import ConfirmForm from '~/components/confirm-form/confirmForm'

import { trpc } from '~/utils/trpc'

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
  selectedImage: any
  status: any
  numUserCanUse: number
  numUserCanUseInDay: number
}
interface IEnumType {
  key: string | number
  label: string
}

const mappingRecipientType: IEnumType[] = [
  { key: CreateVoucherRequestRecipientTypeEnum.All, label: 'Tất cả' },
  { key: CreateVoucherRequestRecipientTypeEnum.FirstTimeBooking, label: 'Người lần đầu thuê' },
  { key: CreateVoucherRequestRecipientTypeEnum.PreviousBooking, label: ' Người đã từng thuê' },
  { key: CreateVoucherRequestRecipientTypeEnum.SelectiveBooker, label: ' Top 5 người thuê' },
  { key: CreateVoucherRequestRecipientTypeEnum.Top10Booker, label: ' Top 10 người thuê' },
]

const voucherType: IEnumType[] = [
  { key: CreateVoucherRequestTypeEnum.Discount, label: 'Giảm giá' },
  { key: CreateVoucherRequestTypeEnum.Cashback, label: 'Hoàn tiền' },
]

const moneyType: IEnumType[] = [
  {
    key: CreateVoucherRequestDiscountUnitEnum.Percent,
    label: '%',
  },
  {
    key: CreateVoucherRequestDiscountUnitEnum.Cash,
    label: 'k/VND',
  },
]

const timeInWeekType: IEnumType[] = [
  {
    key: 1,
    label: 'Thứ 2',
  },
  {
    key: 2,
    label: 'Thứ 3',
  },
  {
    key: 3,
    label: 'Thứ 4',
  },
  {
    key: 4,
    label: 'Thứ 5',
  },
  {
    key: 5,
    label: 'Thứ 6',
  },
  {
    key: 6,
    label: 'Thứ 7',
  },
  {
    key: 7,
    label: 'Chủ nhật',
  },
]

export default function VourcherModal(props: {
  handleCloseModalVoucher: () => void
  actionModal: string
  voucherSelected: VoucherResponse | undefined
}) {
  const { user } = useAuth()
  const issuer = user?.name
  const today = new Date().toISOString().split('T')[0]
  const createVoucherFormRef = useRef<HTMLFormElement>(null)
  const form = useFormik({
    initialValues: {
      vourcherCode: props.voucherSelected?.code ?? '',
      imageSource: props.voucherSelected?.image ?? '',
      description: props.voucherSelected?.description ?? '',
      numVoucher: props.voucherSelected?.numberIssued,
      numVoucherInDay: props.voucherSelected?.dailyNumberIssued,
      minimize: props.voucherSelected?.maximumDiscountValue,
      startDate: props.voucherSelected?.startDate?.split('T')[0] ?? new Date().toISOString().split('T')[0],
      endDate: props.voucherSelected?.endDate?.split('T')[0] ?? '',
      applyTime: props.voucherSelected?.applyISODayOfWeek ?? [timeInWeekType[0].key],
      name: props.voucherSelected?.name ?? '',
      typeVoucher: props.voucherSelected?.type ?? voucherType[0].key,
      discountUnit: props.voucherSelected?.discountUnit ?? moneyType[0].key,
      audience: props.voucherSelected?.recipientType ?? mappingRecipientType[0].key,
      selectedImage: undefined,
      status: undefined,
      numUserCanUse: props.voucherSelected?.numberUsablePerBooker,
      numUserCanUseInDay: props.voucherSelected?.dailyUsageLimitPerBooker,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name là bắt buộc'),
      typeVoucher: Yup.string().required('Loại là bắt buộc'),
      discountUnit: Yup.string().required('discountUnit là bắt buộc'),
      audience: Yup.string().required('Đối tượng là bắt buộc'),
    }),
    onSubmit: (values, { resetForm }) => {
      openConfirmModal()
      resetForm()
    },
  })

  const imageInputRef = useRef<HTMLInputElement>(null)
  const [isModalConfirmationVisible, setIsModalConfirmationVisible] = useState<boolean>(false)
  const providerCreateVoucher = trpc.useMutation(['identity.providerCreateVoucher'])
  const providerUpdateVoucher = trpc.useMutation(['identity.providerUpdateVoucher'])
  const utils = trpc.useContext()

  const [checkFieldRequied, setCheckFieldRequire] = useState<boolean>(false)
  const [checkFieldChange, setCheckFieldChange] = useState<boolean>(false)

  React.useEffect(() => {
    setCheckFieldRequire(
      !!(
        form.values.name &&
        form.values.typeVoucher &&
        form.values.numVoucher &&
        form.values.numVoucherInDay &&
        form.values.minimize &&
        form.values.typeVoucher &&
        form.values.discountUnit &&
        form.values.audience &&
        form.values.endDate &&
        new Date(form.values.endDate) >= new Date(form.values.startDate)
      ),
    )
  }, [form.values])

  React.useEffect(() => {
    if (props.voucherSelected)
      setCheckFieldChange(
        !!(
          form.values.imageSource == props.voucherSelected?.image &&
          form.values.vourcherCode == props.voucherSelected?.code &&
          form.values.name == props.voucherSelected?.name &&
          form.values.description == props.voucherSelected?.description &&
          form.values.numVoucher == props.voucherSelected?.numberIssued &&
          form.values.numVoucherInDay == props.voucherSelected?.dailyNumberIssued &&
          form.values.minimize == props.voucherSelected?.maximumDiscountValue &&
          form.values.typeVoucher == props.voucherSelected?.type &&
          form.values.discountUnit == props.voucherSelected?.discountUnit &&
          form.values.audience == props.voucherSelected?.recipientType &&
          form.values.applyTime == props.voucherSelected?.applyISODayOfWeek &&
          form.values.numUserCanUse == props.voucherSelected?.numberUsablePerBooker &&
          form.values.numUserCanUseInDay == props.voucherSelected?.dailyUsageLimitPerBooker &&
          form.values.startDate == props.voucherSelected?.startDate?.split('T')[0] &&
          form.values.endDate == props.voucherSelected?.endDate?.split('T')[0]
        ),
      )
  }, [
    form.values.applyTime,
    form.values.audience,
    form.values.description,
    form.values.discountUnit,
    form.values.endDate,
    form.values.imageSource,
    form.values.minimize,
    form.values.name,
    form.values.numUserCanUse,
    form.values.numUserCanUseInDay,
    form.values.numVoucher,
    form.values.numVoucherInDay,
    form.values.startDate,
    form.values.typeVoucher,
    form.values.vourcherCode,
    props.voucherSelected,
  ])

  function clearData() {
    form.resetForm()
  }
  function closeHandle() {
    setIsModalConfirmationVisible(false)
  }
  const handleMediaChange = (e) => {
    const file = e.target.files[0]
    if (file?.type.startsWith('image/')) {
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

  const applyTimeValue = form.values.applyTime.map((value) => {
    const item = timeInWeekType.find((item) => item.key === value)!
    return item
  })

  const handleChangeApplyDay = (dateNumber: number) => {
    let index = form.values.applyTime.indexOf(dateNumber)
    if (index !== -1 && form.values.applyTime.length > 1) {
      form.values.applyTime.splice(index, 1)
      form.setFieldValue('applyTime', form.values.applyTime)
    } else {
      form.setFieldValue('applyTime', [...form.values.applyTime, dateNumber])
    }
  }

  function handleTypeVoucher(value: IEnumType) {
    form.setFieldValue('typeVoucher', value)
  }

  function handleRecipientType(value) {
    form.setFieldValue('audience', value)
  }

  function handleTypeDiscount(value) {
    form.setFieldValue('discountUnit', value)
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
          title={`${props.actionModal == ActionEnum.CREATE ? 'Tạo khuyến mãi mới' : 'Cập hật khuyến mãi'}`}
          description={`${
            props.actionModal == ActionEnum.CREATE
              ? 'Bạn có chấp nhận tạo khuyến mãi mới hay không?'
              : 'Bạn có chấp nhận cập khuyến mãi này hay không?'
          }`}
          onClose={handleClose}
          onOk={() => {
            props.actionModal == ActionEnum.CREATE ? handleSubmitCreateVoucher() : handleSubmitUpdateVoucher()
          }}
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

  async function handleSubmitCreateVoucher() {
    if (createVoucherFormRef.current && checkFieldRequied) {
      if (form.values.selectedImage) {
        const formData = new FormData(createVoucherFormRef.current)
        const responseData = await uploadImageBooking(formData.getAll('files'))

        if (responseData?.data?.data?.results) {
          try {
            providerCreateVoucher.mutate(
              {
                code: form.values.vourcherCode,
                image: String(responseData.data.data.results),
                name: form.values.name,
                type: form.values.typeVoucher as CreateVoucherRequestTypeEnum,
                discountUnit: form.values.discountUnit as CreateVoucherRequestDiscountUnitEnum,
                recipientType: form.values.audience as CreateVoucherRequestRecipientTypeEnum,
                isHided: true,
                description: form.values.description,
                numberIssued: form.values.numVoucher,
                dailyNumberIssued: form.values.numVoucherInDay,
                numberUsablePerBooker: form.values.numUserCanUse,
                dailyUsageLimitPerBooker: form.values.numUserCanUseInDay,
                maximumDiscountValue: form.values.minimize,
                startDate: new Date(today).toISOString(),
                endDate: new Date(form.values.endDate).toISOString(),
                applyISODayOfWeek: form.values.applyTime as number[],
              },
              {
                onSuccess: (data) => {
                  if (data.success) {
                    notification.success({
                      message: 'Tạo khuyến mãi thành công!',
                      description: 'Khuyến mãi đã được tạo thành công.',
                      placement: 'bottomLeft',
                    })
                    clearData()
                    utils.invalidateQueries('identity.providerGetSelfVoucher')
                    props.handleCloseModalVoucher()
                  } else {
                    notification.error({
                      message: 'Tạo khuyến mãi thất bại!',
                      description: 'Tạo không thành công.',
                      placement: 'bottomLeft',
                    })
                  }
                },
              },
            )
          } catch (error) {
            notification.error({
              message: 'Tạo khuyến mãi thất bại!',
              description: 'Tạo không thành công. Vui lòng thử lại sau!',
              placement: 'bottomLeft',
            })
          }
        } else {
          notification.error({
            message: 'Tạo khuyến mãi thất bại!',
            description: 'Tạo không thành công. Vui lòng thử lại sau!',
            placement: 'bottomLeft',
          })
        }
      } else {
        notification.warning({
          message: 'Chưa cập nhật ảnh!',
          description: 'Vui lòng kiểm tra lại hình ảnh.',
          placement: 'bottomLeft',
        })
      }
    } else {
      notification.warning({
        message: 'Vui lòng điền đủ thông tin',
        description: 'Vui lòng điền đủ thông tin để tạo khuyến mãi.',
        placement: 'bottomLeft',
      })
    }
    closeHandle()
  }

  async function handleSubmitUpdateVoucher() {
    if (createVoucherFormRef.current && checkFieldRequied && props.voucherSelected?.id) {
      if (String(form.values.imageSource) != String(props.voucherSelected?.image)) {
        const formData = new FormData(createVoucherFormRef.current)
        const responseData = await uploadImageBooking(formData.getAll('files'))

        if (responseData?.data?.data?.results) {
          try {
            providerUpdateVoucher.mutate(
              {
                id: props.voucherSelected?.id,
                body: {
                  image: String(responseData.data.data.results),
                  name: form.values.name,
                  type: form.values.typeVoucher as CreateVoucherRequestTypeEnum,
                  discountUnit: form.values.discountUnit as CreateVoucherRequestDiscountUnitEnum,
                  recipientType: form.values.audience as CreateVoucherRequestRecipientTypeEnum,
                  isHided: true,
                  description: form.values.description,
                  numberIssued: form.values.numVoucher,
                  dailyNumberIssued: form.values.numVoucherInDay,
                  numberUsablePerBooker: form.values.numUserCanUse,
                  dailyUsageLimitPerBooker: form.values.numUserCanUseInDay,
                  maximumDiscountValue: form.values.minimize,
                  startDate: new Date(today).toISOString(),
                  endDate: new Date(form.values.endDate).toISOString(),
                  applyISODayOfWeek: form.values.applyTime as number[],
                },
              },
              {
                onSuccess: (data) => {
                  if (data.success) {
                    notification.success({
                      message: 'Tạo khuyến mãi thành công!',
                      description: 'Khuyến mãi đã được tạo thành công.',
                      placement: 'bottomLeft',
                    })
                    utils.invalidateQueries('identity.providerGetSelfVoucher')
                    clearData()
                    props.handleCloseModalVoucher()
                  } else {
                    notification.error({
                      message: 'Tạo khuyến mãi thất bại!',
                      description: 'Tạo không thành công.',
                      placement: 'bottomLeft',
                    })
                  }
                },
              },
            )
          } catch (error) {
            notification.error({
              message: 'Tạo khuyến mãi thất bại!',
              description: 'Tạo không thành công. Vui lòng thử lại sau!',
              placement: 'bottomLeft',
            })
          }
        } else {
          notification.error({
            message: 'Tạo khuyến mãi thất bại!',
            description: 'Tạo không thành công. Vui lòng thử lại sau!',
            placement: 'bottomLeft',
          })
        }
      } else {
        try {
          providerUpdateVoucher.mutate(
            {
              id: props.voucherSelected?.id,
              body: {
                image: form.values.imageSource,
                name: form.values.name,
                type: form.values.typeVoucher as CreateVoucherRequestTypeEnum,
                discountUnit: form.values.discountUnit as CreateVoucherRequestDiscountUnitEnum,
                recipientType: form.values.audience as CreateVoucherRequestRecipientTypeEnum,
                isHided: true,
                description: form.values.description,
                numberIssued: form.values.numVoucher,
                dailyNumberIssued: form.values.numVoucherInDay,
                numberUsablePerBooker: form.values.numUserCanUse,
                dailyUsageLimitPerBooker: form.values.numUserCanUseInDay,
                maximumDiscountValue: form.values.minimize,
                startDate: new Date(today).toISOString(),
                endDate: new Date(form.values.endDate).toISOString(),
                applyISODayOfWeek: form.values.applyTime as number[],
              },
            },
            {
              onSuccess: (data) => {
                if (data.success) {
                  notification.success({
                    message: 'Tạo khuyến mãi thành công!',
                    description: 'Khuyến mãi đã được tạo thành công.',
                    placement: 'bottomLeft',
                  })
                  clearData()
                  utils.invalidateQueries('identity.providerGetSelfVoucher')
                  props.handleCloseModalVoucher()
                } else {
                  notification.error({
                    message: 'Tạo khuyến mãi thất bại!',
                    description: 'Tạo không thành công.',
                    placement: 'bottomLeft',
                  })
                }
              },
            },
          )
        } catch (error) {
          notification.error({
            message: 'Tạo khuyến mãi thất bại!',
            description: 'Tạo không thành công. Vui lòng thử lại sau!',
            placement: 'bottomLeft',
          })
        }
      }
    } else {
      notification.warning({
        message: 'Vui lòng điền đủ thông tin',
        description: 'Vui lòng điền đủ thông tin để tạo khuyến mãi.',
        placement: 'bottomLeft',
      })
    }
    closeHandle()
  }

  return (
    <>
      <form
        ref={createVoucherFormRef}
        onSubmit={form.handleSubmit}
        className="min-w-[1250px] flex flex-col mb-4 gap-y-4 custom-scrollbar"
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
            <div className="flex flex-col justify-end w-2/5">
              <div className="w-full h-12 text-white">
                Tên* :
                <div className="inline-block w-2/3 ">
                  <FormInput
                    name="name"
                    type="text"
                    className={` ${
                      form.values.name == props.voucherSelected?.name ? 'bg-zinc-800' : 'bg-[#413F4D]'
                    } border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30 ${
                      form.errors.name && form.touched.name ? 'text-red-500' : ''
                    }`}
                    placeholder={'Nhập Tên *'}
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
                Mã* :
                <div className="inline-block w-2/3 h-full ">
                  <FormInput
                    name="vourcherCode"
                    className={`${
                      form.values.vourcherCode == props.voucherSelected?.code ? 'bg-zinc-800' : 'bg-[#413F4D]'
                    } border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30`}
                    placeholder="Ex: SUPPERSALE"
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
                    className={`${
                      form.values.startDate == props.voucherSelected?.startDate?.split('T')[0]
                        ? 'bg-zinc-800'
                        : 'bg-[#413F4D]'
                    } border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30`}
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
                Ngày kết thúc* :
                <div className="inline-block w-1/3 ">
                  <FormInput
                    name="endDate"
                    className={`${
                      form.values.endDate == props.voucherSelected?.endDate?.split('T')[0]
                        ? 'bg-zinc-800'
                        : 'bg-[#413F4D]'
                    } border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30`}
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
            <div className="flex flex-col justify-end w-3/5 gap-3 mt-5">
              <div className="h-12 text-white">
                Số lượng phát hành* :
                <div className="inline-block w-1/5 ">
                  <FormInput
                    name="numVoucher"
                    className={`${
                      form.values.numVoucher == props.voucherSelected?.numberIssued ? 'bg-zinc-800' : 'bg-[#413F4D]'
                    } border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30`}
                    placeholder="Số Lượng"
                    onBlur={form.handleBlur}
                    value={form.values.numVoucher}
                    error={!!form.errors.numVoucher && form.touched.numVoucher}
                    errorMessage={form.errors.numVoucher}
                    disabled={false}
                    onChange={(e) => form.handleChange(e)}
                    type="number"
                    min={0}
                    max={100000}
                  />
                </div>
              </div>

              <div className="h-12 text-white">
                Số lượng tối đa một người có thể dùng* :
                <div className="inline-block w-1/5 ">
                  <FormInput
                    name="numUserCanUse"
                    className={`${
                      form.values.numUserCanUse == props.voucherSelected?.numberUsablePerBooker
                        ? 'bg-zinc-800'
                        : 'bg-[#413F4D]'
                    } border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30`}
                    placeholder="Số Lượng"
                    value={form.values.numUserCanUse}
                    onBlur={form.handleBlur}
                    error={!!form.errors.numUserCanUse && form.touched.numUserCanUse}
                    errorMessage={form.errors.numUserCanUse}
                    onChange={(e) => form.handleChange(e)}
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
                  buttonCustomCss={`min-w-[100px] ${
                    form.values.typeVoucher == props.voucherSelected?.type ? 'bg-zinc-800' : 'bg-gray-700'
                  }`}
                  isDisplayDownButton={true}
                  datas={voucherType}
                  chooseData={voucherType.filter((item) => item.key == form.values.typeVoucher)}
                  onChange={(e) => handleTypeVoucher(e.key)}
                />
              </div>
              <div className="flex items-center gap-5 text-white">
                Thời gian áp dụng trong tuần:
                {
                  <MenuForVoucher
                    buttonTitle={applyTimeValue
                      .map((item) => {
                        return item?.label
                      })
                      .sort((a, b) => a.localeCompare(b))}
                    buttonCustomCss={`min-w-[360px] ${
                      form.values.applyTime == props.voucherSelected?.applyISODayOfWeek ? 'bg-zinc-800' : 'bg-gray-700'
                    }`}
                    isDisplayDownButton={true}
                    datas={timeInWeekType}
                    chooseData={applyTimeValue}
                    onChange={(e) => handleChangeApplyDay(e.key)}
                  />
                }
              </div>
            </div>
            <div className="flex flex-col justify-end w-2/5 gap-3">
              <div className="h-12 text-white">
                Số lượng phát hành mỗi ngày* :
                <div className="inline-block w-1/3 ">
                  <FormInput
                    name="numVoucherInDay"
                    className={`${
                      form.values.numVoucherInDay == props.voucherSelected?.dailyNumberIssued
                        ? 'bg-zinc-800'
                        : 'bg-[#413F4D]'
                    } border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30`}
                    placeholder="Số Lượng"
                    value={form.values.numVoucherInDay}
                    onBlur={form.handleBlur}
                    error={!!form.errors.numVoucherInDay && form.touched.numVoucherInDay}
                    errorMessage={form.errors.numVoucherInDay}
                    onChange={(e) => form.handleChange(e)}
                    type="number"
                    min={0}
                    max={100000}
                  />
                </div>
              </div>
              <div className="h-12 text-white">
                Số lượng tối đa người dùng trong ngày* :
                <div className="inline-block w-1/3 ">
                  <FormInput
                    name="numUserCanUseInDay"
                    className={`${
                      form.values.numUserCanUseInDay == props.voucherSelected?.dailyUsageLimitPerBooker
                        ? 'bg-zinc-800'
                        : 'bg-[#413F4D]'
                    } border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30`}
                    placeholder="Số Lượng"
                    value={form.values.numUserCanUseInDay}
                    onBlur={form.handleBlur}
                    error={!!form.errors.numUserCanUseInDay && form.touched.numUserCanUseInDay}
                    errorMessage={form.errors.numUserCanUseInDay}
                    onChange={(e) => form.handleChange(e)}
                    type="number"
                    min={0}
                    max={100000}
                  />
                </div>
              </div>
              <div className="h-12 text-white">
                Giảm tối đa* :
                <div className="inline-block w-1/4 ">
                  <FormInput
                    name="minimize"
                    className={`${
                      form.values.minimize == props.voucherSelected?.maximumDiscountValue
                        ? 'bg-zinc-800'
                        : 'bg-[#413F4D]'
                    } border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30`}
                    placeholder="Số Lượng"
                    value={form.values.minimize}
                    onBlur={form.handleBlur}
                    error={!!form.errors.minimize && form.touched.minimize}
                    errorMessage={form.errors.minimize}
                    onChange={(e) => form.handleChange(e)}
                    type="number"
                    min={0}
                    max={100}
                  />
                </div>
                <div className="inline-block w-1/4 ml-5 ">
                  <MenuForVoucher
                    buttonTitle={moneyType.find((item) => item.key == form.values.discountUnit)?.label}
                    buttonCustomCss={`min-w-[120px] ${
                      form.values.discountUnit == props.voucherSelected?.discountUnit ? 'bg-zinc-800' : 'bg-gray-700'
                    }`}
                    isDisplayDownButton={true}
                    datas={moneyType}
                    chooseData={moneyType.filter((item) => item.key == form.values.discountUnit)}
                    onChange={(e) => handleTypeDiscount(e.key)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-5 text-white">
                Đối tượng:
                <MenuForVoucher
                  buttonTitle={mappingRecipientType.find((item) => item.key == form.values.audience)?.label}
                  buttonCustomCss={`min-w-[200px] ${
                    form.values.audience == props.voucherSelected?.recipientType ? 'bg-zinc-800' : 'bg-gray-700'
                  }`}
                  isDisplayDownButton={true}
                  datas={mappingRecipientType}
                  chooseData={mappingRecipientType.filter((item) => item.key == form.values.audience)}
                  onChange={(e) => handleRecipientType(e.key)}
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
                  className={`${
                    form.values.description == props.voucherSelected?.description ? 'bg-zinc-800' : 'bg-gray-700'
                  } w-4/5 max-h-[140px]`}
                  rows={5}
                  value={form.values.description}
                  onChange={form.handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-10 pb-4 mt-6">
          {props.voucherSelected?.status == VoucherResponseStatusEnum.Approved ? (
            <>
              <p className="text-white opacity-30">Bạn chỉ có thể chỉnh sửa voucher chưa được admin chấp nhận</p>
            </>
          ) : (
            <>
              <Button
                isActive={false}
                isOutlinedButton={true}
                type="reset"
                customCSS="w-[100px] text-xl p-2 rounded-xl hover:scale-105"
                onClick={() => clearData()}
              >
                Hủy
              </Button>
              <Button
                customCSS={`w-[100px] text-xl p-2 rounded-xl ${
                  (props.actionModal == ActionEnum.CREATE ? !checkFieldRequied : checkFieldChange)
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:scale-105'
                } `}
                type="button"
                isActive={props.actionModal == ActionEnum.CREATE ? checkFieldRequied : !checkFieldChange}
                isOutlinedButton={true}
                onClick={() => {
                  openConfirmModal()
                }}
                isDisable={!form.isValid || !checkFieldRequied}
                isLoading={providerCreateVoucher.isLoading ?? providerUpdateVoucher.isLoading}
              >
                {props.actionModal == ActionEnum.CREATE ? 'Tạo' : 'Lưu'}
              </Button>
            </>
          )}
        </div>
      </form>

      {isModalConfirmationVisible && confirmModal}
    </>
  )
}
