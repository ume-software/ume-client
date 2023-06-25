import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import { LiveStreamChannelResponse } from 'ume-steaming-service-openapi'
import { AppLayout } from '~/components/layouts/app-layout/app-layout'
import { trpc } from '~/utils/trpc'

const DetailPlayer = (props) => {
 let channel: LiveStreamChannelResponse  | undefined;
 const { slug } = props;
  const videoRef = useRef<any>(null); 
   useEffect(() => {
     if (channel && typeof window !== 'undefined') {
        const flvPlayer = require('flv.js');
        const player = flvPlayer.createPlayer({
        type: 'flv',
        url: `http://localhost:5301/live/${slug}.flv`,
        });
        console.log("player ==> ",player);
        console.log("videoRef ===> ",videoRef)
        player.attachMediaElement(videoRef.current);
        player.load();
    }
  }, []);
  

  const {
    data: provider,
    isLoading: loadingProvider,
    isFetching,
  } = trpc.useQuery(['streaming.getLiveStreamChannelById', {channelId:slug as string,limit:'1',page:'1'}])
  if (loadingProvider) {
    return <></>
  }
  channel = provider?.data



  return (
    <>
      <Head>
        <title>UME | Live</title>
      </Head>
      <AppLayout {...props}>
        <div className='text-white'>
            <h1>Live</h1>
            <video ref={videoRef} style={{ width: '80%' }} controls />
            <h1 >{channel?.title}</h1>
            <h5>{channel?.description}</h5>
        </div>
      </AppLayout>
    </>
  )
}
export default DetailPlayer
