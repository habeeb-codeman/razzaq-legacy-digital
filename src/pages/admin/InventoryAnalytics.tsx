import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  MapPin, 
  AlertTriangle, 
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Flag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import SEO from '@/components/SEO';

interface LocationStats {
  location: string;
  count: number;
  totalStock: number;
}

interface StockStatus {
  status: string;
  count: number;
}

interface RecentMovement {
  id: string;
  product_name: string;
  old_location: string | null;
  new_location: string;
  changed_at: string;
}

const COLORS = ['hsl(var(--accent))', 'hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--muted))'];

const InventoryAnalytics = () => {
  const [locationStats, setLocationStats] = useState<LocationStats[]>([]);
  const [stockStatus, setStockStatus] = useState<StockStatus[]>([]);
  const [recentMovements, setRecentMovements] = useState<RecentMovement[]>([]);
  const [totals, setTotals] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStockItems: 0,
    outOfStock: 0,
    underReview: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch all products
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name, location, stock_quantity, low_stock_threshold, status');

      if (error) throw error;

      // Calculate location stats
      const locationMap = new Map<string, { count: number; totalStock: number }>();
      let totalStock = 0;
      let lowStockItems = 0;
      let outOfStock = 0;
      let underReview = 0;

      products?.forEach(product => {
        const loc = product.location || 'Unassigned';
        const current = locationMap.get(loc) || { count: 0, totalStock: 0 };
        current.count += 1;
        current.totalStock += product.stock_quantity || 0;
        locationMap.set(loc, current);

        totalStock += product.stock_quantity || 0;
        if ((product.stock_quantity || 0) === 0) {
          outOfStock += 1;
        } else if ((product.stock_quantity || 0) <= (product.low_stock_threshold || 10)) {
          lowStockItems += 1;
        }
        if (product.status === 'under_review') {
          underReview += 1;
        }
      });

      const locationStatsData: LocationStats[] = Array.from(locationMap.entries()).map(([location, stats]) => ({
        location,
        count: stats.count,
        totalStock: stats.totalStock
      }));

      setLocationStats(locationStatsData);

      // Calculate stock status
      const inStock = (products?.length || 0) - lowStockItems - outOfStock;
      setStockStatus([
        { status: 'In Stock', count: inStock },
        { status: 'Low Stock', count: lowStockItems },
        { status: 'Out of Stock', count: outOfStock }
      ]);

      setTotals({
        totalProducts: products?.length || 0,
        totalStock,
        lowStockItems,
        outOfStock,
        underReview
      });

      // Fetch recent location movements
      const { data: movements, error: movementsError } = await supabase
        .from('product_location_history')
        .select(`
          id,
          old_location,
          new_location,
          changed_at,
          product_id
        `)
        .order('changed_at', { ascending: false })
        .limit(10);

      if (!movementsError && movements) {
        // Fetch product names for movements
        const productIds = movements.map(m => m.product_id);
        const { data: productNames } = await supabase
          .from('products')
          .select('id, name')
          .in('id', productIds);

        const nameMap = new Map(productNames?.map(p => [p.id, p.name]));

        setRecentMovements(movements.map(m => ({
          id: m.id,
          product_name: nameMap.get(m.product_id) || 'Unknown',
          old_location: m.old_location,
          new_location: m.new_location,
          changed_at: m.changed_at
        })));
      }

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <SEO title="Inventory Analytics - Admin Dashboard" />

      <header className="bg-card/50 backdrop-blur-sm border-b border-border/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-heading font-bold">Inventory Analytics</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="text-3xl font-bold">{totals.totalProducts}</p>
                  </div>
                  <Package className="w-10 h-10 text-accent/50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Stock</p>
                    <p className="text-3xl font-bold">{totals.totalStock.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-green-500/50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Low Stock</p>
                    <p className="text-3xl font-bold text-yellow-500">{totals.lowStockItems}</p>
                  </div>
                  <AlertTriangle className="w-10 h-10 text-yellow-500/50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Out of Stock</p>
                    <p className="text-3xl font-bold text-destructive">{totals.outOfStock}</p>
                  </div>
                  <AlertTriangle className="w-10 h-10 text-destructive/50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card className="border-orange-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Under Review</p>
                    <p className="text-3xl font-bold text-orange-500">{totals.underReview}</p>
                  </div>
                  <Flag className="w-10 h-10 text-orange-500/50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Location Distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  Products by Location
                </CardTitle>
                <CardDescription>Distribution across warehouse locations</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={locationStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="location" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" name="Products" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stock Status Pie Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-accent" />
                  Stock Status
                </CardTitle>
                <CardDescription>Overview of inventory health</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stockStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="status"
                      label={({ status, count }) => `${status}: ${count}`}
                    >
                      {stockStatus.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(142, 71%, 45%)' : index === 1 ? 'hsl(45, 93%, 47%)' : 'hsl(0, 84%, 60%)'} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Stock by Location */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Stock Quantity by Location
              </CardTitle>
              <CardDescription>Total stock units in each warehouse</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={locationStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="location" type="category" stroke="hsl(var(--muted-foreground))" width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="totalStock" name="Stock Units" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Location Movements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                Recent Location Movements
              </CardTitle>
              <CardDescription>Latest product transfers between warehouses</CardDescription>
            </CardHeader>
            <CardContent>
              {recentMovements.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No recent movements recorded</p>
              ) : (
                <div className="space-y-4">
                  {recentMovements.map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <ArrowUpRight className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium">{movement.product_name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{movement.old_location || 'None'}</Badge>
                            <span>→</span>
                            <Badge variant="default">{movement.new_location}</Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(movement.changed_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default InventoryAnalytics;
