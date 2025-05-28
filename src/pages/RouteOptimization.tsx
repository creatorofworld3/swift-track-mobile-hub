
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Route, MapPin, Clock, Zap, TrendingUp, Navigation } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface RouteData {
  id: string;
  driver: string;
  stops: number;
  distance: number;
  estimatedTime: number;
  status: 'optimized' | 'in-progress' | 'completed';
  efficiency: number;
}

const RouteOptimization = () => {
  const [routes] = useState<RouteData[]>([
    {
      id: 'RT-001',
      driver: 'Mike Wilson',
      stops: 8,
      distance: 24.5,
      estimatedTime: 180,
      status: 'in-progress',
      efficiency: 94
    },
    {
      id: 'RT-002',
      driver: 'Lisa Chen',
      stops: 6,
      distance: 18.2,
      estimatedTime: 135,
      status: 'completed',
      efficiency: 98
    },
    {
      id: 'RT-003',
      driver: 'Tom Rodriguez',
      stops: 10,
      distance: 32.1,
      estimatedTime: 240,
      status: 'optimized',
      efficiency: 91
    },
    {
      id: 'RT-004',
      driver: 'Sarah Kim',
      stops: 5,
      distance: 15.8,
      estimatedTime: 120,
      status: 'optimized',
      efficiency: 96
    }
  ]);

  const [optimizationMetrics] = useState({
    totalDistance: 90.6,
    totalTime: 675,
    fuelSaved: 12.3,
    co2Reduced: 28.7,
    deliveriesOptimized: 29
  });

  const efficiencyData = [
    { name: 'Mon', efficiency: 89 },
    { name: 'Tue', efficiency: 92 },
    { name: 'Wed', efficiency: 94 },
    { name: 'Thu', efficiency: 96 },
    { name: 'Fri', efficiency: 93 },
    { name: 'Sat', efficiency: 95 },
    { name: 'Sun', efficiency: 91 },
  ];

  const distanceData = [
    { name: 'RT-001', original: 32, optimized: 24.5 },
    { name: 'RT-002', original: 25, optimized: 18.2 },
    { name: 'RT-003', original: 41, optimized: 32.1 },
    { name: 'RT-004', original: 22, optimized: 15.8 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'optimized': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return 'text-green-600';
    if (efficiency >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const optimizeAllRoutes = () => {
    // Simulate route optimization
    console.log('Optimizing all routes...');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Route Optimization</h1>
            <p className="text-gray-600">Optimize delivery routes for maximum efficiency</p>
          </div>
          <Button onClick={optimizeAllRoutes}>
            <Zap className="mr-2 h-4 w-4" />
            Optimize All Routes
          </Button>
        </div>

        {/* Optimization Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
              <Route className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{optimizationMetrics.totalDistance} mi</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">-15%</span> from original
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor(optimizationMetrics.totalTime / 60)}h {optimizationMetrics.totalTime % 60}m</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">-22%</span> time saved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fuel Saved</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{optimizationMetrics.fuelSaved} gal</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">$42.50</span> cost savings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CO₂ Reduced</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{optimizationMetrics.co2Reduced} lbs</div>
              <p className="text-xs text-muted-foreground">
                Environmental impact
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deliveries</CardTitle>
              <Navigation className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{optimizationMetrics.deliveriesOptimized}</div>
              <p className="text-xs text-muted-foreground">
                Optimized today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Route Efficiency Trends</CardTitle>
              <CardDescription>Weekly optimization performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={efficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distance Optimization</CardTitle>
              <CardDescription>Original vs optimized route distances</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="original" fill="#ef4444" />
                    <Bar dataKey="optimized" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Routes List */}
        <Card>
          <CardHeader>
            <CardTitle>Current Routes</CardTitle>
            <CardDescription>Active and optimized delivery routes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routes.map((route) => (
                <div key={route.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Route className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium">{route.id}</h3>
                        <Badge className={getStatusColor(route.status)}>
                          {route.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{route.driver}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-8 text-sm">
                    <div className="text-center">
                      <div className="font-medium">{route.stops}</div>
                      <div className="text-gray-500">Stops</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{route.distance} mi</div>
                      <div className="text-gray-500">Distance</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{Math.floor(route.estimatedTime / 60)}h {route.estimatedTime % 60}m</div>
                      <div className="text-gray-500">Est. Time</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-medium ${getEfficiencyColor(route.efficiency)}`}>
                        {route.efficiency}%
                      </div>
                      <div className="text-gray-500">Efficiency</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Route
                    </Button>
                    <Button variant="outline" size="sm">
                      Re-optimize
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RouteOptimization;
