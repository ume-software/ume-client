import { useEffect, useState } from 'react'

import { TopDonateProviderPagingResponse, TopUserDonatePagingResponse } from 'ume-booking-service-openapi'

import Table from './table'

import { trpc } from '~/utils/trpc'

const durationArray: string[] = ['1W', '1M', '1Y']

const TopDonate = (props) => {
  const [duration, setDuration] = useState<string>('1W')
  const [userDonate, setUserDonate] = useState<TopUserDonatePagingResponse['row'] | undefined>(undefined)
  const [providerDonate, setProviderDonate] = useState<TopDonateProviderPagingResponse['row'] | undefined>(undefined)
  const {
    data: userDonateData,
    isLoading: loadingUserDonate,
    isFetching: fetchingUserDonate,
    refetch: refetchUserDonate,
  } = trpc.useQuery(['community.donateUserTop', duration], {
    onSuccess(data) {
      setUserDonate(data?.data?.row)
    },
  })

  const {
    data: providerDonateData,
    isLoading: loadingProviderDonate,
    isFetching: fetchingProviderDonate,
    refetch: refetchProviderDonate,
  } = trpc.useQuery(['community.donateProviderTop', duration], {
    onSuccess(data) {
      setProviderDonate(data?.data?.row)
    },
  })

  useEffect(() => {
    refetchUserDonate()
    refetchProviderDonate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration])

  return (
    <>
      <div className="flex gap-3">
        {durationArray.map((item, index) => (
          <>
            <div
              key={index}
              className={`w-[80px] text-center rounded-xl py-2 cursor-pointer ${
                item == duration ? ' bg-purple-600' : 'bg-zinc-800'
              }`}
              onClick={() => setDuration(item)}
            >
              {item}
            </div>
          </>
        ))}
      </div>
      <div className="flex flex-col gap-5 mt-5">
        <div>
          <Table type={'User'} data={userDonate} loadingUserDonate={loadingUserDonate} />
        </div>
        <div>
          <Table type={'Provider'} data={providerDonate} loadingUserDonate={loadingUserDonate} />
        </div>
      </div>
    </>
  )
}
export default TopDonate
