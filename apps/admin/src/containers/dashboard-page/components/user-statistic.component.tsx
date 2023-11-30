import { ProviderChart } from './provider-chart.component'
import { UserChart } from './user-chart.component'

export const UserStatistic = () => {
  return (
    <div className="w-full h-full">
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
