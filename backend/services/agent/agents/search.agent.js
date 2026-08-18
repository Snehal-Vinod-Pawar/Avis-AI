import { searchTool } from "../config/tavily.js"

export const searchAgent = async (state) => {
    console.log("Prompt:", state.prompt)
    try {
        const results = await searchTool.invoke({
            query: state.prompt
        })
        console.log("=== SEARCH RESULTS ===", results)
        return {
            ...state,
            searchResults: results,
            images: results.images
        }
    } catch (error) {
        return {
            ...state,
            searchResults: [],
            images: []
        }
    }
}
