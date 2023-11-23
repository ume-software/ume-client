import { useState } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'

import FilterContainer from './components/filter.container'
import { AttrbuteProps } from './components/iFilter'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

import { trpc } from '~/utils/trpc'

const FilterPage = (props) => {
  const router = useRouter()
  const service = router.query.service

  const [listSubAttributeService, setListSubAttributeService] = useState<AttrbuteProps[]>([])

  trpc.useQuery(['booking.getServiceBySlug', { slug: String(service ?? '') }], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    cacheTime: 0,
    refetchOnMount: true,
    onSuccess(data) {
      if ((data?.data?.serviceAttributes?.length ?? 0) > 0) {
        const serviceAttibute =
          data?.data?.serviceAttributes?.map((item) => {
            return {
              id: item.id,
              name: item.viAttribute ?? '',
              subAttr: item?.serviceAttributeValues?.map((itemSubAttr) => {
                return {
                  subAttrId: itemSubAttr.id,
                  subAttrValue: itemSubAttr.value,
                  subAttrViValue: itemSubAttr.viValue ?? '',
                }
              }),
            }
          }) ?? []
        setListSubAttributeService(serviceAttibute)
      } else {
        setListSubAttributeService([])
      }
    },
    enabled: !!service,
  })

  return (
    <>
      <Head>
        <title>UME | {props?.serviceName}</title>
      </Head>
      <AppLayout {...props}>
        <FilterContainer service={service} listSubAttributeService={listSubAttributeService} />
      </AppLayout>
    </>
  )
}
export default FilterPage
