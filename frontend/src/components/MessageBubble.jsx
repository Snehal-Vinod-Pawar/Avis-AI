import React from 'react'
import Markdown from 'react-markdown'

function MessageBubble({ role, content }) {
    const isUser = role === "user"

    if (!content) return null

    return (
        <div className={`flex pt-4 ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[72%] px-5 py-3 rounded-2xl text-[18px] leading-relaxed 
            ${isUser
                ? "bg-linear-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm"
                : "bg-white/[0.06] border border-white/[0.08] text-slate-100 rounded-tl-sm"
            }`}>
                <Markdown>
                    {content}
                </Markdown>
            </div>
        </div>
    )
}

export default MessageBubble