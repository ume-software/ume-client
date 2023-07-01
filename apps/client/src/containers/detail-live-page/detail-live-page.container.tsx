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


  const { data: provider, isLoading: loadingProvider } = trpc.useQuery(['streaming.getLiveStreamChannelById', { channelId: slug as string, limit: '1', page: '1' }]);
  const streamUrl=`${getEnv().baseLivestreamURL}/api/v1/live/show/${slug}`;


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
        <div className="text-white w-full h-full">
          <h1>Live</h1>
           <div className='w-3/4 h-fit' >
            {streamUrl ? (
              <iframe
                src={streamUrl}
              style={{
                maxWidth:"1280px",
                minWidth:"100%",
                maxHeight:"100vh",
                minHeight:"720px"
              }}
              ></iframe>
            ) : (
              <p>Loading livestream...</p>
            )}
          </div>
          {/* <video ref={videoRef} style={{ width: '80%' }} controls /> */}
          <h1>{channel?.title}</h1>
          <h5>{channel?.description}</h5>
        </div>
      </AppLayout>
    </>
  );
};

export default DetailPlayer;
