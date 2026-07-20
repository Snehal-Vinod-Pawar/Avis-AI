import { signInWithPopup } from 'firebase/auth'
import { FaGoogle } from "react-icons/fa";
import { auth, googleProvider } from '../../utils/firebase'
import api from '../../utils/axios'
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice'
import SideBar from '../components/SideBar';
import ChatArea from '../components/ChatArea';
import Artifact from '../components/Artifact';

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

  
  return (
    <>
      <div className='h-screen flex bg-[#0d0f14] text-white overflow-hidden'>

        {!userData && 
          <div className=" fixed inset-0 z-0 flex items-center justify-center bg-black 60 backdrop-blur-sm">
            <div className="w-[400px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-[24px] font-semibold text-slate-100 tracking-tight">Welcome to Avis AI</h2>
                    <p className="text-[16px] text-slate-500">Please login to continue using the app.</p>
                </div>
                 
                <button className=" w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg text-large font-medium 
                text-white bg-linear-to-br from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-600 
                active:from-indigo-600 active:to-violet-800 border border-indigo-500 300 shadow-lg shadow-indigo-500/20 
                hover:shadow-indigo-530 transaction-call-duration-150 cursor-pointer" 
                onClick={googleLogin}>
                    <FaGoogle size={18} className="text-white "/>
                    Continue with Google
                </button>
            </div>
          </div>
        }

        <SideBar/>
        <ChatArea/>
        <Artifact/>
        
      </div>
    </>
  )
}


export default Home
