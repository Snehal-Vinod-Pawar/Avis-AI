import { getFileURL } from "./storage"

/**
 * Get file URL from Firebase Storage
 * @param {string} path - File path in storage
 * @returns {Promise<string>} Download URL
 */
export const getFromFirebase = async (path) => {
  try {
    const downloadURL = await getFileURL(path)
    return downloadURL
  } catch (error) {
    console.error("Error getting file from Firebase:", error)
    throw error
  }
}

export default getFromFirebase