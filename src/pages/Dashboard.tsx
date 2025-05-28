
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import GoogleMap from '@/components/GoogleMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Users,
  BarChart3,
  Navigation
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { websocketService } from '@/services/websocket';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDeliveries: 245,
    activeDrivers: 12,
    completedToday: 89,
    pendingDeliveries: 156,
    averageDeliveryTime: 28,
    onTimeRate: 94.5
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'delivery', message: 'DEL-001 completed by Mike Wilson', time: '2 min ago', status: 'success' },
    { id: 2, type: 'driver', message: 'Lisa Chen started new route', time: '5 min ago', status: 'info' },
    { id: 3, type: 'alert', message: 'Delivery DEL-045 delayed', time: '8 min ago', status: 'warning' },
    { id: 4, type: 'delivery', message: 'DEL-032 picked up', time: '12 min ago', status: 'info' }
  ]);

  useEffect(() => {
    // Subscribe to real-time updates
    const handleDeliveryUpdate = (data: any) => {
      setRecentActivity(prev => [
        {
          id: Date.now(),
          type: 'delivery',
          message: `${data.deliveryId} status: ${data.status}`,
          time: 'Just now',
          status: data.status === 'delivered' ? 'success' : 'info'
        },
        ...prev.slice(0, 9)
      ]);

      // Update stats
      if (data.status === 'delivered') {
        setStats(prev => ({
          ...prev,
          completedToday: prev.completedToday + 1,
          pendingDeliveries: prev.pendingDeliveries - 1
        }));
      }
    };

    websocketService.subscribe('delivery_status', handleDeliveryUpdate);

    return () => {
      websocketService.unsubscribe('delivery_status', handleDeliveryUpdate);
    };
  }, []);

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${greeting}, ${user?.name}!`;
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-delivery':
        toast.success('Redirecting to create new delivery...');
        break;
      case 'assign-driver':
        toast.success('Opening driver assignment...');
        break;
      case 'view-reports':
        toast.success('Loading analytics reports...');
        break;
      case 'optimize-routes':
        toast.success('Starting route optimization...');
        break;
      default:
        toast.info(`Action: ${action}`);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'delivery': return <Package className="h-4 w-4" />;
      case 'driver': return <Truck className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{getWelcomeMessage()}</h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your delivery operations today.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleQuickAction('new-delivery')}>
              <Package className="mr-2 h-4 w-4" />
              New Delivery
            </Button>
            <Button variant="outline" onClick={() => handleQuickAction('optimize-routes')}>
              <Navigation className="mr-2 h-4 w-4" />
              Optimize Routes
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeDrivers}</div>
              <p className="text-xs text-muted-foreground">
                Currently on duty
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedToday}</div>
              <p className="text-xs text-muted-foreground">
                +8 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingDeliveries}</div>
              <p className="text-xs text-muted-foreground">
                In queue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageDeliveryTime}m</div>
              <p className="text-xs text-muted-foreground">
                -3m improvement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.onTimeRate}%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Live Tracking Map</CardTitle>
                    <CardDescription>Real-time driver and delivery locations</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <GoogleMap height="h-80" />
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your fleet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`p-1 rounded-full ${getActivityColor(activity.status)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => toast.info('Loading full activity log...')}>
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to help you manage your operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => handleQuickAction('assign-driver')}
              >
                <Users className="h-6 w-6" />
                <span>Assign Driver</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => handleQuickAction('view-reports')}
              >
                <BarChart3 className="h-6 w-6" />
                <span>View Reports</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => handleQuickAction('optimize-routes')}
              >
                <Navigation className="h-6 w-6" />
                <span>Optimize Routes</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => handleQuickAction('emergency')}
              >
                <AlertTriangle className="h-6 w-6" />
                <span>Emergency</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
