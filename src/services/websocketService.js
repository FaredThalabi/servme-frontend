/**
 * WebSocket Service
 * Handles WebSocket connections using centralized configuration
 */

import Pusher from 'pusher-js'
import { WEBSOCKET_CONFIG, getWebSocketConfig, validateWebSocketConfig, logWebSocketConfig } from '@/config/websocket.js'

class WebSocketService {
  constructor() {
    this.pusher = null
    this.nativeWS = null
    this.currentChannel = null
    this.reconnectAttempts = 0
    this.eventHandlers = new Map()
    this.isConnected = false
  }

  /**
   * Initialize WebSocket connection
   * @param {string} tenantId - Current tenant ID
   * @returns {Promise<boolean>} - Success status
   */
  async connect(tenantId) {
    console.log('🔌 Initializing WebSocket connection...')
    
    // Validate configuration
    if (!validateWebSocketConfig()) {
      console.error('❌ Invalid WebSocket configuration')
      return false
    }

    // Log current configuration
    logWebSocketConfig()

    const config = getWebSocketConfig()
    
    try {
      switch (config.type) {
        case 'pusher':
          return await this.connectPusher(tenantId)
        case 'native':
          return await this.connectNativeWS(tenantId)
        default:
          console.log('⚠️ No WebSocket available, will use fallback')
          return false
      }
    } catch (error) {
      console.error('❌ WebSocket connection failed:', error)
      return false
    }
  }

  /**
   * Connect using Pusher
   * @param {string} tenantId - Current tenant ID
   * @returns {Promise<boolean>} - Success status
   */
  async connectPusher(tenantId) {
    console.log('✅ Connecting with Pusher/Reverb...')
    
    try {
      const { pusher: config } = WEBSOCKET_CONFIG
      
      this.pusher = new Pusher(config.key, {
        wsHost: config.host,
        wsPort: config.port,
        wssPort: config.wssPort,
        forceTLS: config.forceTLS,
        enabledTransports: config.enabledTransports,
        cluster: config.cluster,
        enableLogging: config.enableLogging,
        enableStats: config.enableStats
      })

      // Setup connection event listeners
      this.setupPusherConnectionListeners()

      // Subscribe to tenant channel
      await this.subscribeToPusherChannel(tenantId)

      this.isConnected = true
      console.log('✅ Pusher WebSocket connected successfully')
      
      return true
    } catch (error) {
      console.error('❌ Pusher connection failed:', error)
      throw error
    }
  }

  /**
   * Connect using native WebSocket
   * @param {string} tenantId - Current tenant ID
   * @returns {Promise<boolean>} - Success status
   */
  async connectNativeWS(tenantId) {
    console.log('✅ Connecting with native WebSocket...')
    
    const { nativeWS: config } = WEBSOCKET_CONFIG
    const wsUrl = `${config.url}/${tenantId}`
    
    return new Promise((resolve, reject) => {
      try {
        this.nativeWS = new WebSocket(wsUrl)
        
        this.nativeWS.onopen = () => {
          console.log('✅ Native WebSocket connected:', wsUrl)
          this.isConnected = true
          this.reconnectAttempts = 0
          resolve(true)
        }
        
        this.nativeWS.onmessage = (event) => {
          this.handleNativeWSMessage(event)
        }
        
        this.nativeWS.onclose = () => {
          console.log('❌ Native WebSocket disconnected')
          this.isConnected = false
          this.handleReconnection(tenantId)
        }
        
        this.nativeWS.onerror = (error) => {
          console.error('❌ Native WebSocket error:', error)
          reject(error)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Setup Pusher connection event listeners
   */
  setupPusherConnectionListeners() {
    this.pusher.connection.bind('connecting', () => {
      console.log('🔄 Pusher connecting...')
    })
    
    this.pusher.connection.bind('connected', () => {
      console.log('✅ Pusher connected!')
      this.isConnected = true
      this.reconnectAttempts = 0
    })
    
    this.pusher.connection.bind('disconnected', () => {
      console.log('❌ Pusher disconnected')
      this.isConnected = false
    })
    
    this.pusher.connection.bind('error', (error) => {
      console.error('❌ Pusher connection error:', error)
    })
  }

  /**
   * Subscribe to Pusher channel for tenant
   * @param {string} tenantId - Current tenant ID
   */
  async subscribeToPusherChannel(tenantId) {
    const channelName = WEBSOCKET_CONFIG.channels.getOrderChannel(tenantId)
    
    console.log('📡 Subscribing to channel:', channelName)
    
    this.currentChannel = this.pusher.subscribe(channelName)
    
    // Setup channel event listeners
    this.currentChannel.bind(WEBSOCKET_CONFIG.events.PUSHER_SUBSCRIPTION_SUCCEEDED, () => {
      console.log('✅ Successfully subscribed to:', channelName)
    })
    
    this.currentChannel.bind(WEBSOCKET_CONFIG.events.PUSHER_SUBSCRIPTION_ERROR, (error) => {
      console.error('❌ Subscription error:', error)
    })

    // Bind order events
    this.bindOrderEvents()
  }

  /**
   * Bind order events to current channel
   */
  bindOrderEvents() {
    const { events } = WEBSOCKET_CONFIG
    
    // Bind specific order events
    this.currentChannel.bind(events.ORDER_PLACED, (data) => {
      this.emit('orderPlaced', data)
    })
    
    this.currentChannel.bind(events.ORDER_UPDATED, (data) => {
      this.emit('orderUpdated', data)
    })
    
    this.currentChannel.bind(events.ORDER_CANCELLED, (data) => {
      this.emit('orderCancelled', data)
    })

    // Global event listener for debugging
    this.currentChannel.bind_global((eventName, data) => {
      console.log('📡 Received event:', eventName, data)
      
      if (!eventName.startsWith('pusher:')) {
        console.log('📡 Application event:', eventName, data)
      }
    })
  }

  /**
   * Handle native WebSocket messages
   * @param {MessageEvent} event - WebSocket message event
   */
  handleNativeWSMessage(event) {
    try {
      const data = JSON.parse(event.data)
      console.log('📡 Native WebSocket message:', data)
      
      // Handle different message types
      switch (data.type) {
        case 'order.created':
          this.emit('orderPlaced', data)
          break
        case 'order.updated':
          this.emit('orderUpdated', data)
          break
        case 'order.cancelled':
          this.emit('orderCancelled', data)
          break
      }
    } catch (error) {
      console.error('❌ Failed to parse WebSocket message:', error)
    }
  }

  /**
   * Handle reconnection logic
   * @param {string} tenantId - Current tenant ID
   */
  handleReconnection(tenantId) {
    const { maxReconnectAttempts, reconnectDelay } = WEBSOCKET_CONFIG.nativeWS
    
    if (this.reconnectAttempts < maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`🔄 Reconnecting... (${this.reconnectAttempts}/${maxReconnectAttempts})`)
      
      setTimeout(() => {
        this.connect(tenantId)
      }, reconnectDelay)
    } else {
      console.error('❌ Max reconnection attempts reached')
    }
  }

  /**
   * Register event handler
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function
   */
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, [])
    }
    this.eventHandlers.get(event).push(handler)
  }

  /**
   * Emit event to registered handlers
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    const handlers = this.eventHandlers.get(event) || []
    handlers.forEach(handler => {
      try {
        handler(data)
      } catch (error) {
        console.error(`❌ Error in event handler for ${event}:`, error)
      }
    })
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    console.log('🔌 Disconnecting WebSocket...')
    
    if (this.pusher) {
      this.pusher.disconnect()
      this.pusher = null
    }
    
    if (this.nativeWS) {
      this.nativeWS.close()
      this.nativeWS = null
    }
    
    this.currentChannel = null
    this.isConnected = false
    this.eventHandlers.clear()
    
    console.log('✅ WebSocket disconnected')
  }

  /**
   * Get connection status
   * @returns {boolean} - Connection status
   */
  getConnectionStatus() {
    return this.isConnected
  }
}

// Export singleton instance
export const websocketService = new WebSocketService()
export default websocketService
