import { Search } from '@icon-park/react'
import { InputWithAffix } from '@ume/ui'

import { useEffect, useState } from 'react'

import Image from 'next/legacy/image'
import Link from 'next/link'

import { CategoryGridSkeleton } from '~/components/skeleton-load'

const AllService = ({ data, loadingService }) => {
  const [searchText, setSearchText] = useState<string>('')
  const [filterService, setFilterService] = useState<any>([])

  useEffect(() => {
    const filtered = data.filter((service) => {
      return (
        (service.viName ?? '').toLowerCase().includes(searchText.toLowerCase()) ||
        service.name.toLowerCase().includes(searchText.toLowerCase())
      )
    })
    setFilterService(filtered ?? [])
  }, [data, searchText])

  return (
    <>
      {loadingService ? (
        <CategoryGridSkeleton />
      ) : (
        <div className="w-full h-full px-6 overflow-y-auto custom-scrollbar">
          <div className="absolute top-5 right-10">
            <div className="w-80">
              <InputWithAffix
                placeholder="Tìm kiếm..."
                value={searchText}
                type="text"
                name="messageSearch"
                onChange={(e) => setSearchText(e.target.value)}
                className="bg-[#37354F] rounded-xl border my-2"
                styleInput={`bg-[#37354F] rounded-xl border-none focus:outline-none`}
                iconStyle="border-none"
                position="left"
                component={<Search theme="outline" size="20" fill="#fff" />}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="grid grid-cols-5 pb-5 place-items-center ">
            {filterService.length > 0 ? (
              filterService.map((category) => (
                <div key={category.id} className="my-8">
                  <Link href={`/filter-service/${category.name}?service=${category.slug || category.id}`}>
                    <div className="relative w-[170px] h-[230px]">
                      <Image
                        className="object-cover mb-4 rounded-lg pointer-events-none"
                        layout="fill"
                        src={category.imageUrl}
                        alt={category.name}
                      />
                    </div>
                    <span className="font-bold">
                      {category.viName && category.viName != '' ? category.viName : category.name}
                    </span>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center mt-5">
                <p className="text-xl text-white font-bold">Chưa có dịch vụ phù hợp với tìm kiếm của bạn</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
export default AllService
