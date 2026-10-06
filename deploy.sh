#!/usr/bin/env bash
# One-command production deploy for affiliate-tool-portal (run on the server, in this repo).
# Deploy affiliate-tool-apis first when both changed — the API runs DB migrations.
#   bash deploy.sh
set -euo pipefail
cd "$(dirname "$0")"

step() { printf '\n\033[1;36m==> %s\033[0m\n' "$1"; }

step "Pulling latest main"
git pull --ff-only origin main

step "Installing dependencies"
npm ci

step "Building"
npm run build

step "Restarting portal"
if pm2 describe influxa-portal >/dev/null 2>&1; then
  pm2 reload ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
  pm2 save
fi

step "Status"
pm2 status
echo
echo "Deployed $(git log --oneline -1)"
