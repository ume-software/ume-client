import { Menu, Transition } from '@headlessui/react'
import { Check, Search } from '@icon-park/react'
import { InputWithAffix } from '@ume/ui'
import { GenderProps, OrderByProps } from '~/containers/filter-page/components/iFilter'
import { GenderEnum } from '~/enumVariable/enumVariable'
import useDebounce from '~/hooks/useDebounce'

import { Fragment, useCallback, useEffect, useRef, useState } from 'react'

import { Slider, Tooltip } from 'antd'
import Link from 'next/link'
import { FilterProviderPagingResponse } from 'ume-service-openapi'

import PromoteCard from './promoteCard'

import { PlayerSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

export interface IPromotion {}

const max: number = 100000
const min: number = 0

const genderData: GenderProps[] = [
  { key: undefined, name: 'Giới tính' },
  { key: GenderEnum.MALE, name: 'Nam' },
  { key: GenderEnum.FEMALE, name: 'Nữ' },
  { key: GenderEnum.OTHER, name: 'Khác' },
  { key: GenderEnum.PRIVATE, name: 'Ẩn' },
]

const orderBy: OrderByProps[] = [
  {
    key: 'cost',
    name: 'Giá tiền',
  },
  {
    key: 'star',
    name: 'Đánh giá',
  },
]

export const Promotion = () => {
  const [page, setPage] = useState<string>('1')
  const [listHotProvider, setListHotProvider] = useState<FilterProviderPagingResponse['row']>([])
  const [listProvider, setListProvider] = useState<FilterProviderPagingResponse['row']>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  const [searchText, setSearchText] = useState<string>('')
  const debouncedValue = useDebounce<string>(searchText, 500)
  const [priceRange, setPriceRange] = useState<[number, number]>([min, max])
  const [gender, setGender] = useState<GenderProps>(genderData[0])
  const [order, setOrder] = useState<OrderByProps>(orderBy[0])

  const { isLoading: loadingHotProvider, isFetching: isFetchingHotProviders } = trpc.useQuery(
    ['booking.getHotProviders'],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 0,
      refetchOnMount: true,
      onSuccess(data) {
        setListHotProvider(data?.data?.row)
      },
    },
  )

  const {
    data: providers,
    isLoading: loadingProvider,
    isFetching: isFetchingProviders,
    refetch: refetchListProviderFilter,
  } = trpc.useQuery(
    [
      'booking.getProviders',
      {
        startCost: priceRange[0],
        endCost: priceRange[1],
        serviceAttributeValueIds: [],
        name: debouncedValue,
        gender: gender.key,
        status: 'ACTIVATED',
        limit: '20',
        page: page,
        order: `[{"${order.key}":"asc"}]`,
      },
    ],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 0,
      refetchOnMount: true,
      onSuccess(data) {
        setListProvider((prevData) => [
          ...(prevData?.filter((newProviderFilter) =>
            prevData?.find((itemPrevData) => itemPrevData.id != newProviderFilter.id),
          ) ?? []),
          ...(data?.data?.row ?? []),
        ])
      },
    },
  )

  useEffect(() => {
    refetchListProviderFilter().then((data) => {
      setListProvider(data.data?.data.row)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, priceRange, gender, order])

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value)
  }

  const tooltipContent = (
    <Slider
      className="w-[200px] bg-[#292734] text-white"
      range
      min={min}
      max={max}
      step={1000}
      defaultValue={priceRange}
      onAfterChange={handlePriceChange}
    />
  )

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onScroll = useCallback(() => {
    const { scrollY } = window
    setScrollPosition(scrollY)
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      const { scrollHeight } = containerRef.current
      const isAtEnd = scrollPosition >= scrollHeight

      if (isAtEnd && Number(providers?.data.count) > 20 * Number(page)) {
        setPage(String(Number(page) + 1))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearchText(e.target.value)
    }
  }

  return (
    <>
      {(loadingProvider ?? loadingHotProvider) && !isFetchingProviders && !isFetchingHotProviders ? (
        <PlayerSkeletonLoader />
      ) : (
        <div ref={containerRef} className="container mx-auto my-10">
          <div className="flex flex-col gap-5">
            <p className="text-3xl font-bold text-white">Hot Player</p>
            <div className="grid gap-6 mt-2 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              {listHotProvider?.map((provider) => (
                <Link
                  key={provider?.id}
                  href={`/profile/${provider?.slug ?? provider?.id}?tab=service&service=${
                    provider.serviceSlug ?? provider.serviceId
                  }`}
                >
                  <PromoteCard data={provider} />
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5 pb-5 mt-10">
            <p className="text-3xl font-bold text-white">Ume Player</p>
            <div className="xl:flex block justify-between items-center text-white">
              <div className="xl:col-span-3 col-span-5 xl:justify-self-start">
                <div className="flex items-center gap-5 my-8">
                  <div className="max-w-96">
                    <InputWithAffix
                      className="w-full outline-none border-none bg-[#292734] focus:outline-[#6d3fe0] max-h-10 rounded-xl"
                      styleInput="bg-transparent outline-none border-none hover:border-none"
                      placeholder="Nhập tên player..."
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e)}
                      position={'right'}
                      component={<Search theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip
                      className="bg-[#292734] text-white px-8 py-2 rounded-xl hover:bg-gray-500 cursor-pointer"
                      title={tooltipContent}
                      placement="bottom"
                      trigger="click"
                    >
                      {priceRange[0] != min || priceRange[1] != max ? (
                        <div className="flex items-center gap-3 2xl:text-xl xl:text-lg lg:text-md text-sm font-bold border border-light-50">
                          <div className="flex items-center gap-1">
                            {priceRange[0].toLocaleString('en-US', {
                              currency: 'VND',
                            })}
                            <span className="text-xs italic"> đ</span>
                          </div>
                          <p>-</p>
                          <div className="flex items-center gap-1">
                            {priceRange[1].toLocaleString('en-US', {
                              currency: 'VND',
                            })}
                            <span className="text-xs italic"> đ</span>
                          </div>
                        </div>
                      ) : (
                        <div className="2xl:text-xl xl:text-lg lg:text-md text-sm font-semibold">Khoảng giá</div>
                      )}
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Menu>
                      <Menu.Button>
                        <button className="min-w-[130px] 2xl:text-xl xl:text-lg lg:text-md text-sm font-semibold px-8 py-2 bg-[#292734] hover:bg-gray-700 rounded-xl">
                          {gender.name}
                        </button>
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-400"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-400"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items
                          className="absolute right-0 p-2 mt-1 origin-top-right bg-[#292734] divide-y divide-gray-100 rounded-xl shadow-lg w-full ring-1 ring-black ring-opacity-5 focus:outline-none"
                          style={{ zIndex: 5 }}
                        >
                          <div className="flex flex-col gap-2" style={{ zIndex: 10 }}>
                            {genderData.map((genData, index) => (
                              <div
                                className={`flex gap-5 items-center ${
                                  genData.key === gender.key ? 'bg-gray-700' : ''
                                } hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                                key={index}
                                onClick={() => setGender(genData)}
                                onKeyDown={() => {}}
                              >
                                <p className="font-semibold text-mg">{genData.name}</p>
                                <div>
                                  {genData.key === gender.key ? (
                                    <Check theme="filled" size="10" fill="#FFFFFF" strokeLinejoin="bevel" />
                                  ) : (
                                    ''
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  {isFetchingProviders && (
                    <div className="flex justify-center items-center">
                      <span
                        className={`spinner h-5 w-5 animate-spin rounded-full border-[3px] border-r-transparent border-white}`}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <div>
                  <p className="2xl:text-xl xl:text-lg lg:text-md text-sm font-semibold">Sắp xếp theo:</p>
                </div>
                <div className="relative pt-2">
                  <Menu>
                    <Menu.Button>
                      <button className="2xl:text-lg xl:text-md text-sm font-semibold px-8 py-2 bg-[#292734] hover:bg-gray-700 rounded-xl">
                        {order.name}
                      </button>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-400"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-400"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 p-2 mt-1 origin-top-right bg-[#292734] divide-y divide-gray-100 rounded-xl shadow-lg w-full ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        <div className="flex flex-col gap-2" style={{ zIndex: 10 }}>
                          {orderBy.map((item) => (
                            <div
                              className={`flex gap-5 items-center ${
                                order.key === item.key ? 'bg-gray-700' : ''
                              } hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                              key={item.key}
                              onClick={() => setOrder(item)}
                              onKeyDown={() => {}}
                            >
                              <p className="font-semibold text-mg">{item.name}</p>
                              <div>
                                {order.key === item.key ? (
                                  <Check theme="filled" size="10" fill="#FFFFFF" strokeLinejoin="bevel" />
                                ) : (
                                  ''
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
            <div className="grid gap-6 mt-2 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              {listProvider?.map((provider) => (
                <Link
                  key={provider?.id}
                  href={`/profile/${provider?.slug ?? provider?.id}?tab=service&service=${
                    provider.serviceSlug ?? provider.serviceId
                  }`}
                >
                  <PromoteCard data={provider} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      {isFetchingProviders && <PlayerSkeletonLoader />}
    </>
  )
}
