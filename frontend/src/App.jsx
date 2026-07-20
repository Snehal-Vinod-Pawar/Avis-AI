import React from 'react'
import Home from './pages/Home'
import { useEffect, useState } from 'react'
import getCurrentUser from './features/getCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData, setLoading } from './redux/userSlice'
import EmptyState from './components/EmptyState'

function App() {

  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.user)
  const [fetchError, setFetchError] = useState(null)

  const getUser = async () => {
    dispatch(setLoading(true))
    setFetchError(null)
    try {
      const data = await getCurrentUser()
      dispatch(setUserData(data))
    } catch (error) {
      setFetchError(error.message || 'Something went wrong')
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  if (loading && !fetchError) {
    return (
      <div className='h-screen bg-[#0d0f14]'>
        <EmptyState type="loading" />
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className='h-screen bg-[#0d0f14]'>
        <EmptyState 
          type="error" 
          message={fetchError}
          onRetry={getUser}
        />
      </div>
    )
  }

  return (
    <>
      <Home />
    </>
  )
}

export default App
