import redis from "../../../shared/redis/redis.js"
import { getMessages } from "../utils/getMessages.js"

export const getMemory = async (conversationId) => {
    try {
        const key = `messages-${conversationId}`
        const cached = await redis.get(key)
        if(cached) {
            try {
                return JSON.parse(cached) 
            } catch (parseError) {
                console.error("Failed to parse cached messages in getMemory, fetching from database:", parseError)
                // Delete corrupted cache
                await redis.del(key).catch(() => {})
            }
        } 
        const messages = await getMessages(conversationId)
        if (messages) {
            await redis.set(key,JSON.stringify(messages),"EX",24*60*60)
        }
        return messages || []
    } catch (error) {
        console.error("Redis getMemory error:", error)
        // Fallback to database if Redis fails
        return await getMessages(conversationId) || []
    }
}


export const addMessage = async (conversationId,role,content) => {
    try {
        const key = `messages-${conversationId}`
        const rawMessages = await redis.get(key)
        
        let messages = []
        if (rawMessages) {
            try {
                messages = JSON.parse(rawMessages)
            } catch (parseError) {
                console.error("Failed to parse cached messages, resetting cache:", parseError)
                messages = []
            }
        }
        
        messages.push({
            role,content
        })
        if(messages.length>20) {
            messages.shift()
        }

        await redis.set(key,JSON.stringify(messages))
    } catch (error) {
        console.error("Redis addMessage error:", error)
        // Silently fail - messages are already saved to database
    }
}
