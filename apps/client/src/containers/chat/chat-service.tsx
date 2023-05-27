import Image from 'next/legacy/image'

const ChatService = (props: { serviceData }) => {
  console.log(props.serviceData)

  return (
    <>
      <div className="flex justify-between items-center px-5">
        <div className="flex items-center gap-3">
          <div className="relative w-[80px] h-[80px]">
            <Image
              className="absolute"
              layout="fill"
              objectFit="cover"
              src={props.serviceData?.gameImg}
              alt="Game Image"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-nunito text-xl font-semibold">{props.serviceData?.name}</span>
            <span className="text-white font-nunito text-xl font-semibold opacity-30">
              Coin {props.serviceData?.cost} / Game
            </span>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="rounded-full text-white bg-purple-700 py-1 px-5 font-nunito font-semibold text-lg hover:scale-105"
          >
            Order
          </button>
        </div>
      </div>
    </>
  )
}
export default ChatService
