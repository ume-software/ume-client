import {
  ChartHistogramTwo,
  EveryUser,
  Expenses,
  GameEmoji,
  Income,
  RightUser,
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
        label: (
          <Link href="/dashboard" rel="noopener noreferrer">
            Thống kê hệ thống
          </Link>
        ),
        key: 'dashboard',
        icon: <System theme="outline" size="22" fill="#fff" />,
      },
      // {
      //   label: 'Cấu hình',
      //   key: 'setting',
      //   icon: <Setting theme="outline" size="22" fill="#fff" />,
      //   children: [
      //     {
      //       label: (
      //         <Link href="/#" rel="noopener noreferrer">
      //           Nền tảng giao dịch
      //         </Link>
      //       ),
      //       key: 'deposit-ratio',
      //     },
      //     {
      //       label: (
      //         <Link href="/#" rel="noopener noreferrer">
      //           Banner
      //         </Link>
      //       ),
      //       key: 'banner-manager',
      //     },
      //   ],
      // },
      {
        label: (
          <Link href="/#" rel="noopener noreferrer">
            Tài khoản quản trị viên
          </Link>
        ),
        key: 'admin-member',
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
            Quản lý nhà cung cấp
          </Link>
        ),
        key: 'provider-manager',

        icon: <RightUser theme="outline" size="22" fill="#fff" />,
      },
      {
        label: <div>Quản lý KYC</div>,
        key: 'approve-provider',
        icon: <UserToUserTransmission theme="outline" size="22" fill="#fff" />,
        children: [
          {
            label: (
              <Link href="/kyc-manager/kyc-pending" rel="noopener noreferrer">
                KYC chờ duyệt
              </Link>
            ),
            key: 'kyc-pending',
          },
          {
            label: (
              <Link href="/kyc-manager/kyc-all" rel="noopener noreferrer">
                Danh sách KYC
              </Link>
            ),
            key: 'kyc-all',
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
        label: (
          <Link href="/services-manager" rel="noopener noreferrer">
            Dịch vụ
          </Link>
        ),
        key: 'service-manager',
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
        label: (
          <Link href="/transaction-manager/deposit" rel="noopener noreferrer">
            Giao dịch nạp tiền
          </Link>
        ),
        key: 'deposit',
        icon: <Income theme="outline" size="22" fill="#fff" />,
      },
      {
        label: (
          <Link href="/transaction-manager/withdraw" rel="noopener noreferrer">
            Giao dịch rút tiền
          </Link>
        ),
        key: 'withdraw',
        icon: <Expenses theme="outline" size="22" fill="#fff" />,
      },
    ],
  },
  {
    label: 'Quản lý khuyến mãi',
    key: 'voucher',
    icon: <Ticket theme="outline" size="24" fill="#fff" />,
    children: [
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
            key: 'voucher-by-provider',
          },
          {
            label: (
              <Link href="/voucher-manager/approve-provider-voucher" rel="noopener noreferrer">
                Khuyến mãi chờ duyệt
              </Link>
            ),
            key: 'approve-provider-voucher',
          },
        ],
      },
    ],
  },
]
