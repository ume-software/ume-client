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
    <div className="w-full bg-zinc-800 rounded-xl p-3 animate-running-border">
      {!props.loadingUserDonation ? (
        <div>
          <span className="space-y-5">
            <p className="text-purple-600 text-xl font-bold">Bảng xếp hạng</p>
            <p className="text-md font-medium">
              {props.type == 'Provider' ? 'Nhà cung cấp được nhận quà' : 'Người dùng chi tiền'}
            </p>
          </span>
          {props?.data && props?.data?.length != 0 ? (
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
                  <tr key={data.providerId || data.userId} className="">
                    <td className="py-2">
                      <div className="min-w-[30px]">
                        {index == 0 && <Image src={medalTop1} width={25} height={35} alt="coin" />}
                        {index == 1 && <Image src={medalTop2} width={25} height={35} alt="coin" />}
                        {index == 2 && <Image src={medalTop3} width={25} height={35} alt="coin" />}
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="min-w-[120px] flex justify-center items-center flex-col lg:flex-row gap-2">
                        <div className="relative w-8 h-8">
                          <Image
                            className="absolute rounded-full"
                            layout="fill"
                            objectFit="cover"
                            src={data?.donor?.avatarUrl || data?.recipient?.avatarUrl}
                            alt="Donationr Image"
                          />
                        </div>
                        <p className="truncate">{data?.donor?.name || data?.recipient?.name}</p>
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="min-w-[80px]">
                        {Math.floor(
                          data?.totalCoinDonation ?? data?.totalBalanceDonated ?? data?.totalReceivedAmount,
                        )?.toLocaleString('en-US')}
                        <span className="text-xs italic"> đ</span>
                        <p
                          className="opacity-30
                        "
                        >
                          ({data?.numberDonationsReceived ?? data?.numberDonated} lượt)
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="font-normal text-md">Chưa có dữ liệu. Chúng tôi sẽ cập nhật lại sau.</p>
          )}
        </div>
      ) : (
        <TableSkeletonLoader />
      )}
    </div>
  )
}
export default Table
