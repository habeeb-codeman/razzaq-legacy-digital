import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, CheckCircle, Truck, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import { format } from 'date-fns';

interface Order {
  id: string;
  order_number: string;
  status: 'picking' | 'ready' | 'dispatched' | 'completed';
  created_at: string;
  quotation: {
    id: string;
    quotation_number: string;
    party_name: string;
    party_address: string | null;
    vehicle_number: string | null;
    total_amount: number;
  };
}

interface OrderItem {
  id: string;
  description: string;
  quantity: number;
  is_picked: boolean;
  picked_at: string | null;
}

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('active_orders')
        .select(`
          id,
          order_number,
          status,
          created_at,
          quotation:quotations (
            id,
            quotation_number,
            party_name,
            party_address,
            vehicle_number,
            total_amount
          )
        `)
        .eq('id', id)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData as any);

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id)
        .order('created_at');

      if (itemsError) throw itemsError;
      setItems(itemsData || []);
    } catch (error: any) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order');
      navigate('/admin/quotations');
    } finally {
      setLoading(false);
    }
  };

  const toggleItemPicked = async (itemId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('order_items')
        .update({
          is_picked: !currentStatus,
          picked_at: !currentStatus ? new Date().toISOString() : null,
          picked_by: !currentStatus ? user?.id : null,
        })
        .eq('id', itemId);

      if (error) throw error;

      setItems(items.map(item => 
        item.id === itemId 
          ? { ...item, is_picked: !currentStatus, picked_at: !currentStatus ? new Date().toISOString() : null }
          : item
      ));

      toast.success(currentStatus ? 'Item unmarked' : 'Item marked as picked');
    } catch (error: any) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  };

  const updateOrderStatus = async (newStatus: Order['status']) => {
    if (!order) return;

    try {
      const { error } = await supabase
        .from('active_orders')
        .update({ status: newStatus })
        .eq('id', order.id);

      if (error) throw error;

      setOrder({ ...order, status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'picking':
        return <Badge variant="secondary" className="gap-1"><Package className="w-3 h-3" /> Picking</Badge>;
      case 'ready':
        return <Badge className="gap-1 bg-blue-500"><CheckCircle className="w-3 h-3" /> Ready</Badge>;
      case 'dispatched':
        return <Badge className="gap-1 bg-purple-500"><Truck className="w-3 h-3" /> Dispatched</Badge>;
      case 'completed':
        return <Badge className="gap-1 bg-green-500"><Check className="w-3 h-3" /> Completed</Badge>;
    }
  };

  const pickedCount = items.filter(item => item.is_picked).length;
  const allPicked = items.length > 0 && pickedCount === items.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title={`${order.order_number} - Order`} />

      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/admin/quotations" className="inline-flex items-center text-accent hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
            <div className="flex gap-2">
              {order.status === 'picking' && allPicked && (
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => updateOrderStatus('ready')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Ready
                </Button>
              )}
              {order.status === 'ready' && (
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => updateOrderStatus('dispatched')}
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Mark Dispatched
                </Button>
              )}
              {order.status === 'dispatched' && (
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => updateOrderStatus('completed')}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark Completed
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Order Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-heading font-bold">{order.order_number}</h1>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-lg font-medium">{order.quotation?.party_name}</p>
                  {order.quotation?.party_address && (
                    <p className="text-muted-foreground">{order.quotation.party_address}</p>
                  )}
                  {order.quotation?.vehicle_number && (
                    <p className="text-muted-foreground">Vehicle: {order.quotation.vehicle_number}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    From: {order.quotation?.quotation_number} • Created: {format(new Date(order.created_at), 'PPp')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">₹{order.quotation?.total_amount.toLocaleString()}</p>
                  <p className="text-muted-foreground mt-2">
                    {pickedCount} / {items.length} items picked
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              {items.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Picking Progress</span>
                    <span className="text-sm text-muted-foreground">{Math.round((pickedCount / items.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(pickedCount / items.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" />
                Items to Pick
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div 
                    key={item.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                      item.is_picked 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-card border-border hover:border-accent/30'
                    }`}
                  >
                    <Checkbox
                      checked={item.is_picked}
                      onCheckedChange={() => toggleItemPicked(item.id, item.is_picked)}
                      className="h-6 w-6"
                    />
                    <div className="flex-1">
                      <p className={`font-medium ${item.is_picked ? 'line-through text-muted-foreground' : ''}`}>
                        {index + 1}. {item.description}
                      </p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    {item.is_picked && item.picked_at && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <Check className="w-3 h-3 mr-1" />
                        Picked
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Guide */}
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Order Status Flow</h3>
              <div className="flex items-center justify-between">
                <div className={`flex flex-col items-center ${order.status === 'picking' ? 'text-accent' : 'text-muted-foreground'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'picking' ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-xs mt-2">Picking</span>
                </div>
                <div className="flex-1 h-0.5 bg-border mx-2" />
                <div className={`flex flex-col items-center ${order.status === 'ready' ? 'text-blue-500' : 'text-muted-foreground'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'ready' ? 'bg-blue-500 text-white' : 'bg-muted'}`}>
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs mt-2">Ready</span>
                </div>
                <div className="flex-1 h-0.5 bg-border mx-2" />
                <div className={`flex flex-col items-center ${order.status === 'dispatched' ? 'text-purple-500' : 'text-muted-foreground'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'dispatched' ? 'bg-purple-500 text-white' : 'bg-muted'}`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-xs mt-2">Dispatched</span>
                </div>
                <div className="flex-1 h-0.5 bg-border mx-2" />
                <div className={`flex flex-col items-center ${order.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${order.status === 'completed' ? 'bg-green-500 text-white' : 'bg-muted'}`}>
                    <Check className="w-5 h-5" />
                  </div>
                  <span className="text-xs mt-2">Completed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default OrderDetail;