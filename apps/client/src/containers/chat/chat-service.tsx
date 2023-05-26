import Image from 'next/legacy/image'

const ChatService = (props: { serviceData }) => {
  console.log(props.serviceData)

  return (
    <>
      <div className="flex justify-between items-center px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="relative w-[100px] h-[100px]">
            <Image
              className="absolute"
              layout="fill"
              objectFit="cover"
              src={props.serviceData?.gameImg}
              alt="Game Image"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-nunito text-2xl font-semibold">{props.serviceData?.name}</span>
            <span className="text-white font-nunito text-2xl font-semibold opacity-30">
              Coin {props.serviceData?.cost} / Game
            </span>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="rounded-full text-white bg-purple-700 py-2 px-10 font-nunito font-semibold text-xl hover:scale-105"
          >
            Chat
          </button>
        </div>
      </div>
    </>
  )
}
export default ChatService
