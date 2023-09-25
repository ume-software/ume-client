import { useEffect, useState } from 'react'

import { TopDonationDonorPagingResponse, TopDonationRecipientPagingResponse } from 'ume-service-openapi'

import Table from './table'

import { trpc } from '~/utils/trpc'

interface DurationProps {
  key: string
  nameVi: string
}

const durationArray: DurationProps[] = [
  { key: '1W', nameVi: 'Tuần' },
  { key: '1M', nameVi: 'Tháng' },
]

const TopDonation = (props) => {
  const [duration, setDuration] = useState<string>('1W')
  const [userDonation, setUserDonation] = useState<TopDonationDonorPagingResponse['row'] | undefined>(undefined)
  const [providerDonation, setProviderDonation] = useState<TopDonationRecipientPagingResponse['row'] | undefined>(
    undefined,
  )
  const { isLoading: loadingUserDonation, refetch: refetchUserDonation } = trpc.useQuery(
    ['community.donateUserTop', duration],
    {
      onSuccess(data) {
        setUserDonation(data?.data?.row)
      },
    },
  )

  const { refetch: refetchProviderDonation } = trpc.useQuery(['community.donateProviderTop', duration], {
    onSuccess(data) {
      setProviderDonation(data?.data?.row)
    },
  })

  useEffect(() => {
    refetchUserDonation()
    refetchProviderDonation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration])

  return (
    <>
      <div className="flex gap-3">
        {durationArray.map((item, index) => (
          <>
            <div
              key={item.key}
              className={`w-[80px] text-center rounded-xl py-2 cursor-pointer ${
                item.key == duration ? ' bg-purple-600' : 'bg-zinc-800'
              }`}
              onClick={() => setDuration(item.key)}
            >
              {item.nameVi}
            </div>
          </>
        ))}
      </div>
      <div className="flex flex-col gap-5 mt-5">
        <div>
          <Table type={'User'} data={userDonation} loadingUserDonation={loadingUserDonation} />
        </div>
        <div>
          <Table type={'Provider'} data={providerDonation} loadingUserDonation={loadingUserDonation} />
        </div>
      </div>
    </>
  )
}
export default TopDonation
