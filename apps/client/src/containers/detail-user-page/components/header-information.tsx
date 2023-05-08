import Image from 'next/legacy/image';
import detailBackground from 'public/detail-cover-background.png'
import cover from 'public/cover.png'

const HeaderInformation = (props) => {
  return (
    <div style={{ height: '380px' }}>
      <div className='absolute top-16 left-0' style={{ width: '100%', height: '416px' }}>
        <Image layout='fill' src={detailBackground} alt='background'></Image>
      </div>
      <div className='h-full flex flex-row justify-between items-center'>
        <div className='flex flex-row' style={{ zIndex: 100 }}>
          <div>
            <Image className='rounded-full' width={194} height={182} src={cover} alt='avatar'></Image>
          </div>
          <div className='text-white flex flex-col'>
            <p className='text-white'>@ame147</p>
            <div className='flex flex-row justify-around'>
              <span>16</span>
              <span>Đang hoạt động</span>
            </div>
          </div>
        </div>
        <div style={{ zIndex: 100 }}>Right</div>
      </div>
    </div>
  )
}
export default HeaderInformation
