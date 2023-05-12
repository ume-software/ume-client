import Image from 'next/legacy/image'

const GamePlayed = ({ datas }) => {
  return (
    <>
      {datas.images?.map((img, index) => (
        <Image key={index} src={img} alt="Game Image"></Image>
      ))}
      <span className="font-roboto font-normal text-lg leading-9">{datas.description}</span>
    </>
  )
}
export default GamePlayed
