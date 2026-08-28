import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../../utils/firebase'
import api from '../../utils/axios'
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice'
import SideBar from '../components/SideBar';
import ChatArea from '../components/ChatArea';
import Artifact from '../components/Artifact';
import Landing from './Landing';

function Home() {

  const {userData} = useSelector(state => state.user)
  const dispatch = useDispatch()

  const handleLogin = async (token) => {
    try{
      const {data} = await api.post("/api/auth/login", {token})
      dispatch(setUserData(data))
    } catch(error) {
      console.log(error)
    }
  }

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider)
    const token = await data.user.getIdToken()
    console.log(token)
    await handleLogin(token)
    console.log(data)
  }

  
  if (!userData) {
    return <Landing onLogin={googleLogin} />
  }

  return (
    <>
      <div className='h-screen flex bg-[#0d0f14] text-white overflow-hidden'>
        <SideBar/>
        <ChatArea/>
        <Artifact/>
        
      </div>
    </>
  )
}


export default Home
