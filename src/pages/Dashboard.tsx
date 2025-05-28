
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Users,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data for charts
  const deliveryData = [
    { name: 'Mon', completed: 24, pending: 8 },
    { name: 'Tue', completed: 32, pending: 12 },
    { name: 'Wed', completed: 28, pending: 6 },
    { name: 'Thu', completed: 35, pending: 15 },
    { name: 'Fri', completed: 42, pending: 18 },
    { name: 'Sat', completed: 38, pending: 9 },
    { name: 'Sun', completed: 29, pending: 7 },
  ];

  const performanceData = [
    { time: '9AM', efficiency: 85 },
    { time: '11AM', efficiency: 92 },
    { time: '1PM', efficiency: 88 },
    { time: '3PM', efficiency: 95 },
    { time: '5PM', efficiency: 82 },
  ];

  const recentDeliveries = [
    { id: 'DEL-001', customer: 'John Smith', status: 'delivered', time: '2 mins ago' },
    { id: 'DEL-002', customer: 'Sarah Johnson', status: 'in-transit', time: '5 mins ago' },
    { id: 'DEL-003', customer: 'Mike Wilson', status: 'pending', time: '10 mins ago' },
    { id: 'DEL-004', customer: 'Emma Davis', status: 'delivered', time: '15 mins ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="h-3 w-3" />;
      case 'in-transit': return <Truck className="h-3 w-3" />;
      case 'pending': return <Clock className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">8</span> on route
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2.1%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Delivery Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28m</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">-3m</span> faster than avg
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Delivery Overview</CardTitle>
              <CardDescription>Completed vs Pending deliveries this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deliveryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="completed" fill="#3b82f6" />
                    <Bar dataKey="pending" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Efficiency</CardTitle>
              <CardDescription>Performance throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Deliveries</CardTitle>
            <CardDescription>Latest delivery updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDeliveries.map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getStatusIcon(delivery.status)}
                    </div>
                    <div>
                      <p className="font-medium">{delivery.customer}</p>
                      <p className="text-sm text-gray-500">ID: {delivery.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(delivery.status)}>
                      {delivery.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{delivery.time}</p>
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

export default Dashboard;
