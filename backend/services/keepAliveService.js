import https from 'https';
import http from 'http';

/**
 * Self-ping keep-alive service for Render free instances.
 * Render free web services spin down after 15 minutes of inactivity.
 * By sending a periodic HTTP GET request through Render's external ingress
 * every 14 minutes, the instance stays active and responsive.
 */
export const startKeepAlive = (serverUrl, intervalMinutes = 14) => {
  const targetUrl = serverUrl || process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL;

  if (!targetUrl) {
    console.log('[KeepAlive] No external URL detected. Self-ping idle monitor is inactive in local mode.');
    return;
  }

  const pingUrl = targetUrl.replace(/\/$/, '') + '/api/health';
  const intervalMs = intervalMinutes * 60 * 1000;

  console.log(`[KeepAlive] Service initialized. Self-pinging ${pingUrl} every ${intervalMinutes} minutes.`);

  // Send first ping after 1 minute to allow server startup, then recurring
  setTimeout(() => {
    pingHealth(pingUrl);
    setInterval(() => pingHealth(pingUrl), intervalMs);
  }, 60 * 1000);
};

const pingHealth = (url) => {
  try {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;

    const req = client.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const time = new Date().toLocaleTimeString();
        console.log(`[KeepAlive] Self-ping successful at ${time} - Status: ${res.statusCode}`);
      });
    });

    req.on('timeout', () => {
      req.destroy();
      console.warn('[KeepAlive] Self-ping request timed out.');
    });

    req.on('error', (err) => {
      console.warn(`[KeepAlive] Self-ping warning: ${err.message}`);
    });
  } catch (error) {
    console.warn(`[KeepAlive] Execution error: ${error.message}`);
  }
};
