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
            Duyệt provider
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
    key: 'deposit',
    children: [
      {
        label: (
          <Link href="/#" rel="noopener noreferrer">
            Quản lý kỹ năng
          </Link>
        ),
        key: 'deposit-statistic',
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
            key: 'latest-request',
          },
          {
            label: (
              <Link href="/#" rel="noopener noreferrer">
                Tất cả yêu cầu
              </Link>
            ),
            key: 'all-request',
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
            key: 'latest-request',
          },
          {
            label: (
              <Link href="/#" rel="noopener noreferrer">
                Tất cả yêu cầu
              </Link>
            ),
            key: 'all-request',
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
]

export default SidebarNavigation
