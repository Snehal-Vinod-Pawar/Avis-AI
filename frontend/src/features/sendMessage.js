import React from 'react'
import api from '../../utils/axios'

async function sendMessage(payload) {
  try {
    const {data} = await api.post("/api/agent/chat", payload)
    return data
  } catch(error) {
    console.error("Error sending message:", error)
    if (error.response) {
      // Server responded with error
      console.error("Error response:", error.response.data)
      return {
        error: true,
        message: error.response.data.message || "Server error occurred"
      }
    } else if (error.request) {
      // Request made but no response
      console.error("No response received:", error.request)
      return {
        error: true,
        message: "No response from server. Please check your connection."
      }
    } else {
      // Error in request setup
      console.error("Request error:", error.message)
      return {
        error: true,
        message: "Failed to send message. Please try again."
      }
    }
  }
}

export default sendMessage