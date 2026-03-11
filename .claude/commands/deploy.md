# Deploy to alertasmultas mini-PC server

## Server Details
- **Host**: `rodrigo-minipc@100.102.129.86` (Tailscale IP)
- **Project path**: `~/code/alertas2`
- **Stack**: SvelteKit (adapter-node) + PocketBase + Cloudflare Tunnel
- **Process manager**: PM2

## SSH Setup (ControlMaster for persistent connections)

To avoid repeated SSH handshakes during a session, set up ControlMaster:

```bash
# Add to ~/.ssh/config if not already there:
Host rodrigo-minipc
  HostName 100.102.129.86
  User rodrigo-minipc
  ControlMaster auto
  ControlPath ~/.ssh/cm-%r@%h:%p
  ControlPersist 1h
```

Then use `rodrigo-minipc` as the host shorthand in all SSH/SCP commands.

## Standard Deploy Flow

After making code changes and committing locally:

```bash
# 1. Push to GitHub
git push

# 2. Pull, build, restart on server
ssh rodrigo-minipc@100.102.129.86 "cd ~/code/alertas2 && git pull && npm run build && pm2 restart alertas2"
```

## PM2 Services

| Name | Command | Purpose |
|------|---------|---------|
| alertas2 | `node --env-file=.env build` | SvelteKit app (port 3000) |
| pocketbase | `./pocketbase serve --http=127.0.0.1:8090` | PocketBase (port 8090) |
| cloudflared | `cloudflared tunnel run alertasmultas` | Cloudflare Tunnel |

```bash
# Check status
ssh rodrigo-minipc@100.102.129.86 "pm2 list"

# View logs
ssh rodrigo-minipc@100.102.129.86 "pm2 logs alertas2 --lines 50 --nostream"

# Restart a service
ssh rodrigo-minipc@100.102.129.86 "pm2 restart alertas2"
```

## Environment Variables

`.env` lives at `~/code/alertas2/.env` on the server (not in git).
Key vars:
- `PUBLIC_APP_URL=https://alertasmultas.com`
- `PUBLIC_POCKETBASE_URL=https://pb.alertasmultas.com`
- `STRIPE_SECRET_KEY_LIVE` — used in production (not test)
- `STRIPE_WEBHOOK_SECRET_LIVE` — live webhook secret

After editing `.env`, restart the app (no rebuild needed):
```bash
ssh rodrigo-minipc@100.102.129.86 "pm2 restart alertas2"
```

## Important Notes

- `PUBLIC_*` env vars must be imported from `$env/dynamic/public`, NOT `$env/dynamic/private`
- PocketBase admin: `https://pb.alertasmultas.com/_/` (rodriamarog@gmail.com)
- Cloudflare tunnel config: `~/.cloudflared/config.yml` on the server
- Cronjob: scraper runs daily at 8am — `crontab -l` to verify
- Stripe is in **live mode** in production
