import { Image } from 'antd'

const AlbumImage = (props: { data: string }) => {
  return <Image className="rounded-2xl" src={props.data} alt="Person Image" />
}
export default AlbumImage
