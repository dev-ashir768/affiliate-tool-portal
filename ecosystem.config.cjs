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
      name: "affimaticapp-app",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        API_URL: "https://api.affimaticapp.com",
      },
      max_memory_restart: "768M",
      time: true,
      error_file: "logs/app-error.log",
      out_file: "logs/app-out.log",
      merge_logs: true,
    },
  ],
};
