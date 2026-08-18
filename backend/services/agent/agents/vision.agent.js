import { getModel } from "../config/llmModels.js"
import axios from "axios"

export const visionAgent = async (state) => {
    try {
        const llm = getModel("image")
        const res = await llm.invoke(`
    You are an elite AI image prompt engineer.

Convert the user request into a highly detailed image generation prompt.

Requirements:

- Cinematic lighting
- Professional composition
- Ultra realistic
- High detail
- Beautiful color palette
- Sharp focus
- 8K quality
- Photorealistic
- Depth of field
- Professional photography
- Stunning visuals

Return only the image prompt.

User Request:
${state.prompt}
    `)

        const prompt = res.content.trim()
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

        return {
            ...state,
            aiResponse: `

Your image has been generated! You can download it using the link below.

📥 [Download Image](${imageUrl})

💡 Tip: Right-click on the image and select "Save image as..." to download it.
`,
            images: [imageUrl]
        };
    } catch (error) {
        console.error("[VisionAgent] Error:", error.message)
        return {
            ...state,
            aiResponse: "Failed to generate image. Please try again."
        }
    }
}