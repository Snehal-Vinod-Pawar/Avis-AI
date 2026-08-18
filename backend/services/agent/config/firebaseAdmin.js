import { initializeApp, cert, applicationDefault } from "firebase-admin/app"
import { getStorage } from "firebase-admin/storage"

// Firebase Admin SDK initialization
// Uses GOOGLE_APPLICATION_CREDENTIALS environment variable pointing to your service account key JSON file
// or FIREBASE_SERVICE_ACCOUNT_KEY containing the raw JSON string

let storageBucket
let app

// Initialize Firebase immediately (synchronous)
try {
  // Check if service account key is in environment variable as JSON string
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    
    // Print service account info (excluding private key) for debugging
    console.log("📋 Service Account Info:", {
      type: serviceAccount.type,
      project_id: serviceAccount.project_id,
      client_email: serviceAccount.client_email,
      storage_bucket: serviceAccount.storage_bucket
    })
    
    // Get the correct bucket name from service account or use default
    const bucketName = serviceAccount.storage_bucket || "cortexai-3f9f6.firebasestorage.app"
    
    // Firebase Admin SDK v11+ compatible initialization
    app = initializeApp({
      credential: cert(serviceAccount),
      storageBucket: bucketName
    })
    console.log("✅ Firebase Admin SDK initialized with service account key")
    console.log("   Using bucket:", bucketName)
  } 
  // Use GOOGLE_APPLICATION_CREDENTIALS path
  else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    app = initializeApp({
      credential: applicationDefault(),
      storageBucket: "cortexai-3f9f6.firebasestorage.app"
    })
    console.log("✅ Firebase Admin SDK initialized with application default credentials")
  }
  // Try default initialization (for development/testing)
  else {
    console.warn("⚠️  No Firebase credentials found. Using default initialization.")
    app = initializeApp({
      storageBucket: "cortexai-3f9f6.firebasestorage.app"
    })
    console.log("✅ Firebase Admin SDK initialized with default credentials")
  }
  
  // Initialize storage bucket (synchronous) - Firebase Admin SDK v11+
  storageBucket = getStorage(app).bucket()
  console.log("✅ Firebase Storage bucket initialized")
  console.log("   Bucket:", storageBucket.name)
} catch (error) {
  console.error("❌ Firebase Admin SDK initialization failed:", error.message)
  console.error("   Please set FIREBASE_SERVICE_ACCOUNT_KEY or GOOGLE_APPLICATION_CREDENTIALS")
}

const bucket = () => {
  if (!storageBucket) {
    console.error("❌ Storage bucket not initialized. Check Firebase configuration.")
    throw new Error("Storage bucket not initialized")
  }
  return storageBucket
}

/**
 * Upload a buffer to Firebase Storage
 * @param {Buffer} buffer - File buffer
 * @param {string} filename - Name for the file in storage
 * @param {string} contentType - MIME type (e.g., 'application/pdf')
 * @returns {Promise<string>} Download URL
 */
export const uploadToFirebaseAdmin = async (buffer, filename, contentType) => {
  try {
    const file = bucket().file(`artifacts/${filename}`)
    
    await file.save(buffer, {
      metadata: {
        contentType: contentType
      }
    })
    
    // Make the file publicly accessible
    await file.makePublic()
    
    // Get the public URL using the actual bucket name
    const publicUrl = `https://storage.googleapis.com/${storageBucket.name}/artifacts/${filename}`
    
    console.log(`✅ File uploaded: ${publicUrl}`)
    return publicUrl
  } catch (error) {
    console.error("❌ Upload failed:", error.message)
    throw error
  }
}

/**
 * Get a download URL for a file
 * @param {string} filename - File name in storage
 * @returns {Promise<string>} Download URL
 */
export const getDownloadUrl = async (filename) => {
  try {
    const file = bucket().file(`artifacts/${filename}`)
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    })
    return url
  } catch (error) {
    console.error("❌ Get URL failed:", error.message)
    throw error
  }
}

export default { uploadToFirebaseAdmin, getDownloadUrl }