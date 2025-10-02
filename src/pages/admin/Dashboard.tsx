import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import razzaqLogo from '@/assets/razzaq-logo.png';

const Dashboard = () => {
  const { signOut, user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    publishedProducts: 0,
    draftProducts: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { count: total } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    const { count: published } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('published', true);

    setStats({
      totalProducts: total || 0,
      publishedProducts: published || 0,
      draftProducts: (total || 0) - (published || 0)
    });
  };

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
              <img src={razzaqLogo} alt="Razzaq Automotives" className="w-10 h-10" />
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
            <p className="text-muted-foreground">Manage your products and inventory</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <ShoppingBag className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.publishedProducts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                <Users className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.draftProducts}</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/admin/products">
                <Button className="w-full btn-hero" size="lg">
                  <Package className="w-5 h-5 mr-2" />
                  Manage Products
                </Button>
              </Link>
              <Link to="/admin/products/new">
                <Button className="w-full" variant="outline" size="lg">
                  Add New Product
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
