import { DeleteOne, Plus } from '@icon-park/react'
import { Button, FormInput } from '@ume/ui'
import empty_img from 'public/empty_error.png'
import { uploadImageServices } from '~/api/upload-media'
import useDebounce from '~/hooks/adminDebounce'

import * as React from 'react'
import { useRef, useState } from 'react'

import { Select, notification } from 'antd'
import { useFormik } from 'formik'
import Image from 'next/legacy/image'
import { PrismaWhereConditionType, prismaWhereConditionToJsonString } from 'query-string-prisma-ume'
import {
  HandleServiceAttributeRequest,
  HandleServiceAttributeRequestHandleTypeEnum,
  HandleServiceAttributeValueRequestHandleTypeEnum,
  ServicePagingResponse,
  ServiceResponse,
  UpdateServiceRequest,
} from 'ume-service-openapi'
import * as Yup from 'yup'

import ServiceAttributes from './services-attribute-childrend'

import ModalBase from '~/components/modal-base'
import ComfirmModal from '~/components/modal-base/comfirm-modal'

import { trpc } from '~/utils/trpc'

export interface IServicesModalUpdateProps {
  closeFunction: any
  openValue: boolean
  idService: string
}

export const ServicesModalUpdate = ({ idService, closeFunction, openValue }: IServicesModalUpdateProps) => {
  const utils = trpc.useContext()
  const [servicesDetails, setServicesDetails] = useState<ServiceResponse>()
  const SELECT = [
    '$all',
    {
      serviceAttributes: [
        '$all',
        {
          serviceAttributeValues: ['$all', { $where: { deletedAt: null } }],
        },
        { $where: { deletedAt: null } },
      ],
    },
  ]
  trpc.useQuery(['services.getServiceDetails', { id: idService, select: JSON.stringify(SELECT) }], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    onSuccess(data) {
      setServicesDetails(data.data)
    },
  })
  const titleValue = 'Chỉnh sửa dịch vụ'
  const [openConfirm, setOpenConfirm] = useState(false)
  const [isCreate, setIsCreate] = useState<boolean>(false)
  const [isSubmiting, setSubmiting] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const nameInit = servicesDetails?.name ?? ''
  const viNameInit = servicesDetails?.viName ?? ''
  const imageUrlInit = servicesDetails?.imageUrl ?? empty_img
  const isActivatedInit = true
  const numberUsedInit = servicesDetails?.countProviderUsed
  const createdAtInit = servicesDetails?.createdAt
    ? new Date(servicesDetails?.createdAt).toLocaleDateString('en-GB')
    : ''
  const serviceAttributesInit =
    servicesDetails?.serviceAttributes?.map((service) => {
      const updatedService = { ...service, handleType: HandleServiceAttributeRequestHandleTypeEnum.Update }
      if (service.serviceAttributeValues) {
        updatedService.serviceAttributeValues = service.serviceAttributeValues.map((value) => ({
          ...value,
          handleType: HandleServiceAttributeValueRequestHandleTypeEnum.Update,
        }))
      }
      return updatedService
    }) ?? []

  const updateService = trpc.useMutation(['services.updateService'])
  const [isExitName, setIsExitName] = useState<boolean>(false)
  const [isExitViName, setIsExitViName] = useState<boolean>(false)
  const NOT_EXITED = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  const [serviceList, setServiceList] = useState<ServicePagingResponse | undefined>()
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
      name: Yup.string().required('Tên dịch vụ bắt buộc'),
      viName: Yup.string(),
      serviceAttributes: Yup.array()
        .of(
          Yup.object({
            attribute: Yup.string().required('Thuộc tính là bắt buộc'),
            viAttribute: Yup.string(),
            isActivated: Yup.boolean(),
            serviceAttributeValues: Yup.array()
              .of(
                Yup.object({
                  value: Yup.string().required('Thuộc tính là bắt buộc'),
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
    if (servicesDetails) {
      form.resetForm({
        values: {
          name: nameInit,
          viName: viNameInit,
          imageUrl: imageUrlInit,
          isActivated: isActivatedInit,
          serviceAttributes: serviceAttributesInit,
          numberUsed: numberUsedInit,
          createdAt: createdAtInit,
          selectedImage: null,
        },
      })
    }
  }, [nameInit])

  const debouncedName = useDebounce<string>(form.values.name, 500)
  const debouncedViName = useDebounce<string>(form.values.viName, 500)
  const checkNameQuery: PrismaWhereConditionType<ServicePagingResponse> = Object.assign({
    OR: [
      {
        name: {
          equals: debouncedName ? debouncedName + '' : NOT_EXITED,
          mode: 'insensitive',
        },
      },
      {
        viName: {
          equals: debouncedName ? debouncedName + '' : NOT_EXITED,
          mode: 'insensitive',
        },
      },
    ],
  })
  trpc.useQuery(
    [
      'services.getServiceList',
      {
        limit: '1',
        page: '1',
        select: undefined,
        where: prismaWhereConditionToJsonString(checkNameQuery, ['isUndefined']),
        order: undefined,
      },
    ],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 0,
      refetchOnMount: true,
      onSuccess(data) {
        setServiceList(data.data)
        console.log(data.data)
        if (data.data.count != 0) {
          const idRow = data.data.row ? data.data.row[0]?.id : undefined
          if (idRow !== idService) {
            if (debouncedName != nameInit) setIsExitName(true)
            else {
              setIsExitName(false)
            }
          } else {
            setIsExitName(false)
          }
        } else {
          setIsExitName(false)
        }
      },
    },
  )

  const checkViNameQuery: PrismaWhereConditionType<ServicePagingResponse> = Object.assign({
    OR: [
      {
        name: {
          equals: debouncedViName ? debouncedViName + '' : NOT_EXITED,
          mode: 'insensitive',
        },
      },
      {
        viName: {
          equals: debouncedViName ? debouncedViName + '' : NOT_EXITED,
          mode: 'insensitive',
        },
      },
    ],
  })
  trpc.useQuery(
    [
      'services.getServiceList',
      {
        limit: '1',
        page: '1',
        select: undefined,
        where: prismaWhereConditionToJsonString(checkViNameQuery, ['isUndefined']),
        order: undefined,
      },
    ],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 0,
      refetchOnMount: true,
      onSuccess(data) {
        setServiceList(data.data)
        if (data.data.count != 0) {
          const idRow = data.data.row ? data.data.row[0]?.id : undefined
          if (idRow !== idService) {
            if (debouncedViName != viNameInit) setIsExitViName(true)
            else {
              setIsExitViName(false)
            }
          } else {
            setIsExitViName(false)
          }
        } else {
          setIsExitViName(false)
        }
      },
    },
  )
  function closeHandleSmall() {
    if (!form.dirty) {
      closeHandle()
    } else openConfirmModalCancel()
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
        handleType: HandleServiceAttributeRequestHandleTypeEnum.Create,
      },
    ])
  }
  const removeChildComponent = (index) => {
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
  const uploadImage = async () => {
    let imageUrl = ''
    try {
      if (form.values.selectedImage) {
        const formData = new FormData()
        formData.append('image', form.values.selectedImage)
        const responseData = await uploadImageServices(formData)
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
  function convertToIsoDate(inputDate) {
    const parts = inputDate.split('/')
    const reversedDate = parts[2] + '-' + parts[1] + '-' + parts[0]
    const newDate = new Date(reversedDate)
    const isoDate = newDate.toISOString()

    return isoDate
  }

  const getUpdateReq = () => {
    let updateRes: Array<HandleServiceAttributeRequest> = JSON.parse(JSON.stringify(form.values.serviceAttributes))
    serviceAttributesInit.filter((service) => {
      const matchingUpdateService = form.values.serviceAttributes.find(
        (updateService) => updateService.id === service.id,
      )
      if (!matchingUpdateService) {
        const res = {
          ...service,
          handleType: HandleServiceAttributeRequestHandleTypeEnum.Delete,
        } as HandleServiceAttributeRequest
        updateRes.push(res)
      } else {
        const serviceAttributeValues = service.serviceAttributeValues
        if (serviceAttributeValues) {
          const updateServiceAttributeValues = matchingUpdateService.serviceAttributeValues
          const valueNotInValueInit = serviceAttributeValues.filter((value) => {
            return !updateServiceAttributeValues?.some((item) => item.id === value.id)
          })
          if (valueNotInValueInit.length !== 0) {
            valueNotInValueInit.filter((value) => {
              const res = { ...value, handleType: HandleServiceAttributeRequestHandleTypeEnum.Delete }
              const indexToUpdate = updateRes.findIndex((item) => item.id === service.id)
              updateRes[indexToUpdate]?.serviceAttributeValues?.push(res)
            })
          }
        }
      }
      return true
    })
    return updateRes
  }

  async function submitHandle() {
    setOpenConfirm(false)
    setIsCreate(false)
    const imgURL = await uploadImage()
    try {
      let updateRes = getUpdateReq()
      const req = {
        viName: [form.values.viName, viNameInit],
        isActivated: [form.values.isActivated, isActivatedInit],
        serviceAttributes: [updateRes, serviceAttributesInit],
        numberUsed: [form.values.numberUsed, numberUsedInit],
        createdAt: [convertToIsoDate(form.values.createdAt), convertToIsoDate(createdAtInit)],
      }
      let reqWithValuesNotNull = {
        name: form.values.name,
        imageUrl: form.values.selectedImage ? imgURL.imageUrl : imageUrlInit,
      }
      for (let key in req) {
        if (req[key][0] != req[key][1]) {
          reqWithValuesNotNull[key] = req[key][0]
        }
      }
      if (reqWithValuesNotNull) {
        try {
          let req = {
            id: `${idService}`,
            updateServiceRequest: reqWithValuesNotNull as UpdateServiceRequest,
          }
          updateService.mutate(req, {
            onSuccess: () => {
              notification.success({
                message: 'Chỉnh sửa Dịch vụ thành công!',
                description: 'Dịch vụ Đã được chỉnh sửa',
              })
              utils.invalidateQueries('services.getServiceList')
              closeHandle()
            },
            onError: (err) => {
              notification.error({
                message: 'Chỉnh sửa dịch vụ không thành công!',
                description: err.message,
              })
            },
          })
        } catch (error) {
          notification.error({
            message: 'Chỉnh sửa dịch vụ không thành công!',
            description: 'Gặp lỗi khi chỉnh sửa',
          })
          console.error('Failed to Handle update voucher:', error)
        }
      }
    } catch (error) {
      console.error('Failed to update voucher:', error)
    }
  }
  function isDisableButton() {
    return (
      !form.isValid ||
      !form.dirty ||
      (isExitName ? true : false) ||
      (isExitViName ? true : false) ||
      isInValidUniqueAttribute() ||
      isInvalidValidateValues()
    )
  }
  const isAttributeUnique = (newAttributeValue, index) => {
    let flag = false
    if (newAttributeValue.length != 0) {
      const attributeValues = form.values.serviceAttributes
        .filter((_, i) => i !== index)
        .map((row) => row.attribute.toLowerCase())
      if (attributeValues.includes(newAttributeValue.toLowerCase())) {
        flag = true
      }
      const attributeViValues = form.values.serviceAttributes
        .filter((_, i) => i !== index)
        .map((row) => row.viAttribute?.toLowerCase())

      if (attributeViValues.includes(newAttributeValue.toLowerCase())) {
        flag = true
      }
    }
    return flag
  }

  function isInvalidValidateValues() {
    const isValid = form.values.serviceAttributes.map((row) => {
      const isValidValue = validateListValue(row.serviceAttributeValues)
      if (isValidValue) {
        return true
      } else {
        false
      }
    })
    if (isValid) {
      const result = isValid.includes(true)
      if (result) {
        return true
      }
    }
    return false
  }
  function validateListValue(listValue) {
    let flag = false
    const values = listValue.map((row) => row.value.toLowerCase())
    if (values.length > 0) {
      const checkDuplicateValues = values.length != new Set(values).size
      if (checkDuplicateValues) {
        return true
      }
    }
    const viValues = listValue.map((row) => row.viValue?.toLowerCase())
    if (viValues.length > 0) {
      const checkDuplicateViValues =
        viValues.filter((value) => value != '').length != new Set(viValues.filter((value) => value != '')).size
      if (checkDuplicateViValues) {
        return true
      }
    }

    if (values.length > 0 && viValues.length > 0) {
      const isValueInViValues = values
        .filter((_, index) => values[index] !== viValues[index])
        .some((value) => viValues.includes(value))
      if (isValueInViValues) {
        return true
      }
    }
    return flag
  }

  function isInValidUniqueAttribute() {
    let flag = false
    const attributeValues = form.values.serviceAttributes.map((row) => row.attribute.toLowerCase())
    if (attributeValues.length > 0) {
      const checkDuplicateAttribute = attributeValues.length != new Set(attributeValues).size
      if (checkDuplicateAttribute) {
        return true
      }
    }
    const attributeViValues = form.values.serviceAttributes
      .map((row) => row.viAttribute?.toLowerCase())
      .filter((value) => value != '')
    if (attributeViValues.length > 0) {
      const checkDuplicateViAttribute = attributeViValues.length != new Set(attributeViValues).size
      if (checkDuplicateViAttribute) {
        return true
      }
    }
    if (attributeValues.length > 0 && attributeViValues.length > 0) {
      const isAttributeInViAttributes = attributeValues
        .filter((_, index) => attributeValues[index] !== attributeViValues[index])
        .some((value) => attributeViValues.includes(value))
      if (isAttributeInViAttributes) {
        return true
      }
    }
    return flag
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
                  <div className="inline-block w-full h-8">Tên dịch vụ:</div>
                  <div className="inline-block w-full ">
                    <FormInput
                      autoComplete="off"
                      name="name"
                      className={`bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 ${
                        form.errors.name && form.touched.name ? 'placeholder:text-red-500' : ''
                      }`}
                      placeholder={!!form.errors.name && form.touched.name ? form.errors.name : 'Tên dịch vụ bắt buộc '}
                      disabled={false}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      value={form.values.name}
                      error={!!form.errors.name && form.touched.name}
                      errorMessage={''}
                    />
                    {isExitName && <div className="w-full text-xs text-red-500">Tên dịch vụ đã tồn tại</div>}
                  </div>
                </div>
                <div className="w-64 h-12 text-white">
                  <div className="inline-block w-full h-8">Tên dịch vụ tiếng việt:</div>
                  <div className="inline-block w-full ">
                    <FormInput
                      autoComplete="off"
                      name="viName"
                      className={`bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 ${
                        form.errors.viName && form.touched.viName ? 'placeholder:text-red-500' : ''
                      }`}
                      placeholder={
                        !!form.errors.viName && form.touched.viName ? form.errors.viName : 'Tên dịch vụ nếu có '
                      }
                      disabled={false}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      value={form.values.viName}
                      error={!!form.errors.viName && form.touched.viName}
                      errorMessage={''}
                    />
                    {isExitViName && <div className="w-full text-xs text-red-500">Tên dịch vụ đã tồn tại</div>}
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
                          label: mappingStatus.true,
                        },
                        {
                          value: false,
                          label: mappingStatus.false,
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
                  index={index}
                  serviceAttributesData={childData}
                  setServiceAttributesData={(data) => {
                    const updatedSubChildData = [...form.values.serviceAttributes]
                    updatedSubChildData[index] = data
                    form.setFieldValue(`serviceAttributes[${index}]`, data)
                  }}
                  removeChildComponent={(index) => {
                    removeChildComponent(index)
                  }}
                  isAttributeUnique={isAttributeUnique}
                />
              </div>
            ))}
            <div className="col-span-1 ">
              <div className="flex items-center justify-center w-full h-full">
                <div className="w-40">
                  <Button
                    customCSS="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 hover:scale-110 px-2"
                    onClick={addChildComponent}
                  >
                    <Plus theme="outline" size="24" fill="#fff" />
                    Thêm thuộc tính
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
              isActive={false}
              customCSS={`mx-6 px-4 py-1 border-2 ${
                !isDisableButton() && 'hover:scale-110 bg-[#7463F0] border-[#7463F0]'
              }`}
              onClick={(e) => {
                if (updateService.isLoading) {
                  return
                } else {
                  e.preventDefault()
                  openConfirmModal()
                }
              }}
              isDisable={isDisableButton()}
              isLoading={updateService.isLoading}
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
