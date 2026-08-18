# Firebase Storage Guide (Replacing AWS S3)

## Overview
This guide shows how to use Firebase Storage instead of AWS S3 for storing files in your Multi-Agent AI Platform.

## What is Firebase Storage?

Firebase Storage is a free, unlimited file storage service that replaces AWS S3:
- **5 GB** free storage
- **1 GB/day** download bandwidth
- **20,000 uploads/day**
- **50,000 downloads/day**
- **Completely free** (Spark Plan)

## Already Configured ✅

Your app already has Firebase Storage configured:
```javascript
// cortexAI/frontend/utils/firebase.js
const firebaseConfig = {
  projectId: "cortexai-3f9f6",
  storageBucket: "cortexai-3f9f6.firebasestorage.app",
  // ... other config
}
```

## Storage Service Created ✅

I've created `cortexAI/frontend/utils/storage.js` with all the functions you need.

---

## How to Use Firebase Storage (Instead of S3)

### 1. **Upload Images** (Vision Agent, User Avatars)

#### Instead of S3:
```javascript
// AWS S3 (OLD)
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
const s3 = new S3Client({ region: "us-east-1" })
await s3.send(new PutObjectCommand({
  Bucket: "my-bucket",
  Key: "image.jpg",
  Body: file
}))
```

#### Use Firebase Storage (NEW):
```javascript
import { uploadFile, generatePath } from "../utils/storage"

// Upload image
const imagePath = generatePath.image(conversationId, "image.jpg")
const downloadURL = await uploadFile(file, imagePath)

// Use the downloadURL in your app
console.log("File available at:", downloadURL)
```

---

### 2. **Upload Artifacts** (Code Files, PDFs, PPTs)

#### Example: Upload Generated Code Files
```javascript
import { uploadFile, generatePath } from "../utils/storage"

// Upload index.html
const htmlPath = generatePath.artifact(conversationId, "index.html")
const htmlURL = await uploadFile(htmlFile, htmlPath)

// Upload style.css
const cssPath = generatePath.artifact(conversationId, "style.css")
const cssURL = await uploadFile(cssFile, cssPath)

// Upload script.js
const jsPath = generatePath.artifact(conversationId, "script.js")
const jsURL = await uploadFile(jsFile, jsPath)

// Store URLs in database
await saveArtifact({
  conversationId,
  files: [
    { name: "index.html", url: htmlURL },
    { name: "style.css", url: cssURL },
    { name: "script.js", url: jsURL }
  ]
})
```

---

### 3. **Upload PDFs** (PDF Agent)

```javascript
import { uploadFile, generatePath } from "../utils/storage"

// Upload PDF
const pdfPath = generatePath.pdf(conversationId, "document.pdf")
const pdfURL = await uploadFile(pdfFile, pdfPath)

// Save to message
await saveMessage({
  conversationId,
  role: "assistant",
  content: "Here's your PDF",
  attachments: [{ type: "pdf", url: pdfURL }]
})
```

---

### 4. **Upload PPTs** (PPT Agent)

```javascript
import { uploadFile, generatePath } from "../utils/storage"

// Upload PPT
const pptPath = generatePath.ppt(conversationId, "presentation.pptx")
const pptURL = await uploadFile(pptFile, pptPath)

// Save to message
await saveMessage({
  conversationId,
  role: "assistant",
  content: "Here's your presentation",
  attachments: [{ type: "ppt", url: pptURL }]
})
```

---

### 5. **Upload Base64 Images** (Vision Agent)

```javascript
import { uploadBase64Image, generatePath } from "../utils/storage"

// Upload base64 image
const imagePath = generatePath.image(conversationId, "generated-image.png")
const imageURL = await uploadBase64Image(base64Data, imagePath)

// Save to message
await saveMessage({
  conversationId,
  role: "assistant",
  content: "Here's the generated image",
  images: [imageURL]
})
```

---

### 6. **Upload User Avatars**

```javascript
import { uploadFile, generatePath } from "../utils/storage"

// When user signs in with Google
const avatarPath = generatePath.avatar(userId)
const avatarURL = await uploadFile(photoURL, avatarPath)

// Save to user profile
await updateUser({
  userId,
  avatar: avatarURL
})
```

---

### 7. **Delete Files**

```javascript
import { deleteFile } from "../utils/storage"

// Delete file
await deleteFile("artifacts/conversationId/index.html")

// Delete multiple files
await Promise.all([
  deleteFile("artifacts/conversationId/index.html"),
  deleteFile("artifacts/conversationId/style.css"),
  deleteFile("artifacts/conversationId/script.js")
])
```

---

### 8. **Get File URL**

```javascript
import { getFileURL } from "../utils/storage"

// Get download URL
const url = await getFileURL("artifacts/conversationId/file.pdf")

// Use in UI
<a href={url} download>Download PDF</a>
```

---

## Integration Examples

### Example 1: Vision Agent (Image Generation)

```javascript
// In vision.agent.js
import { uploadBase64Image, generatePath } from "../../../frontend/utils/storage"

// After generating image
const imagePath = generatePath.image(conversationId, `vision-${Date.now()}.png`)
const imageURL = await uploadBase64Image(base64Image, imagePath)

return {
  ...state,
  images: [imageURL],
  aiResponse: "Image generated successfully!"
}
```

### Example 2: PDF Agent

```javascript
// In pdf.agent.js
import { uploadFile, generatePath } from "../../../frontend/utils/storage"

// After creating PDF
const pdfPath = generatePath.pdf(conversationId, `document-${Date.now()}.pdf`)
const pdfURL = await uploadFile(pdfBlob, pdfPath)

return {
  ...state,
  artifacts: [{
    type: "PDF",
    files: [{ name: "document.pdf", url: pdfURL }],
    title: "Generated PDF"
  }],
  aiResponse: "PDF created successfully!"
}
```

### Example 3: PPT Agent

```javascript
// In ppt.agent.js
import { uploadFile, generatePath } from "../../../frontend/utils/storage"

// After creating PPT
const pptPath = generatePath.ppt(conversationId, `presentation-${Date.now()}.pptx`)
const pptURL = await uploadFile(pptBlob, pptPath)

return {
  ...state,
  artifacts: [{
    type: "PPT",
    files: [{ name: "presentation.pptx", url: pptURL }],
    title: "Generated Presentation"
  }],
  aiResponse: "Presentation created successfully!"
}
```

### Example 4: Coding Agent (Code Artifacts)

```javascript
// In coding.agent.js - Already implemented!
// The artifacts are returned in the JSON response
// You can optionally upload them to Firebase Storage

import { uploadFile, generatePath } from "../../../frontend/utils/storage"

// After generating code
const uploadedFiles = await Promise.all(
  data.files.map(file => {
    const path = generatePath.artifact(conversationId, file.name)
    return uploadFile(new Blob([file.content]), path)
  })
)

// Store URLs in database
await saveArtifact({
  conversationId,
  files: uploadedFiles.map((url, i) => ({
    name: data.files[i].name,
    url
  }))
})
```

---

## Storage Structure

Your Firebase Storage will be organized like this:

```
cortexai-3f9f6.firebasestorage.app/
├── avatars/
│   └── {userId}.jpg
├── images/
│   └── {conversationId}/
│       ├── vision-1234567890.png
│       └── generated-image.png
├── artifacts/
│   └── {conversationId}/
│       ├── index.html
│       ├── style.css
│       └── script.js
├── pdfs/
│   └── {conversationId}/
│       └── document-1234567890.pdf
└── ppts/
    └── {conversationId}/
        └── presentation-1234567890.pptx
```

---

## Security Rules

Firebase Storage has security rules. Make sure to configure them in Firebase Console:

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: cortexai-3f9f6
3. Go to Storage → Rules
4. Use these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to read/write
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Or for more control:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can only access their own files
    match /avatars/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Users can access files in their conversations
    match /{conversationId}/{filename} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Benefits Over AWS S3

1. **Free Forever**: 5GB storage + 1GB bandwidth/day
2. **No Credit Card**: Spark Plan doesn't require payment
3. **Easy Setup**: Already configured in your app!
4. **Simple API**: Much easier than S3
5. **Fast CDN**: Google's global CDN included
6. **Security**: Built-in authentication & rules

---

## Next Steps

1. ✅ Storage service created (`storage.js`)
2. ⏭️ Integrate with agents (vision, pdf, ppt, coding)
3. ⏭️ Update backend to store file URLs in database
4. ⏭️ Add file upload UI components
5. ⏭️ Test file upload/download

Would you like me to implement any of these next steps?