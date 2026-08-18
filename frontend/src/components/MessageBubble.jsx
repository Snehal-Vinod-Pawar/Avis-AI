import React from 'react'
import { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { X } from 'lucide-react'
import { Children } from 'react'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiCheck, FiCopy } from "react-icons/fi";
import api from "../../utils/axios.js";

function MessageBubble({ role, content, images, isVisionAgent = false }) {
    const isUser = role === "user"
    const [lightBox, setLightBox] = useState(null)
    const [copiedCode, setCopiedCode] = useState("")

    const copyCode = async (code) => {
        navigator.clipboard.writeText(code)
        setCopiedCode(code)
        setTimeout(() => {
            setCopiedCode("")
        }, 2000)
    }

    // Fetch a URL as a blob and trigger a browser download with a proper file name.
    const saveBlob = async (url, init = {}) => {
        const res = await fetch(url, init)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const blob = await res.blob()
        const fileName = decodeURIComponent(url.split("/").pop().split("?")[0]) || "download.pdf"
        const objectUrl = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = objectUrl
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(objectUrl)
    }

    // Download Cloudinary-hosted files (PDFs, etc.). Tries fetching the file in
    // the browser first (the browser has access to Cloudinary + its CORS), then
    // falls back to the backend proxy, then opens the link directly.
    const downloadFromUrl = async (e, href) => {
        e.preventDefault()
        try {
            await saveBlob(href)
        } catch (err) {
            console.error("Direct download failed, trying backend proxy:", err)
            try {
                const base = api?.defaults?.baseURL || ""
                await saveBlob(`${base}/api/agent/download?url=${encodeURIComponent(href)}`, { credentials: "include" })
            } catch (err2) {
                console.error("Proxy download failed, opening file:", err2)
                window.open(href, "_blank", "noopener,noreferrer")
            }
        }
    }

    if (!content) return null

    // Ensure content is a string for Markdown
    const contentString = typeof content === 'string' ? content : JSON.stringify(content)

    return (
        <div className={`flex pt-4 ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={`w-fit max-w-[95vw] md:max-w-[80%] px-5 py-3.5 rounded-2xl break-words overflow-hidden ${isUser
                ? "text-[20px] md:text-[22px] leading-9 bg-gradient-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm"
                : "text-[20px] md:text-[18px] leading-8 text-slate-200 rounded-tl-sm"
                }`}>
                {images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                        {images.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                onClick={() => setLightBox(img)}
                                loading="lazy"
                                onError={(e) => e.currentTarget.remove()}
                                className={isVisionAgent 
                                    ? "w-120 h-100 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"
                                    : "w-70 h-40 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"
                                }
                            />
                        ))}
                    </div>
                )}
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ children }) => (
                            <h1 className="text-3xl font-bold mt-8 mb-4 text-white">
                                {children}
                            </h1>
                        ),

                        h2: ({ children }) => (
                            <h2 className="text-2xl font-semibold mt-7 mb-3 text-white">
                                {children}
                            </h2>
                        ),

                        h3: ({ children }) => (
                            <h3 className="text-xl font-semibold mt-6 mb-3 text-white">
                                {children}
                            </h3>
                        ),

                        p: ({ children }) => (
                            <p className="mb-4 leading-8 text-inherit whitespace-pre-wrap break-words">
                                {children}
                            </p>
                        ),

                        ul: ({ children }) => (
                            <ul className="list-disc pl-6 my-4 space-y-2 text-slate-200">
                                {children}
                            </ul>
                        ),

                        ol: ({ children }) => (
                            <ol className="list-decimal pl-6 my-4 space-y-2 text-slate-200">
                                {children}
                            </ol>
                        ),

                        li: ({ children }) => (
                            <li className="leading-8">
                                {children}
                            </li>
                        ),

                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-violet-500 pl-4 italic text-slate-300 my-5">
                                {children}
                            </blockquote>
                        ),

                        code({ className, children }) {
                            const code = String(children).trim();

                            if (!className) {
                                return (
                                    <code className="px-1.5 py-0.5 rounded bg-white/10 text-pink-400">
                                        {code}
                                    </code>
                                );
                            }

                            const language = className.replace("language-", "");

                            const handleCopy = async () => {
                                await navigator.clipboard.writeText(code);
                                setCopiedCode(code);

                                setTimeout(() => {
                                    setCopiedCode("");
                                }, 2000);
                            };

                            return (
                                <div className="my-5 overflow-hidden rounded-xl border border-white/10 bg-[#111318]">

                                    <div className="flex items-center justify-between border-b border-white/10 bg-[#1b1d24] px-4 py-3">

                                        <span className="text-lg font-semibold uppercase tracking-wider text-slate-400">
                                            {language}
                                        </span>

                                        <button
                                            onClick={handleCopy}
                                            className="rounded-lg bg-white/5 px-3 py-1 text-lg text-slate-300 transition hover:bg-white/10"
                                        >
                                            {copiedCode === code ? "Copied ✓" : "Copy"}
                                        </button>

                                    </div>

                                    <SyntaxHighlighter
                                        language={language}
                                        style={oneDark}
                                        showLineNumbers
                                        wrapLongLines
                                        customStyle={{
                                            margin: 0,
                                            padding: "18px",
                                            background: "#111318",
                                            fontSize: "18px",
                                            lineHeight: "1.8",
                                        }}
                                    >
                                        {code}
                                    </SyntaxHighlighter>

                                </div>
                            );
                        },

                        table: ({ children }) => (
                            <div className="my-6 overflow-x-auto rounded-xl border border-white/10">
                                <table className="min-w-full border-collapse text-left">
                                    {children}
                                </table>
                            </div>
                        ),

                        thead: ({ children }) => (
                            <thead className="bg-slate-800 sticky top-0">
                                {children}
                            </thead>
                        ),

                        tbody: ({ children }) => (
                            <tbody className="divide-y divide-white/10">
                                {children}
                            </tbody>
                        ),

                        tr: ({ children }) => (
                            <tr className="hover:bg-white/5 transition-colors">
                                {children}
                            </tr>
                        ),

                        th: ({ children }) => (
                            <th className="px-5 py-3 text-left text-sm font-semibold uppercase tracking-wide text-slate-100 border-b border-white/10 whitespace-nowrap">
                                {children}
                            </th>
                        ),

                        td: ({ children }) => (
                            <td className="px-5 py-3 text-[15px] text-slate-300 border-b border-white/10 align-top">
                                {children}
                            </td>
                        ),

                        a: ({ href, children }) => {
                            // Cloudinary-hosted files (generated PDFs) have a download
                            // attribute so that right‑click “Save link as...” uses the
                            // real filename instead of the opaque Cloudinary path.
                            // The target is omitted so that a click attempts to download
                            // the file rather than opening a new tab.
                            const isCloudinaryFile = href?.includes("res.cloudinary.com/")
                            return (
                                <a
                                    href={href}
                                    target={undefined}
                                    rel="noopener noreferrer"
                                    className="text-indigo-400 hover:text-indigo-300 underline"
                                    download={isCloudinaryFile ? href.split("/").pop().split("?")[0] : undefined}
                                >
                                    {children}
                                </a>
                            )
                        },

                        hr: () => (
                            <hr className="my-8 border-white/10" />
                        ),

                        img: ({ src }) => {
                            if (!src) return null;

                            return (
                                <img
                                    src={src}
                                    onClick={() => setLightBox(src)}
                                    loading="lazy"
                                    onError={(e) => e.currentTarget.remove()}
                                    className={isVisionAgent 
                                        ? "w-120 h-100 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"
                                        : "w-70 h-50 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"
                                    }
                                />
                            );
                        },
                    }}
                >
                    {contentString}
                </Markdown>
            </div>
            {lightBox &&
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center justify-center p-6">
                    <button
                        className='absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2'
                        onClick={() => setLightBox(null)}
                    >
                        <X />
                    </button>
                    <img
                        src={lightBox}
                        className='max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain'
                    />
                </div>
            }
        </div>
    )
}

export default MessageBubble