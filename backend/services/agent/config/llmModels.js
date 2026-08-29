import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import dotenv from "dotenv"
import { ChatOpenRouter } from "@langchain/openrouter";

dotenv.config()

const groq = new ChatGroq({
    model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY
})

const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
})


const openrouter = new ChatOpenRouter({
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 2500
});

export const getModel = (agent) => {
    switch(agent) {
        case "chat":
            return groq;
        case "search":
            return groq;
        case "coding":
            return openrouter;
        default:
            return groq;
    }
}
