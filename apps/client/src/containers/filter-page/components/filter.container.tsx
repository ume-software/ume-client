import { Menu, Transition } from '@headlessui/react'
import { Check, Search } from '@icon-park/react'
import { Input } from '@ume/ui'
import coin from 'public/coin-icon.png'
import CategoryDrawer from '~/containers/home-page/components/category-drawer'
import PromoteCard from '~/containers/home-page/components/promoteCard'
import { GenderEnum } from '~/enumVariable/enumVariable'

import { Fragment, useCallback, useEffect, useRef, useState } from 'react'

import { Slider, Tooltip } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FilterProviderPagingResponse } from 'ume-service-openapi'

import { PlayerSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

interface OrderByProps {
  key: string
  name: string
}
interface GenderProps {
  key: string | undefined
  name: string
}

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
const max: number = 100
const min: number = 0

const genderData: GenderProps[] = [
  { key: undefined, name: 'Giới tính' },
  { key: GenderEnum.MALE, name: 'Nam' },
  { key: GenderEnum.FEMALE, name: 'Nữ' },
  { key: GenderEnum.OTHER, name: 'Khác' },
  { key: GenderEnum.PRIVATE, name: 'Ẩn' },
]

const FilterContainer = (props) => {
  const router = useRouter()
  const service = router.query.service

  const limit = '20'
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [listProviderFilter, setListProviderFilter] = useState<FilterProviderPagingResponse['row']>([])
  const [page, setPage] = useState('1')
  const [searchText, setSearchText] = useState<string>('')
  const [gender, setGender] = useState<GenderProps>(genderData[0])
  const [order, setOrder] = useState<OrderByProps>(orderBy[0])
  const [listSkils, setListSkils] = useState<any>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([min, max])

  const { isLoading: loadingService, isFetching } = trpc.useQuery(['booking.getListService'], {
    onSuccess(data) {
      setListSkils(data?.data?.row)
    },
  })

  const {
    data: providersFilter,
    isLoading: loadingProviderFilter,
    isFetching: isFetchingProviderFilter,
    refetch: refetchListProviderFilter,
  } = trpc.useQuery(
    [
      'booking.getProviders',
      {
        startCost: priceRange[0],
        endCost: priceRange[1],
        serviceId: String(service),
        name: searchText,
        gender: gender.key,
        limit: limit,
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
        setListProviderFilter((prevData) => [...(prevData || []), ...(data?.data?.row || [])])
      },
    },
  )

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value)
  }
  const tooltipContent = (
    <Slider
      className="w-[200px] bg-[#292734] text-white"
      range
      min={min}
      max={max}
      marks={{ 0: <p className="text-white">{min}</p>, 100: <p className="text-white">{max}</p> }}
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
      const isAtEnd = scrollPosition >= scrollHeight - 500
      if (isAtEnd && Number(providersFilter?.data.count) > 20 * Number(page)) {
        setPage(String(Number(page) + 1))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition])

  useEffect(() => {
    setPage('1')
    refetchListProviderFilter().then((data) => {
      setListProviderFilter(data.data?.data.row)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange, service, searchText, gender, page, order])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearchText(e.target.value)
    }
  }

  return (
    <div className="min-h-screen mx-10 text-white">
      <div className="flex items-center justify-between mx-5 my-5">
        <p className="text-5xl font-bold">{props?.serviceName}</p>
        <CategoryDrawer data={listSkils} loadingService={loadingService} />
      </div>
      <div className="flex items-center justify-between mx-5">
        <div className="flex gap-5 my-8 items-center">
          <div className="max-w-96">
            <Input
              className="w-full outline-none border-none bg-[#292734] focus:outline-[#6d3fe0] max-h-10 rounded-xl"
              placeholder="Nhập tên player..."
              onKeyPress={(e) => handleKeyPress(e)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <Tooltip
              className="bg-[#292734] text-white px-8 py-2 rounded-xl hover:bg-gray-500 cursor-pointer"
              title={tooltipContent}
              placement="bottom"
              trigger="click"
            >
              {priceRange[0] != min || priceRange[1] != max ? (
                <div className="flex text-xl gap-3 font-bold border border-light-50">
                  <div className="flex items-center gap-1">
                    {priceRange[0]}
                    <Image src={coin} width={25} height={25} alt="coin" />
                  </div>
                  -
                  <div className="flex items-center gap-1">
                    {priceRange[1]}
                    <Image src={coin} width={25} height={25} alt="coin" />
                  </div>
                </div>
              ) : (
                <div className="text-xl font-semibold">Khoảng giá</div>
              )}
            </Tooltip>
          </div>
          <div className="relative">
            <Menu>
              <Menu.Button>
                <button className="min-w-[130px] text-xl font-semibold px-8 py-2 bg-[#292734] hover:bg-gray-700 rounded-xl">
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
                  className="absolute right-0 p-2 mt-2 origin-top-right bg-[#292734] divide-y divide-gray-100 rounded-xl shadow-lg w-fit ring-1 ring-black ring-opacity-5 focus:outline-none"
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
                      >
                        <p className="text-mg font-semibold">{genData.name}</p>
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
        </div>
        <div className="flex items-center gap-2">
          <div>
            <p className="text-xl font-semibold">Sắp xếp theo:</p>
          </div>
          <div className="relative pt-2">
            <Menu>
              <Menu.Button>
                <button className="text-lg font-semibold px-8 py-2 bg-[#292734] hover:bg-gray-700 rounded-xl">
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
                <Menu.Items className="absolute right-0 p-2 mt-2 origin-top-right bg-[#292734] divide-y divide-gray-100 rounded-xl shadow-lg w-fit ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="flex flex-col gap-2" style={{ zIndex: 10 }}>
                    {orderBy.map((item) => (
                      <div
                        className={`flex gap-5 items-center ${
                          order.key === item.key ? 'bg-gray-700' : ''
                        } hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                        key={item.key}
                        onClick={() => setOrder(item)}
                      >
                        <p className="text-mg font-semibold">{item.name}</p>
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
      <div className="container mx-auto my-10">
        {loadingProviderFilter && !isFetchingProviderFilter ? (
          <>
            <PlayerSkeletonLoader />
          </>
        ) : (
          <div ref={containerRef} className="grid gap-6 mt-2 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
            {listProviderFilter?.length != 0 ? (
              listProviderFilter?.map((provider) => (
                <Link
                  key={provider?.id}
                  href={`/profile/${provider?.slug ?? provider?.id}?tab=information&service=${
                    provider.serviceSlug || provider.serviceId
                  }`}
                >
                  <PromoteCard data={provider} />
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center mt-10">
                <p className="text-3xl font-bold">
                  Chưa có người chơi nào phù hợp với tìm kiếm của bạn. Xin hãy thử lại
                </p>
              </div>
            )}
          </div>
        )}
        {isFetchingProviderFilter && <PlayerSkeletonLoader />}
      </div>
    </div>
  )
}
export default FilterContainer
