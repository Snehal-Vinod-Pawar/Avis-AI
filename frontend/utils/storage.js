import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { app } from "./firebase"

// Initialize Firebase Storage
const storage = getStorage(app)

/**
 * Upload a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - Storage path (e.g., 'artifacts/filename.pdf')
 * @returns {Promise<string>} Download URL
 */
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

/**
 * Upload a base64 image to Firebase Storage
 * @param {string} base64Data - Base64 encoded image data
 * @param {string} path - Storage path
 * @returns {Promise<string>} Download URL
 */
export const uploadBase64Image = async (base64Data, path) => {
  try {
    // Convert base64 to blob
    const response = await fetch(base64Data)
    const blob = await response.blob()
    
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, blob)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  } catch (error) {
    console.error("Error uploading base64 image:", error)
    throw error
  }
}

/**
 * Get download URL for a file
 * @param {string} path - Storage path
 * @returns {Promise<string>} Download URL
 */
export const getFileURL = async (path) => {
  try {
    const storageRef = ref(storage, path)
    return await getDownloadURL(storageRef)
  } catch (error) {
    console.error("Error getting file URL:", error)
    throw error
  }
}

/**
 * Delete a file from Firebase Storage
 * @param {string} path - Storage path
 */
export const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  } catch (error) {
    console.error("Error deleting file:", error)
    throw error
  }
}

/**
 * Upload multiple files
 * @param {Array<{file: File, path: string}>} files - Array of files with paths
 * @returns {Promise<Array<string>>} Array of download URLs
 */
export const uploadMultipleFiles = async (files) => {
  try {
    const uploadPromises = files.map(({ file, path }) => uploadFile(file, path))
    return await Promise.all(uploadPromises)
  } catch (error) {
    console.error("Error uploading multiple files:", error)
    throw error
  }
}

// Storage path generators
export const generatePath = {
  artifact: (conversationId, filename) => `artifacts/${conversationId}/${filename}`,
  image: (conversationId, filename) => `images/${conversationId}/${filename}`,
  avatar: (userId) => `avatars/${userId}.jpg`,
  pdf: (conversationId, filename) => `pdfs/${conversationId}/${filename}`,
  ppt: (conversationId, filename) => `ppts/${conversationId}/${filename}`,
}

export default storage