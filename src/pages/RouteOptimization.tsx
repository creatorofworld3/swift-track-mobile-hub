
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import GoogleMap from '@/components/GoogleMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Truck, 
  Zap, 
  Settings,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface RoutePoint {
  id: string;
  address: string;
  lat: number;
  lng: number;
  type: 'pickup' | 'delivery' | 'warehouse';
  priority: 'low' | 'medium' | 'high';
  timeWindow?: string;
  estimatedTime?: number;
}

interface OptimizedRoute {
  id: string;
  driverId: string;
  driverName: string;
  points: RoutePoint[];
  totalDistance: number;
  estimatedDuration: number;
  optimizationScore: number;
  status: 'draft' | 'optimizing' | 'optimized' | 'assigned';
}

const RouteOptimization = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [optimizationSettings, setOptimizationSettings] = useState({
    prioritizeTime: true,
    prioritizeDistance: false,
    respectTimeWindows: true,
    maxStopsPerRoute: 15
  });

  const [routes, setRoutes] = useState<OptimizedRoute[]>([
    {
      id: 'ROUTE-001',
      driverId: 'DRV-001',
      driverName: 'Mike Wilson',
      points: [
        { id: 'P1', address: 'Warehouse A', lat: 40.7128, lng: -74.0060, type: 'warehouse', priority: 'high' },
        { id: 'P2', address: '123 Main St', lat: 40.7282, lng: -73.7949, type: 'delivery', priority: 'high', timeWindow: '9:00-11:00' },
        { id: 'P3', address: '456 Oak Ave', lat: 40.7614, lng: -73.9776, type: 'delivery', priority: 'medium', timeWindow: '11:00-13:00' },
        { id: 'P4', address: '789 Pine Rd', lat: 40.6782, lng: -73.9442, type: 'delivery', priority: 'low', timeWindow: '13:00-15:00' }
      ],
      totalDistance: 45.2,
      estimatedDuration: 180,
      optimizationScore: 94,
      status: 'optimized'
    },
    {
      id: 'ROUTE-002',
      driverId: 'DRV-002',
      driverName: 'Lisa Chen',
      points: [
        { id: 'P5', address: 'Warehouse B', lat: 40.7589, lng: -73.9851, type: 'warehouse', priority: 'high' },
        { id: 'P6', address: '321 Elm St', lat: 40.7505, lng: -73.9934, type: 'pickup', priority: 'high', timeWindow: '8:00-10:00' },
        { id: 'P7', address: '654 Maple Dr', lat: 40.7831, lng: -73.9712, type: 'delivery', priority: 'medium', timeWindow: '10:00-12:00' }
      ],
      totalDistance: 28.7,
      estimatedDuration: 120,
      optimizationScore: 89,
      status: 'assigned'
    }
  ]);

  const handleOptimizeRoutes = async () => {
    setIsOptimizing(true);
    toast.info('Starting route optimization...');
    
    // Simulate optimization process
    setTimeout(() => {
      setRoutes(prev => prev.map(route => ({
        ...route,
        optimizationScore: Math.min(route.optimizationScore + Math.random() * 10, 100),
        totalDistance: route.totalDistance * (0.9 + Math.random() * 0.1),
        estimatedDuration: Math.floor(route.estimatedDuration * (0.85 + Math.random() * 0.15)),
        status: 'optimized' as const
      })));
      
      setIsOptimizing(false);
      toast.success('Routes optimized successfully! Average improvement: 12%');
    }, 3000);
  };

  const handleAssignRoute = (routeId: string) => {
    setRoutes(prev => prev.map(route => 
      route.id === routeId 
        ? { ...route, status: 'assigned' as const }
        : route
    ));
    toast.success(`Route ${routeId} assigned to driver`);
  };

  const handleResetRoute = (routeId: string) => {
    setRoutes(prev => prev.map(route => 
      route.id === routeId 
        ? { ...route, status: 'draft' as const, optimizationScore: 75 }
        : route
    ));
    toast.info(`Route ${routeId} reset to draft`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimized': return 'bg-green-100 text-green-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'optimizing': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warehouse': return <MapPin className="h-4 w-4" />;
      case 'pickup': return <Truck className="h-4 w-4" />;
      case 'delivery': return <CheckCircle2 className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  // Convert route points to map markers
  const selectedRouteData = selectedRoute ? routes.find(r => r.id === selectedRoute) : routes[0];
  const mapMarkers = selectedRouteData ? selectedRouteData.points.map(point => ({
    id: point.id,
    lat: point.lat,
    lng: point.lng,
    type: point.type === 'warehouse' ? 'warehouse' as const : 'delivery' as const,
    title: point.address,
    status: point.priority,
    info: `${point.type} - ${point.priority} priority`
  })) : [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Route Optimization</h1>
            <p className="text-gray-600">AI-powered route planning for maximum efficiency</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => toast.info('Opening optimization settings...')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button 
              onClick={handleOptimizeRoutes} 
              disabled={isOptimizing}
              className="min-w-[140px]"
            >
              {isOptimizing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Optimize All
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Optimization Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
              <Navigation className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{routes.length}</div>
              <p className="text-xs text-muted-foreground">
                {routes.filter(r => r.status === 'optimized').length} optimized
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Distance</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(routes.reduce((acc, r) => acc + r.totalDistance, 0) / routes.length).toFixed(1)} km
              </div>
              <p className="text-xs text-muted-foreground">
                12% reduction
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor(routes.reduce((acc, r) => acc + r.estimatedDuration, 0) / routes.length)}m
              </div>
              <p className="text-xs text-muted-foreground">
                15% faster
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor(routes.reduce((acc, r) => acc + r.optimizationScore, 0) / routes.length)}%
              </div>
              <p className="text-xs text-muted-foreground">
                +8% improvement
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Route Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Route Visualization</CardTitle>
                    <CardDescription>
                      {selectedRouteData ? `Viewing ${selectedRouteData.id} - ${selectedRouteData.driverName}` : 'Select a route to view details'}
                    </CardDescription>
                  </div>
                  {selectedRouteData && (
                    <Badge className={getStatusColor(selectedRouteData.status)}>
                      {selectedRouteData.status}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <GoogleMap 
                  markers={mapMarkers}
                  height="h-96"
                  onMarkerClick={(marker) => toast.info(`Selected: ${marker.title}`)}
                />
                {selectedRouteData && (
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium">{selectedRouteData.totalDistance.toFixed(1)} km</p>
                      <p className="text-gray-500">Total Distance</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{selectedRouteData.estimatedDuration}m</p>
                      <p className="text-gray-500">Est. Duration</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{selectedRouteData.optimizationScore}%</p>
                      <p className="text-gray-500">Efficiency Score</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Route List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Route Management</CardTitle>
                <CardDescription>Manage and optimize delivery routes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {routes.map((route) => (
                    <div 
                      key={route.id} 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedRoute === route.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedRoute(route.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{route.id}</h3>
                        <Badge className={getStatusColor(route.status)}>
                          {route.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{route.driverName}</p>
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex justify-between">
                          <span>Distance:</span>
                          <span>{route.totalDistance.toFixed(1)} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>{route.estimatedDuration}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stops:</span>
                          <span>{route.points.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Score:</span>
                          <span className="font-medium">{route.optimizationScore}%</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {route.status === 'optimized' && (
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); handleAssignRoute(route.id); }}>
                            <Play className="mr-1 h-3 w-3" />
                            Assign
                          </Button>
                        )}
                        {route.status !== 'draft' && (
                          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleResetRoute(route.id); }}>
                            <RotateCcw className="mr-1 h-3 w-3" />
                            Reset
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Route Details */}
        {selectedRouteData && (
          <Card>
            <CardHeader>
              <CardTitle>Route Details - {selectedRouteData.id}</CardTitle>
              <CardDescription>Detailed breakdown of stops and timing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedRouteData.points.map((point, index) => (
                  <div key={point.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {getTypeIcon(point.type)}
                        <span className="font-medium">{point.address}</span>
                        <Badge className={getPriorityColor(point.priority)}>
                          {point.priority}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {point.type.charAt(0).toUpperCase() + point.type.slice(1)}
                        {point.timeWindow && ` • Window: ${point.timeWindow}`}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {point.estimatedTime && `${point.estimatedTime}m`}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default RouteOptimization;
