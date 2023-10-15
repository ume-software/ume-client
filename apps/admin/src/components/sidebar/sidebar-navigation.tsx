import {
  ChartHistogramTwo,
  Expenses,
  GameHandle,
  History,
  Income,
  RightUser,
  SettingTwo,
  User,
  UserBusiness,
  UserToUserTransmission,
} from '@icon-park/react'

import React, { ReactNode } from 'react'

import Link from 'next/link'

export interface SidebarNavigationItem {
  label: ReactNode
  key: string
  children?: SidebarNavigationItem[]
  icon?: React.ReactNode
}

const SidebarNavigation: SidebarNavigationItem[] = [
  {
    label: 'Quản trị',
    key: 'admin',
    children: [
      {
        label: (
          <Link href="/#" rel="noopener noreferrer">
            Tài khoản quản trị viên
          </Link>
        ),
        key: 'admin-member',
        icon: <RightUser theme="outline" size="22" fill="#fff" />,
      },
      {
        label: 'Cấu hình',
        key: 'setting',
        icon: <SettingTwo theme="outline" size="22" fill="#fff" />,
        children: [
          {
            label: (
              <Link href="/#" rel="noopener noreferrer">
                Nền tảng giao dịch
              </Link>
            ),
            key: 'deposit-ratio',
          },
          {
            label: (
              <Link href="/#" rel="noopener noreferrer">
                Banner
              </Link>
            ),
            key: 'banner-manager',
          },
        ],
      },
    ],
  },
  {
    label: 'Quản lý tài khoản',
    key: 'account',
    children: [
      {
        label: (
          <Link href="/dashboard" rel="noopener noreferrer">
            Thống kê
          </Link>
        ),
        key: 'user-statistic',
        icon: <ChartHistogramTwo theme="outline" size="22" fill="#fff" />,
      },
      {
        label: (
          <Link href="/user-manager" rel="noopener noreferrer">
            Quản lý người dùng
          </Link>
        ),
        key: 'user-manager',
        icon: <User theme="outline" size="22" fill="#fff" />,
      },
      {
        label: (
          <Link href="/provider-manager" rel="noopener noreferrer">
            Quản lý provider
          </Link>
        ),
        key: 'provider-manager',
        icon: <UserBusiness theme="outline" size="22" fill="#fff" />,
      },
      {
        label: (
          <Link href="/approve-provider" rel="noopener noreferrer">
            Quản lý KYC
          </Link>
        ),
        key: 'approve-provider',
        icon: <UserToUserTransmission theme="outline" size="22" fill="#fff" />,
      },
    ],
  },
  {
    label: 'Quản lý kỹ năng',
    key: 'service',
    children: [
      {
        label: (
          <Link href="/#" rel="noopener noreferrer">
            Quản lý kỹ năng
          </Link>
        ),
        key: 'service-manager',
        icon: <GameHandle theme="outline" size="22" fill="#fff" />,
      },
    ],
  },
  {
    label: 'Quản lý giao dịch',
    key: 'transaction',
    children: [
      {
        label: (
          <Link href="/dashboard" rel="noopener noreferrer">
            Thống kê
          </Link>
        ),
        key: 'transaction-statistic',
        icon: <ChartHistogramTwo theme="outline" size="22" fill="#fff" />,
      },
      {
        label: 'Yêu cầu nạp tiền',
        key: 'pay-request',
        icon: <Income theme="outline" size="22" fill="#fff" />,
        children: [
          {
            label: (
              <Link href="/#" rel="noopener noreferrer">
                Yêu cầu mới nhất
              </Link>
            ),
            key: 'latest-pay-request',
          },
          {
            label: (
              <Link href="/#" rel="noopener noreferrer">
                Tất cả yêu cầu
              </Link>
            ),
            key: 'all-pay-request',
          },
        ],
      },
      {
        label: 'Yêu cầu rút tiền',
        key: 'withdraw-request',
        icon: <Expenses theme="outline" size="22" fill="#fff" />,
        children: [
          {
            label: (
              <Link href="/#" rel="noopener noreferrer">
                Yêu cầu mới nhất
              </Link>
            ),
            key: 'latest-withdraw-request',
          },
          {
            label: (
              <Link href="/#" rel="noopener noreferrer">
                Tất cả yêu cầu
              </Link>
            ),
            key: 'all-withdraw-request',
          },
        ],
      },
      {
        label: (
          <Link href="/#" rel="noopener noreferrer">
            Lịch sử giao dịch
          </Link>
        ),
        key: 'deposit-history',
        icon: <History theme="outline" size="22" fill="#fff" />,
      },
    ],
  },
  {
    label: 'Quản lý khuyến mãi',
    key: 'voucher',
    children: [
      {
        label: (
          <Link href="/dashboard" rel="noopener noreferrer">
            Thống kê
          </Link>
        ),
        key: 'voucher-statistic',
        icon: <ChartHistogramTwo theme="outline" size="22" fill="#fff" />,
      },
      {
        label: (
          <Link href="/voucher-manager/voucher-by-admin" rel="noopener noreferrer">
            Khuyến mãi từ quản trị viên
          </Link>
        ),
        key: 'voucher-by-admin',
        icon: <RightUser theme="outline" size="22" fill="#fff" />,
      },
      {
        label: 'Khuyến mãi từ nhà cung cấp',
        key: 'voucher-by-provider',
        icon: <UserBusiness theme="outline" size="22" fill="#fff" />,
        children: [
          {
            label: (
              <Link href="/voucher-manager/voucher-by-provider" rel="noopener noreferrer">
                Tất cả khuyến mãi
              </Link>
            ),
            key: 'all-voucher',
          },
          {
            label: (
              <Link href="/voucher-manager/approve-provider-voucher" rel="noopener noreferrer">
                Khuyến mãi chờ duyệt
              </Link>
            ),
            key: 'pending-voucher',
          },
        ],
      },
    ],
  },
]

export default SidebarNavigation
