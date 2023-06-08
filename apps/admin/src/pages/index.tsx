function App() {
  return <></>
}

export async function getServerSideProps(context) {
  return {
    redirect: {
      permanent: false,
      destination: '/signin',
    },
  }
}
export default App
