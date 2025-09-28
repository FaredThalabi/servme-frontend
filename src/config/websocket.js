/**
 * WebSocket Configuration
 * Centralized configuration for WebSocket connections
 */

export const WEBSOCKET_CONFIG = {
  // Pusher/Reverb Configuration
  pusher: {
    key: import.meta.env.VITE_WEBSOCKET_KEY,
    cluster: import.meta.env.VITE_WEBSOCKET_CLUSTER || 'mt1',
    host: '68.183.236.163',
    port: 8080,
    wssPort: 8080,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    enableLogging: import.meta.env.DEV, // Enable logging in development
    enableStats: false
  },

  // Native WebSocket Configuration
  nativeWS: {
    url: import.meta.env.VITE_WEBSOCKET_URL,
    reconnectDelay: 5000,
    maxReconnectAttempts: 10
  },

  // Channel Configuration
  channels: {
    getOrderChannel: (tenantId) => `merchant.${tenantId}`,
    getNotificationChannel: (tenantId) => `notifications.${tenantId}`
  },

  // Event Names
  events: {
    // Order Events
    ORDER_PLACED: 'App\\Events\\OrderPlaced',
    ORDER_UPDATED: 'App\\Events\\OrderUpdated', 
    ORDER_CANCELLED: 'App\\Events\\OrderCancelled',
    ORDER_PAID: 'App\\Events\\OrderPaid',
    
    // System Events
    PUSHER_SUBSCRIPTION_SUCCEEDED: 'pusher:subscription_succeeded',
    PUSHER_SUBSCRIPTION_ERROR: 'pusher:subscription_error'
  },

  // Fallback Configuration
  fallback: {
    pollingInterval: 30000, // 30 seconds
    enabled: true
  },

  // Default Tenant (fallback)
  defaultTenant: '01997f28-0912-72d7-8471-ccb1477d859a'
}

/**
 * Validate WebSocket configuration
 * @returns {boolean} - True if configuration is valid
 */
export function validateWebSocketConfig() {
  const { pusher, nativeWS } = WEBSOCKET_CONFIG
  
  // Check if at least one WebSocket option is available
  const hasPusherConfig = pusher.key && pusher.host
  const hasNativeWSConfig = nativeWS.url
  
  if (!hasPusherConfig && !hasNativeWSConfig) {
    console.warn('⚠️ No WebSocket configuration found')
    return false
  }
  
  return true
}

/**
 * Get the appropriate WebSocket configuration based on environment
 * @returns {Object} - WebSocket configuration object
 */
export function getWebSocketConfig() {
  if (import.meta.env.VITE_WEBSOCKET_KEY) {
    return {
      type: 'pusher',
      config: WEBSOCKET_CONFIG.pusher
    }
  } else if (import.meta.env.VITE_WEBSOCKET_URL) {
    return {
      type: 'native',
      config: WEBSOCKET_CONFIG.nativeWS
    }
  } else {
    return {
      type: 'fallback',
      config: WEBSOCKET_CONFIG.fallback
    }
  }
}

/**
 * Log configuration status
 */
export function logWebSocketConfig() {
  const config = getWebSocketConfig()
  
  console.log('🔧 WebSocket Configuration:', {
    type: config.type,
    pusherKey: WEBSOCKET_CONFIG.pusher.key ? '✅ Set' : '❌ Missing',
    pusherHost: WEBSOCKET_CONFIG.pusher.host,
    nativeWSUrl: WEBSOCKET_CONFIG.nativeWS.url || '❌ Not set',
    fallbackEnabled: WEBSOCKET_CONFIG.fallback.enabled
  })
}
