
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Truck, MapPin, Users, BarChart3 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const demoUsers = [
    { email: 'admin@cigo.io', role: 'Admin', description: 'Full system access' },
    { email: 'dispatcher@cigo.io', role: 'Dispatcher', description: 'Route management' },
    { email: 'driver@cigo.io', role: 'Driver', description: 'Delivery execution' },
    { email: 'customer@cigo.io', role: 'Customer', description: 'Track deliveries' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Truck className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Cigo.io</h1>
          </div>
          <p className="text-gray-600">Delivery Tracking & Management</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Demo Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setEmail(user.email);
                  setPassword('demo123');
                }}
              >
                <div>
                  <div className="font-medium text-sm">{user.role}</div>
                  <div className="text-xs text-gray-500">{user.description}</div>
                </div>
                <div className="text-xs text-blue-600">{user.email}</div>
              </div>
            ))}
            <div className="text-xs text-gray-500 mt-2">Password: demo123</div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-4 gap-4 text-center text-xs text-gray-500">
          <div className="flex flex-col items-center space-y-1">
            <MapPin className="h-4 w-4" />
            <span>Real-time Tracking</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Truck className="h-4 w-4" />
            <span>Route Optimization</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Users className="h-4 w-4" />
            <span>Multi-role Access</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
