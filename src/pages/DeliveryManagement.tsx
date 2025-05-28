
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Plus, Search, Filter, MapPin, Clock, User, Package2 } from 'lucide-react';
import { toast } from 'sonner';

interface Delivery {
  id: string;
  customer: string;
  address: string;
  phone: string;
  status: 'pending' | 'assigned' | 'in-transit' | 'delivered' | 'failed';
  driver?: string;
  estimatedTime: string;
  priority: 'low' | 'medium' | 'high';
  packages: number;
  value: number;
}

const DeliveryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [deliveries] = useState<Delivery[]>([
    {
      id: 'DEL-001',
      customer: 'John Smith',
      address: '123 Main St, Downtown',
      phone: '+1 (555) 123-4567',
      status: 'pending',
      estimatedTime: '2:30 PM',
      priority: 'high',
      packages: 2,
      value: 125.50
    },
    {
      id: 'DEL-002',
      customer: 'Sarah Johnson',
      address: '456 Oak Ave, Suburb',
      phone: '+1 (555) 987-6543',
      status: 'in-transit',
      driver: 'Mike Wilson',
      estimatedTime: '3:15 PM',
      priority: 'medium',
      packages: 1,
      value: 89.99
    },
    {
      id: 'DEL-003',
      customer: 'Emma Davis',
      address: '789 Pine Rd, Uptown',
      phone: '+1 (555) 456-7890',
      status: 'delivered',
      driver: 'Lisa Chen',
      estimatedTime: '1:45 PM',
      priority: 'low',
      packages: 3,
      value: 245.00
    },
    {
      id: 'DEL-004',
      customer: 'Robert Brown',
      address: '321 Elm St, Midtown',
      phone: '+1 (555) 321-0987',
      status: 'assigned',
      driver: 'Tom Rodriguez',
      estimatedTime: '4:00 PM',
      priority: 'medium',
      packages: 1,
      value: 67.25
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
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

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || delivery.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateDelivery = () => {
    toast.success('New delivery created successfully!');
  };

  const handleAssignDriver = (deliveryId: string) => {
    toast.success(`Driver assigned to delivery ${deliveryId}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Delivery Management</h1>
            <p className="text-gray-600">Manage and track all deliveries</p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Delivery
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Create New Delivery</SheetTitle>
                <SheetDescription>Add a new delivery to the system</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Customer Name</label>
                  <Input placeholder="Enter customer name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Delivery Address</label>
                  <Input placeholder="Enter delivery address" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Packages</label>
                  <Input type="number" placeholder="1" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order Value</label>
                  <Input type="number" step="0.01" placeholder="0.00" />
                </div>
                <Button onClick={handleCreateDelivery} className="w-full">
                  Create Delivery
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search deliveries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus('all')}
                >
                  All
                </Button>
                <Button
                  variant={selectedStatus === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus('pending')}
                >
                  Pending
                </Button>
                <Button
                  variant={selectedStatus === 'in-transit' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus('in-transit')}
                >
                  In Transit
                </Button>
                <Button
                  variant={selectedStatus === 'delivered' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus('delivered')}
                >
                  Delivered
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deliveries Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDeliveries.map((delivery) => (
            <Card key={delivery.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{delivery.id}</CardTitle>
                  <Badge className={getPriorityColor(delivery.priority)}>
                    {delivery.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(delivery.status)}>
                    {delivery.status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    ${delivery.value.toFixed(2)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{delivery.customer}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{delivery.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">ETA: {delivery.estimatedTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{delivery.packages} package(s)</span>
                  </div>
                  {delivery.driver && (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Driver: {delivery.driver}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {delivery.status === 'pending' && (
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleAssignDriver(delivery.id)}
                    >
                      Assign Driver
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDeliveries.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default DeliveryManagement;
