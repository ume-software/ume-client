import FeedItem from './feed-item'

const FeedsTab = (props: { datas }) => {
  return (
    <>
      <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-10">
        {props.datas.map((data, index) => (
          <FeedItem key={index} data={data}></FeedItem>
        ))}
      </div>
    </>
  )
}
export default FeedsTab
