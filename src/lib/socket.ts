import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

// Safe mock socket for environments like Vercel Serverless where WebSocket server is not running
class MockSocket {
  on(_event: string, _callback: (...args: any[]) => void) { return this; }
  off(_event: string, _callback?: (...args: any[]) => void) { return this; }
  emit(_event: string, ..._args: any[]) { return this; }
  connect() { return this; }
  disconnect() { return this; }
  close() { return this; }
}

export const getSocket = (): Socket => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isVercel = hostname.includes('vercel.app') || hostname.includes('vercel.dev');
    const customSocketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

    // On Vercel, serverless lambdas do not host persistent WebSocket listeners.
    // If no external WebSocket server URL is provided, return safe mock socket to prevent red console spam.
    if (isVercel && (!customSocketUrl || customSocketUrl.includes('localhost'))) {
      if (!socket) {
        socket = new MockSocket() as unknown as Socket;
      }
      return socket;
    }
  }

  if (!socket) {
    const url =
      typeof window !== 'undefined'
        ? (process.env.NEXT_PUBLIC_SOCKET_URL && !process.env.NEXT_PUBLIC_SOCKET_URL.includes('localhost')
            ? process.env.NEXT_PUBLIC_SOCKET_URL
            : window.location.origin)
        : (process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000');

    try {
      socket = io(url, {
        transports: ['polling', 'websocket'],
        reconnectionAttempts: 2,
        timeout: 4000,
        autoConnect: true,
      });
    } catch {
      socket = new MockSocket() as unknown as Socket;
    }
  }
  return socket;
};
