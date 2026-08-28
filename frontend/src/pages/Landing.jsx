import { motion } from 'motion/react'
import { FaGoogle, FaGithub } from 'react-icons/fa'
import {
    MessageSquare, Code2, Globe, Image as ImageIcon, Presentation, FileText,
    ArrowRight, Zap, ShieldCheck, Layers, Workflow, Download, Sparkles
} from 'lucide-react'

import heroImg from '../assets/hero.png'

const ease = [0.22, 1, 0.36, 1]




const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.7, ease, delay: i * 0.08 }
    })
}

function Logo({ big = false }) {
    return (
        <span className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 ${big ? 'h-12 w-12' : 'h-8 w-8'}`}>
            <Sparkles size={big ? 22 : 15} className="text-white" />
        </span>
    )
}

function Nav({ onLogin }) {
    return (
        <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease }}
            className="fixed top-0 inset-x-0 z-50"
        >
            <div className="mx-auto max-w-6xl px-6">
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/[0.07] bg-[#0d0f14]/70 backdrop-blur-xl px-5 py-3">
                    <a href="#top" className="flex items-center gap-2.5">
                        <Logo />
                        <span className="text-[17px] font-semibold text-slate-100 tracking-tight">
                            Avis <span className="text-indigo-400">AI</span>
                        </span>
                    </a>

                    <nav className="hidden md:flex items-center gap-8 text-[14px] text-slate-400">
                        <a href="#agents" className="hover:text-slate-100 transition-colors duration-200">Agents</a>
                        <a href="#features" className="hover:text-slate-100 transition-colors duration-200">Features</a>
                        <a href="#about" className="hover:text-slate-100 transition-colors duration-200">About</a>
                    </nav>

                    <button
                        onClick={onLogin}
                        className="group flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-[14px] font-medium text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-all duration-200 cursor-pointer"
                    >
                        <FaGoogle size={13} />
                        Get Started
                        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>
                </div>
            </div>
        </motion.header>
    )
}

function Hero({ onLogin }) {
    return (
        <section id="top" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-16">
            {/* backdrop */}
            <div className="avis-grid-bg absolute inset-0" />
            <div className="avis-aurora absolute top-[-20%] left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[140px]" />
            <div className="avis-pulse-glow absolute bottom-[-30%] left-1/4 h-[400px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />

            {/* headline */}
            <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
                className="relative z-10 max-w-3xl text-center text-[38px] leading-[1.08] font-semibold tracking-tight text-slate-100 md:text-[56px]">
                Meet Avis.
                <br />
                <span className="avis-shimmer-text">One prompt. Every skill.</span>
            </motion.h1>

            <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
                className="relative z-10 mt-6 max-w-xl text-center text-[17px] leading-relaxed text-slate-500">
                A multi-agent AI platform that routes your request to the right specialist —
                chat, code, search, vision, slides or documents. No switching tools. No noise.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
                className="relative z-10 mt-9 flex flex-wrap items-center justify-center gap-4">
                <button onClick={onLogin}
                    className="group flex items-center gap-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 px-7 py-3 text-[15px] font-medium text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:brightness-110 transition-all duration-200 cursor-pointer">
                    <FaGoogle size={15} />
                    Start with Google
                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                </button>
                <a href="#features"
                    className="rounded-xl border border-white/[0.09] bg-white/[0.03] px-7 py-3 text-[15px] font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white transition-all duration-200">
                    Explore features
                </a>
            </motion.div>

            {/* hero visual — floating hero image */}
            <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.1, ease, delay: 0.35 }}
                className="relative z-10 mt-12 w-full max-w-md"
            >
                <div className="absolute inset-x-10 top-10 h-full rounded-full bg-indigo-600/25 blur-[100px]" />

                <img
                    src={heroImg}
                    alt="Avis AI multi-agent interface"
                    className="avis-float relative mx-auto w-full max-w-sm drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
                    draggable={false}
                />

                {/* floating chips */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease, delay: 0.9 }}
                    className="avis-float-slow absolute -left-10 top-[22%] hidden md:flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#13151c]/90 px-3.5 py-2.5 backdrop-blur"
                >
                    <Code2 size={15} className="text-indigo-400" />
                    <span className="text-[13px] text-slate-300">Build a full-stack app</span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease, delay: 1.05 }}
                    className="avis-float-slow absolute -right-12 bottom-[16%] hidden md:flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#13151c]/90 px-3.5 py-2.5 backdrop-blur"
                    style={{ animationDelay: '1.2s' }}
                >
                    <Globe size={15} className="text-emerald-400" />
                    <span className="text-[13px] text-slate-300">Summarize today's news</span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease, delay: 1.2 }}
                    className="avis-float-slow absolute -left-8 bottom-[6%] hidden md:flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#13151c]/90 px-3.5 py-2.5 backdrop-blur"
                    style={{ animationDelay: '2.1s' }}
                >
                    <Presentation size={15} className="text-amber-400" />
                    <span className="text-[13px] text-slate-300">Turn these notes into slides</span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease, delay: 1.35 }}
                    className="avis-float-slow absolute -right-8 top-[10%] hidden md:flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#13151c]/90 px-3.5 py-2.5 backdrop-blur"
                    style={{ animationDelay: '3s' }}
                >
                    <FileText size={15} className="text-sky-400" />
                    <span className="text-[13px] text-slate-300">Explain this PDF</span>
                </motion.div>
            </motion.div>

            {/* scroll cue */}
            <motion.a href="#agents" aria-label="Scroll down"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <div className="flex h-9 w-6 items-start justify-center rounded-full border border-white/15 p-1.5">
                    <motion.div
                        animate={{ y: [0, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                        className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                    />
                </div>
            </motion.a>
        </section>
    )
}

const AGENTS = [
    { icon: MessageSquare, name: 'Chat', desc: 'Natural conversation with context-aware replies' },
    { icon: Code2, name: 'Coding', desc: 'Full projects, debugging & architecture' },
    { icon: Globe, name: 'Search', desc: 'Live web synthesis, always current' },
    { icon: ImageIcon, name: 'Vision', desc: 'Image generation & visual analysis' },
    { icon: Presentation, name: 'PPT', desc: 'Presentations generated from a prompt' },
    { icon: FileText, name: 'PDF', desc: 'Deep document understanding & Q&A' },
]

function Agents() {
    return (
        <section id="agents" className="relative border-t border-white/[0.05] py-24 px-6">
            <div className="mx-auto max-w-6xl">
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
                    className="text-center">
                    <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-indigo-400">The Team</p>
                    <h2 className="mt-3 text-[32px] md:text-[42px] font-semibold tracking-tight text-slate-100">
                        Six minds. One conversation.
                    </h2>
                    <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-slate-500">
                        Under the hood, a router agent reads your intent and hands the work to a specialist —
                        seamlessly, mid-conversation.
                    </p>
                </motion.div>

                <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {AGENTS.map((agent, i) => (
                        <motion.div
                            key={agent.name}
                            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} custom={i}
                            whileHover={{ y: -6 }}
                            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#13151c] p-6 transition-colors duration-300 hover:border-indigo-500/30"
                        >
                            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-500/0 blur-2xl transition-all duration-500 group-hover:bg-indigo-500/20" />
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
                                <agent.icon size={20} className="text-indigo-400" />
                            </div>
                            <h3 className="mt-5 text-[18px] font-semibold text-slate-100 tracking-tight">{agent.name}</h3>
                            <p className="mt-2 text-[14px] leading-relaxed text-slate-500">{agent.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const FEATURES = [
    {
        icon: Workflow,
        title: 'Intelligent Multi-Agent Routing',
        desc: 'A LangGraph router classifies every message in real time and dispatches it to the most capable specialist agent — no modes, no menus. Just ask.',
    },
    {
        icon: Layers,
        title: 'Artifacts, Not Walls of Text',
        desc: 'Code, slides and images render as clean, downloadable artifacts beside the chat — ready to use, not copy-pasted.',
    },
    {
        icon: Zap,
        title: 'Built for Speed',
        desc: 'Powered by Groq and Gemini 2.5 Flash across a lightweight microservice mesh — answers stream back in milliseconds.',
    },
    {
        icon: ShieldCheck,
        title: 'Private by Design',
        desc: 'Google OAuth via Firebase with hardened Redis-backed sessions. Your conversations stay yours — encrypted, isolated, expiring.',
    },
    {
        icon: MessageSquare,
        title: 'Conversations that Persist',
        desc: 'Every thread is stored and retrievable. Pick up any conversation exactly where you left it, across refreshes and devices.',
    },
    {
        icon: Download,
        title: 'One-Click Exports',
        desc: 'Take your work with you — generated PDFs, decks and code export instantly with proper metadata and formatting.',
    },
]

function Features() {
    return (
        <section id="features" className="relative border-t border-white/[0.05] py-24 px-6 overflow-hidden">
            <div className="absolute left-[-15%] top-1/3 h-[420px] w-[420px] rounded-full bg-indigo-600/10 blur-[130px]" />
            <div className="mx-auto max-w-6xl">
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
                    className="text-center">
                    <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-indigo-400">Why Avis</p>
                    <h2 className="mt-3 text-[32px] md:text-[42px] font-semibold tracking-tight text-slate-100">
                        Engineered, not assembled.
                    </h2>
                    <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-slate-500">
                        Every layer — from the LangGraph workflow to the Redis sessions — was built
                        with intent. It shows.
                    </p>
                </motion.div>

                <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={f.title}
                            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} custom={i}
                            whileHover={{ y: -6 }}
                            className="group rounded-2xl border border-white/[0.07] bg-[#13151c] p-6 transition-all duration-300 hover:border-indigo-500/30 hover:bg-[#151824]"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 transition-transform duration-300 group-hover:scale-110">
                                <f.icon size={20} className="text-indigo-400" />
                            </div>
                            <h3 className="mt-5 text-[17px] font-semibold tracking-tight text-slate-100">{f.title}</h3>
                            <p className="mt-2.5 text-[14px] leading-relaxed text-slate-500">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function About() {
    return (
        <section id="about" className="relative border-t border-white/[0.05] py-24 px-6 overflow-hidden">
            <div className="avis-aurora absolute right-[-10%] top-0 h-[380px] w-[500px] rounded-full bg-violet-600/10 blur-[130px]" />
            <div className="mx-auto max-w-4xl">
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
                    className="text-center">
                    <p className="text-[13px] font-medium uppercase tracking-[0.2em] text-indigo-400">About Us</p>
                    <h2 className="mt-3 text-[32px] md:text-[42px] font-semibold tracking-tight text-slate-100">
                        A platform with a point of view.
                    </h2>
                </motion.div>

                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} custom={1}
                    className="mt-10 space-y-6 text-center text-[16px] leading-[1.8] text-slate-400">
                    <p>
                        Avis AI started with a simple frustration: one model can't do everything well.
                        Chat models fumble large codebases, coding models hallucinate current events, and
                        nobody wants to paste PDF text into a chat box. So we stopped asking one model
                        to be everything — and built a team of specialists instead.
                    </p>
                    <p>
                        Under the hood, Avis is a microservices platform: an Express gateway, a
                        LangGraph agent workflow, MongoDB for memory, Redis for sessions, and Groq +
                        Gemini for raw intelligence. On the surface, none of that complexity exists.
                        You type. The right agent answers. That's the whole product.
                    </p>
                    <p className="text-slate-500">
                        We believe great AI tools should feel calm. No clutter, no settings rabbit holes —
                        just a dark, quiet canvas where serious work happens.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}

function MadeBy({ onLogin }) {
    return (
        <section className="relative border-t border-white/[0.05] py-28 px-6 overflow-hidden">
            <div className="avis-grid-bg absolute inset-0 opacity-60" />
            <div className="avis-pulse-glow absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
                className="relative mx-auto max-w-3xl text-center">
                <div className="flex justify-center"><Logo big /></div>
                <h2 className="mt-8 text-[30px] md:text-[38px] font-semibold tracking-tight text-slate-100">
                    Ready to meet your <span className="avis-shimmer-text">new team</span>?
                </h2>
                <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-slate-500">
                    Six specialist agents, one conversation. Sign in and send your first
                    prompt — it takes less than a minute to get started.
                </p>

                <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                    <button onClick={onLogin}
                        className="group flex items-center gap-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 px-7 py-3 text-[15px] font-medium text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:brightness-110 transition-all duration-200 cursor-pointer">
                        <FaGoogle size={15} />
                        Try Avis AI — it's free
                        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                    <a href="https://github.com/Snehal-Vinod-Pawar/Avis-AI" target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.03] px-6 py-3 text-[15px] font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white transition-all duration-200">
                        <FaGithub size={16} />
                        View source
                    </a>
                </div>
            </motion.div>
        </section>
    )
}

function Footer() {
    return (
        <footer className="border-t border-white/[0.05] px-6 py-10">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center gap-2">
                    <Logo />
                    <span className="text-[14px] text-slate-400">Avis AI — One prompt. Every skill.</span>
                </div>
                <p className="flex items-center gap-1.5 text-[13px] text-slate-600">
                    © {new Date().getFullYear()} Avis AI. All rights reserved.
                </p>
            </div>
        </footer>
    )
}

export default function Landing({ onLogin }) {
    return (
        <div className="min-h-screen bg-[#0d0f14] text-white antialiased selection:bg-indigo-500/30">
            <Nav onLogin={onLogin} />
            <Hero onLogin={onLogin} />
            <Agents />
            <Features />
            <About />
            <MadeBy onLogin={onLogin} />
            <Footer />
        </div>
    )
}