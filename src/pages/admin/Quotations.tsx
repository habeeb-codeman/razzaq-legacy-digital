import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Check, 
  X, 
  Download, 
  Clock,
  Package,
  Truck,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import { format } from 'date-fns';

interface Quotation {
  id: string;
  quotation_number: string;
  party_name: string;
  party_address: string | null;
  vehicle_number: string | null;
  status: 'pending' | 'accepted' | 'declined';
  total_amount: number;
  created_at: string;
}

interface ActiveOrder {
  id: string;
  order_number: string;
  status: 'picking' | 'ready' | 'dispatched' | 'completed';
  created_at: string;
  quotation: {
    id: string;
    quotation_number: string;
    party_name: string;
    total_amount: number;
  };
  items_count: number;
  picked_count: number;
}

const Quotations = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch quotations
      const { data: quotationsData, error: quotationsError } = await supabase
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false });

      if (quotationsError) throw quotationsError;
      setQuotations(quotationsData || []);

      // Fetch active orders with quotation info
      const { data: ordersData, error: ordersError } = await supabase
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
            total_amount
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Get item counts for each order
      const ordersWithCounts = await Promise.all(
        (ordersData || []).map(async (order: any) => {
          const { count: itemsCount } = await supabase
            .from('order_items')
            .select('*', { count: 'exact', head: true })
            .eq('order_id', order.id);

          const { count: pickedCount } = await supabase
            .from('order_items')
            .select('*', { count: 'exact', head: true })
            .eq('order_id', order.id)
            .eq('is_picked', true);

          return {
            ...order,
            items_count: itemsCount || 0,
            picked_count: pickedCount || 0,
          };
        })
      );

      setActiveOrders(ordersWithCounts);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuotation = async (quotation: Quotation) => {
    try {
      // Update quotation status
      const { error: updateError } = await supabase
        .from('quotations')
        .update({ status: 'accepted' })
        .eq('id', quotation.id);

      if (updateError) throw updateError;

      // Generate order number
      const { data: orderNumberData, error: orderNumberError } = await supabase
        .rpc('generate_order_number');

      if (orderNumberError) throw orderNumberError;

      // Create active order
      const { data: orderData, error: orderError } = await supabase
        .from('active_orders')
        .insert({
          quotation_id: quotation.id,
          order_number: orderNumberData,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Get quotation items and copy to order items
      const { data: quotationItems, error: itemsError } = await supabase
        .from('quotation_items')
        .select('*')
        .eq('quotation_id', quotation.id);

      if (itemsError) throw itemsError;

      if (quotationItems && quotationItems.length > 0) {
        const orderItems = quotationItems.map((item: any) => ({
          order_id: orderData.id,
          quotation_item_id: item.id,
          description: item.description,
          quantity: item.quantity,
        }));

        const { error: insertItemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (insertItemsError) throw insertItemsError;
      }

      toast.success('Quotation accepted! Order created.');
      fetchData();
    } catch (error: any) {
      console.error('Error accepting quotation:', error);
      toast.error('Failed to accept quotation');
    }
  };

  const handleDeclineQuotation = async (quotationId: string) => {
    try {
      const { error } = await supabase
        .from('quotations')
        .update({ status: 'declined' })
        .eq('id', quotationId);

      if (error) throw error;

      toast.success('Quotation declined');
      fetchData();
    } catch (error: any) {
      console.error('Error declining quotation:', error);
      toast.error('Failed to decline quotation');
    }
  };

  const getStatusBadge = (status: Quotation['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> Pending</Badge>;
      case 'accepted':
        return <Badge className="gap-1 bg-green-500"><Check className="w-3 h-3" /> Accepted</Badge>;
      case 'declined':
        return <Badge variant="destructive" className="gap-1"><X className="w-3 h-3" /> Declined</Badge>;
    }
  };

  const getOrderStatusBadge = (status: ActiveOrder['status']) => {
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

  const pendingQuotations = quotations.filter(q => q.status === 'pending');
  const acceptedQuotations = quotations.filter(q => q.status === 'accepted');
  const declinedQuotations = quotations.filter(q => q.status === 'declined');

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Quotations - Admin" />

      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="inline-flex items-center text-accent hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <Link to="/admin/quotations/new">
              <Button className="btn-hero gap-2">
                <Plus className="w-4 h-4" />
                New Quotation
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-accent" />
            <div>
              <h1 className="text-3xl font-heading font-bold">Quotations & Orders</h1>
              <p className="text-muted-foreground">Manage quotations and track orders</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="pending" className="gap-1">
                Pending
                {pendingQuotations.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">{pendingQuotations.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-1">
                Orders
                {activeOrders.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">{activeOrders.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="declined">Declined</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6">
              {pendingQuotations.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No pending quotations</p>
                    <Link to="/admin/quotations/new">
                      <Button variant="outline" className="mt-4">Create Quotation</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {pendingQuotations.map((quotation) => (
                    <Card key={quotation.id} className="hover:border-accent/30 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">{quotation.quotation_number}</h3>
                              {getStatusBadge(quotation.status)}
                            </div>
                            <p className="text-foreground font-medium">{quotation.party_name}</p>
                            {quotation.vehicle_number && (
                              <p className="text-sm text-muted-foreground">Vehicle: {quotation.vehicle_number}</p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              Created: {format(new Date(quotation.created_at), 'PPp')}
                            </p>
                          </div>
                          <div className="text-right space-y-3">
                            <p className="text-2xl font-bold">₹{quotation.total_amount.toLocaleString()}</p>
                            <div className="flex gap-2">
                              <Link to={`/admin/quotations/${quotation.id}`}>
                                <Button variant="outline" size="sm">
                                  <Download className="w-4 h-4 mr-1" />
                                  View/PDF
                                </Button>
                              </Link>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleAcceptQuotation(quotation)}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeclineQuotation(quotation.id)}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Decline
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              {activeOrders.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No active orders</p>
                    <p className="text-sm text-muted-foreground mt-2">Accept a quotation to create an order</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {activeOrders.map((order) => (
                    <Card key={order.id} className="hover:border-accent/30 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">{order.order_number}</h3>
                              {getOrderStatusBadge(order.status)}
                            </div>
                            <p className="text-foreground font-medium">{order.quotation?.party_name}</p>
                            <p className="text-sm text-muted-foreground">
                              From: {order.quotation?.quotation_number}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Created: {format(new Date(order.created_at), 'PPp')}
                            </p>
                          </div>
                          <div className="text-right space-y-3">
                            <p className="text-2xl font-bold">₹{order.quotation?.total_amount.toLocaleString()}</p>
                            <div className="flex items-center gap-2">
                              <div className="text-sm">
                                <span className="text-green-500 font-medium">{order.picked_count}</span>
                                <span className="text-muted-foreground"> / {order.items_count} items picked</span>
                              </div>
                            </div>
                            <Link to={`/admin/orders/${order.id}`}>
                              <Button size="sm" className="btn-hero">
                                Manage Order
                              </Button>
                            </Link>
                          </div>
                        </div>
                        {order.items_count > 0 && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(order.picked_count / order.items_count) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="accepted" className="mt-6">
              {acceptedQuotations.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Check className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No accepted quotations</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {acceptedQuotations.map((quotation) => (
                    <Card key={quotation.id} className="opacity-75">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">{quotation.quotation_number}</h3>
                              {getStatusBadge(quotation.status)}
                            </div>
                            <p className="text-foreground font-medium">{quotation.party_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(quotation.created_at), 'PPp')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">₹{quotation.total_amount.toLocaleString()}</p>
                            <Link to={`/admin/quotations/${quotation.id}`}>
                              <Button variant="outline" size="sm" className="mt-2">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="declined" className="mt-6">
              {declinedQuotations.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <X className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No declined quotations</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {declinedQuotations.map((quotation) => (
                    <Card key={quotation.id} className="opacity-50">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">{quotation.quotation_number}</h3>
                              {getStatusBadge(quotation.status)}
                            </div>
                            <p className="text-foreground font-medium">{quotation.party_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(quotation.created_at), 'PPp')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold line-through text-muted-foreground">₹{quotation.total_amount.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Quotations;