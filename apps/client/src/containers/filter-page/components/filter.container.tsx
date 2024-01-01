import { Menu, Transition } from '@headlessui/react'
import { Check, DownOne, Plus, Search, SortTwo } from '@icon-park/react'
import { Button, CustomDrawer, InputWithAffix } from '@ume/ui'
import CategoryDrawer from '~/containers/home-page/components/category-drawer'
import PromoteCard from '~/containers/home-page/components/promoteCard'
import useDebounce from '~/hooks/useDebounce'

import { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { Slider, Tooltip } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FilterProviderPagingResponse } from 'ume-service-openapi'

import AddAttributeDrawer from './add-attribute-drawer'
import { AttrbuteProps, GenderProps, OnlineProps, OrderByProps } from './iFilter'

import { DrawerContext } from '~/components/layouts/app-layout/app-layout'
import { PlayerSkeletonLoader } from '~/components/skeleton-load'

import { GenderEnum } from '~/utils/enumVariable'
import { trpc } from '~/utils/trpc'

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
const max: number = 100000
const min: number = 0

const isOnlineData: OnlineProps[] = [
  { key: undefined, name: 'Trạng thái' },
  { key: true, name: 'Đang hoạt động' },
  { key: false, name: 'Không hoạt động' },
]

const genderData: GenderProps[] = [
  { key: undefined, name: 'Giới tính' },
  { key: GenderEnum.MALE, name: 'Nam' },
  { key: GenderEnum.FEMALE, name: 'Nữ' },
  { key: GenderEnum.OTHER, name: 'Khác' },
  { key: GenderEnum.PRIVATE, name: 'Ẩn' },
]

const FilterContainer = ({ service, listSubAttributeService }) => {
  const router = useRouter()
  const basePath = router.asPath.split('?')[0]
  const slug = router.query

  const limit = '20'
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [listProviderFilter, setListProviderFilter] = useState<FilterProviderPagingResponse['row']>([])
  const { childrenDrawer, setChildrenDrawer } = useContext(DrawerContext)

  const [page, setPage] = useState<string>('1')
  const [searchText, setSearchText] = useState<string>(String(slug.name ?? ''))
  const debouncedValue = useDebounce<string>(searchText, 500)
  const [gender, setGender] = useState<GenderProps>(
    genderData.find((item) => item.name == String(slug.gender)) ?? genderData[0],
  )
  const [isOnline, setIsOnline] = useState<OnlineProps>(isOnlineData[0])
  const [order, setOrder] = useState<OrderByProps>(orderBy[0])
  const [isDesc, setIsDesc] = useState<boolean>(false)
  const [attributeFilter, setAttributeFilter] = useState<AttrbuteProps[]>([])
  const [listSkils, setListSkils] = useState<any>([])
  const [priceRange, setPriceRange] = useState<[number, number]>(
    [Number(slug.minPrice ?? min), Number(slug.maxPrice ?? max)] ?? [min, max],
  )

  useEffect(() => {
    setAttributeFilter([])
    setPage('1')
  }, [service, listSubAttributeService])

  const { isLoading: loadingService } = trpc.useQuery(['booking.getListService'], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
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
        serviceId: String(service ?? ''),
        serviceAttributeValueIds: attributeFilter.flatMap(
          (listSubAttr) => listSubAttr.subAttr?.map((itemSubAttr) => itemSubAttr.subAttrId) ?? [],
        ),
        name: debouncedValue,
        gender: gender.key,
        status: 'ACTIVATED',
        isOnline: isOnline.key,
        limit: limit,
        page: page,
        order: `[{"${order.key}":"${isDesc ? 'desc' : 'asc'}"}]`,
      },
    ],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 0,
      refetchOnMount: true,
      onSuccess(data) {
        setListProviderFilter((prevData) => [
          ...(prevData?.filter((newProviderFilter) =>
            prevData?.find((itemPrevData) => itemPrevData.id != newProviderFilter.id),
          ) ?? []),
          ...(data?.data?.row ?? []),
        ])
      },
    },
  )

  const serviceName =
    listSkils.find((skill) => skill?.slug == service)?.viName &&
    listSkils.find((skill) => skill?.slug == service)?.viName != ''
      ? listSkils.find((skill) => skill?.slug == service)?.viName
      : listSkils.find((skill) => skill?.slug == service)?.name

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
      onChangeComplete={handlePriceChange}
    />
  )

  const handleFilterOpen = () => {
    setChildrenDrawer(
      <AddAttributeDrawer
        attributeData={listSubAttributeService}
        attributeFilter={attributeFilter}
        setAttributeFilter={setAttributeFilter}
        setListProviderFilter={setListProviderFilter}
      />,
    )
  }

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
      const isAtEnd = scrollPosition >= scrollHeight - 700
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

    router.replace(
      {
        pathname: basePath,
        query: {
          service: service,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          name: debouncedValue,
          gender: gender.name,
          status: isOnline.name,
        },
      },
      undefined,
      {
        shallow: true,
      },
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange, service, debouncedValue, gender, isOnline, order, isDesc])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearchText(e.target.value)
    }
  }

  return (
    <div className="min-h-screen mx-10 text-white">
      <div className="flex items-center justify-between mx-5 my-5">
        <p className="text-5xl font-bold">{serviceName}</p>
        <CategoryDrawer data={listSkils} loadingService={loadingService} />
      </div>
      <div className="grid grid-cols-5 items-center mx-3">
        <div className="2xl:col-span-3 col-span-5 2xl:justify-self-start">
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
                  <div className="flex items-center gap-3 2xl:text-lg lg:text-md text-sm font-bold border border-light-50">
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
                  <div className="2xl:text-lg lg:text-md text-sm font-semibold">Khoảng giá</div>
                )}
              </Tooltip>
            </div>
            <div className="relative">
              <Menu>
                <Menu.Button>
                  <button className="min-w-[130px] 2xl:text-lg lg:text-md text-sm font-semibold px-8 py-2 bg-[#292734] hover:bg-gray-700 rounded-xl">
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
            <div className="relative">
              <Menu>
                <Menu.Button>
                  <button className="min-w-[190px] 2xl:text-lg lg:text-md text-sm font-semibold px-8 py-2 bg-[#292734] hover:bg-gray-700 rounded-xl">
                    {isOnline.name}
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
                      {isOnlineData.map((isOnlineData, index) => (
                        <div
                          className={`flex gap-5 items-center ${
                            isOnlineData.key === isOnline.key ? 'bg-gray-700' : ''
                          } hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                          key={index}
                          onClick={() => setIsOnline(isOnlineData)}
                          onKeyDown={() => {}}
                        >
                          <p className="font-semibold text-mg">{isOnlineData.name}</p>
                          <div>
                            {isOnlineData.key === isOnline.key ? (
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
            {isFetchingProviderFilter && (
              <div className="flex justify-center items-center">
                <span
                  className={`spinner h-5 w-5 animate-spin rounded-full border-[3px] border-r-transparent border-white}`}
                />
              </div>
            )}
          </div>
        </div>
        <div className="2xl:col-span-2 col-span-5 justify-self-end">
          <div className="flex items-center gap-2">
            {(listSubAttributeService.length ?? 0) > 0 && (
              <div className="mr-10 mt-2">
                <CustomDrawer
                  customOpenBtn={`text-md p-2 rounded-xl hover:scale-105`}
                  openBtn={
                    <Button
                      type="button"
                      isActive={false}
                      isOutlinedButton={true}
                      customCSS="w-fit text-md p-2 rounded-xl hover:scale-105"
                      onClick={() => {
                        handleFilterOpen()
                      }}
                    >
                      <Plus theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />
                      Thêm thuộc tính
                    </Button>
                  }
                >
                  {childrenDrawer}
                </CustomDrawer>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="flex items-start gap-2">
                <p className="text-xl font-semibold">Sắp xếp theo:</p>
                <SortTwo
                  className="opacity-30 cursor-pointer hover:opacity-100"
                  theme="outline"
                  size="15"
                  fill="#FFF"
                  strokeLinejoin="bevel"
                  onClick={() => setIsDesc(!isDesc)}
                />
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
        </div>
      </div>
      <div className="grid grid-cols-6">
        {attributeFilter.length > 0 && (
          <>
            {attributeFilter.map((attrFilter) => (
              <div className="2xl:col-span-2 lg:col-span-3 col-span-6 my-3 w-fit" key={attrFilter.id}>
                {(attrFilter?.subAttr ?? []).length > 0 && (
                  <>
                    <span className="mx-20 flex items-center gap-5">
                      <p className="text-xl font-bold">{attrFilter.name}: </p>
                      <div className="relative">
                        <Menu>
                          <Menu.Button>
                            <button className="flex justify-between items-center text-lg font-semibold p-2 bg-[#292734] hover:bg-gray-700 rounded-xl">
                              <p className="max-w-[250px] text-lg font-semibold px-5 truncate">
                                {(attrFilter?.subAttr?.map((itemAttrFilter) => itemAttrFilter.subAttrViValue) ?? [])
                                  ?.slice()
                                  .sort()
                                  .join(', ')}
                              </p>
                              <DownOne theme="filled" size="20" fill="#fff" strokeLinejoin="bevel" />
                            </button>
                          </Menu.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-400"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items
                              className="absolute left-0 p-2 mt-1 origin-top-left bg-[#292734] divide-y divide-gray-100 rounded-xl shadow-lg min-w-[250px] w-full max-h-[300px] overflow-y-auto ring-1 ring-black ring-opacity-5 focus:outline-none hide-scrollbar"
                              style={{ zIndex: 5 }}
                            >
                              <div className="flex flex-col gap-2" style={{ zIndex: 10 }}>
                                {listSubAttributeService
                                  .find((item) => item.id == attrFilter.id)
                                  ?.subAttr?.map((subAttrFilter) => (
                                    <div
                                      className={`flex justify-between items-center ${
                                        attributeFilter.find((item) =>
                                          item?.subAttr?.find(
                                            (itemSubAttr) => itemSubAttr.subAttrId == subAttrFilter.subAttrId,
                                          ),
                                        )
                                          ? 'bg-gray-700'
                                          : ''
                                      } hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                                      key={subAttrFilter.subAttrId}
                                      onClick={() => {
                                        setAttributeFilter((prevData) =>
                                          prevData.map((attr) =>
                                            attr.id === attrFilter.id
                                              ? {
                                                  ...attr,
                                                  subAttr: attr?.subAttr?.find(
                                                    (subAttrFind) => subAttrFind.subAttrId == subAttrFilter.subAttrId,
                                                  )
                                                    ? attr?.subAttr?.filter(
                                                        (subAttrFind) =>
                                                          subAttrFind.subAttrId != subAttrFilter.subAttrId,
                                                      )
                                                    : [...(attr.subAttr as any), subAttrFilter],
                                                }
                                              : attr,
                                          ),
                                        )
                                        setListProviderFilter([])
                                      }}
                                      onKeyDown={() => {}}
                                    >
                                      <p className="font-semibold text-mg">{subAttrFilter.subAttrViValue}</p>
                                      <div>
                                        {attributeFilter.find((item) =>
                                          item?.subAttr?.find(
                                            (itemSubAttr) => itemSubAttr.subAttrId == subAttrFilter.subAttrId,
                                          ),
                                        ) ? (
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
                    </span>
                  </>
                )}
              </div>
            ))}
          </>
        )}
      </div>
      <div className="container mx-auto my-10">
        {loadingProviderFilter && !isFetchingProviderFilter ? (
          <PlayerSkeletonLoader />
        ) : (
          <div
            ref={containerRef}
            className="grid gap-6 mt-2 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1"
          >
            {listProviderFilter?.length != 0 ? (
              listProviderFilter?.map((provider) => (
                <Link
                  key={provider?.id}
                  href={`/profile/${provider?.slug ?? provider?.id}?tab=service&service=${
                    provider.serviceSlug ?? provider.serviceId
                  }`}
                  className="mb-10"
                >
                  <PromoteCard data={provider} />
                </Link>
              ))
            ) : (
              <div className="mt-10 text-center col-span-full">
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
