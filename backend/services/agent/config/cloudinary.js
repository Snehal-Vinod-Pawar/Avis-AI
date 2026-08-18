import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {string} filename - Name for the file
 * @param {string} contentType - MIME type (e.g., 'application/pdf')
 * @param {string} resourceType - Cloudinary resource type ('image', 'raw', 'video', 'auto')
 * @returns {Promise<string>} Download URL
 */
export const uploadFile = async (buffer, filename, contentType, resourceType = 'auto') => {
  try {
    // Convert buffer to base64 data URI
    const base64Data = `data:${contentType};base64,${buffer.toString('base64')}`;
    
    const result = await cloudinary.uploader.upload(base64Data, {
      resource_type: resourceType,
      public_id: filename,
      folder: 'cortexai',
      access_mode: 'public',
    });

    // Log the complete upload response for debugging
    console.log('📊 Cloudinary Upload Response:', {
      public_id: result.public_id,
      resource_type: result.resource_type,
      type: result.type,
      secure_url: result.secure_url,
      url: result.url,
      format: result.format,
    });

    // Use the secure_url from the upload response
    console.log(`✅ File uploaded to Cloudinary: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
    throw error;
  }
};

/**
 * Get a download URL for a file
 * @param {string} filename - File name in Cloudinary
 * @returns {Promise<string>} Download URL
 */
export const getDownloadUrl = async (filename) => {
  try {
    const result = await cloudinary.url(filename, {
      secure: true,
    });
    return result;
  } catch (error) {
    console.error("❌ Get URL failed:", error.message);
    throw error;
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} filename - File name in Cloudinary
 * @returns {Promise<void>}
 */
export const deleteFile = async (filename) => {
  try {
    await cloudinary.uploader.destroy(filename);
    console.log(`✅ File deleted from Cloudinary: ${filename}`);
  } catch (error) {
    console.error("❌ Delete failed:", error.message);
    throw error;
  }
};

export default { uploadFile, getDownloadUrl, deleteFile };