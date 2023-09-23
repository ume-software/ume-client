import coin from 'public/coin-icon.png'
import medalTop1 from 'public/first-place-medal.png'
import medalTop2 from 'public/second-place-medal.png'
import medalTop3 from 'public/third-place-medal.png'

import Image from 'next/legacy/image'
import { TopDonationDonorPagingResponse, TopDonationRecipientPagingResponse } from 'ume-service-openapi'

import { TableSkeletonLoader } from '~/components/skeleton-load'

const Table = (props: {
  type: string
  data: TopDonationDonorPagingResponse['row'] | TopDonationRecipientPagingResponse['row'] | undefined
  loadingUserDonation?: boolean
}) => {
  return (
    <>
      <div className="w-[80%] bg-zinc-800 rounded-xl p-3 animate-running-border">
        {!props.loadingUserDonation ? (
          <>
            <div>
              {props?.data?.length != 0 ? (
                <>
                  <p className="text-lg font-semibold">Top {props.type.toLocaleLowerCase()} donate</p>
                  <table className="w-full text-center">
                    <thead>
                      <tr>
                        <th className="py-2">Top</th>
                        <th className="py-2">Tên</th>
                        <th className="py-2">Số tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {props?.data?.map((data, index) => (
                        <tr key={data.prividerId || data.userId} className="">
                          <td className="py-2">
                            {index == 0 && <Image src={medalTop1} width={30} height={40} alt="coin" />}
                            {index == 1 && <Image src={medalTop2} width={30} height={40} alt="coin" />}
                            {index == 2 && <Image src={medalTop3} width={30} height={40} alt="coin" />}
                          </td>
                          <td className="py-2">
                            <div className="min-w-[150px] flex justify-center items-center gap-2">
                              <div className="relative w-8 h-8">
                                <Image
                                  className="absolute rounded-full"
                                  layout="fill"
                                  objectFit="cover"
                                  src={data?.user?.avatarUrl || data?.provider?.avatarUrl}
                                  alt="Donationr Image"
                                />
                              </div>
                              <p className="truncate">{data?.user?.name || data?.provider?.name}</p>
                            </div>
                          </td>
                          <td className="py-2">
                            <div className="flex items-center justify-center">
                              {Math.floor(data?.totalCoinDonation) || Math.floor(data?.actualReceivingAmount)}
                              <Image src={coin} width={40} height={40} alt="coin" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <p className="text-md font-normal">Chưa có dữ liệu. Chúng tôi sẽ cập nhật lại sau.</p>
              )}
            </div>
          </>
        ) : (
          <TableSkeletonLoader />
        )}
      </div>
    </>
  )
}
export default Table
