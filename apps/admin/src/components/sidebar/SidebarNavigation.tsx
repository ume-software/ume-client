import {
  Abnormal,
  ChartHistogramTwo,
  EveryUser,
  Expenses,
  GameEmoji,
  Income,
  RightUser,
  Setting,
  SettingTwo,
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
        label: 'Tài khoản quản trị viên',
        path: '/admin-account-manager',
        key: 'admin-account-manager',
        icon: <UserBusiness theme="outline" size="22" fill="#fff" />,
      },
      {
        label: 'Cấu hình',
        key: 'setting',
        icon: <Setting theme="outline" size="22" fill="#fff" />,
        children: [
          {
            label: 'Nền tảng giao dịch',
            key: 'deposit-ratio',
            path: '/dashboard',
          },
          {
            label: 'Banner',
            key: 'banner-manager',
            path: '/dashboard',
          },
        ],
      },
    ],
  },
  {
    label: 'Quản lý tài khoản',
    key: 'account',
    icon: <EveryUser theme="outline" size="24" fill="#fff" />,
    children: [
      {
        label: 'Thống kê',
        key: 'user-statistic',
        path: '/dashboard',
        icon: <ChartHistogramTwo theme="outline" size="22" fill="#fff" />,
      },
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
            key: 'kyc-pending',
            path: '/kyc-manager/kyc-pending',
          },
          {
            label: 'Danh sách KYC',
            key: 'kyc-all',
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
        label: 'Thống kê',
        key: 'transaction-statistic',
        path: '/dashboard',
        icon: <ChartHistogramTwo theme="outline" size="22" fill="#fff" />,
      },
      {
        label: 'Giao dịch nạp tiền',
        key: 'deposit',
        path: '/transaction-manager/deposit',
        icon: <Income theme="outline" size="22" fill="#fff" />,
      },
      {
        label: 'Giao dịch rút tiền',
        key: 'withdraw',
        path: '/transaction-manager/withdraw',
        icon: <Expenses theme="outline" size="22" fill="#fff" />,
      },
      // {
      //   label: (
      //     <Link href="/#" rel="noopener noreferrer">
      //       Lịch sử giao dịch
      //     </Link>
      //   ),
      //   key: 'deposit-history',
      //   path: '/admin-account-manager',
      //   icon: <History theme="outline" size="22" fill="#fff" />,
      // },
    ],
  },
  {
    label: 'Quản lý khuyến mãi',
    key: 'voucher',
    icon: <Ticket theme="outline" size="24" fill="#fff" />,
    children: [
      {
        label: 'Thống kê',
        key: 'voucher-statistic',
        path: '/dashboard',
        icon: <ChartHistogramTwo theme="outline" size="22" fill="#fff" />,
      },
      {
        label: 'Khuyến mãi từ quản trị viên',
        key: 'voucher-by-admin',
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
            key: 'voucher-by-provider',
            path: '/voucher-manager/voucher-by-provider',
          },
          {
            label: 'Khuyến mãi chờ duyệt',
            key: 'approve-provider-voucher',
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
        label: 'Báo cáo',
        key: 'report-manager',
        path: '/report-manager',
        icon: <Abnormal theme="outline" size="22" fill="#fff" />,
      },
    ],
  },
]
