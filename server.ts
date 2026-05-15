import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected to Elysian Sync WebSocket');

  ws.on('message', async (message: string) => {
    const data = JSON.parse(message.toString());
    console.log('[Elysian Sync] User Input:', data.text);

    try {
      // Call the proprietary AI Engine
      const response = await fetch('http://localhost:8000/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: data.text,
          session_id: 'default-session' // In production, use real session IDs
        })
      });

      const aiResult = await response.json();
      
      if (aiResult.status === 'SUCCESS') {
        ws.send(JSON.stringify({
          type: 'AI_RESPONSE',
          text: aiResult.response,
          sentiment: aiResult.sentiment
        }));
      }
    } catch (error) {
      console.error('[Soul Backend] AI Engine Error:', error);
      ws.send(JSON.stringify({ type: 'ERROR', message: 'Synchronization link unstable' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`[Soul Backend] Elysian Sync Server running on port ${port}`);
});
