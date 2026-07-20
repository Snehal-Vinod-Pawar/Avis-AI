import React from 'react'
import { useState } from 'react'
import { LogOut, MessageSquare, PanelLeftIcon, PenBoxIcon, Plus, UserIcon, Coins, PanelRight, PenSquare } from "lucide-react"
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getConversations } from '../features/getConverations'
import { addConversation, setConversation, setSelectedConversation } from '../redux/conversationslice'
import { createConversation } from '../features/createConversation'
import logOut from '../features/logOut'
import { setUserData } from '../redux/userSlice'

function SideBar() {
    const [collapased, setCollapsed] = useState(false)
    const dispatch = useDispatch()
    const [imageError, setImageError] = useState(false)
    const { conversations, selectedConversation } = useSelector(state => state.conversation)
    const { userData } = useSelector(state => state.user)
    useEffect(() => {
        const getConv = async () => {
            const data = await getConversations()
            dispatch(setConversation(data))
        }
        getConv()
    }, [userData?._id])

    const handleCreateConversation = async () => {
        const data = await createConversation()
        dispatch(addConversation(data))
        dispatch(setSelectedConversation(data))
    }

    if (collapased) {
        return (
            <div className="hidden lg:flex flex-col items-center w-[80px] h-screen bg-[#0d0f14] border-r border-white/[0.06] py-4 gap-6 shrink-0">
                <button className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] 
                transition-colors duration-150 bg-transparent border-none cursor-pointer"
                    onClick={() => setCollapsed(false)}
                >
                    <PanelRight size={35} />
                </button>
                <button className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] 
                transition-colors duration-150 bg-transparent border-none cursor-pointer"
                    onClick={() => dispatch(setSelectedConversation(null))}
                >
                    <Plus size={28} />
                </button>

                <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-8">
                    {conversations.map((conv, i) => {
                        const isActive = selectedConversation?._id == conv?._id
                        return (
                            <div key={conv?._id || i} onClick={() => dispatch(setSelectedConversation(conv))}
                                className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] transition-colors duration-150 ${isActive
                                    ? "bg-indigo-500/15"
                                    : "bg-transparent"
                                    }`}>
                                <div className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150 ${isActive
                                    ? "bg-indigo-500/20 text-indigo-400"
                                    : "bg-white/0.05 text-slate-500"
                                    }`}>
                                    <MessageSquare size={22} />
                                </div>
                            </div>
                        )
                    })}

                </div>

                <div className="relative shrink-0">
                    {(userData?.avatar && !imageError) ? (
                        <img
                            className="w-10 h-10 rounded-[10px] object-cover border-2 border-indigo-500/25"
                            src={userData?.avatar}
                            alt="image"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
                            <UserIcon size={15} className="text-slate-400" />
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className='fixed lg:static inset-y-0 left-0 Z-50 w-[340px] h-screen shrink0 bg-[#0D0F14] border-r border-white/[0.06]'>
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]">
                    <div className='hidden lg:flex items-center justify-center w-12 h-12 rounded-lg text-slate-500
                hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent
                border-none cursor-pointer'
                        onClick={() => setCollapsed(true)}
                    >
                        <PanelLeftIcon size={35} />
                    </div>
                    <span className="text-[26px] font-semibold text-slate-100 tracking-tight flex-1">
                        Avis AI
                    </span>
                    <span className='text-[12px] font-medium text-indigo-400 bg-indigo-500/10 border 
              border-indigo-500/20 px-0.5 rounded-full tracking-wide'>
                        free
                    </span>
                    <button className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 
                  hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent 
                    border-none cursor-pointer"
                        onClick={() => dispatch(setSelectedConversation(null))}>
                        <PenSquare size={18} />
                    </button>
                </div>

                <div className='px-4 pt-4 pb-1'>
                    <button className="w-full flex items-center justify-center gap-1 text-xl font-medium text-white bg-linear-to-br 
                  from-indigo-500 to-violet-700 rounded-xl py-[10px] border-none cursor-pointer hover:opacity-90 transition-opacity 
                    duration-150" onClick={() => dispatch(setSelectedConversation(null))}>
                        <Plus />
                        New Chat
                    </button>
                </div>

                {conversations.length == 0 ?
                    <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-wideest
                    text-slate-600">
                        No Recent Conversations
                    </div>
                    :
                    (
                        <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-wideest
                      text-slate-600">
                            Recents
                        </div>
                    )
                }

                <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {conversations.map((conv, i) => {
                        const isActive = selectedConversation?._id == conv?._id
                        return (
                            <div key={conv?._id || i} onClick={() => dispatch(setSelectedConversation(conv))}
                                className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] transition-colors duration-150 ${isActive
                                    ? "bg-indigo-500/15"
                                    : "bg-transparent"
                                    }`}>
                                <div className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150 ${isActive
                                    ? "bg-indigo-500/20 text-indigo-400"
                                    : "bg-white/0.05 text-slate-500"
                                    }`}>
                                    <MessageSquare size={18} />
                                </div>
                                <span className={`text=[16px] font-medium truncate ${isActive ?
                                    "text-slate-100" : "text-slate-300"
                                    }`}>
                                    {conv?.title || "New Chat"}
                                </span>
                            </div>
                        )
                    })}

                </div>

                <div className="mx-2.5 h-px bg-white/[0.06]" />

                <div className="px-3.5 py-3.5">
                    {userData ? (
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-colors duration-150 cursor-pointer">
                            <div className="relative shrink-0">
                                {(userData?.avatar && !imageError) ? (
                                    <img
                                        className="w-10 h-10 rounded-[10px] object-cover border-2 border-indigo-500/25"
                                        src={userData?.avatar}
                                        alt="image"
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
                                        <UserIcon size={15} className="text-slate-400" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-[16px] font-semibold text-slate-100 truncate">{userData?.name || "user"}</p>
                                <p className="text-[13px] text-slate-600 mt-px"> {"Free Plan "} </p>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-yellow-600 cursor-pointer hover:bg-white/[0.08]
                                hover:text-slate-400 transition-all duration-150">
                                    <Coins size={24} />
                                </button>
                                <button className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-slate-600 cursor-pointer hover:bg-white/[0.08] 
                                hover:text-slate-400 transition-all duration-150"
                                    onClick={() => {
                                        logOut();
                                        dispatch(setUserData(null))
                                    }}
                                >
                                    <LogOut size={24} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button className="w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-200 bg-white/[0.05] border border-white/[0.08] rounded-xl py-[11px] 
                        cursor-pointer hover:bg-white/[0.08] transition-colors duration-150">
                            Login
                        </button>
                    )}
                </div>

            </div>
        </div>
    )

}

export default SideBar
