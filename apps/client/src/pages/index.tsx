const Home = () => {
  return <></>
}

export async function getServerSideProps(context) {
  return {
    redirect: {
      permanent: false,
      destination: '/home'
    }
  }
}

export default Home