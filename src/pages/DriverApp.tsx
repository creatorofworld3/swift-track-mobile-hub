import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Phone, 
  Camera, 
  CheckCircle2, 
  AlertCircle,
  Package2,
  User,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { toast } from 'sonner';

interface Delivery {
  id: string;
  customer: string;
  address: string;
  phone: string;
  packages: number;
  notes?: string;
  estimatedTime: string;
  status: 'pending' | 'in-progress' | 'arrived' | 'delivered';
  priority: 'low' | 'medium' | 'high';
}

const DriverApp = () => {
  const [currentStatus, setCurrentStatus] = useState<'available' | 'on-route' | 'break'>('available');
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    {
      id: 'DEL-001',
      customer: 'John Smith',
      address: '123 Main St, Downtown',
      phone: '+1 (555) 123-4567',
      packages: 2,
      notes: 'Ring doorbell twice. Customer prefers front door delivery.',
      estimatedTime: '2:30 PM',
      status: 'in-progress',
      priority: 'high'
    },
    {
      id: 'DEL-002',
      customer: 'Sarah Johnson',
      address: '456 Oak Ave, Suburb',
      phone: '+1 (555) 987-6543',
      packages: 1,
      estimatedTime: '3:15 PM',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: 'DEL-003',
      customer: 'Mike Wilson',
      address: '789 Pine Rd, Uptown',
      phone: '+1 (555) 456-7890',
      packages: 3,
      notes: 'Apartment 4B. Use buzzer code 1234.',
      estimatedTime: '4:00 PM',
      status: 'pending',
      priority: 'low'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'arrived': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
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

  const handleStartRoute = () => {
    setCurrentStatus('on-route');
    toast.success('Route started! Navigation active.');
  };

  const handleTakeBreak = () => {
    setCurrentStatus('break');
    toast.info('Break mode activated.');
  };

  const handleBackToWork = () => {
    setCurrentStatus('on-route');
    toast.success('Back to work! Ready for deliveries.');
  };

  const handleEndShift = () => {
    setCurrentStatus('available');
    toast.success('Shift ended. Have a great day!');
  };

  const handleNavigate = (address: string) => {
    toast.success(`Opening navigation to ${address}`);
  };

  const handleCallCustomer = (customer: string, phone: string) => {
    toast.success(`Calling ${customer} at ${phone}`);
  };

  const handleTakePhoto = (deliveryId: string) => {
    toast.success(`Camera opened for delivery ${deliveryId}`);
  };

  const handleMarkDelivered = (deliveryId: string) => {
    setDeliveries(prev => 
      prev.map(delivery => 
        delivery.id === deliveryId 
          ? { ...delivery, status: 'delivered' as const }
          : delivery
      )
    );
    toast.success(`Delivery ${deliveryId} marked as delivered!`);
  };

  const handleMarkArrived = (deliveryId: string) => {
    setDeliveries(prev => 
      prev.map(delivery => 
        delivery.id === deliveryId 
          ? { ...delivery, status: 'arrived' as const }
          : delivery
      )
    );
    toast.success(`Marked as arrived at ${deliveryId}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Driver App</h1>
            <p className="text-gray-600">Manage your deliveries and routes</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={
              currentStatus === 'on-route' ? 'bg-green-100 text-green-800' :
              currentStatus === 'break' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }>
              {currentStatus}
            </Badge>
          </div>
        </div>

        {/* Driver Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Driver Controls</CardTitle>
            <CardDescription>Manage your shift and route status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {currentStatus === 'available' && (
                <Button onClick={handleStartRoute} className="flex-1 sm:flex-none">
                  <Play className="mr-2 h-4 w-4" />
                  Start Route
                </Button>
              )}
              {currentStatus === 'on-route' && (
                <>
                  <Button onClick={handleTakeBreak} variant="outline" className="flex-1 sm:flex-none">
                    <Pause className="mr-2 h-4 w-4" />
                    Take Break
                  </Button>
                  <Button onClick={handleEndShift} variant="destructive" className="flex-1 sm:flex-none">
                    <Square className="mr-2 h-4 w-4" />
                    End Shift
                  </Button>
                </>
              )}
              {currentStatus === 'break' && (
                <Button onClick={handleBackToWork} className="flex-1 sm:flex-none">
                  <Play className="mr-2 h-4 w-4" />
                  Back to Work
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deliveries Today</CardTitle>
              <Package2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 remaining</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Distance Covered</CardTitle>
              <Navigation className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47.2 mi</div>
              <p className="text-xs text-muted-foreground">Efficient routing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time on Route</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5h 23m</div>
              <p className="text-xs text-muted-foreground">Started at 9:00 AM</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100%</div>
              <p className="text-xs text-muted-foreground">Perfect delivery rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Queue</CardTitle>
            <CardDescription>Your assigned deliveries for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveries.map((delivery, index) => (
                <div key={delivery.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{delivery.id}</h3>
                        <p className="text-sm text-gray-500">{delivery.customer}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getPriorityColor(delivery.priority)}>
                        {delivery.priority}
                      </Badge>
                      <Badge className={getStatusColor(delivery.status)}>
                        {delivery.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{delivery.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{delivery.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package2 className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{delivery.packages} package(s)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">ETA: {delivery.estimatedTime}</span>
                      </div>
                    </div>

                    {delivery.notes && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800">Delivery Notes</p>
                            <p className="text-sm text-yellow-700">{delivery.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleNavigate(delivery.address)}
                      className="flex-1 sm:flex-none"
                    >
                      <Navigation className="mr-2 h-4 w-4" />
                      Navigate
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCallCustomer(delivery.customer, delivery.phone)}
                      className="flex-1 sm:flex-none"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleTakePhoto(delivery.id)}
                      className="flex-1 sm:flex-none"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Photo
                    </Button>
                    {delivery.status === 'pending' && (
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => handleMarkArrived(delivery.id)}
                        className="flex-1 sm:flex-none"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Mark Arrived
                      </Button>
                    )}
                    {(delivery.status === 'in-progress' || delivery.status === 'arrived') && (
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handleMarkDelivered(delivery.id)}
                        className="flex-1 sm:flex-none"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark Delivered
                      </Button>
                    )}
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

export default DriverApp;
