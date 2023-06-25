import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { LiveStreamChannelResponse } from 'ume-steaming-service-openapi';
import { AppLayout } from '~/components/layouts/app-layout/app-layout';
import { trpc } from '~/utils/trpc';
import flvPlayer from 'flv.js';
import { getEnv } from '~/env';

const DetailPlayer = (props) => {
  const { slug } = props;
  const videoRef = useRef<any>(null);
  const [channel, setChannel] = useState<LiveStreamChannelResponse | undefined>(undefined);

  useEffect(() => {
    if (channel && typeof window !== 'undefined') {
      const player = flvPlayer.createPlayer({
        type: 'flv',
        url: `${getEnv().baseLivestreamFlvURL}/live/${slug}.flv`,
      });
      player.attachMediaElement(videoRef.current);
      player.load();

      return () => {
        player.unload();
        player.detachMediaElement();
      };
    }
  }, [channel, slug]);

  const { data: provider, isLoading: loadingProvider } = trpc.useQuery(['streaming.getLiveStreamChannelById', { channelId: slug as string, limit: '1', page: '1' }]);
  
  useEffect(() => {
    if (!loadingProvider) {
      setChannel(provider?.data);
    }
  }, [loadingProvider, provider]);

  if (loadingProvider) {
    return <></>;
  }

  return (
    <>
      <Head>
        <title>UME | Live</title>
      </Head>
      <AppLayout {...props}>
        <div className="text-white">
          <h1>Live</h1>
          <video ref={videoRef} style={{ width: '80%' }} controls />
          <h1>{channel?.title}</h1>
          <h5>{channel?.description}</h5>
        </div>
      </AppLayout>
    </>
  );
};

export default DetailPlayer;
