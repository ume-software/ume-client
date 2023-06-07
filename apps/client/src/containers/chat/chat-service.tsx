import Image from 'next/legacy/image'

const ChatService = (props: { serviceData }) => {
  return (
    <>
      <div className="flex justify-between items-center px-5">
        <div className="flex items-center gap-3">
          <div className="relative w-[80px] h-[100px]">
            <Image
              className="absolute rounded-lg"
              layout="fill"
              objectFit="cover"
              src={props.serviceData?.gameImg || props.serviceData?.skill?.imageUrl}
              alt="Game Image"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white  text-xl font-semibold">{props.serviceData?.skill?.name}</span>
            <span className="text-white  text-xl font-semibold opacity-30">Coin {props.serviceData?.cost} / Game</span>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="rounded-full text-white bg-purple-700 py-1 px-5  font-semibold text-lg hover:scale-105"
          >
            Play
          </button>
        </div>
      </div>
    </>
  )
}
export default ChatService
