import axios from "axios"
import { graph } from "../graph/graph.js"
import { addMessage } from "../config/memory.js"

export const agent = async (req,res) => {
   try {
     const  {prompt,conversationId, agent} = req.body
     
     console.log(`[Agent] Processing request - Agent: ${agent}, ConversationId: ${conversationId}`)
     
     // Save user message to chat service
     await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{
        conversationId,
        role: "user",
        content: prompt
     })

     // Invoke the LangGraph agent
     const result = await graph.invoke({
        prompt,
        conversationId,
        agent: agent || "auto"
     })
     
     const response = result.aiResponse
     console.log(`[Agent] Response generated successfully`)
     
     // Cache messages in Redis (non-blocking, fail silently if Redis is down)
     try {
        await addMessage(conversationId,"user",prompt)
        await addMessage(conversationId,"assistant",response)
     } catch (redisError) {
        console.warn("[Agent] Redis message cache failed (non-fatal):", redisError.message)
     }
     
      // Save assistant response to chat service
      await axios.post(`${process.env.CHAT_SERVICE}/save-message`,{
         conversationId,
         role: "assistant",
         content: response,
         images: result.images,
         artifacts: result.artifacts
      })
      
      console.log(`[Agent] Returning response - Images: ${result.images?.length || 0}, Artifacts: ${result.artifacts?.length || 0}`)
     
     return res.status(200).json({
         answer: result?.aiResponse,
         images: result?.images,
         artifacts: result?.artifacts
     })

   } catch (error) {
      console.error("[Agent] Error stack:", error.stack)
      console.error("[Agent] Error message:", error.message)
      console.error("[Agent] Error details:", JSON.stringify(error, null, 2))
      return res.status(500).json({message: `Agent error: ${error.message}`})
   } 
}

/**
 * Stream a generated file (e.g. a PDF from Cloudinary) back to the client with
 * a Content-Disposition: attachment header so the browser always downloads it.
 *
 * This avoids relying on Cloudinary's fl_attachment flag, which is unreliable
 * for raw files and returns ERR_INVALID_RESPONSE on some networks/CDNs.
 *
 * GET /download?url=<cloudinary secure_url>
 */
export const downloadFile = async (req, res) => {
   try {
      const url = req.query.url
      if (!url) return res.status(400).json({ message: "Download URL is required" })

      const response = await axios.get(url, { responseType: "arraybuffer" })

      // Derive a safe file name from the download URL (e.g. pdf-<id>.pdf)
      let fileName = decodeURIComponent((url.split("/").pop() || "download").split("?")[0])
      fileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "") || "download.pdf"

      res.setHeader("Content-Type", response.headers["content-type"] || "application/octet-stream")
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`)
      res.setHeader("Content-Length", response.data.length)
      res.setHeader("Cache-Control", "no-store")

      return res.send(Buffer.from(response.data))
   } catch (error) {
      console.error("[Agent] Download failed:", error.message)
      return res.status(502).json({ message: `Download failed: ${error.message}` })
   }
}
