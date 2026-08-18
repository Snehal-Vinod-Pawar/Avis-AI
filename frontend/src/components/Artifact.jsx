import { Code2, Copy, PanelRightClose, Eye, Check } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from "motion/react"
import Editor from "@monaco-editor/react"

function Artifact() {
  const [collapsed, setCollapsed] = useState(false) // Start expanded to show files
  const { artifacts } = useSelector(state => state.message)
  const [tab, setTab] = useState("code")
  const [activeFile, setActiveFile] = useState(0)
  const [copied, setCopied] = useState(false)

  if (artifacts.length == 0) return null;

  const artifact = artifacts[0]
  const file = artifact?.files?.[activeFile]
  const htmlFile = artifact?.files?.find(f => f.name === "index.html")
  const cssFile = artifact?.files?.find(f => f.name === "style.css")
  const jsFile = artifact?.files?.find(f => f.name === "script.js")

  const canPreview = Boolean(htmlFile)

  const previewDoc = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        ${cssFile?.content || ""}
      </style>
  </head>
  <body>
      ${htmlFile?.content || ""}
      <script> 
        ${jsFile?.content || ""}
      </script>
  </body>
  </html>`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(file?.content || "")
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
    }, 2000)
  }

  const detectLanguage = (fileName = "") => {
    const name = fileName.toLowerCase();

    if (name.endsWith(".html"))
      return "html";

    if (name.endsWith(".css"))
      return "css";

    if (name.endsWith(".js"))
      return "javascript";

    if (name.endsWith(".jsx"))
      return "javascript";

    if (name.endsWith(".ts"))
      return "typescript";

    if (name.endsWith(".tsx"))
      return "typescript";

    if (name.endsWith(".json"))
      return "json";

    if (name.endsWith(".py"))
      return "python";

    return "text";
  };

  return (
    <motion.div
      initial={{ width: 660 }}
      animate={{ width: collapsed ? 75 : 660 }}
      transition={{
        duration: 0.25,
        ease: "easeInOut"
      }}
      className='flex h-full border-l border-white/[0.06] flex-col overflow-hidden shrink-0'>
      {!collapsed ? (
        <div className='flex flex-col h-full bg-[#0d0f14]'>

          <div className="h-20 px-4 border-b border-white/[0.06] flex items-center gap-4 shrink-0">
            <button className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 
            hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent'
              onClick={() => setCollapsed(true)}>
              <PanelRightClose size={26} />
            </button>
            <div className="flex item-center gap-2 flex-1 min-w-0">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                <Code2 className="text-indigo-400" size={20} />
              </div>
              <div className="text-[20px] font-medium text-slate-200 truncate">
                {artifacts?.[0]?.title}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 
             hover:text-slate-200 hover:bg-white/[0.05] rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer"
              >
                {copied? <Check size={22}/> : <Copy size={22} />}
              </button>
            </div>

            {canPreview &&
              <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-1 rounded-lg">
                <button
                  onClick={() => setTab("code")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-[18px] font-medium rounded-md transition-colors duration-150 
                  ${tab === "code"
                      ? "bg-indigo-500 text-white"
                      : "text-slate-500 hover:text-slate-200"
                    }`}
                >
                  <Code2 size={20} />
                  Code
                </button>

                <button
                  onClick={() => setTab("preview")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-[18px] font-medium rounded-md transition-colors duration-150 ${tab === "preview"
                    ? "bg-indigo-500 text-white"
                    : "text-slate-500 hover:text-slate-200"
                    }`}
                >
                  <Eye size={20} />
                  Preview
                </button>
              </div>
            }

          </div>

          {tab === "code" &&
            <div className="h-auto flex border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
              {
                artifacts[0]?.files?.map((f, index) => (
                  <button
                    key={f?.name || index}
                    onClick={() => setActiveFile(index)}
                    className={`px-4 py-2.5 text-[18px] font-medium whitespace-nowrap transition-colors duration-150 border-r border-white/[0.05] 
                relative cursor-pointer bg-transparent ${activeFile === index ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}>
                    {f?.name}
                    {activeFile === index && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 rounded-t-full" />
                    )}
                  </button>
                ))
              }
            </div>
          }

          <div className="flex-1 overflow-hidden">
            {(tab === "preview" && canPreview) ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
              >
                <iframe title="preview" srcDoc={previewDoc} sandbox="allow-scripts" className="w-full h-full bg-white" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full overflow-hidden"
              >
                <Editor
                  theme="vs-dark"
                  language={detectLanguage(file?.name)}
                  value={file?.content || ""}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 16,
                    wordWrap: "on",
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 18 },
                    lineNumbers: "on",
                    renderLineHighlight: "none"
                  }}
                />
              </motion.div>
            )}
          </div>

        </div>
      ) : (
        <div className='hidden lg:flex h-full border-l bg-[#0d0f14] border-white/[0.06] flex-col overflow-hidden shrink-0'>
          <div className="h-20 px-4 border-b border-white/[0.06] flex items-center justify-center shrink-0">
            <button className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent'
              onClick={() => setCollapsed(false)}>
              <PanelRightClose size={26} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-[18px] font-medium text-slate-600 tracking-widest uppercase whitespace-nowrap"
              style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)"
              }}
            >
              {artifacts[0]?.title}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default Artifact