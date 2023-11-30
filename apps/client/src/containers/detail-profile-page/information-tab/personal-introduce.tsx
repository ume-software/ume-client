import { UserInformationResponse } from 'ume-service-openapi'

const PersonalIntroduce = (props: { data: UserInformationResponse }) => {
  return (
    <div className="p-10 bg-zinc-800 rounded-3xl">
      <div className="flex flex-col gap-10">
        <span className="text-lg font-normal leading-9 font-roboto">{props.data?.providerConfig?.description}</span>
      </div>
    </div>
  )
}
export default PersonalIntroduce
