import Image from 'next/legacy/image';
import detailBackground from 'public/detail-cover-background.png'
import cover from 'public/cover.png'
import { Dot, Male } from '@icon-park/react';
import type { TabsProps } from 'antd';
import { Tabs } from 'antd';
import { useState } from 'react';

interface tabData {
  label: string,
  children: string,
}

const tabDatas: tabData[] = [
  {
    label: `Thông tin cá nhân`,
    children: `Content of Tab Pane 1`,
  },
  {
    label: `Album`,
    children: `Content of Tab Pane 2`,
  },
  {
    label: `Khoảnh khắc`,
    children: `Content of Tab Pane 3`,
  },
]



const HeaderInformation = (props) => {

  const [selectedTab, setSelectedTab] = useState('Thông tin cá nhân')

  const handleChangeTab = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = (e.target as HTMLElement).dataset.tab
    if (typeof target !== 'string') {
      return;
    }
    setSelectedTab(target)
  }

  return (
    <>
      <div style={{ height: '380px', margin: '0 70px' }}>
        <div className='absolute top-16 left-0' style={{ width: '100%', height: '416px' }}>
          <Image layout='fill' src={detailBackground} alt='background'></Image>
        </div>
        <div className='h-full flex flex-col justify-end gap-5'>
          <div className='flex flex-row justify-between md:items-center items-baseline'>
            <div className='flex md:flex-row md:gap-x-8 flex-col gap-y-2' style={{ zIndex: 100 }}>
              <div>
                <Image className='rounded-full' width={194} height={182} src={cover} alt='avatar'></Image>
              </div>
              <div className='text-white flex flex-col gap-y-2'>
                <p className='text-white text-4xl font-medium'>@ame147</p>
                <div className='flex flex-row justify-around gap-x-5'>
                  <div className='bg-gray-700 p-2 rounded-full flex items-center gap-1'>
                    <Male theme="outline" size="24" fill="#1CB3FF" />
                    <p>16</p>
                  </div>
                  <div className='bg-gray-700 p-2 rounded-full flex items-center gap-1'>
                    <Dot theme="multi-color" size="24" fill={['#54AF45', '#54AF45', '#54AF45', '#54AF45']} />
                    <p>Đang hoạt động</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ zIndex: 100 }}>
              <div className='flex flex-row bg-gray-700 p-2 rounded-full cursor-pointer'>
                <Dot theme="outline" size="8" fill="#fff" />
                <Dot theme="outline" size="8" fill="#fff" />
                <Dot theme="outline" size="8" fill="#fff" />
              </div>
            </div>
          </div>

          <div className='flex flex-row gap-10' style={{ zIndex: 100 }}>
            {tabDatas.map((item, index) => (
              <>
                <a href="#tab" className={`text-white text-3xl font-medium p-4 ${item.label == selectedTab ? 'border-b-4 border-purple-700' : ''}`} key={index} onClick={handleChangeTab} data-tab={item.label}>{item.label}</a>
              </>
            ))}
          </div>
        </div>
      </div>
      <div className='p-5'>
        {tabDatas.map((item, index) => {
          return (
            <p className='text-white' key={index} hidden={selectedTab !== item.label}>
              {item.children}
            </p>
          );
        })}
      </div>
    </>
  )
}
export default HeaderInformation
