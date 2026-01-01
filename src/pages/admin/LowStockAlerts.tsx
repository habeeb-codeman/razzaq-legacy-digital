import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  ArrowLeft, 
  Package, 
  MapPin, 
  RefreshCw,
  Plus,
  Minus,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

interface LowStockProduct {
  id: string;
  product_code: string;
  name: string;
  stock_quantity: number;
  low_stock_threshold: number;
  location: string | null;
}

const LowStockAlerts = () => {
  const [products, setProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<LowStockProduct | null>(null);
  const [restockAmount, setRestockAmount] = useState(0);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, product_code, name, stock_quantity, low_stock_threshold, location')
        .order('stock_quantity', { ascending: true });

      if (error) throw error;

      // Filter products that are at or below threshold
      const lowStock = (data || []).filter(p => {
        const stock = p.stock_quantity || 0;
        const threshold = p.low_stock_threshold || 10;
        return stock <= threshold;
      });

      setProducts(lowStock);
    } catch (error: any) {
      toast.error('Failed to load low stock products');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async () => {
    if (!selectedProduct || restockAmount <= 0) return;

    setUpdating(true);
    try {
      const newStock = (selectedProduct.stock_quantity || 0) + restockAmount;

      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', selectedProduct.id);

      if (error) throw error;

      // Log the stock update in scan_history
      await supabase.from('scan_history').insert({
        product_id: selectedProduct.id,
        action: 'stock_up',
        old_stock: selectedProduct.stock_quantity || 0,
        new_stock: newStock,
        quantity_change: restockAmount,
        notes: `Restocked via Low Stock Alerts page`
      });

      toast.success(`Added ${restockAmount} units to ${selectedProduct.name}`);
      setSelectedProduct(null);
      setRestockAmount(0);
      fetchLowStockProducts();
    } catch (error: any) {
      toast.error('Failed to update stock');
      console.error('Error:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStockBadge = (stock: number, threshold: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (stock <= threshold / 2) {
      return <Badge variant="destructive">Critical</Badge>;
    }
    return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Low</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Low Stock Alerts - Admin"
        description="Manage low stock inventory items"
      />

      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <div>
                <h1 className="font-heading font-bold text-2xl text-foreground">Low Stock Alerts</h1>
                <p className="text-muted-foreground">Manage inventory that needs restocking</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={fetchLowStockProducts} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-yellow-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Low Stock Items</p>
                    <p className="text-3xl font-bold text-yellow-500">
                      {products.filter(p => (p.stock_quantity || 0) > 0).length}
                    </p>
                  </div>
                  <AlertTriangle className="w-10 h-10 text-yellow-500/30" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Out of Stock</p>
                    <p className="text-3xl font-bold text-destructive">
                      {products.filter(p => (p.stock_quantity || 0) === 0).length}
                    </p>
                  </div>
                  <Package className="w-10 h-10 text-destructive/30" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Alerts</p>
                    <p className="text-3xl font-bold text-accent">{products.length}</p>
                  </div>
                  <Package className="w-10 h-10 text-accent/30" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Products Requiring Attention</CardTitle>
              <CardDescription>
                Click "Restock" to quickly update inventory levels
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-center">Current Stock</TableHead>
                      <TableHead className="text-center">Threshold</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Loading low stock products...
                        </TableCell>
                      </TableRow>
                    ) : products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Package className="w-12 h-12 opacity-50" />
                            <p>All products are well stocked!</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => (
                        <TableRow key={product.id} className={product.stock_quantity === 0 ? 'bg-destructive/5' : ''}>
                          <TableCell className="font-mono text-sm">{product.product_code}</TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            {product.location ? (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                {product.location}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={product.stock_quantity === 0 ? 'text-destructive font-bold' : 'text-yellow-500 font-semibold'}>
                              {product.stock_quantity || 0}
                            </span>
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {product.low_stock_threshold || 10}
                          </TableCell>
                          <TableCell className="text-center">
                            {getStockBadge(product.stock_quantity || 0, product.low_stock_threshold || 10)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(product);
                                setRestockAmount(product.low_stock_threshold || 10);
                              }}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Restock
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Restock Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restock Product</DialogTitle>
            <DialogDescription>
              Add stock to {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Current Stock</p>
                <p className="text-2xl font-bold">{selectedProduct?.stock_quantity || 0}</p>
              </div>
              <div className="text-3xl text-muted-foreground">→</div>
              <div>
                <p className="text-sm text-muted-foreground">New Stock</p>
                <p className="text-2xl font-bold text-accent">
                  {(selectedProduct?.stock_quantity || 0) + restockAmount}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Add Quantity</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setRestockAmount(Math.max(1, restockAmount - 10))}
                  disabled={restockAmount <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Math.max(1, parseInt(e.target.value) || 0))}
                  className="text-center text-xl font-bold"
                  min={1}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setRestockAmount(restockAmount + 10)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              {[10, 25, 50, 100].map((qty) => (
                <Button
                  key={qty}
                  variant="outline"
                  size="sm"
                  onClick={() => setRestockAmount(qty)}
                  className={restockAmount === qty ? 'border-accent' : ''}
                >
                  +{qty}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProduct(null)}>
              Cancel
            </Button>
            <Button onClick={handleRestock} disabled={updating || restockAmount <= 0}>
              {updating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Add Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LowStockAlerts;
