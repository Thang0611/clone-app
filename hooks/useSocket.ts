'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { SocketEvent } from '@/types';

interface UseSocketOptions {
  url?: string;
  enabled?: boolean;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  subscribe: (scope: 'order' | 'task', id: number) => void;
  unsubscribe: (scope: 'order' | 'task', id: number) => void;
  on: (event: string, handler: (data: any) => void) => void;
  off: (event: string, handler: (data: any) => void) => void;
}

/**
 * Custom hook for Socket.io client connection
 * Manages WebSocket connection lifecycle and subscriptions
 */
import { APP_CONFIG } from '@/lib/config';

export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const { 
    url = APP_CONFIG.socketUrl,
    enabled = true 
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  // Track subscriptions to auto-resubscribe on reconnect
  const subscriptionsRef = useRef<Array<{ scope: 'order' | 'task', id: number }>>([]);

  useEffect(() => {
    if (!enabled) return;

    // Initialize Socket.io connection
    const socketInstance = io(url, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity, // Keep trying to reconnect
      timeout: 20000,
      forceNew: false
    });

    // Sync state with actual socket connection state
    const updateConnectionState = () => {
      const connected = socketInstance.connected;
      setIsConnected(connected);
    };

    const handleConnect = () => {
      console.log('[Socket] ✅ Connected to server:', socketInstance.id);
      updateConnectionState();
      
      // Auto-resubscribe to all previous subscriptions on reconnect
      if (subscriptionsRef.current.length > 0) {
        console.log(`[Socket] 🔄 Auto-resubscribing to ${subscriptionsRef.current.length} subscriptions...`);
        subscriptionsRef.current.forEach(({ scope, id }) => {
          const eventName = `subscribe:${scope}`;
          const payload = scope === 'order' ? { orderId: id } : { taskId: id };
          socketInstance.emit(eventName, payload);
          console.log(`[Socket] ✅ Auto-resubscribed to ${scope}:${id}`);
        });
      }
    };

    socketInstance.on('connect', handleConnect);

    socketInstance.on('connected', (data) => {
      console.log('[Socket] ✅ Server confirmed connection:', data);
      updateConnectionState();
    });

    socketInstance.on('subscribed', (data) => {
      console.log('[Socket] ✅ Subscription confirmed:', data);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('[Socket] ❌ Disconnected:', reason);
      updateConnectionState();
    });

    socketInstance.on('connect_error', (error) => {
      console.error('[Socket] ❌ Connection error:', error.message);
      updateConnectionState();
    });

    socketInstance.on('error', (error) => {
      console.error('[Socket] ❌ Error:', error);
    });

    socketRef.current = socketInstance;
    
    // Initial state sync
    updateConnectionState();
    
    // Periodic state sync to catch any state mismatches
    const syncInterval = setInterval(updateConnectionState, 1000);

    // Cleanup on unmount
    return () => {
      clearInterval(syncInterval);
      console.log('[Socket] 🧹 Cleaning up connection');
      socketInstance.disconnect();
      socketRef.current = null;
      subscriptionsRef.current = [];
      setIsConnected(false);
    };
  }, [url, enabled]);

  const subscribe = (scope: 'order' | 'task', id: number) => {
    if (!socketRef.current) {
      console.warn(`[Socket] ⚠️ Cannot subscribe to ${scope}:${id} - socket not initialized`);
      return;
    }

    // Track subscription for auto-resubscribe
    const subscriptionKey = { scope, id };
    const exists = subscriptionsRef.current.some(
      sub => sub.scope === scope && sub.id === id
    );
    if (!exists) {
      subscriptionsRef.current.push(subscriptionKey);
    }

    // Use socket.connected directly instead of isConnected state (more reliable)
    if (!socketRef.current.connected) {
      console.log(`[Socket] ⏳ Socket not connected, will subscribe when connected: ${scope}:${id}`);
      
      // Set up a one-time listener for when connection is established
      const onConnectOnce = () => {
        socketRef.current?.off('connect', onConnectOnce);
        const eventName = `subscribe:${scope}`;
        const payload = scope === 'order' ? { orderId: id } : { taskId: id };
        socketRef.current?.emit(eventName, payload);
        console.log(`[Socket] ✅ Subscribed to ${scope}:${id} after connection`, { eventName, payload });
      };
      
      socketRef.current.once('connect', onConnectOnce);
      return;
    }

    // Subscribe immediately if connected
    const eventName = `subscribe:${scope}`;
    const payload = scope === 'order' ? { orderId: id } : { taskId: id };
    socketRef.current.emit(eventName, payload);
    console.log(`[Socket] ✅ Subscribed to ${scope}:${id}`, { eventName, payload });
  };

  const unsubscribe = (scope: 'order' | 'task', id: number) => {
    // Remove from tracked subscriptions
    subscriptionsRef.current = subscriptionsRef.current.filter(
      sub => !(sub.scope === scope && sub.id === id)
    );

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(`unsubscribe:${scope}`, { [`${scope}Id`]: id });
      console.log(`[Socket] Unsubscribed from ${scope}:${id}`);
    }
  };

  const on = (event: string, handler: (data: any) => void) => {
    if (socketRef.current) {
      // Register handler immediately
      socketRef.current.on(event, handler);
    }
  };

  const off = (event: string, handler: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler);
    }
  };

  // Return actual socket connection state for reliability
  const actualConnected = socketRef.current?.connected ?? false;
  
  return {
    socket: socketRef.current,
    isConnected: actualConnected || isConnected, // Use actual state if available, fallback to React state
    subscribe,
    unsubscribe,
    on,
    off
  };
}
