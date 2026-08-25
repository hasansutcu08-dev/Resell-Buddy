# Resell Buddy

**Subscription-based marketplace monitoring for resellers — Discord bot + dashboard + Whop billing.**

Catch deals before the feed moves on. Create targeted monitors, get instant Discord alerts, and flip faster.

> Independent commercial product. Core monitoring concepts adapted from [Vintrack](https://github.com/JakobAIOdev/Vintrack-Vinted-Monitor) (MIT). Not affiliated with Vinted.

## Live links

| What | URL |
|------|-----|
| **Whop product** | https://whop.com/resell-buddy |
| **Pro monthly** | https://whop.com/checkout/plan_vAO3R1lqZ11UT (€14.99) |
| **Elite monthly** | https://whop.com/checkout/plan_3aG0H3FQibNZ4 (€29.99) |
| **Pro yearly** | https://whop.com/checkout/plan_UNnsnnhzGRy9Y (€149) |
| **Elite yearly** | https://whop.com/checkout/plan_swwMjSoMLni4Z (€299) |
| **GitHub** | https://github.com/hasansutcu08-dev/Resell-Buddy |

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Web App    │────▶│  API / Auth  │◀───▶│  Postgres   │
│  (Next.js)  │     │  + Whop      │     │  + Redis    │
└─────────────┘     └──────┬───────┘     └──────▲──────┘
                           │                    │
                    ┌──────▼───────┐     ┌──────┴──────┐
                    │ Discord Bot  │     │ Go Workers  │
                    │ (slash cmds) │     │ (catalog)   │
                    └──────────────┘     └─────────────┘
```

- **Multi-tenant** (`user_id` / `subscription_id` on every resource)
- **Discord-first** — `/link` → Whop membership check → monitors + alerts
- **Plan gating** at API, bot, and worker level
- **Whop** as primary billing (checkout + webhooks)

## Plans

| Plan | Monitors | Discord DMs | Shared proxies | Account actions | Price |
|------|----------|-------------|----------------|-----------------|-------|
| Free | 1 | — | — | — | €0 |
| Pro | 10 | ✓ | ✓ | — | €14.99/mo |
| Elite | Unlimited | ✓ | ✓ | ✓ | €29.99/mo |

## Quick start

```bash
cp .env.example .env
# Fill DISCORD_* and WHOP_* 
docker compose up -d          # Postgres + Redis
npm install
npm run dev:web               # http://localhost:3000
npm run dev:bot               # Discord bot (needs token)
```

## Discord bot setup (required for live invite)

1. Go to [Discord Developer Portal](https://discord.com/developers/applications) → New Application → **Resell Buddy**
2. Bot tab → Reset Token → copy into `DISCORD_BOT_TOKEN`
3. OAuth2 → copy Client ID into `DISCORD_CLIENT_ID` (and secret if using OAuth)
4. Invite URL (replace `CLIENT_ID`):

```
https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=2147485696&scope=bot%20applications.commands
```

Permissions needed: Send Messages, Embed Links, Use Application Commands, Read Message History.

5. Run the bot:

```bash
cd apps/bot && npm install && npm run dev
```

Commands register globally on startup: `/link` `/status` `/monitor` `/alerts` `/subscribe` `/help`

## Whop

- Company: `biz_Jqhj2PEBBvSaMI`
- Product: `prod_paXtUuRtqX13D` (route: `resell-buddy`)
- Webhooks should POST membership events → your API to set `users.plan`

## Repo layout

```
apps/
  bot/          Discord.js slash-command bot
  web/          Next.js landing + pricing (Whop CTAs)
  worker/       Go catalog workers (skeleton)
packages/
  shared/       Plan limits + Whop plan ID mapping
docs/
  COMMERCIAL.md GTM + legal notes
```

## Responsible use

You are responsible for complying with marketplace terms of service, rate limits, and applicable law.  
Resell Buddy is a tool for authorized monitoring and notification. Do not use it to bypass access controls or violate platform rules.

## License

MIT — see [LICENSE](LICENSE). Attribution to Vintrack retained.
