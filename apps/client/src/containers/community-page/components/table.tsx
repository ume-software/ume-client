import coin from 'public/coin-icon.png'

import Image from 'next/legacy/image'
import {
  TopDonateProviderPagingResponse,
  TopDonateProviderResponse,
  TopUserDonatePagingResponse,
  TopUserDonateResponse,
} from 'ume-booking-service-openapi'

const Table = (props: {
  data: TopUserDonatePagingResponse['row'] | TopDonateProviderPagingResponse['row'] | undefined
}) => {
  return (
    <>
      <table>
        <tr>
          <th>Top</th>
          <th>Tên</th>
          <th>Số tiền</th>
        </tr>
        {props?.data?.map((data, index) => (
          <tr key={data?.id}>
            <td>{index + 1}</td>
            <td>
              <div className="relative w-[30px] h-[30px]">
                <Image
                  className="absolute rounded-full"
                  layout="fill"
                  objectFit="cover"
                  src={data?.user?.avatarUrl || data?.provider?.avatarUrl}
                  alt="Donater Image"
                />
              </div>
            </td>
            <td>
              <div className="flex items-center justify-end">
                {Math.floor(data?.totalCoinDonate) || Math.floor(data?.actualReceivingAmount)}
                <Image src={coin} width={40} height={40} alt="coin" />
              </div>
            </td>
          </tr>
        ))}
      </table>
    </>
  )
}
export default Table
