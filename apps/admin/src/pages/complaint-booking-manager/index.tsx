import dynamic from 'next/dynamic'

const ComplaintBookingRender = dynamic(() => import('~/containers/complaint-booking-page'), {
  ssr: false,
})

const ComplaintBookingPage = (props) => {
  return <ComplaintBookingRender {...props} />
}

export default ComplaintBookingPage
