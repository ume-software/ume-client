import { Plus } from '@icon-park/react'
import { Button, Input, TextArea } from '@ume/ui'
import { uploadImageVoucher } from '~/api/upload-media'

import * as React from 'react'
import { useRef, useState } from 'react'

import { Select, Space, notification } from 'antd'
import { values } from 'lodash'
import Image from 'next/legacy/image'
import {
  CreateVoucherRequestDiscountUnitEnum,
  CreateVoucherRequestRecipientTypeEnum,
  CreateVoucherRequestTypeEnum,
} from 'ume-service-openapi'

import anhURL from '../../../../../public/anh.jpg'

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
  const avatarUrl = anhURL.src
  const [name, setName] = useState<any>()
  const [vourcherCode, setVourcherCode] = useState<any>()
  const issuer = 'ADMIN'
  const [status, setStatus] = useState<any>()
  const [createAt, setCreateAt] = useState<any>(new Date().toLocaleDateString('en-GB'))
  const [endDate, setEndDate] = useState<any>(new Date().toISOString().split('T')[0])

  const [numVoucher, setNumVoucher] = useState<any>()
  const [numUserCanUse, setNumUserCanUse] = useState<any>()
  const [typeVoucher, setTypeVoucher] = useState<any>(CreateVoucherRequestTypeEnum.Discount)
  const [applyTime, setApplyTime] = useState<Array<any>>([])
  const [numVoucherInDay, setNumVoucherInDay] = useState<any>()
  const [numUserCanUseInDay, setNumUserCanUseInDay] = useState<any>()
  const [minimize, setMinimize] = useState<any>()
  const [audience, setAudience] = useState<any>(CreateVoucherRequestRecipientTypeEnum.All)
  const [description, setDescription] = useState<any>()
  const [content, setContent] = useState<any>()
  const [imageSource, setImageSource] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<any | null>(null)
  const [discountUnit, setDiscountUnit] = useState<string>(CreateVoucherRequestDiscountUnitEnum.Percent)

  const imageInputRef = useRef<HTMLInputElement>(null)
  const [openConfirm, setOpenConfirm] = React.useState(false)
  const [isCreate, setIsCreate] = useState<boolean>(false)

  const createNewVoucherAdmin = trpc.useMutation(['voucher.createNewVoucherAdmin'])

  function clearData() {
    setImageSource('')
    setSelectedImage(null)
    setName(null)
    setVourcherCode(null)
    setStatus(null)
    setEndDate(new Date().toISOString().split('T')[0])
    setNumVoucher(null)
    setNumUserCanUse(null)
    setTypeVoucher(CreateVoucherRequestTypeEnum.Discount)
    setApplyTime([])
    setNumVoucherInDay(null)
    setNumUserCanUseInDay(null)
    setMinimize(null)
    setAudience(CreateVoucherRequestRecipientTypeEnum.All)
    setDescription(null)
    setContent(null)
    setDiscountUnit(CreateVoucherRequestDiscountUnitEnum.Percent)
    setIsCreate(false)
  }
  function closeComfirmFormHandle() {
    setOpenConfirm(false)
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
        setSelectedImage(file)
        setImageSource(URL.createObjectURL(file))
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
    setApplyTime(dayText)
  }
  function handleTypeVoucher(value) {
    setTypeVoucher(value)
  }
  function filterOptionTypeVoucher(input, option) {
    return (option?.label ?? '').toUpperCase().includes(input.toUpperCase())
  }

  function handleRecipientType(value) {
    setAudience(value)
  }

  function filterOptionRecipientType(input, option) {
    return (option?.label ?? '').toUpperCase().includes(input.toUpperCase())
  }

  function handleDisCountUnit(value) {
    console.log(value)
    setDiscountUnit(value)
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
    if (
      name &&
      vourcherCode &&
      issuer &&
      // status &&
      createAt &&
      endDate &&
      numVoucher &&
      numUserCanUse &&
      typeVoucher &&
      applyTime &&
      numVoucherInDay &&
      numUserCanUseInDay &&
      minimize &&
      audience &&
      description &&
      content &&
      imageSource &&
      discountUnit
    ) {
      return true
    } else {
      return false
    }
  }
  async function submitHandle() {
    if (await checkFieldRequỉed()) {
      const imgURL = await uploadImage()
      try {
        createNewVoucherAdmin.mutate(
          {
            code: vourcherCode,
            image: imgURL.imageUrl,
            // content: content,
            name: name,
            description: description,
            numberIssued: numVoucher,
            dailyNumberIssued: numVoucherInDay,
            numberUsablePerBooker: numUserCanUse,
            dailyUsageLimitPerBooker: numUserCanUseInDay,
            // isActivated : true,
            type: typeVoucher,
            discountUnit: discountUnit,
            // discountValue : ,
            maximumDiscountValue: minimize,
            // minimumBookingTotalPriceForUsage : ,
            // minimumBookingDurationForUsage : ,
            startDate: new Date(createAt).toISOString(),
            endDate: new Date(endDate).toISOString(),
            applyISODayOfWeek: applyTime,
            recipientType: audience,
            // selectiveBookerIds : ,
            isHided: true,
          },
          {
            onSuccess: (data) => {
              if (data.success) {
                notification.success({
                  message: 'Tạo thành công!',
                  description: 'đã được tạo thành công.',
                  placement: 'bottomLeft',
                })
              }
            },
          },
        )
      } catch (error) {
        console.error('Failed to post comment:', error)
      }
    }

    const res = {}
    //excute api here
    closeHandle()
  }
  function closeHandleSmall() {
    openConfirmModalCancel()
  }

  const uploadImage = async () => {
    let imageUrl = ''
    try {
      if (selectedImage) {
        const formData = new FormData()
        formData.append('image', selectedImage)
        console.log(formData)
        const responseData = await uploadImageVoucher(formData)
        console.log(responseData)
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
                ${!imageSource && ' flex items-center justify-center border-dashed border-2 border-[#FFFFFF80]'}
                `}
                onClick={handleImageClick}
              >
                {imageSource && (
                  <Image
                    className="overflow-hidden rounded-2xl"
                    width={144}
                    height={208}
                    src={imageSource}
                    alt=""
                    objectFit="cover"
                  />
                )}
                {!imageSource && (
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
                  <Input
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4"
                    placeholder="Tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                  />
                </div>
              </div>
              <div className="h-12 text-white">
                Mã:
                <div className="inline-block w-2/3 ">
                  <Input
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4"
                    placeholder="Mã: SUPPERSALE"
                    value={vourcherCode}
                    onChange={(e) => setVourcherCode(e.target.value)}
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
                Trạng thái: <span className="font-bold">{status}</span>
              </div>
              <div className="h-12 text-white">
                Ngày phát hành: <span className="font-bold">{createAt}</span>
              </div>
              <div className="h-12 text-white">
                Ngày kết thúc:
                <div className="inline-block w-1/3 ">
                  <Input
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4"
                    type="date"
                    pattern="\d{2}/\d{2}/\d{4}"
                    value={endDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
            <div className="flex flex-col justify-end w-3/5 mt-5">
              <div className="h-12 text-white">
                Số lượng phát hành:
                <div className="inline-block w-1/5 ">
                  <Input
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4"
                    placeholder="Số Lượng"
                    value={numVoucher}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      if (!isNaN(newValue) && newValue >= 0) {
                        e.target.value = newValue.toString()
                      } else {
                        e.target.value = '0'
                      }
                      setNumVoucher(parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 0)
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
                  <Input
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4"
                    placeholder="Số Lượng"
                    value={numUserCanUse}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      if (!isNaN(newValue) && newValue >= 0) {
                        e.target.value = newValue.toString()
                      } else {
                        e.target.value = '0'
                      }
                      setNumUserCanUse(parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 0)
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
                  defaultValue={typeVoucher}
                  style={{
                    minWidth: '8rem',
                    marginLeft: '1rem',
                  }}
                  options={[
                    {
                      value: CreateVoucherRequestTypeEnum.Discount,
                      label: 'DISCOUNT',
                    },
                    {
                      value: CreateVoucherRequestTypeEnum.Cashback,
                      label: 'CASHBACK',
                    },
                  ]}
                />
              </div>
              <div className="h-12 text-white">
                Thời gian áp dụng trong tuần:
                <Select
                  mode="multiple"
                  placeholder="Chọn ngày"
                  defaultValue={applyTime}
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
                  <Input
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4"
                    placeholder="Số Lượng"
                    value={numVoucherInDay}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      if (!isNaN(newValue) && newValue >= 0) {
                        e.target.value = newValue.toString()
                      } else {
                        e.target.value = '0'
                      }
                      setNumVoucherInDay(parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 0)
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
                  <Input
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4"
                    placeholder="Số Lượng"
                    value={numUserCanUseInDay}
                    onChange={(e) => {
                      const newnumUserCanUseInDay = parseInt(e.target.value)
                      if (!isNaN(newnumUserCanUseInDay) && newnumUserCanUseInDay >= 0) {
                        e.target.value = newnumUserCanUseInDay.toString()
                      } else {
                        e.target.value = '0'
                      }
                      setNumUserCanUseInDay(parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 0)
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
                  <Input
                    className="bg-[#413F4D]  border-2 border-[#FFFFFF] h-8 ml-4"
                    placeholder="Số Lượng"
                    value={minimize}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      if (!isNaN(newValue) && newValue >= 0) {
                        e.target.value = newValue.toString()
                      } else {
                        e.target.value = '0'
                      }
                      setMinimize(parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 0)
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
                    defaultValue={discountUnit}
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
                  defaultValue={audience}
                  style={{
                    minWidth: '8rem',
                    marginLeft: '1rem',
                  }}
                  options={[
                    {
                      value: CreateVoucherRequestRecipientTypeEnum.All,
                      label: 'ALL',
                    },
                    {
                      value: CreateVoucherRequestRecipientTypeEnum.FirstTimeBooking,
                      label: 'FIRST_TIME_BOOKING',
                    },
                    {
                      value: CreateVoucherRequestRecipientTypeEnum.PreviousBooking,
                      label: 'PREVIOUS_BOOKING',
                    },
                    {
                      value: CreateVoucherRequestRecipientTypeEnum.SelectiveBooker,
                      label: 'SELECTIVE_BOOKER',
                    },
                    {
                      value: CreateVoucherRequestRecipientTypeEnum.Top10Booker,
                      label: 'TOP_10_BOOKER',
                    },
                    {
                      value: CreateVoucherRequestRecipientTypeEnum.Top5Booker,
                      label: 'TOP_5_BOOKER',
                    },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
            <div className="flex flex-col justify-end mt-5">
              <div className="h-12 text-white">
                Mô tả:
                <div className="inline-block w-2/3 ">
                  <Input
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4"
                    placeholder="Mô tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"
                  />
                </div>
              </div>
              <div className="flex h-32 text-white">
                <span className="mr-4">Nội dung:</span>
                <TextArea
                  className="bg-[#413F4D] w-4/5"
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Button customCSS="mx-6 px-4 py-1 border-2 hover:scale-105" onClick={openConfirmModalCancel}>
            Hủy
          </Button>
          <Button
            customCSS="mx-6 px-4 py-1 border-2 bg-[#7463F0] border-[#7463F0] hover:scale-105"
            onClick={openConfirmModal}
          >
            {'Tạo'}
          </Button>
        </div>
      </ModalBase>
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
