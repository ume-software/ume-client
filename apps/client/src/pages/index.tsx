<<<<<<< HEAD
const Home = () => {
=======
function App() {
>>>>>>> e61802efb5da1b96c52000516bb2c2ee35315bd0
  return <></>
}

export async function getServerSideProps(context) {
  return {
    redirect: {
      permanent: false,
<<<<<<< HEAD
      destination: '/home'
    }
  }
}

export default Home
=======
      destination: '/home',
    },
  }
}
export default App
>>>>>>> e61802efb5da1b96c52000516bb2c2ee35315bd0
