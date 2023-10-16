import { DeleteOne, Plus } from '@icon-park/react'
import { Button, FormInput } from '@ume/ui'
import empty_img from 'public/empty_error.png'

import * as React from 'react'
import { useRef, useState } from 'react'

import { Select } from 'antd'
import { FormikErrors, useFormik } from 'formik'
import Image from 'next/legacy/image'
import { ServiceResponse } from 'ume-service-openapi'
import * as Yup from 'yup'

import ServiceAttributes from './services-attribute-childrend'

import FilterDropdown from '~/components/filter-dropdown'
import ModalBase from '~/components/modal-base'
import ComfirmModal from '~/components/modal-base/comfirm-modal'

import { trpc } from '~/utils/trpc'

export interface IServicesModalUpdateProps {
  closeFunction: any
  openValue: boolean
  idService: string
}

export default function ServicesModalUpdate({ idService, closeFunction, openValue }: IServicesModalUpdateProps) {
  console.log(idService)
  const [servicesDetails, setServicesDetails] = useState<ServiceResponse>()
  const SELECT = [
    '$all',
    {
      serviceAttributes: [
        '$all',
        {
          serviceAttributeValues: ['$all'],
        },
      ],
    },
  ]
  const { isLoading, isFetching } = trpc.useQuery(
    ['services.getServiceDetails', { id: idService, select: JSON.stringify(SELECT) }],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      // refetchOnMount: false,
      // refetchInterval: false,
      // refetchIntervalInBackground: false,
      onSuccess(data) {
        setServicesDetails(data.data)
      },
    },
  )
  const titleValue = 'Chỉnh sửa dịch vụ'
  const [openConfirm, setOpenConfirm] = useState(false)
  const [isCreate, setIsCreate] = useState<boolean>(false)
  const [isSubmiting, setSubmiting] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const nameInit = 'Test ne'
  const viNameInit = servicesDetails?.name
  const imageUrlInit = servicesDetails?.imageUrl || empty_img
  const isActivatedInit = true
  const numberUsedInit = 100
  const createdAtInit = servicesDetails?.createdAt
    ? new Date(servicesDetails?.createdAt).toLocaleDateString('en-GB')
    : ''
  const serviceAttributesInit = servicesDetails?.serviceAttributes || []

  const form = useFormik({
    initialValues: {
      name: nameInit,
      viName: viNameInit,
      imageUrl: imageUrlInit,
      isActivated: isActivatedInit,
      serviceAttributes: serviceAttributesInit,
      numberUsed: numberUsedInit,
      createdAt: createdAtInit,
      selectedImage: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Tên là bắt buộc'),
      viName: Yup.string().required('Tên là bắt buộc'),
      serviceAttributes: Yup.array()
        .of(
          Yup.object({
            attribute: Yup.string(),
            viAttribute: Yup.string(),
            isActivated: Yup.boolean(),
            serviceAttributeValues: Yup.array()
              .of(
                Yup.object({
                  value: Yup.string(),
                  viValue: Yup.string(),
                  isActivated: Yup.boolean(),
                }),
              )
              .min(0, ''),
          }),
        )
        .min(0, ''),
    }),
    onSubmit: (values, { resetForm }) => {
      setSubmiting(true)
      openConfirmModal()
      resetForm()
    },
  })

  React.useEffect(() => {
    form.setFieldValue('name', nameInit)
    form.setFieldValue('viName', viNameInit)
    form.setFieldValue('imageUrl', imageUrlInit)
    form.setFieldValue('isActivated', isActivatedInit)
    form.setFieldValue('serviceAttributes', serviceAttributesInit)
    form.setFieldValue('numberUsed', numberUsedInit)
    form.setFieldValue('createdAt', createdAtInit)
  }, [servicesDetails])

  function closeHandleSmall() {
    openConfirmModalCancel()
  }
  function openConfirmModalCancel() {
    setOpenConfirm(true)
  }
  function openConfirmModal() {
    setIsCreate(true)
    setOpenConfirm(true)
  }
  function closeComfirmFormHandle() {
    setOpenConfirm(false)
    setIsCreate(false)
  }
  function clearData() {
    form.resetForm()
  }
  function closeHandle() {
    setOpenConfirm(false)
    clearData()
    closeFunction()
  }
  const handleImageClick = () => {
    if (imageInputRef) {
      imageInputRef.current?.click()
    }
  }
  const handleMediaChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        form.setFieldValue('selectedImage', file)
        form.setFieldValue('imageUrl', URL.createObjectURL(file))
      }
      reader.readAsDataURL(file)
    }
  }

  const addChildComponent = () => {
    form.setFieldValue('serviceAttributes', [
      ...form.values.serviceAttributes,
      {
        attribute: '',
        viAttribute: '',
        isActivated: true,
        serviceAttributeValues: [],
      },
    ])
  }
  const removeChildComponent = (index) => {
    console.log(index)
    const updatedSubChildData = [...form.values.serviceAttributes]
    updatedSubChildData.splice(index, 1)
    form.setFieldValue(`serviceAttributes`, updatedSubChildData)
  }

  function handleActivate(value) {
    form.setFieldValue('isActivated', value)
  }
  function filterOptionTypeVoucher(input, option) {
    return (option?.label ?? '').toUpperCase().includes(input.toUpperCase())
  }
  const mappingStatus = {
    false: 'Tạm dừng',
    true: 'Hoạt động',
  }
  async function submitHandle() {
    closeHandle()
  }
  return (
    <div>
      <form onSubmit={form.handleSubmit} className="flex flex-col mb-4 gap-y-4">
        <ModalBase
          titleValue={titleValue}
          closeFunction={closeFunction}
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
                  !form.values.imageUrl && ' flex items-center justify-center border-dashed border-2 border-[#FFFFFF80]'
                }
                `}
                  onClick={handleImageClick}
                >
                  {form.values.imageUrl && (
                    <Image
                      className="overflow-hidden rounded-2xl"
                      width={144}
                      height={208}
                      src={form.values.imageUrl}
                      alt=""
                      objectFit="cover"
                    />
                  )}
                  {!form.values.imageUrl && (
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
              <div className="flex flex-col justify-center w-2/5 ">
                <div className="w-64 h-24 text-white">
                  <div className="inline-block w-full h-8">Tên tiếng việt:</div>
                  <div className="inline-block w-full ">
                    <FormInput
                      autoComplete="off"
                      name="viName"
                      className={`bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 ${
                        form.errors.viName && form.touched.viName ? 'placeholder:text-red-500' : ''
                      }`}
                      placeholder={!!form.errors.viName && form.touched.viName ? form.errors.viName : 'Tên kỹ năng '}
                      disabled={false}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      value={form.values.viName}
                      error={!!form.errors.viName && form.touched.viName}
                      errorMessage={''}
                    />
                  </div>
                </div>
                <div className="w-64 h-12 text-white">
                  <div className="inline-block w-full h-8">Tên tiếng anh:</div>
                  <div className="inline-block w-full ">
                    <FormInput
                      autoComplete="off"
                      name="name"
                      className={`bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 ${
                        form.errors.name && form.touched.name ? 'placeholder:text-red-500' : ''
                      }`}
                      placeholder={!!form.errors.name && form.touched.name ? form.errors.name : 'Tên kỹ năng '}
                      disabled={false}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      value={form.values.name}
                      error={!!form.errors.name && form.touched.name}
                      errorMessage={''}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center w-2/5 ">
                <div className="w-full h-12 text-white">
                  Trạng Thái:
                  <div className="inline-block w-2/3 pl-4">
                    <Select
                      showSearch
                      placeholder="Loại"
                      optionFilterProp="children"
                      onChange={handleActivate}
                      filterOption={filterOptionTypeVoucher}
                      value={form.values.isActivated}
                      style={{
                        minWidth: '8rem',
                        marginLeft: '1rem',
                      }}
                      options={[
                        {
                          value: true,
                          label: 'Hoạt động',
                        },
                        {
                          value: false,
                          label: 'Tạm dừng',
                        },
                      ]}
                    />
                  </div>
                </div>
                <div className="w-full h-12 text-white">
                  Số người dùng: <span className="inline-block w-2/3 pl-4">{form.values.numberUsed} người</span>
                </div>
                <div className="w-full h-12 text-white">
                  Ngày Tạo: <span className="inline-block w-2/3 pl-4">{form.values.createdAt}</span>
                </div>
              </div>
            </div>
          </div>
          {/* compent-child */}

          <div className="grid grid-cols-2 gap-4 px-4 pb-4 mt-6">
            {form.values.serviceAttributes.map((childData, index) => (
              <div className="col-span-1 " key={index}>
                <ServiceAttributes
                  id={index}
                  serviceAttributesData={childData}
                  setServiceAttributesData={(data) => {
                    const updatedSubChildData = [...form.values.serviceAttributes]
                    updatedSubChildData[index] = data
                    form.setFieldValue(`serviceAttributes[${index}]`, data)
                  }}
                  removeChildComponent={(id) => {
                    removeChildComponent(id)
                  }}
                />
              </div>
            ))}
            <div className="col-span-1 ">
              <div className="flex items-center justify-center w-full h-full">
                <div className="w-40">
                  <Button
                    customCSS="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 hover:scale-110"
                    onClick={addChildComponent}
                  >
                    <Plus theme="outline" size="24" fill="#fff" />
                    Thêm dịch vụ
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center pb-4 mt-6">
            <Button customCSS="mx-6 px-4 py-1 border-2 hover:scale-110" onClick={openConfirmModalCancel}>
              Hủy
            </Button>
            <Button
              customCSS={`mx-6 px-4 py-1 border-2 ${
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
          titleValue={isCreate ? 'Xác nhận sửa' : 'Xác nhận hủy'}
        ></ComfirmModal>
      )}
    </div>
  )
}
