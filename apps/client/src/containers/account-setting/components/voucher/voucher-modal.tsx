import { CloseSmall, Plus } from '@icon-park/react'
import { Button, FormInput, Modal, TextArea } from '@ume/ui'
import coin from 'public/coin-icon.png'
import { uploadImageBooking } from '~/apis/upload-media'
import { useAuth } from '~/contexts/auth'
import { ActionEnum } from '~/enumVariable/enumVariable'
import useDebounce from '~/hooks/useDebounce'

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

interface IEnumType {
  key: string | number
  label: React.ReactNode
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
    label: <Image src={coin} width={25} height={25} alt="coin" />,
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
      discountValue: props.voucherSelected?.discountValue,
      minimize: props.voucherSelected?.maximumDiscountValue,
      minimumBookingTotalPriceForUsage: props.voucherSelected?.minimumBookingTotalPriceForUsage,
      minimumBookingDurationForUsage: props.voucherSelected?.minimumBookingDurationForUsage,
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
      name: Yup.string().required('Tên là bắt buộc'),
      vourcherCode: Yup.string().required('Mã là bắt buộc'),
      endDate: Yup.date()
        .required('Ngày kết thúc là bắt buộc')
        .when(
          'startDate',
          (startDate, yup) => startDate && yup.min(startDate, 'Ngày kết thúc không thể trước này phát hành'),
        ),
      numVoucher: Yup.number()
        .required('Số lượng là bắt buộc')
        .moreThan(0, 'Số lượng phải lớn hơn 0')
        .lessThan(10001, 'Số lượng không vượt quá 10.000'),
      numVoucherInDay: Yup.number().test({
        name: 'numVoucherInDay',
        test: function (value, { parent }) {
          if ((value ?? 0) <= parent.numVoucher) {
            return true
          } else {
            return this.createError({
              message: 'Không được lớn hơn số lượng',
            })
          }
        },
      }),
      numUserCanUse: Yup.number().test({
        name: 'numUserCanUse',
        test: function (value, { parent }) {
          if ((value ?? 0) <= parent.numVoucher) {
            return true
          } else {
            return this.createError({
              message: 'Không được lớn hơn số lượng',
            })
          }
        },
      }),
      numUserCanUseInDay: Yup.number().test({
        name: 'numUserCanUseInDay',
        test: function (value, { parent }) {
          if ((value ?? 0) <= parent.numUserCanUse) {
            return true
          } else {
            return this.createError({
              message: 'Không được lớn hơn số lượng có thể sử dụng',
            })
          }
        },
      }),
      typeVoucher: Yup.string().required('Loại là bắt buộc'),
      discountUnit: Yup.string().required('Đơn vị là bắt buộc'),
      audience: Yup.string().required('Đối tượng là bắt buộc'),
      discountValue: Yup.number().moreThan(0, 'Số tiền phải lớn hơn 0').lessThan(101, 'Số tiền không vượt quá 100'),
      minimize: Yup.number().moreThan(0, 'Số tiền phải lớn hơn 0').lessThan(101, 'Số tiền không vượt quá 100'),
      minimumBookingTotalPriceForUsage: Yup.number().lessThan(10001, 'Số tiền không vượt quá 10.000'),
      minimumBookingDurationForUsage: Yup.number().lessThan(10001, 'Số tiền không vượt quá 10.000'),
    }),
    onSubmit: (values, { resetForm }) => {
      openConfirmModal()
      resetForm()
    },
  })

  const imageInputRef = useRef<HTMLInputElement>(null)
  const [isModalConfirmationVisible, setIsModalConfirmationVisible] = useState<boolean>(false)
  const debouncedValue = useDebounce<string>(form.values.vourcherCode, 500)
  const { data: checkVoucherCode, isLoading: isCheckVoucherCodeLoading } = trpc.useQuery([
    'identity.providerCheckVoucherCode',
    debouncedValue,
  ])
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
                      message: 'Cập nhật khuyến mãi thành công!',
                      description: 'Khuyến mãi đã được cập nhật thành công.',
                      placement: 'bottomLeft',
                    })
                    utils.invalidateQueries('identity.providerGetSelfVoucher')
                    clearData()
                    props.handleCloseModalVoucher()
                  } else {
                    notification.error({
                      message: 'Cập nhật thất bại!',
                      description: 'Cập nhật khuyến mãi không thành công. Vui lòng thử lại sau!',
                      placement: 'bottomLeft',
                    })
                  }
                },
              },
            )
          } catch (error) {
            notification.error({
              message: 'Cập nhật thất bại!',
              description: 'Cập nhật khuyến mãi không thành công. Vui lòng thử lại sau!',
              placement: 'bottomLeft',
            })
          }
        } else {
          notification.error({
            message: 'Cập nhật thất bại!',
            description: 'Cập nhật khuyến mãi không thành công. Vui lòng thử lại sau!',
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
                    message: 'Cập nhật khuyến mãi thành công!',
                    description: 'Khuyến mãi đã được cập nhật thành công.',
                    placement: 'bottomLeft',
                  })
                  clearData()
                  utils.invalidateQueries('identity.providerGetSelfVoucher')
                  props.handleCloseModalVoucher()
                } else {
                  notification.error({
                    message: 'Cập nhật thất bại!',
                    description: 'Cập nhật khuyến mãi không thành công. Vui lòng thử lại sau!',
                    placement: 'bottomLeft',
                  })
                }
              },
            },
          )
        } catch (error) {
          notification.error({
            message: 'Cập nhật thất bại!',
            description: 'Cập nhật khuyến mãi không thành công. Vui lòng thử lại sau!',
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
              <div className="w-full text-white">
                Tên* :
                <div className="relative h-12 ml-4 inline-block w-2/3">
                  <FormInput
                    name="name"
                    type="text"
                    className={` ${
                      form.values.name == props.voucherSelected?.name ? 'bg-zinc-800' : 'bg-[#413F4D]'
                    } border-2 border-[#FFFFFF] h-8 border-opacity-30 ${
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
                  {!!form.errors.name && form.touched.name && (
                    <p className="absolute bottom-0 text-red-500 text-xs">{form.errors.name}</p>
                  )}
                </div>
              </div>
              <div className="h-12 text-white">
                Mã* :
                <div className="relative h-12 ml-4 inline-block w-2/3">
                  <FormInput
                    name="vourcherCode"
                    className={`${
                      form.values.vourcherCode == props.voucherSelected?.code ? 'bg-zinc-800' : 'bg-[#413F4D]'
                    } border-2 border-[#FFFFFF] h-8 border-opacity-30`}
                    placeholder="Ex: SUPPERSALE"
                    disabled={false}
                    onChange={(e) => {
                      e.target.value = e.target.value.toUpperCase()
                      form.handleChange(e)
                    }}
                    onBlur={form.handleBlur}
                    value={form.values.vourcherCode}
                    error={
                      (!!form.errors.vourcherCode && form.touched.vourcherCode) ||
                      (props.actionModal == ActionEnum.CREATE && checkVoucherCode?.data.isExisted)
                    }
                    errorMessage={''}
                    isDisable={!!props.voucherSelected?.code}
                    type="text"
                  />
                  {!!form.errors.vourcherCode && form.touched.vourcherCode && (
                    <p className="absolute bottom-0 text-red-500 text-xs">{form.errors.vourcherCode}</p>
                  )}
                  {!isCheckVoucherCodeLoading ? (
                    props.actionModal == ActionEnum.CREATE &&
                    checkVoucherCode?.data.isExisted && (
                      <p className="absolute bottom-0 text-red-500 text-xs">Mã này đã được sử dụng</p>
                    )
                  ) : (
                    <span
                      className={`absolute bottom-0 right-0 spinner h-3 w-3 animate-spin rounded-full border-[2px] border-r-transparent dark:border-navy-300 dark:border-r-transparent border-white`}
                    />
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
                    min={form.values.startDate ?? today}
                    disabled={!!form.values.startDate}
                    required
                  />
                </div>
              </div>
              <div className="h-12 flex justify-start text-white">
                Ngày kết thúc* :
                <div className="relative inline-block w-1/3 ml-4">
                  <FormInput
                    name="endDate"
                    className={`${
                      form.values.endDate == props.voucherSelected?.endDate?.split('T')[0]
                        ? 'bg-zinc-800'
                        : 'bg-[#413F4D]'
                    } border-2 border-[#FFFFFF] h-8 border-opacity-30`}
                    type="date"
                    pattern="\d{2}/\d{2}/\d{4}"
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    value={form.values.endDate}
                    error={!!form.errors.endDate && form.touched.endDate}
                    errorMessage={''}
                    min={form.values.startDate}
                    required
                  />
                  {!!form.errors.endDate && form.touched.endDate && (
                    <p className="absolute bottom-0 text-red-500 text-xs">{form.errors.endDate}</p>
                  )}
                </div>
              </div>
              <div className="h-12 text-white">
                {form.values.status && 'Trạng thái: <span className="font-bold">{status}</span>'}
              </div>
            </div>
          </div>

          <div className="flex w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
            <div className="flex flex-col justify-end w-3/5 mt-5 gap-3">
              <div className="text-white">
                Số lượng phát hành* :
                <div className="relative inline-block w-2/5 h-12 ml-4">
                  <div className="w-3/5">
                    <FormInput
                      name="numVoucher"
                      className={`${
                        form.values.numVoucher == props.voucherSelected?.numberIssued ? 'bg-zinc-800' : 'bg-[#413F4D]'
                      } border-2 border-[#FFFFFF] h-8 border-opacity-30`}
                      placeholder="Số Lượng"
                      onBlur={form.handleBlur}
                      value={form.values.numVoucher}
                      error={!!form.errors.numVoucher && form.touched.numVoucher}
                      errorMessage={''}
                      disabled={false}
                      onChange={(e) => form.handleChange(e)}
                      type="number"
                      min={0}
                      max={100000}
                    />
                  </div>
                  {!!form.errors.numVoucher && form.touched.numVoucher && (
                    <p className="absolute bottom-0 text-red-500 text-xs">{form.errors.numVoucher}</p>
                  )}
                </div>
              </div>

              <div className="h-12 text-white">
                Số lượng tối đa một người có thể dùng* :
                <div className="relative inline-block w-2/5 h-12 ml-4">
                  <div className="w-3/5">
                    <FormInput
                      name="numUserCanUse"
                      className={`${
                        form.values.numUserCanUse == props.voucherSelected?.numberUsablePerBooker
                          ? 'bg-zinc-800'
                          : 'bg-[#413F4D]'
                      } border-2 border-[#FFFFFF] h-8 border-opacity-30`}
                      placeholder="Số Lượng"
                      value={form.values.numUserCanUse}
                      onBlur={form.handleBlur}
                      error={!!form.errors.numUserCanUse && form.touched.numUserCanUse}
                      errorMessage={''}
                      onChange={(e) => form.handleChange(e)}
                      type="number"
                      min={0}
                      max={100000}
                    />
                  </div>
                  {!!form.errors.numUserCanUse && form.touched.numUserCanUse && (
                    <p className="absolute bottom-0 text-red-500 text-xs">{form.errors.numUserCanUse}</p>
                  )}
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
                      .sort()}
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
              <div className="h-12 text-white flex items-center">
                Số giờ tối thiểu để sử dụng:
                <div className="relative ml-4 h-12 flex items-center w-6/12 ">
                  <div className="w-5/12 flex items-center">
                    <FormInput
                      name="minimumBookingDurationForUsage"
                      className={`${
                        form.values.minimumBookingDurationForUsage ==
                        props.voucherSelected?.minimumBookingDurationForUsage
                          ? 'bg-zinc-800'
                          : 'bg-[#413F4D]'
                      } border-2 border-[#FFFFFF] h-8 border-opacity-30`}
                      placeholder="Số giờ"
                      value={form.values.minimumBookingDurationForUsage}
                      onBlur={form.handleBlur}
                      error={
                        !!form.errors.minimumBookingDurationForUsage && form.touched.minimumBookingDurationForUsage
                      }
                      errorMessage={''}
                      onChange={(e) => form.handleChange(e)}
                      type="number"
                      min={0}
                      max={100000}
                    />
                  </div>
                  {!!form.errors.minimumBookingDurationForUsage && form.touched.minimumBookingDurationForUsage && (
                    <p className="absolute bottom-[-10px] left-0 text-red-500 text-xs">
                      {form.errors.minimumBookingDurationForUsage}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-end w-2/5 gap-3">
              <div className="h-12 text-white">
                Số lượng phát hành mỗi ngày:
                <div className="relative inline-block w-2/5 h-12 ml-4">
                  <div className="w-3/5">
                    <FormInput
                      name="numVoucherInDay"
                      className={`${
                        form.values.numVoucherInDay == props.voucherSelected?.dailyNumberIssued
                          ? 'bg-zinc-800'
                          : 'bg-[#413F4D]'
                      } border-2 border-[#FFFFFF] h-8 border-opacity-30`}
                      placeholder="Số Lượng"
                      value={form.values.numVoucherInDay}
                      onBlur={form.handleBlur}
                      error={!!form.errors.numVoucherInDay && form.touched.numVoucherInDay}
                      errorMessage={''}
                      onChange={(e) => form.handleChange(e)}
                      type="number"
                      min={0}
                      max={100000}
                    />
                  </div>
                  {!!form.errors.numVoucherInDay && form.touched.numVoucherInDay && (
                    <p className="absolute bottom-0 text-red-500 text-xs">{form.errors.numVoucherInDay}</p>
                  )}
                </div>
              </div>
              <div className="relative h-12 text-white">
                Số lượng tối đa người dùng trong ngày:
                <div className="inline-block w-1/5 h-12 ml-4">
                  <FormInput
                    name="numUserCanUseInDay"
                    className={`${
                      form.values.numUserCanUseInDay == props.voucherSelected?.dailyUsageLimitPerBooker
                        ? 'bg-zinc-800'
                        : 'bg-[#413F4D]'
                    } border-2 border-[#FFFFFF] h-8 border-opacity-30`}
                    placeholder="Số Lượng"
                    value={form.values.numUserCanUseInDay}
                    onBlur={form.handleBlur}
                    error={!!form.errors.numUserCanUseInDay && form.touched.numUserCanUseInDay}
                    errorMessage={''}
                    onChange={(e) => form.handleChange(e)}
                    type="number"
                    min={0}
                    max={100000}
                  />
                </div>
                {!!form.errors.numUserCanUseInDay && form.touched.numUserCanUseInDay && (
                  <p className="absolute bottom-0 right-0 text-red-500 text-xs">{form.errors.numUserCanUseInDay}</p>
                )}
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="relative h-12 flex items-center">
                  Giảm* :
                  <div className="w-4/12 ml-4 flex items-center">
                    <FormInput
                      name="discountValue"
                      className={`${
                        form.values.discountValue == props.voucherSelected?.discountValue
                          ? 'bg-zinc-800'
                          : 'bg-[#413F4D]'
                      } border-2 border-[#FFFFFF] h-8 border-opacity-30`}
                      placeholder=""
                      value={form.values.discountValue}
                      onBlur={form.handleBlur}
                      error={!!form.errors.discountValue && form.touched.discountValue}
                      errorMessage={''}
                      onChange={(e) => form.handleChange(e)}
                      type="number"
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="w-4/12 ml-1 flex items-center">
                    <MenuForVoucher
                      buttonTitle={moneyType.find((item) => item.key == form.values.discountUnit)?.label}
                      buttonCustomCss={`min-w-[50px] ${
                        form.values.discountUnit == props.voucherSelected?.discountUnit ? 'bg-zinc-800' : 'bg-gray-700'
                      }`}
                      isDisplayDownButton={true}
                      datas={moneyType}
                      chooseData={moneyType.filter((item) => item.key == form.values.discountUnit)}
                      onChange={(e) => handleTypeDiscount(e.key)}
                    />
                  </div>
                  {!!form.errors.discountValue && form.touched.discountValue && (
                    <p className="absolute bottom-[-10px] left-14 text-red-500 text-xs">{form.errors.discountValue}</p>
                  )}
                </div>
                {form.values.discountUnit == CreateVoucherRequestDiscountUnitEnum.Percent && (
                  <div className="relative w-6/12 h-12 flex items-center">
                    Giảm tối đa:
                    <div className="w-5/12 flex items-center">
                      <FormInput
                        name="minimize"
                        className={`${
                          form.values.minimize == props.voucherSelected?.maximumDiscountValue
                            ? 'bg-zinc-800'
                            : 'bg-[#413F4D]'
                        } border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30`}
                        placeholder=""
                        value={form.values.minimize}
                        onBlur={form.handleBlur}
                        error={!!form.errors.minimize && form.touched.minimize}
                        errorMessage={''}
                        onChange={(e) => form.handleChange(e)}
                        type="number"
                        min={0}
                        max={100}
                      />
                    </div>
                    <Image src={coin} width={35} height={35} alt="coin" />
                    {!!form.errors.minimize && form.touched.minimize && (
                      <p className="absolute bottom-[-10px] left-20 text-red-500 text-xs">{form.errors.minimize}</p>
                    )}
                  </div>
                )}
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
              <div className="h-12 text-white flex items-center">
                Số tiền tối thiểu để sử dụng:
                <div className="relative w-6/12 h-12 flex items-center">
                  <div className="w-8/12 flex items-center">
                    <FormInput
                      name="minimumBookingTotalPriceForUsage"
                      className={`${
                        form.values.minimumBookingTotalPriceForUsage ==
                        props.voucherSelected?.minimumBookingTotalPriceForUsage
                          ? 'bg-zinc-800'
                          : 'bg-[#413F4D]'
                      } border-2 border-[#FFFFFF] h-8 ml-4 border-opacity-30`}
                      placeholder="Số tiền"
                      value={form.values.minimumBookingTotalPriceForUsage}
                      onBlur={form.handleBlur}
                      error={
                        !!form.errors.minimumBookingTotalPriceForUsage && form.touched.minimumBookingTotalPriceForUsage
                      }
                      errorMessage={''}
                      onChange={(e) => form.handleChange(e)}
                      type="number"
                      min={0}
                      max={100000}
                    />
                  </div>
                  <Image src={coin} width={35} height={35} alt="coin" />
                  {!!form.errors.minimumBookingTotalPriceForUsage && form.touched.minimumBookingTotalPriceForUsage && (
                    <p className="absolute bottom-[-10px] left-0 text-red-500 text-xs">
                      {form.errors.minimumBookingTotalPriceForUsage}
                    </p>
                  )}
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
        <div className="flex justify-center pb-4 mt-6 gap-10">
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
                  (
                    props.actionModal == ActionEnum.CREATE
                      ? !checkFieldRequied || checkVoucherCode?.data.isExisted
                      : checkFieldChange
                  )
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:scale-105'
                } `}
                type="button"
                isActive={
                  props.actionModal == ActionEnum.CREATE
                    ? checkFieldRequied && !checkVoucherCode?.data.isExisted
                    : !checkFieldChange
                }
                isOutlinedButton={true}
                onClick={() => {
                  if (
                    props.actionModal == ActionEnum.CREATE
                      ? checkFieldRequied && !checkVoucherCode?.data.isExisted
                      : !checkFieldChange
                  ) {
                    openConfirmModal()
                  }
                }}
                isDisable={(!form.isValid || !checkFieldRequied) && !checkVoucherCode?.data.isExisted}
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
