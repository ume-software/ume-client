import { Image } from 'antd'

const AlbumImage = (props: { data }) => {
  return (
    <>
      <Image className="rounded-2xl" src={props.data} alt="Person Image"></Image>
    </>
  )
}
export default AlbumImage
