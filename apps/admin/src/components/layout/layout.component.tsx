import Sidebar from '../sidebar/sidebar.component'

interface ILayout {
  children: React.ReactNode
}
const ILayout = ({ children }: ILayout) => {
  return (
    <>
      <div>
        <div>Header</div>
        <div>
          <Sidebar />
        </div>
        <div>{children}</div>
      </div>
    </>
  )
}
export default ILayout
