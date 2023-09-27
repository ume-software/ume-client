import { GetProfileProviderBySlugResponse, UserInformationResponse } from 'ume-service-openapi'

const PersonalInformation = (props: { data: UserInformationResponse }) => {
  return (
    <>
      <div className="bg-zinc-800 rounded-3xl p-10">
        <div className="flex flex-col gap-10">
          <span className="font-roboto font-normal text-lg leading-9">{props.data?.providerConfig?.description}</span>
        </div>
      </div>
    </>
  )
}
export default PersonalInformation
