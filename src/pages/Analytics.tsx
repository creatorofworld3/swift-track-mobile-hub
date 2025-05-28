
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Clock, 
  MapPin, 
  Users,
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('deliveries');

  // Mock data for charts
  const deliveryData = [
    { name: 'Mon', deliveries: 45, completed: 42, failed: 3 },
    { name: 'Tue', deliveries: 52, completed: 48, failed: 4 },
    { name: 'Wed', deliveries: 38, completed: 36, failed: 2 },
    { name: 'Thu', deliveries: 61, completed: 58, failed: 3 },
    { name: 'Fri', deliveries: 55, completed: 51, failed: 4 },
    { name: 'Sat', deliveries: 67, completed: 63, failed: 4 },
    { name: 'Sun', deliveries: 43, completed: 41, failed: 2 }
  ];

  const performanceData = [
    { time: '6 AM', avgTime: 25, onTime: 95 },
    { time: '9 AM', avgTime: 32, onTime: 88 },
    { time: '12 PM', avgTime: 28, onTime: 92 },
    { time: '3 PM', avgTime: 35, onTime: 85 },
    { time: '6 PM', avgTime: 30, onTime: 90 },
    { time: '9 PM', avgTime: 22, onTime: 97 }
  ];

  const regionData = [
    { name: 'Downtown', value: 35, color: '#0088FE' },
    { name: 'Suburbs', value: 28, color: '#00C49F' },
    { name: 'Industrial', value: 20, color: '#FFBB28' },
    { name: 'Residential', value: 17, color: '#FF8042' }
  ];

  const driverPerformance = [
    { name: 'Mike Wilson', deliveries: 156, rating: 4.9, onTime: 96 },
    { name: 'Lisa Chen', deliveries: 142, rating: 4.8, onTime: 94 },
    { name: 'Tom Rodriguez', deliveries: 138, rating: 4.7, onTime: 92 },
    { name: 'Sarah Kim', deliveries: 134, rating: 4.8, onTime: 93 }
  ];

  const handleExportData = () => {
    toast.success('Exporting analytics data...');
  };

  const handleFilterChange = (filter: string) => {
    setSelectedPeriod(filter);
    toast.info(`Analytics period changed to ${filter}`);
  };

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric);
    toast.info(`Viewing ${metric} analytics`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-600">Comprehensive insights into your delivery operations</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="24hours">Last 24 Hours</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
              </select>
              <Button variant="outline" onClick={() => toast.info('Advanced filters coming soon...')}>
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
            <Button onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                +12% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                +2.1% improvement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28.5m</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                -3.2m faster
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8/5</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                +0.2 increase
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Delivery Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Trends</CardTitle>
              <CardDescription>Daily delivery performance over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deliveryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                  <Bar dataKey="failed" fill="#ef4444" name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Average delivery time and on-time percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="avgTime" stroke="#3b82f6" name="Avg Time (min)" />
                  <Line yAxisId="right" type="monotone" dataKey="onTime" stroke="#10b981" name="On-Time %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Regional Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Regional Distribution</CardTitle>
              <CardDescription>Delivery volume by region</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Driver Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Driver performance rankings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {driverPerformance.map((driver, index) => (
                  <div key={driver.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{driver.name}</p>
                        <p className="text-sm text-gray-600">{driver.deliveries} deliveries</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">⭐ {driver.rating}</p>
                      <p className="text-sm text-gray-600">{driver.onTime}% on-time</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Route Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Route Distance</span>
                  <span className="font-bold">47.2 km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Fuel Efficiency</span>
                  <span className="font-bold">12.4 L/100km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Route Optimization Score</span>
                  <Badge className="bg-green-100 text-green-800">92%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Rating</span>
                  <span className="font-bold">4.8/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Response Rate</span>
                  <span className="font-bold">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Complaints</span>
                  <Badge className="bg-yellow-100 text-yellow-800">3 this week</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cost per Delivery</span>
                  <span className="font-bold">$8.50</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Monthly Savings</span>
                  <span className="font-bold text-green-600">$2,340</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">ROI</span>
                  <Badge className="bg-green-100 text-green-800">+15.2%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
