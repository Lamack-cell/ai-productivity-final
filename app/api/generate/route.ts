import { generateText, Output } from 'ai'
import { z } from 'zod'

export const maxDuration = 60

const requestSchema = z.discriminatedUnion('tool', [
  z.object({
    tool: z.literal('email'),
    draft: z.string().min(10).max(12000),
    audience: z.string().max(500).default(''),
    context: z.string().max(1000).default(''),
    tone: z.enum(['Formal', 'Informal', 'Persuasive']),
  }),
  z.object({
    tool: z.literal('planner'),
    tasks: z.string().min(5).max(12000),
    mode: z.enum(['Daily', 'Weekly']),
    hours: z.string().max(200).default('9:00 AM–5:00 PM'),
  }),
  z.object({
    tool: z.literal('research'),
    query: z.string().min(5).max(15000),
    mode: z.enum(['Content', 'URLs', 'Topic']),
  }),
])

const emailSchema = z.object({
  detectedTone: z.string(),
  audienceInterpretation: z.string(),
  subject: z.string(),
  body: z.string(),
  adaptations: z.array(z.string()).min(2).max(5),
})

const plannerSchema = z.object({
  summary: z.string(),
  schedule: z.array(z.object({ day: z.string(), time: z.string(), task: z.string(), priority: z.enum(['Critical', 'High', 'Medium', 'Low']), rationale: z.string() })),
  conflicts: z.array(z.string()),
  strategies: z.array(z.string()).min(2).max(6),
})

const researchSchema = z.object({
  title: z.string(),
  executiveSummary: z.string(),
  keyInsights: z.array(z.string()).min(2).max(8),
  recommendations: z.array(z.string()).min(2).max(6),
  caveats: z.array(z.string()),
  sources: z.array(z.object({ title: z.string(), publisher: z.string(), date: z.string(), url: z.string().url(), relevance: z.string() })).max(8),
})

function assertPublicUrls(value: string) {
  const matches = value.match(/https?:\/\/[^\s]+/g) ?? []
  for (const raw of matches) {
    const url = new URL(raw.replace(/[),.;]+$/, ''))
    const host = url.hostname.toLowerCase()
    if (url.protocol !== 'https:' || host === 'localhost' || host.endsWith('.local') || /^(10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)) {
      throw new Error('Only public HTTPS URLs are supported.')
    }
  }
}

export async function POST(request: Request) {
  try {
    const input = requestSchema.parse(await request.json())

    if (input.tool === 'email') {
      const { output } = await generateText({
        model: 'openai/gpt-5.4-mini',
        output: Output.object({ schema: emailSchema }),
        system: 'You are a precise professional communications editor. Preserve all facts, names, dates, links, and commitments. Never invent details. Adapt vocabulary, greeting, structure, detail, and call to action to the stated audience and tone.',
        prompt: `Rewrite or generate this email. Tone: ${input.tone}. Audience: ${input.audience || 'infer from draft'}. Context/outcome: ${input.context || 'infer from draft'}.\n\nDraft or goal:\n${input.draft}`,
      })
      return Response.json(output)
    }

    if (input.tool === 'planner') {
      const { output } = await generateText({
        model: 'openai/gpt-5.4-mini',
        output: Output.object({ schema: plannerSchema }),
        system: 'You are a pragmatic executive planning assistant. Prioritize with urgency and importance, create realistic time blocks, preserve fixed commitments, include breaks, and never invent deadlines. Explicitly surface ambiguity and over-capacity.',
        prompt: `Create a ${input.mode.toLowerCase()} plan within ${input.hours}. Include priority rationale and time optimization strategies.\n\nTasks:\n${input.tasks}`,
      })
      return Response.json(output)
    }

    if (input.mode === 'URLs') assertPublicUrls(input.query)
    const { output } = await generateText({
      model: input.mode === 'Topic' ? 'openai/gpt-4o-mini-search-preview' : 'openai/gpt-5.4-mini',
      output: Output.object({ schema: researchSchema }),
      system: 'You are a careful research analyst. Simplify complex information, distinguish evidence from analysis, flag uncertainty and conflicting claims, and never fabricate citations. For topic research, find relevant current public articles and include only verified source URLs. For supplied content, use only supplied evidence unless clearly labeled.',
      prompt: `${input.mode === 'Topic' ? 'Research this topic using current web articles' : input.mode === 'URLs' ? 'Read and summarize these public sources' : 'Summarize this supplied content'} with a plain-language executive summary, key insights, recommendations, caveats, and sources when available:\n\n${input.query}`,
    })
    return Response.json(output)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The request could not be completed.'
    return Response.json({ error: message }, { status: 400 })
  }
}
