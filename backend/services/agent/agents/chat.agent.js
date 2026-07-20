import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { getModel } from "../config/llmModels.js"
import { getMemory } from "../config/memory.js"

export const chatAgent = async (state) => {
    const llm = await getModel("chat")
    const history = await getMemory(state.conversationId)
    const systemPrompt = `You are CortexAI, an intelligent AI assistant.
    Rules:
    -for simple questions, greatings and short queries, respond naturally in plain text. 
    -for technical, education, coding or detailed topics use clean Markdown.
    
    Formatting:
    -Use # for titles and ## for sections.
    -Leave a blank line after headings.
    -Use bullet points for lists.
    -Use numbered lists for steps.
    -Use fenced code blocks with language tags for code.
    -Keep paragraphs short and readable.
    -Never write headings and content on the same line.
    -Never generate large walls of text.
    `
    const messages = [
        new SystemMessage(systemPrompt)
    ]

    history.forEach(msg => {
        if(msg.role=="user") {
            messages.push(new HumanMessage(msg.content))
        } else {
            messages.push(new AIMessage(msg.content))
        }
    })

    messages.push(new HumanMessage(state.prompt))

    console.log(messages)

    const response = await llm.invoke(messages)

    return {
        ...state,
        aiResponse: response.content
    }
}