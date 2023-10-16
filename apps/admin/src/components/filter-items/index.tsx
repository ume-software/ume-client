import { Tag } from 'antd'
import {
  AdminGetUserResponseResponseGenderEnum,
  VoucherResponseDiscountUnitEnum,
  VoucherResponseRecipientTypeEnum,
  VoucherResponseStatusEnum,
  VoucherResponseTypeEnum,
} from 'ume-service-openapi'

export const voucherStatusFilterItems = [
  {
    key: 'all',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-400 hover:text-white">
        Tất cả
      </Tag>
    ),
  },
  {
    key: VoucherResponseStatusEnum.Approved,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Đã duyệt
      </Tag>
    ),
  },
  {
    key: VoucherResponseStatusEnum.Pending,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Chờ duyệt
      </Tag>
    ),
  },
  {
    key: VoucherResponseStatusEnum.Rejected,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        Từ chối
      </Tag>
    ),
  },
]
export const mappingVoucherStatus = {
  all: 'Tất cả',
  APPROVED: 'Đã duyệt',
  PENDING: 'Chờ duyệt',
  REJECTED: 'Từ chối',
}

export const discountUnitsFilter = [
  {
    key: 'all',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-400 hover:text-white">
        Tất cả
      </Tag>
    ),
  },
  {
    key: VoucherResponseDiscountUnitEnum.Cash,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-400 hover:text-white">
        Tiền
      </Tag>
    ),
  },
  {
    key: VoucherResponseDiscountUnitEnum.Percent,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-400 hover:text-white">
        Phần trăm
      </Tag>
    ),
  },
]
export const mappingDiscountUnits = {
  all: 'Tất cả',
  CASH: 'Tiền',
  PERCENT: 'Phần trăm',
}

export const voucherTypeFilter = [
  {
    key: 'all',
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-400 hover:text-white">
        Tất cả
      </Tag>
    ),
  },
  {
    key: VoucherResponseTypeEnum.Discount,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-400 hover:text-white">
        Giảm giá
      </Tag>
    ),
  },
  {
    key: VoucherResponseTypeEnum.Cashback,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-400 hover:text-white">
        Hoàn tiền
      </Tag>
    ),
  },
]
export const mappingVoucherType = {
  all: 'Tất cả',
  CASHBACK: 'Hoàn tiền',
  DISCOUNT: 'Giảm giá',
}

export const recipientType = [
  {
    key: VoucherResponseRecipientTypeEnum.All,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center">Tất cả</div>
      </Tag>
    ),
  },
  {
    key: VoucherResponseRecipientTypeEnum.FirstTimeBooking,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center">Người lần đầu thuê</div>
      </Tag>
    ),
  },
  {
    key: VoucherResponseRecipientTypeEnum.PreviousBooking,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center">Người đã từng thuê</div>
      </Tag>
    ),
  },
  {
    key: VoucherResponseRecipientTypeEnum.Top5Booker,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center">Top 5 người thuê</div>
      </Tag>
    ),
  },
  {
    key: VoucherResponseRecipientTypeEnum.Top10Booker,
    label: (
      <Tag className="flex justify-center w-full px-3 py-2 bg-white rounded-lg hover:bg-gray-500 hover:text-white">
        <div className="flex items-center justify-center">Top 10 người thuê</div>
      </Tag>
    ),
  },
]
export const mappingRecipientTypes = {
  ALL: 'Tất cả',
  FIRST_TIME_BOOKING: 'Người lần đầu thuê',
  PREVIOUS_BOOKING: ' Người đã từng thuê',
  TOP_5_BOOKER: ' Top 5 người thuê',
  TOP_10_BOOKER: ' Top 10 người thuê',
}

export const userStatusFilterItems = [
  {
    key: 'all',
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white px-3 py-2 w-full flex justify-center">
        Tất cả
      </Tag>
    ),
  },
  {
    key: 'false',
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white  px-3 py-2 w-full flex justify-center">
        Hoạt động
      </Tag>
    ),
  },
  {
    key: 'true',
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white  px-3 py-2 w-full flex justify-center">
        Tạm dừng
      </Tag>
    ),
  },
]
export const mappingUserStatus = {
  all: 'Tất cả',
  false: 'Hoạt động',
  true: 'Tạm dừng',
}

export const genderFilterItems = [
  {
    key: 'ALL',
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white px-3 py-2 w-full flex justify-center">
        <div className="flex justify-center items-center w-10">Tất cả</div>
      </Tag>
    ),
  },
  {
    key: AdminGetUserResponseResponseGenderEnum.Male,
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white px-3 py-2 w-full flex justify-center">
        <div className="flex justify-center items-center w-10">Nam</div>
      </Tag>
    ),
  },
  {
    key: AdminGetUserResponseResponseGenderEnum.Female,
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white px-3 py-2 w-full flex justify-center">
        <div className="flex justify-center items-center w-10">Nữ</div>
      </Tag>
    ),
  },
  {
    key: AdminGetUserResponseResponseGenderEnum.Other,
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white px-3 py-2 w-full flex justify-center">
        <div className="flex justify-center items-center w-10">Khác</div>
      </Tag>
    ),
  },
  {
    key: AdminGetUserResponseResponseGenderEnum.Private,
    label: (
      <Tag className="hover:bg-gray-500 hover:text-white rounded-lg bg-white px-3 py-2 w-full flex justify-center">
        <div className="flex justify-center items-center w-10">Ẩn</div>
      </Tag>
    ),
  },
]
export const mappingGender = {
  ALL: 'Tất cả',
  MALE: 'Nam',
  FEMALE: ' Nữ',
  PRIVATE: 'Ẩn',
  OTHER: ' Khác',
}
