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

  ws.on('message', (message: string) => {
    console.log('Received:', message.toString());
    // This is where we will integrate the proprietary psychological AI model
    ws.send(JSON.stringify({ type: 'STATUS', message: 'Resonance established' }));
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`[Soul Backend] Elysian Sync Server running on port ${port}`);
});
