import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  LogOut, 
  FileText, 
  Receipt, 
  BookOpen, 
  BarChart3, 
  QrCode, 
  Plus, 
  Upload, 
  Tag, 
  TrendingUp, 
  AlertTriangle,
  MapPin,
  Printer,
  Settings,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import razzaqLogo from '@/assets/razzaq-logo-new.png';

interface DashboardStats {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  totalBills: number;
  totalBlogs: number;
  publishedBlogs: number;
  lowStockItems: number;
  outOfStock: number;
  recentBillTotal: number;
  locationCounts: Record<string, number>;
}

const Dashboard = () => {
  const { signOut, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    publishedProducts: 0,
    draftProducts: 0,
    totalBills: 0,
    totalBlogs: 0,
    publishedBlogs: 0,
    lowStockItems: 0,
    outOfStock: 0,
    recentBillTotal: 0,
    locationCounts: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch products with stock info
      const { data: products } = await supabase
        .from('products')
        .select('id, published, stock_quantity, low_stock_threshold, location');

      const total = products?.length || 0;
      const published = products?.filter(p => p.published).length || 0;
      let lowStock = 0;
      let outOfStock = 0;
      const locationCounts: Record<string, number> = {};

      products?.forEach(product => {
        const stock = product.stock_quantity || 0;
        const threshold = product.low_stock_threshold || 10;
        
        if (stock === 0) outOfStock++;
        else if (stock <= threshold) lowStock++;

        const loc = product.location || 'Unassigned';
        locationCounts[loc] = (locationCounts[loc] || 0) + 1;
      });

      // Fetch bills
      const { count: billsCount } = await supabase
        .from('bills')
        .select('*', { count: 'exact', head: true });

      // Get recent bills total
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: recentBills } = await supabase
        .from('bills')
        .select('total_amount')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const recentBillTotal = recentBills?.reduce((sum, bill) => sum + (bill.total_amount || 0), 0) || 0;

      // Fetch blogs
      const { count: totalBlogs } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });

      const { count: publishedBlogs } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('published', true);

      setStats({
        totalProducts: total,
        publishedProducts: published,
        draftProducts: total - published,
        totalBills: billsCount || 0,
        totalBlogs: totalBlogs || 0,
        publishedBlogs: publishedBlogs || 0,
        lowStockItems: lowStock,
        outOfStock: outOfStock,
        recentBillTotal,
        locationCounts
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { to: '/admin/products', icon: Package, label: 'Products', color: 'text-accent', description: 'Manage inventory' },
    { to: '/admin/low-stock', icon: AlertTriangle, label: 'Low Stock', color: 'text-yellow-500', description: 'Restock alerts' },
    { to: '/admin/inventory-analytics', icon: BarChart3, label: 'Analytics', color: 'text-blue-500', description: 'View insights' },
    { to: '/qr-scanner', icon: QrCode, label: 'QR Scanner', color: 'text-purple-500', description: 'Scan products' },
    { to: '/admin/bills', icon: Receipt, label: 'Billing', color: 'text-green-500', description: 'Create invoices' },
    { to: '/admin/blog', icon: BookOpen, label: 'Blog', color: 'text-pink-500', description: 'Manage posts' },
  ];

  const secondaryActions = [
    { to: '/admin/quick-add', icon: Plus, label: 'Quick Add', highlight: true },
    { to: '/admin/products/new', icon: Plus, label: 'Full Form' },
    { to: '/admin/bulk-import', icon: Upload, label: 'Bulk Import' },
    { to: '/admin/bulk-location-update', icon: MapPin, label: 'Update Locations' },
    { to: '/admin/bills/new', icon: FileText, label: 'Create Bill' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Admin Dashboard - Manage Products"
        description="Admin dashboard for managing Razzaq Automotives products and inventory"
      />

      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-foreground flex-shrink-0">
                <img src={razzaqLogo} alt="Razzaq Automotives" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-xl text-foreground">Admin Dashboard</h1>
                <p className="text-accent text-xs font-medium">Razzaq Automotives</p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user?.email}
              </span>
              <Button onClick={signOut} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-3xl font-heading font-bold mb-2">Welcome Back!</h2>
            <p className="text-muted-foreground">Here's an overview of your business</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
              <Card className="border-accent/20">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-5 h-5 text-accent" />
                    <Badge variant="secondary" className="text-xs">{stats.publishedProducts} live</Badge>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  <p className="text-xs text-muted-foreground">Total Products</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card className="border-yellow-500/20">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    {stats.lowStockItems > 0 && <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-500">Alert</Badge>}
                  </div>
                  <p className="text-2xl font-bold text-yellow-500">{stats.lowStockItems}</p>
                  <p className="text-xs text-muted-foreground">Low Stock Items</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-destructive/20">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-5 h-5 text-destructive" />
                    {stats.outOfStock > 0 && <Badge variant="destructive" className="text-xs">Critical</Badge>}
                  </div>
                  <p className="text-2xl font-bold text-destructive">{stats.outOfStock}</p>
                  <p className="text-xs text-muted-foreground">Out of Stock</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card className="border-green-500/20">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Receipt className="w-5 h-5 text-green-500" />
                    <Badge variant="secondary" className="text-xs">{stats.totalBills} total</Badge>
                  </div>
                  <p className="text-2xl font-bold">₹{(stats.recentBillTotal / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-muted-foreground">Last 30 Days</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-pink-500/20">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <BookOpen className="w-5 h-5 text-pink-500" />
                    <Badge variant="secondary" className="text-xs">{stats.publishedBlogs} live</Badge>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalBlogs}</p>
                  <p className="text-xs text-muted-foreground">Blog Posts</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card className="border-blue-500/20">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold">{Object.keys(stats.locationCounts).length}</p>
                  <p className="text-xs text-muted-foreground">Active Locations</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access frequently used features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {quickActions.map(({ to, icon: Icon, label, color, description }) => (
                    <Link key={to} to={to}>
                      <div className="group p-4 rounded-xl border border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 h-full">
                        <div className={`w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <p className="font-medium text-sm">{label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Secondary Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>More Actions</CardTitle>
                <CardDescription>Additional management options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {secondaryActions.map(({ to, icon: Icon, label }) => (
                    <Link key={to} to={to}>
                      <Button variant="outline" className="gap-2">
                        <Icon className="w-4 h-4" />
                        {label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Location Distribution */}
          {Object.keys(stats.locationCounts).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent" />
                    Inventory Distribution
                  </CardTitle>
                  <CardDescription>Products across warehouse locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Object.entries(stats.locationCounts).map(([location, count]) => (
                      <div key={location} className="p-4 rounded-xl bg-muted/30 border border-border/30 text-center">
                        <p className="text-2xl font-bold text-accent">{count}</p>
                        <p className="text-sm text-muted-foreground">{location}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
