'use client'

import { useState } from 'react'
import { AlertCircle, ArrowRight, CalendarDays, Check, Clipboard, FileSearch, LayoutDashboard, Mail, Menu, RefreshCw, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type View = 'dashboard' | 'email' | 'planner' | 'research'
type Json = Record<string, any>

const navigation = [
  { id: 'dashboard' as const, label: 'Overview', icon: LayoutDashboard },
  { id: 'email' as const, label: 'Smart Email', icon: Mail },
  { id: 'planner' as const, label: 'Task Planner', icon: CalendarDays },
  { id: 'research' as const, label: 'Research', icon: FileSearch },
]

const notice = '⚠️ Responsible AI Notice: AI-generated content may contain inaccuracies, biases, or outdated information. Do not input sensitive company data or Personally Identifiable Information (PII). Please review, verify, and validate all outputs before using them in a professional capacity.'

async function generate(body: Record<string, unknown>) {
  const response = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Generation failed. Please try again.')
  return data
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return <label htmlFor={htmlFor} className="text-sm font-semibold text-foreground">{children}</label>
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-xs outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-muted-foreground'

export function ProductivityApp() {
  const [view, setView] = useState<View>('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Json | null>(null)

  function navigate(next: View) {
    setView(next); setResult(null); setError(''); setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function run(body: Record<string, unknown>) {
    setLoading(true); setError(''); setResult(null)
    try { setResult(await generate(body)) } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong.') } finally { setLoading(false) }
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-sidebar lg:flex lg:flex-col">
        <Brand />
        <Nav view={view} navigate={navigate} />
        <div className="mt-auto p-5"><div className="rounded-2xl bg-primary p-4 text-primary-foreground"><Sparkles className="mb-3 size-5"/><p className="text-sm font-semibold">Built for thoughtful work</p><p className="mt-1 text-xs leading-relaxed opacity-75">Three focused AI tools. No saved history.</p></div></div>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-xl lg:ml-64 lg:px-8">
        <div className="flex items-center gap-3 lg:hidden"><Button variant="outline" size="icon" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu /></Button><Brand compact /></div>
        <div className="hidden lg:block"><p className="text-sm font-medium text-muted-foreground">AI productivity workspace</p></div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium"><span className="size-2 rounded-full bg-primary"/>Live AI</div>
      </header>

      {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-foreground/35" aria-label="Close navigation" onClick={() => setMobileOpen(false)}/><aside className="relative flex h-full w-72 flex-col bg-sidebar shadow-2xl"><div className="flex items-center justify-between"><Brand /><Button variant="ghost" size="icon" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X /></Button></div><Nav view={view} navigate={navigate}/></aside></div>}

      <main className="pb-40 lg:ml-64 lg:pb-32">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {view === 'dashboard' && <Dashboard navigate={navigate} />}
          {view === 'email' && <EmailWorkspace run={run} loading={loading} result={result} error={error} />}
          {view === 'planner' && <PlannerWorkspace run={run} loading={loading} result={result} error={error} />}
          {view === 'research' && <ResearchWorkspace run={run} loading={loading} result={result} error={error} />}
        </div>
      </main>
      <div role="note" aria-label="Responsible AI Notice" className="fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-warning-border bg-warning px-4 py-3 text-warning-foreground shadow-xl sm:inset-x-6 lg:left-[280px] lg:px-5">
        <p className="text-xs font-medium leading-relaxed sm:text-sm">{notice}</p>
      </div>
    </div>
  )
}

function Brand({ compact = false }: { compact?: boolean }) { return <div className={cn('flex items-center gap-3', compact ? '' : 'p-5')}><div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-4"/></div><div><p className="text-sm font-bold tracking-tight">Northstar AI</p>{!compact && <p className="text-xs text-muted-foreground">Productivity suite</p>}</div></div> }
function Nav({ view, navigate }: { view: View; navigate: (view: View) => void }) { return <nav aria-label="Main navigation" className="flex flex-col gap-1 px-3">{navigation.map(item => <button key={item.id} onClick={() => navigate(item.id)} className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors', view === item.id ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-xs' : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground')}><item.icon className="size-4"/>{item.label}</button>)}</nav> }

function Dashboard({ navigate }: { navigate: (view: View) => void }) {
  const cards = [
    { id: 'email' as const, icon: Mail, eyebrow: 'COMMUNICATE', title: 'Write with precision', body: 'Shape audience-aware emails in formal, informal, or persuasive tones.' },
    { id: 'planner' as const, icon: CalendarDays, eyebrow: 'ORGANIZE', title: 'Plan what matters', body: 'Turn a task dump into a prioritized daily or weekly schedule.' },
    { id: 'research' as const, icon: FileSearch, eyebrow: 'UNDERSTAND', title: 'Research with clarity', body: 'Summarize reports, simplify ideas, and discover cited articles.' },
  ]
  return <div className="flex flex-col gap-8"><section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10"><span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">YOUR FOCUSED WORKSPACE</span><h1 className="mt-5 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">Move from busywork to your best work.</h1><p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">A focused set of AI tools for communication, planning, and research—designed to help you think clearly and move confidently.</p></section><section><div className="mb-4 flex items-end justify-between"><div><p className="text-sm font-semibold text-primary">AI WORKSPACES</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Choose where to begin</h2></div></div><div className="grid gap-4 md:grid-cols-3">{cards.map(card => <button key={card.id} onClick={() => navigate(card.id)} className="group flex min-h-64 flex-col rounded-3xl border border-border bg-card p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"><div className="flex size-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><card.icon className="size-5"/></div><p className="mt-8 text-xs font-bold tracking-widest text-primary">{card.eyebrow}</p><h3 className="mt-2 text-xl font-bold">{card.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p><span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold">Open workspace <ArrowRight className="size-4 transition-transform group-hover:translate-x-1"/></span></button>)}</div></section></div>
}

function WorkspaceHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) { return <header className="mb-6"><p className="text-xs font-bold tracking-widest text-primary">{eyebrow}</p><h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">{body}</p></header> }
function Shell({ form, output }: { form: React.ReactNode; output: React.ReactNode }) { return <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"><section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">{form}</section><section className="min-h-96 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">{output}</section></div> }
function Status({ loading, error, children }: { loading: boolean; error: string; children: React.ReactNode }) { if (loading) return <div className="flex min-h-80 flex-col items-center justify-center gap-4 text-center"><RefreshCw className="size-7 animate-spin text-primary"/><div><p className="font-semibold">Thinking through your request</p><p className="mt-1 text-sm text-muted-foreground">Structuring a useful, review-ready result.</p></div></div>; if (error) return <div className="flex min-h-80 flex-col items-center justify-center gap-3 text-center"><AlertCircle className="size-8 text-destructive"/><p className="font-semibold">We could not complete that request</p><p className="max-w-md text-sm text-muted-foreground">{error}</p></div>; return <>{children}</> }
function Empty({ icon: Icon, title, body }: { icon: typeof Mail; title: string; body: string }) { return <div className="flex min-h-80 flex-col items-center justify-center text-center"><div className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Icon className="size-6"/></div><h2 className="mt-5 text-lg font-bold">{title}</h2><p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{body}</p></div> }
function CopyButton({ value }: { value: string }) { const [copied, setCopied] = useState(false); return <Button variant="outline" size="sm" onClick={async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500) }}>{copied ? <Check data-icon="inline-start"/> : <Clipboard data-icon="inline-start"/>}{copied ? 'Copied' : 'Copy'}</Button> }

function EmailWorkspace({ run, loading, result, error }: any) {
  const [draft, setDraft] = useState(''); const [audience, setAudience] = useState(''); const [context, setContext] = useState(''); const [tone, setTone] = useState('Formal')
  return <><WorkspaceHeader eyebrow="SMART EMAIL" title="Say exactly what you mean." body="Paste a draft or describe your goal. AI preserves the facts while adapting tone, structure, and detail to your audience."/><Shell form={<form className="flex flex-col gap-5" onSubmit={e => { e.preventDefault(); run({ tool: 'email', draft, audience, context, tone }) }}><div className="flex flex-col gap-2"><Label htmlFor="draft">Email draft or goal</Label><textarea id="draft" required minLength={10} value={draft} onChange={e => setDraft(e.target.value)} rows={9} className={inputClass} placeholder="Paste your email, or describe what you need to communicate…"/></div><div className="grid gap-4 sm:grid-cols-2"><div className="flex flex-col gap-2"><Label htmlFor="audience">Audience</Label><input id="audience" value={audience} onChange={e => setAudience(e.target.value)} className={inputClass} placeholder="Client, manager, team…"/></div><div className="flex flex-col gap-2"><Label htmlFor="tone">Tone</Label><select id="tone" value={tone} onChange={e => setTone(e.target.value)} className={inputClass}><option>Formal</option><option>Informal</option><option>Persuasive</option></select></div></div><div className="flex flex-col gap-2"><Label htmlFor="context">Context or desired outcome</Label><input id="context" value={context} onChange={e => setContext(e.target.value)} className={inputClass} placeholder="Secure approval, follow up, clarify…"/></div><Button type="submit" disabled={loading || draft.trim().length < 10}><Sparkles data-icon="inline-start"/>Generate email</Button></form>} output={<Status loading={loading} error={error}>{result ? <div className="flex flex-col gap-5"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold tracking-wider text-primary">READY TO REVIEW</p><h2 className="mt-1 text-xl font-bold">Your refined email</h2></div><CopyButton value={`Subject: ${result.subject}\n\n${result.body}`}/></div><div className="rounded-2xl border border-border bg-background p-5"><p className="text-xs font-semibold text-muted-foreground">SUBJECT</p><p className="mt-2 font-semibold">{result.subject}</p><div className="my-4 border-t border-border"/><p className="whitespace-pre-wrap text-sm leading-relaxed">{result.body}</p></div><div><p className="text-sm font-semibold">How it was adapted</p><ul className="mt-2 flex flex-col gap-2">{result.adaptations.map((x: string) => <li key={x} className="flex gap-2 text-sm text-muted-foreground"><Check className="mt-0.5 size-4 shrink-0 text-primary"/>{x}</li>)}</ul></div></div> : <Empty icon={Mail} title="A stronger email starts here" body="Your audience-aware subject, body, and adaptation notes will appear here."/>}</Status>}/></>
}

function PlannerWorkspace({ run, loading, result, error }: any) {
  const [tasks, setTasks] = useState(''); const [mode, setMode] = useState('Daily'); const [hours, setHours] = useState('9:00 AM–5:00 PM')
  return <><WorkspaceHeader eyebrow="TASK PLANNER" title="Give every priority its place." body="Share your task list, deadlines, and constraints. AI will rank the work and build a realistic schedule."/><Shell form={<form className="flex flex-col gap-5" onSubmit={e => { e.preventDefault(); run({ tool: 'planner', tasks, mode, hours }) }}><div className="flex flex-col gap-2"><Label htmlFor="tasks">Tasks and constraints</Label><textarea id="tasks" required value={tasks} onChange={e => setTasks(e.target.value)} rows={12} className={inputClass} placeholder={'Prepare board report — due Thursday, 2 hours\nReply to client — urgent, 30 minutes\nTeam planning — Tuesday at 2 PM'}/></div><div className="grid gap-4 sm:grid-cols-2"><div className="flex flex-col gap-2"><Label htmlFor="mode">Plan range</Label><select id="mode" value={mode} onChange={e => setMode(e.target.value)} className={inputClass}><option>Daily</option><option>Weekly</option></select></div><div className="flex flex-col gap-2"><Label htmlFor="hours">Working hours</Label><input id="hours" value={hours} onChange={e => setHours(e.target.value)} className={inputClass}/></div></div><Button type="submit" disabled={loading || tasks.trim().length < 5}><Sparkles data-icon="inline-start"/>Build my plan</Button></form>} output={<Status loading={loading} error={error}>{result ? <div className="flex flex-col gap-5"><div><p className="text-xs font-bold tracking-wider text-primary">{mode.toUpperCase()} PLAN</p><h2 className="mt-1 text-xl font-bold">Prioritized schedule</h2><p className="mt-2 text-sm text-muted-foreground">{result.summary}</p></div><div className="flex flex-col gap-3">{result.schedule.map((item: any, i: number) => <article key={`${item.day}-${item.time}-${i}`} className="grid gap-3 rounded-2xl border border-border bg-background p-4 sm:grid-cols-[100px_110px_1fr]"><div><p className="text-sm font-bold">{item.day}</p><p className="text-xs text-muted-foreground">{item.time}</p></div><span className="h-fit w-fit rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">{item.priority}</span><div><p className="font-semibold">{item.task}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.rationale}</p></div></article>)}</div><div className="rounded-2xl bg-accent p-4"><p className="font-semibold">Time optimization</p><ul className="mt-2 flex flex-col gap-2">{result.strategies.map((x: string) => <li key={x} className="text-sm text-accent-foreground">• {x}</li>)}</ul></div>{result.conflicts?.length > 0 && <div><p className="text-sm font-semibold">Needs your attention</p><ul className="mt-2 text-sm text-muted-foreground">{result.conflicts.map((x: string) => <li key={x}>• {x}</li>)}</ul></div>}</div> : <Empty icon={CalendarDays} title="A realistic plan, not just a list" body="Your time-blocked schedule, priority rationale, and optimization ideas will appear here."/>}</Status>}/></>
}

function ResearchWorkspace({ run, loading, result, error }: any) {
  const [query, setQuery] = useState(''); const [mode, setMode] = useState('Content')
  return <><WorkspaceHeader eyebrow="RESEARCH ASSISTANT" title="Understand more, in less time." body="Summarize supplied content, analyze public URLs, or discover current articles around a topic—with sources and caveats."/><Shell form={<form className="flex flex-col gap-5" onSubmit={e => { e.preventDefault(); run({ tool: 'research', query, mode }) }}><div className="flex flex-col gap-2"><Label htmlFor="research-mode">Research input</Label><select id="research-mode" value={mode} onChange={e => setMode(e.target.value)} className={inputClass}><option>Content</option><option>URLs</option><option>Topic</option></select></div><div className="flex flex-col gap-2"><Label htmlFor="query">{mode === 'Content' ? 'Article or report content' : mode === 'URLs' ? 'Public HTTPS URLs' : 'Topic or research question'}</Label><textarea id="query" required value={query} onChange={e => setQuery(e.target.value)} rows={14} className={inputClass} placeholder={mode === 'Content' ? 'Paste the content you want to understand…' : mode === 'URLs' ? 'https://example.com/article' : 'How is generative AI changing knowledge work in 2026?'}/></div><Button type="submit" disabled={loading || query.trim().length < 5}><FileSearch data-icon="inline-start"/>{mode === 'Topic' ? 'Find and synthesize' : 'Analyze content'}</Button></form>} output={<Status loading={loading} error={error}>{result ? <div className="flex flex-col gap-6"><div><p className="text-xs font-bold tracking-wider text-primary">RESEARCH BRIEF</p><h2 className="mt-1 text-xl font-bold">{result.title}</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{result.executiveSummary}</p></div><div><h3 className="font-semibold">Key insights</h3><div className="mt-3 grid gap-3 sm:grid-cols-2">{result.keyInsights.map((x: string, i: number) => <div key={x} className="rounded-2xl border border-border bg-background p-4"><p className="text-xs font-bold text-primary">0{i + 1}</p><p className="mt-2 text-sm leading-relaxed">{x}</p></div>)}</div></div><div className="rounded-2xl bg-accent p-4"><h3 className="font-semibold">Recommendations</h3><ul className="mt-2 flex flex-col gap-2">{result.recommendations.map((x: string) => <li key={x} className="flex gap-2 text-sm"><Check className="mt-0.5 size-4 shrink-0"/>{x}</li>)}</ul></div>{result.sources?.length > 0 && <div><h3 className="font-semibold">Sources</h3><div className="mt-3 flex flex-col gap-3">{result.sources.map((s: any) => <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-border p-4 transition hover:border-primary/40 hover:bg-accent/40"><div className="flex items-start justify-between gap-3"><p className="font-semibold">{s.title}</p><ArrowRight className="size-4 shrink-0"/></div><p className="mt-1 text-xs text-muted-foreground">{s.publisher} · {s.date}</p><p className="mt-2 text-sm text-muted-foreground">{s.relevance}</p></a>)}</div></div>}{result.caveats?.length > 0 && <p className="text-xs leading-relaxed text-muted-foreground">Caveats: {result.caveats.join(' ')}</p>}</div> : <Empty icon={FileSearch} title="From information to understanding" body="A simplified summary, key insights, recommendations, caveats, and cited sources will appear here."/>}</Status>}/></>
}
