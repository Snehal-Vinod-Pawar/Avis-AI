import React from 'react'
import api from '../../utils/axios'
import { setArtifacts } from '../redux/messageSlice'

async function getMessages(id, dispatch) {
  try {
    const {data} = await api.get(`/api/chat/get-message/${id}`)
    console.log(data)
    
    // Extract artifacts from assistant messages
    if (dispatch && data) {
      const artifacts = data
        .filter(msg => msg.role === 'assistant' && msg.artifacts && msg.artifacts.length > 0)
        .map(msg => msg.artifacts[0])
      
      // Always dispatch setArtifacts, even if empty, to clear artifacts from previous conversation
      dispatch(setArtifacts(artifacts))
    }
    
    return data
  } catch(error) {
    console.log(error)
    return []
  }
}

export default getMessages