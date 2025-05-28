
interface WebSocketMessage {
  type: 'location_update' | 'delivery_status' | 'route_update' | 'driver_status';
  data: any;
  timestamp: number;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Function[]> = new Map();

  connect() {
    try {
      // Using a mock WebSocket server for demo
      this.ws = new WebSocket('wss://echo.websocket.org');
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.startMockDataStream();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.reconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.reconnect();
    }
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts);
    }
  }

  private handleMessage(message: WebSocketMessage) {
    const listeners = this.listeners.get(message.type) || [];
    listeners.forEach(listener => listener(message.data));
  }

  subscribe(type: string, callback: Function) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(callback);
  }

  unsubscribe(type: string, callback: Function) {
    const listeners = this.listeners.get(type) || [];
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  send(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private startMockDataStream() {
    // Simulate real-time location updates for demo
    const mockDrivers = [
      { id: 'DRV-001', name: 'Mike Wilson', lat: 40.7128, lng: -74.0060 },
      { id: 'DRV-002', name: 'Lisa Chen', lat: 40.7614, lng: -73.9776 },
      { id: 'DRV-003', name: 'Tom Rodriguez', lat: 40.7282, lng: -73.7949 },
      { id: 'DRV-004', name: 'Sarah Kim', lat: 40.6782, lng: -73.9442 }
    ];

    setInterval(() => {
      mockDrivers.forEach(driver => {
        // Simulate movement
        driver.lat += (Math.random() - 0.5) * 0.001;
        driver.lng += (Math.random() - 0.5) * 0.001;

        this.handleMessage({
          type: 'location_update',
          data: {
            driverId: driver.id,
            location: { lat: driver.lat, lng: driver.lng },
            timestamp: Date.now(),
            speed: Math.random() * 50 + 10, // 10-60 mph
            heading: Math.random() * 360
          },
          timestamp: Date.now()
        });
      });
    }, 3000); // Update every 3 seconds

    // Simulate delivery status updates
    setInterval(() => {
      const statuses = ['picked_up', 'in_transit', 'delivered', 'failed'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      this.handleMessage({
        type: 'delivery_status',
        data: {
          deliveryId: `DEL-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
          status: randomStatus,
          timestamp: Date.now(),
          location: { 
            lat: 40.7128 + (Math.random() - 0.5) * 0.1, 
            lng: -74.0060 + (Math.random() - 0.5) * 0.1 
          }
        },
        timestamp: Date.now()
      });
    }, 15000); // Update every 15 seconds
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const websocketService = new WebSocketService();
