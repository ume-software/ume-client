function App() {
  return <></>
}

export async function getServerSideProps(context) {
  return {
    redirect: {
      permanent: false,
      destination: '/home',
    },
  }
}
export default App
