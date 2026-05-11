import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Replit's proxy assigns dynamic hostnames (e.g.
    // <repl-id>.replit.dev, sometimes with sub-route prefixes). Vite
    // refuses requests from unknown hosts by default — `allowedHosts: true`
    // accepts any host so the proxy can route freely.
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '5173', 10),
    strictPort: true,
    allowedHosts: true,
    // HMR through the Replit proxy:
    //   • The user reaches the dev server via HTTPS on port 443 (proxy
    //     upgrades automatically even when the source is HTTP).
    //   • Vite's default WS port matches the dev server port, which the
    //     browser would try to connect to as ws://...:5173. That fails
    //     (mixed-content + port closed externally to the Repl).
    //   • clientPort: 443 + protocol: 'wss' makes Vite advertise the
    //     WS endpoint as wss://<host>:443 — the proxy then upgrades the
    //     WS like any other request.
    // Effect: HMR works inside the embedded Küa Canvas webview AND any
    // browser hitting the public Replit dev URL.
    hmr: {
      clientPort: 443,
      protocol: 'wss',
    },
    cors: true,
  },
})
