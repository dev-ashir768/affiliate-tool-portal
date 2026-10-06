/**
 * PM2 ecosystem — affiliate-tool-portal
 *
 * Deploy (on the server, inside this repo):
 *   bash deploy.sh
 *
 * What deploy.sh runs:
 *   npm ci
 *   npm run build
 *   pm2 reload ecosystem.config.cjs --update-env  (pm2 start on first run)
 */
module.exports = {
  apps: [
    {
      name: "influxa-portal",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        API_URL: "https://api.dealhoper.com",
      },
      max_memory_restart: "768M",
      time: true,
      error_file: "logs/portal-error.log",
      out_file: "logs/portal-out.log",
      merge_logs: true,
    },
  ],
};
