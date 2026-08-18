import { uploadFile, generatePath } from "./storage"

/**
 * Upload file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} type - Type of file (image, artifact, pdf, ppt)
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<string>} Download URL
 */
export const uploadToFirebase = async (file, type = "artifact", conversationId) => {
  try {
    const filename = `${Date.now()}-${file.name}`
    let path

    switch (type) {
      case "image":
        path = generatePath.image(conversationId, filename)
        break
      case "pdf":
        path = generatePath.pdf(conversationId, filename)
        break
      case "ppt":
        path = generatePath.ppt(conversationId, filename)
        break
      case "avatar":
        path = generatePath.avatar(conversationId)
        break
      default:
        path = generatePath.artifact(conversationId, filename)
    }

    const downloadURL = await uploadFile(file, path)
    return downloadURL
  } catch (error) {
    console.error("Error uploading to Firebase:", error)
    throw error
  }
}

export default uploadToFirebase