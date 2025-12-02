import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Upload, Package, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import razzaqLogo from '@/assets/razzaq-logo.png';

interface Product {
  id: string;
  product_code: string;
  name: string;
  slug: string;
  short_description: string | null;
  price: number | null;
  published: boolean;
  images: any;
  location: string | null;
  stock_quantity: number | null;
  low_stock_threshold: number | null;
  created_at: string;
}

const Products = () => {
  const { signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load products');
      console.error(error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const togglePublished = async (productId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ published: !currentStatus })
      .eq('id', productId);

    if (error) {
      toast.error('Failed to update product');
    } else {
      toast.success(`Product ${!currentStatus ? 'published' : 'unpublished'}`);
      fetchProducts();
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      toast.error('Failed to delete product');
    } else {
      toast.success('Product deleted');
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.short_description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === 'all' || product.location === locationFilter;
    
    const matchesStock = 
      stockFilter === 'all' ||
      (stockFilter === 'low' && product.stock_quantity !== null && product.low_stock_threshold !== null && product.stock_quantity <= product.low_stock_threshold) ||
      (stockFilter === 'out' && product.stock_quantity === 0) ||
      (stockFilter === 'in' && product.stock_quantity !== null && product.stock_quantity > 0);
    
    return matchesSearch && matchesLocation && matchesStock;
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Manage Products - Admin" />

      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center space-x-3">
              <img src={razzaqLogo} alt="Razzaq Automotives" className="w-10 h-10" />
              <div>
                <h1 className="font-heading font-bold text-xl text-foreground">Product Management</h1>
                <p className="text-accent text-xs font-medium">Admin Dashboard</p>
              </div>
            </Link>

            <Button onClick={signOut} variant="outline" size="sm">
              Logout
            </Button>
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
          {/* Actions Bar */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products, codes, descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Link to="/admin/products/bulk-import">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Upload className="w-4 h-4 mr-2" />
                    Bulk Import
                  </Button>
                </Link>
                <Link to="/admin/products/bulk-location-update">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <MapPin className="w-4 h-4 mr-2" />
                    Bulk Location
                  </Button>
                </Link>
                <Link to="/admin/products/qr-labels">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Package className="w-4 h-4 mr-2" />
                    QR Labels
                  </Button>
                </Link>
                <Link to="/admin/products/new">
                  <Button className="btn-hero w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </Link>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="RA1">RA1 - Warehouse 1</SelectItem>
                  <SelectItem value="RA2">RA2 - Warehouse 2</SelectItem>
                  <SelectItem value="RA3">RA3 - Warehouse 3</SelectItem>
                  <SelectItem value="RA4">RA4 - Warehouse 4</SelectItem>
                </SelectContent>
              </Select>

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Stock Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock Levels</SelectItem>
                  <SelectItem value="in">In Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              {(locationFilter !== 'all' || stockFilter !== 'all' || searchTerm) && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setLocationFilter('all');
                    setStockFilter('all');
                    setSearchTerm('');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Products List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No products found</p>
              <Link to="/admin/products/new">
                <Button className="btn-hero">Create Your First Product</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                     <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-heading font-bold text-lg">{product.name}</h3>
                        <Badge variant={product.published ? "default" : "secondary"}>
                          {product.published ? 'Published' : 'Draft'}
                        </Badge>
                        {product.location && (
                          <Badge variant="outline" className="text-xs">
                            {product.location}
                          </Badge>
                        )}
                        {(!product.images || (Array.isArray(product.images) && product.images.length === 0)) && (
                          <Badge variant="outline" className="text-xs">
                            No Images
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{product.product_code}</p>
                      {product.short_description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{product.short_description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        {product.price && (
                          <p className="text-accent font-semibold">₹{product.price.toLocaleString()}</p>
                        )}
                        {product.stock_quantity !== null && (
                          <Badge 
                            variant={
                              product.stock_quantity === 0 ? "destructive" :
                              product.stock_quantity <= (product.low_stock_threshold || 10) ? "secondary" :
                              "default"
                            }
                          >
                            {product.stock_quantity === 0 ? "Out of Stock" :
                             product.stock_quantity <= (product.low_stock_threshold || 10) ? `Low: ${product.stock_quantity}` :
                             `Stock: ${product.stock_quantity}`}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePublished(product.id, product.published)}
                      >
                        {product.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Link to={`/admin/products/edit/${product.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProduct(product.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Products;
