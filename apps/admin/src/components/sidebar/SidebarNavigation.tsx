import {
  Abnormal,
  Bank,
  ChartHistogramTwo,
  DataFile,
  EveryUser,
  Exchange,
  Expenses,
  FileStaffOne,
  GameEmoji,
  Gift,
  Income,
  Pic,
  PictureOne,
  RightUser,
  Setting,
  SettingTwo,
  System,
  Ticket,
  TransactionOrder,
  User,
  UserBusiness,
  UserToUserTransmission,
} from '@icon-park/react'

import React, { ReactNode } from 'react'

import Link from 'next/link'

export interface SidebarNavigationItem {
  label?: ReactNode
  key?: string
  path?: string
  children?: SidebarNavigationItem[]
  icon?: React.ReactNode
}

export const SidebarNavigation: SidebarNavigationItem[] = [
  {
    label: 'Quản trị',
    key: 'admin',
    icon: <SettingTwo theme="outline" size="24" fill="#fff" />,
    children: [
      {
        label: 'Thống kê',
        path: '/dashboard',
        key: 'dashboard',
        icon: <DataFile theme="outline" size="22" fill="#fff" />,
      },
      {
        label: 'Tài khoản quản trị viên',
        path: '/admin-account-manager',
        key: 'admin-account-manager',
        icon: <UserBusiness theme="outline" size="22" fill="#fff" />,
      },
    ],
  },
  {
    label: 'Quản lý tài khoản',
    key: 'account',
    icon: <EveryUser theme="outline" size="24" fill="#fff" />,
    children: [
      {
        label: 'Quản lý người dùng',
        key: 'user-manager',
        path: '/user-manager',
        icon: <User theme="outline" size="22" fill="#fff" />,
      },
      {
        label: 'Quản lý nhà cung cấp',
        key: 'provider-manager',
        path: '/provider-manager',
        icon: <RightUser theme="outline" size="22" fill="#fff" />,
      },
      {
        label: 'Quản lý KYC',
        key: 'approve-provider',
        icon: <UserToUserTransmission theme="outline" size="22" fill="#fff" />,
        children: [
          {
            label: 'KYC chờ duyệt',
            key: 'kyc-manager/kyc-pending',
            path: '/kyc-manager/kyc-pending',
          },
          {
            label: 'Danh sách KYC',
            key: 'kyc-manager/kyc-all',
            path: '/kyc-manager/kyc-all',
          },
        ],
      },
    ],
  },
  {
    label: 'Quản lý dịch vụ',
    key: 'service',
    icon: <GameEmoji theme="outline" size="24" fill="#fff" />,
    children: [
      {
        label: 'Dịch vụ',
        key: 'service-manager',
        path: '/services-manager',
        icon: <GameEmoji theme="outline" size="22" fill="#fff" />,
      },
    ],
  },
  {
    label: 'Quản lý giao dịch',
    key: 'transaction',
    icon: <TransactionOrder theme="outline" size="24" fill="#fff" />,
    children: [
      {
        label: 'Giao dịch nạp tiền',
        key: 'transaction-manager/deposit',
        path: '/transaction-manager/deposit',
        icon: <Income theme="outline" size="22" fill="#fff" />,
      },
      {
        label: 'Giao dịch rút tiền',
        key: 'transaction-manager/withdrawal',
        path: '/transaction-manager/withdrawal',
        icon: <Expenses theme="outline" size="22" fill="#fff" />,
      },
      {
        label: 'Giao dịch trong hệ thống',
        key: 'transaction-manager',
        icon: <Bank theme="outline" size="22" fill="#fff" />,
        children: [
          {
            label: 'Lịch sử thuê',
            key: 'transaction-manager/booking',
            path: '/transaction-manager/booking',
          },
          {
            label: 'Lịch sử ủng hộ',
            key: 'transaction-manager/donation',
            path: '/transaction-manager/donation',
          },
        ],
      },
    ],
  },
  {
    label: 'Quản lý khuyến mãi',
    key: 'voucher',
    icon: <Ticket theme="outline" size="24" fill="#fff" />,
    children: [
      {
        label: 'Khuyến mãi từ quản trị viên',
        key: 'voucher-manager/voucher-by-admin',
        path: '/voucher-manager/voucher-by-admin',
        icon: <RightUser theme="outline" size="22" fill="#fff" />,
      },
      {
        label: 'Khuyến mãi từ nhà cung cấp',
        key: 'voucher-by-provider',
        icon: <UserBusiness theme="outline" size="22" fill="#fff" />,
        children: [
          {
            label: 'Tất cả khuyến mãi',
            key: 'voucher-manager/voucher-by-provider',
            path: '/voucher-manager/voucher-by-provider',
          },
          {
            label: 'Khuyến mãi chờ duyệt',
            key: 'voucher-manager/approve-provider-voucher',
            path: '/voucher-manager/approve-provider-voucher',
          },
        ],
      },
    ],
  },
  {
    label: 'Quản lý báo cáo',
    key: 'report',
    icon: <Abnormal theme="outline" size="24" fill="#fff" />,
    children: [
      {
        label: 'Tố cáo',
        key: 'report-manager',
        path: '/report-manager',
        icon: <Abnormal theme="outline" size="22" fill="#fff" />,
      },
      {
        label: 'Khiếu nại dịch vụ',
        key: 'complaint-booking-manager',
        path: '/complaint-booking-manager',
        icon: <FileStaffOne theme="outline" size="22" fill="#fff" />,
      },
    ],
  },
]
