import { getModel } from "../config/llmModels.js"

export const codingAgent = async (state) => {
    const intentLlm = await getModel("intent")
    const llm = await getModel("coding")
    const intentRes = await intentLlm.invoke(`
        You are an intent classifier.
        Return ONLY one of these values.
        CODE_GENERATION
        CODE_REVIEW
        CODE_EXPLAINATION
        DEBUGGING
        OPTIMIZATION
        CONVERSION
        DOCUMENTATION

        User Request:
        ${state.prompt}
    `)
    const intent = intentRes.content
    console.log(intent)
    if (intent == "CODE_GENERATION") {
        const prompt = `
You are Avis AI, an expert software architect and senior full-stack developer.

Your task is to analyze the user's request and generate a COMPLETE, production-ready project.

## Instructions

- First understand the user's requirements.
- Choose the most appropriate architecture and technology stack.
- Do NOT assume the project is frontend-only.
- If backend, database, authentication, APIs, AI, real-time communication, or file storage are required, include them automatically.
- If the user specifies a framework or technology, use it.
- Otherwise choose the simplest modern stack that best fits the project.

## Project Requirements

Generate every required file.

Examples include:

- HTML
- CSS
- JavaScript
- React
- Next.js
- Node.js
- Express
- MongoDB
- Prisma
- Firebase
- Socket.io
- Tailwind
- TypeScript

Only generate technologies that are actually required.

Never omit important files.

Examples:

- package.json
- README.md
- .env.example
- configuration files
- frontend files
- backend files
- routes
- controllers
- models
- middleware
- assets

## Code Quality

Generate production-quality code.

Requirements:

- clean architecture
- modular code
- reusable components
- responsive UI
- accessibility
- proper validation
- robust error handling
- secure coding practices
- modern JavaScript/TypeScript
- no TODOs
- no placeholders
- no incomplete implementations

#images
Use real Unsplash images when images are needed. do not use placeholders
## Images

When images are required:

1. First use valid Unsplash Source URLs.

Examples:

https://source.unsplash.com/800x600/?pizza
https://source.unsplash.com/800x600/?restaurant
https://source.unsplash.com/800x600/?coffee

2. If you are not confident that a valid Unsplash URL exists, DO NOT invent image IDs or URLs.

Instead use Picsum as a fallback.

Examples:

https://picsum.photos/800/600?random=1
https://picsum.photos/800/600?random=2

Never generate broken image URLs.
Always ensure every <img src=""> points to a valid image URL.

## Output

Return ONLY valid JSON.

Do not return Markdown.

Do not return explanations.

Use exactly this format:

{
  "projectName": "",
  "description": "",
  "techStack": [],
  "files": [
    {
      "path": "",
      "content": ""
    }
  ]
}

Rules:

- Valid JSON only
- Every required file must be included
- Every file content must be a string
- Preserve folder structure using the "path" field
- Never truncate code
- Never summarize code

User Request: 
${state.prompt}
`
        const res = await llm.invoke(prompt)

        // Parse the JSON response
        let data
        try {
            // Extract JSON from response
            let content = res.content
            console.log("Raw LLM response length:", content.length)

            // Remove markdown code block markers if present
            content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '')

            // Try to find JSON object using brace matching
            const firstBrace = content.indexOf('{')
            if (firstBrace === -1) {
                throw new Error('No JSON found in response')
            }

            // Find matching closing brace by counting braces (ignore escaped braces)
            let braceCount = 0
            let lastBrace = -1
            for (let i = firstBrace; i < content.length; i++) {
                // Skip escaped characters
                if (content[i] === '\\' && i + 1 < content.length) {
                    i++ // skip next character
                    continue
                }
                if (content[i] === '{') braceCount++
                if (content[i] === '}') braceCount--
                if (braceCount === 0) {
                    lastBrace = i
                    break
                }
            }

            console.log("JSON extraction - firstBrace:", firstBrace, "lastBrace:", lastBrace)

            if (lastBrace !== -1) {
                let jsonStr = content.substring(firstBrace, lastBrace + 1)
                console.log("Extracted JSON string length:", jsonStr.length)

                // Try to fix common JSON issues from LLM responses
                // Remove trailing commas
                jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1')

                try {
                    data = JSON.parse(jsonStr)
                    // Unescape newlines and tabs in file contents
                    data.files?.forEach(file => {
                        if (file.content) {
                            file.content = file.content
                                .replace(/\\n/g, '\n')
                                .replace(/\\t/g, '\t')
                                .replace(/\\"/g, '"')
                        }
                    })
                    console.log("JSON parsed successfully, files count:", data.files?.length || 0)
                } catch (retryError) {
                    // If still failing, log and fallback
                    console.error("JSON parse failed:", retryError.message)
                    console.error("JSON preview:", jsonStr.substring(0, 300))
                    return {
                        ...state,
                        aiResponse: res.content,
                        artifacts: []
                    }
                }
            } else {
                throw new Error('No matching closing brace found')
            }
        } catch (parseError) {
            // Silently fallback to raw content - LLM didn't generate valid JSON
            console.error("JSON extraction failed:", parseError.message)
            return {
                ...state,
                aiResponse: res.content,
                artifacts: []
            }
        }
        
        return {
            ...state,
            aiResponse: "Code Generated Successfully",
            artifacts: [
                {
                    id: Date.now(),
                    type: "Project",
                    files: data.files || [],
                    title: state.prompt
                }
            ]
        }
    }

    const res = await llm.invoke(`
You are Avis AI, an expert software engineer specializing in debugging, code analysis, optimization, and bug fixing.

## Your Expertise
- Debugging and troubleshooting code issues
- Code review and quality improvement
- Performance optimization
- Architecture and design patterns
- Best practices and modern standards
- Bug fixing and error resolution

## Response Format

Provide a clear, structured Markdown response following this format:

# Overview
Brief summary of the issue or request

## Root Cause
Explain what's causing the problem

## Explanation
Detailed explanation of the issue, why it occurs, and how it affects the system

## Problems Identified
List specific problems found (if applicable)
- Problem 1
- Problem 2
- etc.

## Solution
Step-by-step solution to fix the issue
1. First step
2. Second step
3. etc.

## Code Changes
Provide complete, working code blocks with proper syntax highlighting:
\`\`\`language
// Complete code here
\`\`\`

## Best Practices
Recommend best practices to prevent similar issues

## Additional Notes
Any other relevant information, warnings, or suggestions

## Guidelines

- **Understand First**: Analyze the issue thoroughly before suggesting solutions
- **Clear Explanations**: Use simple language, avoid unnecessary jargon
- **Root Cause**: Always explain why the bug occurs, not just how to fix it
- **Complete Solutions**: Provide full code blocks, not snippets
- **Preserve Style**: Match the existing code style and patterns
- **Modern Practices**: Suggest current best practices and standards
- **Edge Cases**: Mention potential edge cases and how to handle them
- **Performance**: Optimize only when necessary, explain trade-offs
- **Security**: Highlight security implications if relevant
- **Testing**: Suggest how to test the fix

## Important Rules

- Return ONLY Markdown format
- Do NOT generate complete project files unless explicitly requested
- Do NOT change project architecture unless necessary
- Focus only on the specific problem or request
- Keep explanations concise but thorough
- Use proper Markdown syntax
- Include code language tags for syntax highlighting

User Request:
${intent}

Original User Message:
${state.prompt}
`)
    const data = res.content
    return {
        ...state,
        aiResponse: data,
        artifacts: []
    }
}