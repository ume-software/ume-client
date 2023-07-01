import AlbumImage from './album-image'

const AlbumTab = (props: { datas }) => {
  const left: JSX.Element[] = []
  const middle: JSX.Element[] = []
  const right: JSX.Element[] = []

  props.datas.forEach((data, index) => {
    const imgSrc = <AlbumImage key={index} data={data.src} />
    let newIndex = index + 1
    if (newIndex % 3 == 0) {
      right.push(imgSrc)
    } else if (newIndex % 2 == 0) {
      left.push(imgSrc)
    } else {
      middle.push(imgSrc)
    }
  })
  return (
    <>
      <div className="grid grid-cols-3 gap-4 px-10">
        <div className="flex flex-col gap-8">{left.map((item) => item)}</div>
        <div className="flex flex-col gap-8">{middle.map((item) => item)}</div>
        <div className="flex flex-col gap-8">{right.map((item) => item)}</div>
      </div>
    </>
  )
}
export default AlbumTab
