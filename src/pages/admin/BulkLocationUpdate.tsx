import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

interface Product {
  id: string;
  product_code: string;
  name: string;
  location: string | null;
  stock_quantity: number | null;
}

const BulkLocationUpdate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [newLocation, setNewLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, product_code, name, location, stock_quantity')
      .order('product_code');

    if (error) {
      toast.error('Failed to load products');
      console.error(error);
    } else {
      setProducts(data || []);
    }
  };

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const toggleAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedProducts.size === 0) {
      toast.error('Please select at least one product');
      return;
    }

    if (!newLocation) {
      toast.error('Please select a new location');
      return;
    }

    setLoading(true);

    try {
      // Get old locations for history tracking
      const productsToUpdate = products.filter(p => selectedProducts.has(p.id));
      
      // Update all selected products
      const { error: updateError } = await supabase
        .from('products')
        .update({ location: newLocation as 'RA1' | 'RA2' | 'RA3' | 'RA4' })
        .in('id', Array.from(selectedProducts));

      if (updateError) throw updateError;

      // Record location history for each product
      const historyRecords = productsToUpdate.map(product => ({
        product_id: product.id,
        old_location: product.location as 'RA1' | 'RA2' | 'RA3' | 'RA4' | null,
        new_location: newLocation as 'RA1' | 'RA2' | 'RA3' | 'RA4',
        changed_by: user?.id,
        notes: notes || null,
      }));

      const { error: historyError } = await supabase
        .from('product_location_history')
        .insert(historyRecords);

      if (historyError) {
        console.error('Failed to record location history:', historyError);
      }

      toast.success(`Successfully updated ${selectedProducts.size} products`);
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to update products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    if (filterLocation === 'all') return true;
    return product.location === filterLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Bulk Location Update - Admin" />

      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <Link to="/admin/products" className="inline-flex items-center text-accent hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-8 h-8 text-accent" />
            <h1 className="text-3xl font-heading font-bold">Bulk Location Update</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Selection */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Select Products</CardTitle>
                  <div className="flex items-center gap-3">
                    <Select value={filterLocation} onValueChange={setFilterLocation}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="RA1">RA1 - Warehouse 1</SelectItem>
                        <SelectItem value="RA2">RA2 - Warehouse 2</SelectItem>
                        <SelectItem value="RA3">RA3 - Warehouse 3</SelectItem>
                        <SelectItem value="RA4">RA4 - Warehouse 4</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleAll}
                    >
                      {selectedProducts.size === filteredProducts.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={selectedProducts.has(product.id)}
                        onCheckedChange={() => toggleProduct(product.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{product.name}</p>
                          {product.location && (
                            <Badge variant="outline" className="text-xs">
                              {product.location}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{product.product_code}</p>
                      </div>
                      {product.stock_quantity !== null && (
                        <Badge variant="secondary">
                          Stock: {product.stock_quantity}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    {selectedProducts.size} of {filteredProducts.length} products selected
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Update Settings */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>New Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Target Warehouse *</Label>
                    <Select value={newLocation} onValueChange={setNewLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select new location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RA1">RA1 - Warehouse 1</SelectItem>
                        <SelectItem value="RA2">RA2 - Warehouse 2</SelectItem>
                        <SelectItem value="RA3">RA3 - Warehouse 3</SelectItem>
                        <SelectItem value="RA4">RA4 - Warehouse 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Reason for transfer, special instructions, etc."
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be saved in the location history
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Products selected:</span>
                      <span className="font-semibold">{selectedProducts.size}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">New location:</span>
                      <span className="font-semibold">{newLocation || '-'}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleBulkUpdate}
                    disabled={loading || selectedProducts.size === 0 || !newLocation}
                    className="w-full mt-6 btn-hero"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Updating...' : 'Update Locations'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default BulkLocationUpdate;