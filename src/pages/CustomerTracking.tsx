
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Clock, 
  Package2, 
  Truck, 
  CheckCircle2, 
  Phone,
  MessageCircle,
  Navigation
} from 'lucide-react';

interface TrackingData {
  id: string;
  status: 'pending' | 'picked-up' | 'in-transit' | 'out-for-delivery' | 'delivered';
  estimatedDelivery: string;
  driver: {
    name: string;
    phone: string;
    rating: number;
  };
  timeline: {
    status: string;
    time: string;
    description: string;
    completed: boolean;
  }[];
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
}

const CustomerTracking = () => {
  const { trackingId } = useParams();
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTrackingData({
        id: trackingId || 'DEL-001',
        status: 'in-transit',
        estimatedDelivery: '3:15 PM - 3:45 PM',
        driver: {
          name: 'Mike Wilson',
          phone: '+1 (555) 123-4567',
          rating: 4.9
        },
        timeline: [
          {
            status: 'Order Confirmed',
            time: '10:30 AM',
            description: 'Your order has been confirmed and is being prepared',
            completed: true
          },
          {
            status: 'Picked Up',
            time: '11:45 AM',
            description: 'Package picked up from warehouse',
            completed: true
          },
          {
            status: 'In Transit',
            time: '12:30 PM',
            description: 'Package is on the way to your location',
            completed: true
          },
          {
            status: 'Out for Delivery',
            time: '2:45 PM',
            description: 'Driver is approaching your delivery area',
            completed: false
          },
          {
            status: 'Delivered',
            time: 'Pending',
            description: 'Package delivered to your address',
            completed: false
          }
        ],
        currentLocation: {
          lat: 40.7128,
          lng: -74.0060,
          address: '5th Avenue, approaching destination'
        }
      });
      setIsLoading(false);
    }, 1000);
  }, [trackingId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'picked-up': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Package2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tracking ID Not Found</h3>
            <p className="text-gray-600">Please check your tracking ID and try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Truck className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Cigo.io Tracking</h1>
          </div>
          <p className="text-gray-600">Track your delivery in real-time</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Delivery {trackingData.id}</CardTitle>
                  <CardDescription>Estimated delivery: {trackingData.estimatedDelivery}</CardDescription>
                </div>
                <Badge className={getStatusColor(trackingData.status)}>
                  {trackingData.status.replace('-', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {trackingData.currentLocation && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Current location: {trackingData.currentLocation.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Live Tracking Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300">
                <div className="text-center">
                  <Navigation className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-blue-900 mb-2">Live Map View</h3>
                  <p className="text-blue-700">Your delivery's real-time location</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Timeline</CardTitle>
                <CardDescription>Track your package's journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingData.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-4 h-4 rounded-full mt-1 ${
                        event.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${
                            event.completed ? 'text-green-800' : 'text-gray-500'
                          }`}>
                            {event.status}
                          </h4>
                          <span className="text-sm text-gray-500">{event.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Driver Info */}
            <Card>
              <CardHeader>
                <CardTitle>Your Driver</CardTitle>
                <CardDescription>Driver information and contact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{trackingData.driver.name}</h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-500">⭐ {trackingData.driver.rating}</span>
                      <span className="text-sm text-gray-500">Professional Driver</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Driver
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Delivery Instructions</h4>
                  <p className="text-sm text-blue-800">
                    Please ensure someone is available to receive the package. 
                    If no one is home, we'll attempt redelivery or leave it at a safe location.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-center">
                    <MessageCircle className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Contact Support</div>
                    <div className="text-sm text-gray-500">Get help with your delivery</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-center">
                    <Clock className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Reschedule</div>
                    <div className="text-sm text-gray-500">Change delivery time</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-center">
                    <MapPin className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Change Address</div>
                    <div className="text-sm text-gray-500">Update delivery location</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerTracking;
