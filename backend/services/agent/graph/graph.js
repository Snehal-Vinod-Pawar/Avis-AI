import { StateGraph } from "@langchain/langgraph"
import { agentState } from "./state.js"
import { router } from "./router.js"
import { chatAgent } from "../agents/chat.agent.js"
import { searchAgent } from "../agents/search.agent.js"
import { codingAgent } from "../agents/coding.agent.js"
import { pptAgent } from "../agents/ppt.agent.js"
import { visionAgent } from "../agents/vision.agent.js"
import { pdfAgent } from "../agents/pdf.agent.js"

const stateGraph = new StateGraph(agentState)

stateGraph.addNode("router", router)
stateGraph.addNode("chat", chatAgent)
stateGraph.addNode("search", searchAgent)
stateGraph.addNode("coding", codingAgent)
stateGraph.addNode("ppt", pptAgent)
stateGraph.addNode("pdf", pdfAgent)
stateGraph.addNode("vision", visionAgent)


stateGraph.addEdge("__start__","router")
stateGraph.addConditionalEdges("router", (state) => {
    switch(state.agent) {
        case "chat":
            return "chat";
        case "search":
            return "search"
        case "coding":
            return "coding";
        case "pdf":
            return "pdf";
        case "ppt":
            return "ppt";
        case "vision":
            return "vision";
        default:
            return "chat";
    }
},{
    chat: "chat",
    search: "search",
    coding: "coding",
    pdf: "pdf",
    ppt: "ppt",
    vision: "vision"
})

stateGraph.addEdge("search", "chat")
stateGraph.addEdge("chat", "__end__")
stateGraph.addEdge("coding", "__end__")
stateGraph.addEdge("pdf", "__end__")
stateGraph.addEdge("ppt", "__end__")
stateGraph.addEdge("vision", "__end__")

export const graph = stateGraph.compile()

