import { Star } from '@icon-park/react'

const PersonalInformation = (props: { datas }) => {
  return (
    <>
      <div className="bg-zinc-800 rounded-3xl p-10">
        <div className="flex flex-col gap-10">
          <p className="font-inter font-bold text-4xl">{props.datas.title}</p>
          <span className="font-roboto font-normal text-lg leading-9">{props.datas.content}</span>
        </div>
      </div>
      <div className="bg-zinc-800 rounded-3xl p-5">
        <div className="flex flex-col gap-10">
          <p className="font-inter font-bold text-4xl">Reviews</p>
          {props.datas.reviews?.map((item, index) => (
            <div key={index} className="flex flex-col border-2 border-gray-600 rounded-lg p-3">
              <div className="flex flex-row justify-between">
                <span className="font-roboto font-bold text-2xl leading-9">{item.name}</span>
                <div className="flex flex-row items-center gap-1 leading-9">
                  <p className="font-roboto font-normal text-lg">{item.rate}</p>
                  <Star theme="filled" size="15" fill="#FFDF00" />
                </div>
              </div>
              <div className="flex flex-row gap-3 text-gray-600 leading-9 truncate">
                {item.serviceUsed.map((service) => (
                  <p className="font-roboto font-normal text-md">{service}</p>
                ))}
              </div>
              <span className="font-roboto font-normal text-lg leading-9">{item.comment}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
export default PersonalInformation
