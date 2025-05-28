
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Package, 
  Users,
  Download,
  Calendar
} from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock analytics data
  const performanceData = [
    { name: 'Jan', deliveries: 450, revenue: 18500, efficiency: 92 },
    { name: 'Feb', deliveries: 520, revenue: 21300, efficiency: 94 },
    { name: 'Mar', deliveries: 480, revenue: 19800, efficiency: 89 },
    { name: 'Apr', deliveries: 610, revenue: 25200, efficiency: 96 },
    { name: 'May', deliveries: 580, revenue: 23900, efficiency: 93 },
    { name: 'Jun', deliveries: 720, revenue: 29500, efficiency: 97 },
  ];

  const deliveryStatusData = [
    { name: 'Delivered', value: 789, color: '#10b981' },
    { name: 'In Transit', value: 156, color: '#3b82f6' },
    { name: 'Pending', value: 89, color: '#f59e0b' },
    { name: 'Failed', value: 23, color: '#ef4444' },
  ];

  const driverPerformanceData = [
    { name: 'Mike Wilson', deliveries: 156, rating: 4.9, efficiency: 96 },
    { name: 'Lisa Chen', deliveries: 142, rating: 4.8, efficiency: 94 },
    { name: 'Tom Rodriguez', deliveries: 138, rating: 4.7, efficiency: 92 },
    { name: 'Sarah Kim', deliveries: 134, rating: 4.9, efficiency: 95 },
    { name: 'John Davis', deliveries: 128, rating: 4.6, efficiency: 89 },
  ];

  const hourlyDeliveryData = [
    { hour: '6AM', deliveries: 12 },
    { hour: '8AM', deliveries: 28 },
    { hour: '10AM', deliveries: 45 },
    { hour: '12PM', deliveries: 67 },
    { hour: '2PM', deliveries: 89 },
    { hour: '4PM', deliveries: 76 },
    { hour: '6PM', deliveries: 54 },
    { hour: '8PM', deliveries: 32 },
  ];

  const kpiData = [
    {
      title: 'Total Revenue',
      value: '$142,500',
      change: '+12.5%',
      trending: 'up',
      icon: DollarSign
    },
    {
      title: 'Total Deliveries',
      value: '3,247',
      change: '+8.2%',
      trending: 'up',
      icon: Package
    },
    {
      title: 'Avg. Delivery Time',
      value: '28 min',
      change: '-5.1%',
      trending: 'down',
      icon: Clock
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8/5',
      change: '+0.3',
      trending: 'up',
      icon: Users
    }
  ];

  const exportReport = () => {
    console.log('Exporting analytics report...');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive performance insights and metrics</p>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1">
              <Button 
                variant={timeRange === '7d' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeRange('7d')}
              >
                7 Days
              </Button>
              <Button 
                variant={timeRange === '30d' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeRange('30d')}
              >
                30 Days
              </Button>
              <Button 
                variant={timeRange === '90d' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeRange('90d')}
              >
                90 Days
              </Button>
            </div>
            <Button onClick={exportReport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {kpi.trending === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
                  )}
                  <span className="text-green-600">{kpi.change}</span> from last period
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Monthly trends for key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="deliveries" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="efficiency" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Status Distribution</CardTitle>
              <CardDescription>Current status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deliveryStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {deliveryStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Driver Performance and Hourly Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Drivers</CardTitle>
              <CardDescription>Performance leaderboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {driverPerformanceData.map((driver, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{driver.name}</p>
                        <p className="text-sm text-gray-500">{driver.deliveries} deliveries</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{driver.efficiency}%</p>
                      <p className="text-sm text-gray-500">⭐ {driver.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hourly Delivery Volume</CardTitle>
              <CardDescription>Peak delivery hours</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyDeliveryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="deliveries" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
