# Northstar AI

Northstar AI is a responsive AI productivity dashboard that helps professionals communicate clearly, organize their time, and understand complex information. It combines audience-aware email generation, intelligent task scheduling, and research summarization in a single privacy-conscious workspace.

## Features Implemented

### Smart Email Generator

- Generates professional emails from a draft or writing goal
- Supports formal, informal, and persuasive tones
- Adapts language and structure to the intended audience
- Returns a subject line, email body, detected tone, and adaptation notes
- Provides convenient copy actions for generated content

### AI Task Planner

- Converts free-form task lists into structured schedules
- Supports daily and weekly planning modes
- Prioritizes tasks by urgency and importance
- Accounts for working hours, deadlines, and scheduling constraints
- Identifies conflicts and tasks that cannot fit into the schedule
- Suggests practical time-optimization strategies

### AI Research Assistant

- Summarizes pasted articles, reports, and other long-form content
- Analyzes public URLs
- Supports topic-based research and article discovery
- Produces executive summaries, key insights, recommendations, and caveats
- Returns relevant sources with validated public HTTPS links
- Simplifies complex information for quick understanding

### Interface and Safety

- Responsive SaaS dashboard for mobile, tablet, and desktop devices
- Accessible desktop sidebar and mobile navigation drawer
- Light and dark color-scheme support
- Structured loading, empty, result, and error states
- Persistent Responsible AI Notice across every workspace
- Ephemeral workspace content with no application-level data persistence

## Technologies and Tools Used

- [Next.js 16](https://nextjs.org/) with the App Router
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vercel AI SDK](https://ai-sdk.dev/)
- [Vercel AI Gateway](https://vercel.com/ai-gateway)
- [Zod](https://zod.dev/) for request and response validation
- [Lucide React](https://lucide.dev/) for interface icons
- [Geist](https://vercel.com/font) typography
- [v0](https://v0.app/) for development and iteration
- [Vercel](https://vercel.com/) for deployment

## Setup Instructions

### Prerequisites

Install the following before starting:

- Node.js 20 or newer
- pnpm
- A Vercel account with access to Vercel AI Gateway

### 1. Clone the repository

```bash
git clone https://github.com/Lamack-cell/ai-productivity-final.git
cd ai-productivity-final
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env.development.local` file in the project root and add your AI Gateway credential:

```bash
AI_GATEWAY_API_KEY=your_ai_gateway_api_key
```

Do not commit environment files or API keys to source control.

### 4. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

### 5. Create a production build

```bash
pnpm build
```

To run the production build locally:

```bash
pnpm start
```

## Team Members

- Resimate Lamack Maluleke
