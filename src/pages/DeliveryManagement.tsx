
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  User, 
  Phone,
  Edit,
  Trash2,
  Eye,
  Truck
} from 'lucide-react';
import { toast } from 'sonner';
import { websocketService } from '@/services/websocket';

interface Delivery {
  id: string;
  customer: string;
  address: string;
  phone: string;
  packages: number;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
  driverId?: string;
  driverName?: string;
  estimatedDelivery: string;
  createdAt: string;
  notes?: string;
}

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    {
      id: 'DEL-001',
      customer: 'John Smith',
      address: '123 Main St, Downtown',
      phone: '+1 (555) 123-4567',
      packages: 2,
      priority: 'high',
      status: 'in_transit',
      driverId: 'DRV-001',
      driverName: 'Mike Wilson',
      estimatedDelivery: '2:30 PM',
      createdAt: '2024-01-15 09:00',
      notes: 'Ring doorbell twice'
    },
    {
      id: 'DEL-002',
      customer: 'Sarah Johnson',
      address: '456 Oak Ave, Suburb',
      phone: '+1 (555) 987-6543',
      packages: 1,
      priority: 'medium',
      status: 'assigned',
      driverId: 'DRV-002',
      driverName: 'Lisa Chen',
      estimatedDelivery: '3:15 PM',
      createdAt: '2024-01-15 10:30'
    },
    {
      id: 'DEL-003',
      customer: 'Mike Wilson',
      address: '789 Pine Rd, Uptown',
      phone: '+1 (555) 456-7890',
      packages: 3,
      priority: 'low',
      status: 'pending',
      estimatedDelivery: '4:00 PM',
      createdAt: '2024-01-15 11:15',
      notes: 'Apartment 4B, buzzer code 1234'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    // Subscribe to delivery status updates
    const handleDeliveryUpdate = (data: any) => {
      setDeliveries(prev => 
        prev.map(delivery => 
          delivery.id === data.deliveryId 
            ? { ...delivery, status: data.status }
            : delivery
        )
      );
    };

    websocketService.subscribe('delivery_status', handleDeliveryUpdate);

    return () => {
      websocketService.unsubscribe('delivery_status', handleDeliveryUpdate);
    };
  }, []);

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || delivery.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
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

  const handleCreateDelivery = () => {
    setShowCreateForm(true);
    toast.success('Opening delivery creation form...');
  };

  const handleEditDelivery = (deliveryId: string) => {
    toast.success(`Opening edit form for ${deliveryId}`);
  };

  const handleDeleteDelivery = (deliveryId: string) => {
    setDeliveries(prev => prev.filter(d => d.id !== deliveryId));
    toast.success(`Delivery ${deliveryId} deleted successfully`);
  };

  const handleViewDetails = (deliveryId: string) => {
    toast.info(`Viewing details for ${deliveryId}`);
  };

  const handleAssignDriver = (deliveryId: string) => {
    toast.success(`Opening driver assignment for ${deliveryId}`);
  };

  const handleTrackDelivery = (deliveryId: string) => {
    toast.success(`Opening tracking for ${deliveryId}`);
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'picked_up', label: 'Picked Up' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'failed', label: 'Failed' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Delivery Management</h1>
            <p className="text-gray-600">Create, assign, and track all your deliveries</p>
          </div>
          <Button onClick={handleCreateDelivery}>
            <Plus className="mr-2 h-4 w-4" />
            New Delivery
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Total</p>
                  <p className="text-2xl font-bold">{deliveries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold">{deliveries.filter(d => d.status === 'pending').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">In Transit</p>
                  <p className="text-2xl font-bold">{deliveries.filter(d => d.status === 'in_transit').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Delivered</p>
                  <p className="text-2xl font-bold">{deliveries.filter(d => d.status === 'delivered').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Failed</p>
                  <p className="text-2xl font-bold">{deliveries.filter(d => d.status === 'failed').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search deliveries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Button variant="outline" onClick={() => toast.info('Advanced filters coming soon...')}>
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deliveries List */}
        <div className="space-y-4">
          {filteredDeliveries.map((delivery) => (
            <Card key={delivery.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{delivery.id}</h3>
                        <Badge className={getStatusColor(delivery.status)}>
                          {delivery.status}
                        </Badge>
                        <Badge className={getPriorityColor(delivery.priority)}>
                          {delivery.priority}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">{delivery.customer}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{delivery.phone}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{delivery.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{delivery.packages} package(s)</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">ETA: {delivery.estimatedDelivery}</span>
                        </div>
                        {delivery.driverName && (
                          <div className="flex items-center space-x-2">
                            <Truck className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{delivery.driverName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {delivery.notes && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Notes:</strong> {delivery.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 lg:flex-col lg:min-w-[200px]">
                    <Button size="sm" onClick={() => handleViewDetails(delivery.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEditDelivery(delivery.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    {delivery.status === 'pending' && (
                      <Button size="sm" variant="outline" onClick={() => handleAssignDriver(delivery.id)}>
                        <Truck className="mr-2 h-4 w-4" />
                        Assign
                      </Button>
                    )}
                    {(delivery.status === 'assigned' || delivery.status === 'in_transit') && (
                      <Button size="sm" variant="outline" onClick={() => handleTrackDelivery(delivery.id)}>
                        <MapPin className="mr-2 h-4 w-4" />
                        Track
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteDelivery(delivery.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDeliveries.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first delivery'
                }
              </p>
              <Button onClick={handleCreateDelivery}>
                <Plus className="mr-2 h-4 w-4" />
                Create Delivery
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default DeliveryManagement;
