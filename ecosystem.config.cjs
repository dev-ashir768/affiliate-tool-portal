/**
 * PM2 ecosystem — affiliate-tool-portal
 *
 * Usage (on the server, inside this repo):
 *   npm ci
 *   npm run build
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 */
module.exports = {
  apps: [
    {
      name: "tiksly-portal",
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
