import { Menu, Transition } from '@headlessui/react'
import { Check, Search } from '@icon-park/react'
import { Input } from '@ume/ui'
import coin from 'public/coin-icon.png'
import CategoryDrawer from '~/containers/home-page/components/category-drawer'
import PromoteCard from '~/containers/home-page/components/promoteCard'

import { Fragment, useEffect, useRef, useState } from 'react'

import { Slider, Tooltip } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FilterProviderPagingResponse } from 'ume-booking-service-openapi'

import { PlayerSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

interface OrderByProps {
  key: string
  name: string
}

const orderBy: OrderByProps[] = [
  {
    key: 'cost',
    name: 'Giá tiền',
  },
  {
    key: 'rate',
    name: 'Đánh giá',
  },
]
const max: number = 100
const min: number = 0

const FilterContainer = (props) => {
  const router = useRouter()
  const skillId = router.query.skillId
  const limit = '20'
  const containerRef = useRef<HTMLDivElement>(null)
  const [listProviderFilter, setListProviderFilter] = useState<FilterProviderPagingResponse['row']>([])
  const [page, setPage] = useState('1')
  const [searchText, setSearchText] = useState<string>('')
  const [order, setOrder] = useState<OrderByProps>(orderBy[0])
  const [listSkils, setListSkils] = useState<any>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([min, max])

  const {
    data: skills,
    isLoading: loadingSkill,
    isFetching,
  } = trpc.useQuery(['booking.getListSkill'], {
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
        skillId: String(skillId),
        limit: limit,
        page: page,
        where: `{"name":{"contains":"${searchText}"}}`,
        order: `[{"${order.key}":"asc"}]`,
      },
    ],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 0,
      refetchOnMount: true,
      onSuccess(data) {
        setListProviderFilter(data?.data?.row)
      },
    },
  )

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value)
  }
  const tooltipContent = (
    <Slider
      className="w-[200px] text-white"
      range
      min={min}
      max={max}
      marks={{ 0: <p className="text-white">{min}</p>, 100: <p className="text-white">{max}</p> }}
      defaultValue={priceRange}
      onChange={handlePriceChange}
    />
  )

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current

        const isAtEnd = scrollTop + clientHeight >= scrollHeight

        console.log(scrollHeight)

        if (isAtEnd && Number(providersFilter?.data.count) > Number(limit) * Number(page)) {
          setPage(String(Number(page) + 1))
        }
      }
    }

    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (containerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        containerRef.current.removeEventListener('scroll', handleScroll)
      }
    }
  })

  useEffect(() => {
    if (page !== '1') {
      refetchListProviderFilter()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearchText(e.target.value)
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen mx-10 text-white">
      <div className="flex items-center justify-between mx-5 my-5">
        <p className="text-5xl font-bold">{props?.skillName}</p>
        <CategoryDrawer data={listSkils} loadingSkill={loadingSkill} />
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
            {/* <label htmlFor="price" className="text-xl font-bold">
              Chọn mức giá:
            </label> */}
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
        {loadingProviderFilter || isFetchingProviderFilter ? (
          <>
            <PlayerSkeletonLoader />
          </>
        ) : (
          <div className="grid gap-6 mt-2 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
            {listProviderFilter?.map((provider) => (
              <Link key={provider?.id} href={`/player/${provider?.slug || provider?.id}?gameId=${provider.skillid}`}>
                <PromoteCard data={provider} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default FilterContainer
