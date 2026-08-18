import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { getModel } from "../config/llmModels.js"
import { getMemory } from "../config/memory.js"

export const chatAgent = async (state) => {
    try {
        const llm = await getModel("chat")
        const history = await getMemory(state.conversationId)
        
        let searchContext = ""
        if (state.searchResults && state.searchResults.results) {
            // Extract only the most relevant information from search results
            const topResults = state.searchResults.results.slice(0, 3)
            searchContext = `
I found some information online. Here are the top results:

${topResults.map((result, i) => `
${i + 1}. ${result.title}
   ${result.content || result.url}
`).join('\n')}

Based on the above search results, provide a helpful and concise answer to the user's question.

IMPORTANT: Use the MOST RECENT information from the search results. Focus on the latest data and ignore any outdated information.
`
        }

        const systemPrompt = `You are Avis AI, an intelligent AI assistant.

${searchContext}

Rules:
- For simple questions, greetings and short queries, respond naturally in plain text.
- For technical, educational, coding or detailed topics use clean Markdown.
- Be concise and helpful.
- If you used search results, mention that you found the information online.

Formatting:
- Use # for titles and ## for sections.
- Leave a blank line after headings.
- Use bullet points for lists.
- Use numbered lists for steps.
- Use fenced code blocks with language tags for code.
- Keep paragraphs short and readable.
- Never write headings and content on the same line.
- Never generate large walls of text.
`
        // Build messages array - ensure all messages are proper LangChain message objects
        const messages = [
            new SystemMessage({ content: systemPrompt })
        ]

        // Add history - ensure proper message format
        if (history && Array.isArray(history)) {
            history.forEach(msg => {
                if(msg.role === "user") {
                    messages.push(new HumanMessage({ content: msg.content }))
                } else {
                    messages.push(new AIMessage({ content: msg.content }))
                }
            })
        }

        // Add current prompt
        messages.push(new HumanMessage({ content: state.prompt }))

        const response = await llm.invoke(messages)

        return {
            ...state,
            aiResponse: response.content
        }
    } catch (error) {
        console.error("[ChatAgent] Error:", error.message)
        return {
            ...state,
            aiResponse: "I apologize, but I encountered an error while generating a response. Please try again."
        }
    }
}
