import { getModel } from "../config/llmModels.js"

export const router = async (state) => {

    if (state.agent && state.agent !== "auto") {
        return {
            ...state,
            agent: state.agent
        }
    }

    const llm = await getModel("router")
    const prompt = ` You are an router agent
          Available agents:
          -chat
          -search
          -coding
          -pdf
          -ppt
          -vision

          Rules:
          chat: General converstaion, explainations,learning,questions
          search: Current events,latest information,news,recent developments,internet lookup
          coding: Generate code, debug code, build projects,architecture,API design
          pdf: Questions about generate PDFs or document context.
          ppt: Questions about generate ppts
          vision: Generate image,create image

          Return ONLY one word:
          chat
          search
          coding
          pdf
          ppt
          vision
          
          User Query:
          ${state.prompt}
    `

    const response = await llm.invoke(prompt)
    let selectedAgent = response.content.trim().toLowerCase()
    
    // Validate agent name - fallback to chat if invalid
    const validAgents = ['chat', 'search', 'coding', 'pdf', 'ppt', 'vision']
    if (!validAgents.includes(selectedAgent)) {
      console.warn(`Invalid agent selected: ${selectedAgent}, falling back to chat`)
      selectedAgent = 'chat'
    }
    
    return {
        ...state,
        agent: selectedAgent
    }

}