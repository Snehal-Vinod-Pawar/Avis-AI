import React from 'react'
import { useSelector } from 'react-redux'
import MessageBubble from './MessageBubble'

function MessageList() {
  const { selectedConversation } = useSelector(state => state.conversation)
  const { messages } = useSelector(state => state.message)
  
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {messages.length==0 || !selectedConversation? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                <div className="flex flex-col gap-1.5">
                    <h1 className='text-[30px] font-semibold text-slate-200 tracking-tight'>Avis AI</h1>
                    <p className='text-[23px] font-semibold text-slate-400 tracking-tight'>How can I help you?</p>
                    <p className='text-[20px] font-semibold text-slate-600 max-w-[400px] leading-relaxed'>Ask me anything - code, ideas, explainations, or just a quick question.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-1">
                    {["Write a Netflix clone","Explain Redis","Build a dashboard"].map((s, i) => (
                        <button key={i} className="text-[18px] text-slate-400 bg-white/[0.04] border border-white/[0.07] 
                        px-3 py-1.5 rounded-lg hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer">
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        ) :
        <div className="cls">
            {messages.map((msg,i) => (
                <div key={msg?._id || i} className="cls">
                    <MessageBubble role={msg?.role} content={msg?.content}/>
                </div>
            ))}
        </div>
        }
    </div>
  )
}

export default MessageList
