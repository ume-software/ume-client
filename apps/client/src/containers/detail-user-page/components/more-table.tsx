const MoreTable = (props) => {
  return (
    <>
      {props.children ? (
        props.children.icon ? (
          <div className="w-full overflow-hidden hover:bg-gray-700 group rounded-md pl-2 pr-2 ">
            <div className="w-full overflow-hidden scale-x-100 group-hover:scale-x-95 flex items-center justify-between gap-2 group-hover:-translate-x-2 duration-300">
              <a href="#">{props.children.name}</a>
              {props.children.icon}
            </div>
          </div>
        ) : (
          <a href="#" className="hover:bg-gray-700 rounded-md pl-2 pr-2">
            {props.children.name}
          </a>
        )
      ) : (
        <div className="w-full bg-white h-0.5 rounded-all" />
      )}
    </>
  )
}
export default MoreTable
