# Prompt Vault

An open-source, community-driven prompt registry for product designers and UX practitioners. Browse, copy, and contribute AI prompts, skills, agent workflows, and resources.

## Features

- Browse prompts, skills, workflows, and agent configurations
- Copy prompts to clipboard with one click
- Install commands for Claude Code skills
- Download content as markdown files
- Community contributions via proposal system
- Admin review and approval workflow

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Clerk
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account (free tier works)
- Clerk account (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/timreerink-del/prompt-vault.git
cd prompt-vault
npm install
```

### 2. Set up environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `schema.sql`
3. Copy your project URL and keys into `.env.local`

### 4. Set up Clerk

1. Create an app at [clerk.com](https://clerk.com)
2. Enable Google and/or GitHub sign-in
3. Copy your publishable key and secret key into `.env.local`

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

## Contributing

1. Browse the registry at the deployed site
2. Sign in with your account
3. Click "Propose" to submit a new prompt, skill, or workflow
4. Admins will review and approve contributions

### Local development

```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run lint   # Run linter
```

## License

MIT — see [LICENSE](LICENSE) for details.
