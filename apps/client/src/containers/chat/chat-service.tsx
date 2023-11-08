import Image from 'next/legacy/image'

const ChatService = (props: { serviceData }) => {
  return (
    <div className="flex items-center justify-between px-5">
      <div className="flex items-center gap-3">
        <div className="relative w-[80px] h-[100px]">
          <Image
            className="absolute rounded-lg"
            layout="fill"
            objectFit="cover"
            src={props.serviceData?.gameImg || props.serviceData?.service?.imageUrl}
            alt="Game Image"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-white">{props.serviceData?.service?.name}</span>
          <span className="text-xl font-semibold text-white opacity-30">Coin {props.serviceData?.cost} / Game</span>
        </div>
      </div>
      <div>
        <button
          type="button"
          className="px-5 py-1 text-lg font-semibold text-white bg-purple-700 rounded-full hover:scale-105"
        >
          Play
        </button>
      </div>
    </div>
  )
}
export default ChatService
