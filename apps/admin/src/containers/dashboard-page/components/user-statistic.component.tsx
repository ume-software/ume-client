import { ProviderChart } from './provider-chart.component'
import { UserChart } from './user-chart.component'

export const UserStatistic = () => {
  return (
    <div className="w-full h-full">
      <div>
        <div className="text-2xl font-medium text-white">Tổng số người dùng</div>
        <div className="text-base font-normal text-gray-400">Tổng số người dùng trong hệ thống</div>
      </div>
      <div className="flex justify-around">
        <div>
          <UserChart />
        </div>
        <div>
          <ProviderChart />
        </div>
      </div>
    </div>
  )
}
