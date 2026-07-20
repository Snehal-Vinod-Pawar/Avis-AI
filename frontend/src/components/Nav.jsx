import { MessageSquare } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'

function Nav() {
    const { selectedConversation } = useSelector(state => state.conversation)
    const { messages } = useSelector(state => state.message)

    return (
        <>
            {selectedConversation &&
                <div className='h-20 flex items-center gap-3 px-5 border-b border-white/[0.06] bg-[#0d0f14]'>
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                        <MessageSquare size={30} className='text-indigo-400' />
                    </div>
                    <div className='text-[20px] font-semibold text-slate-100 tracking-tight'>
                        {selectedConversation?.title || "New Chat"}
                    </div>
                    <div className='text-[16px] font-medium text-slate-600 bg-white/[0.0.4] border border-white/[0.06] px-2 py-0.5 rounded-full'>
                        {messages?.length} Messages
                    </div>
                </div>
            }
        </>
    )
}

export default Nav
