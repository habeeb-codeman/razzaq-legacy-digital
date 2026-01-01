import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Package, MapPin, Hash, DollarSign, Boxes, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import razzaqLogo from '@/assets/razzaq-logo-new.png';

const LOCATIONS = ['RA1', 'RA2', 'RA3', 'RA4'] as const;

interface QuickProduct {
  name: string;
  location: typeof LOCATIONS[number];
  stock_quantity: number;
  price: number;
}

const QuickAddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<QuickProduct>({
    name: '',
    location: 'RA1',
    stock_quantity: 1,
    price: 0
  });
  const [addedCount, setAddedCount] = useState(0);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    setLoading(true);
    try {
      // Generate product code
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_product_code', { p_location: product.location });

      if (codeError) throw codeError;

      const slug = generateSlug(product.name);

      const { error } = await supabase
        .from('products')
        .insert({
          name: product.name.trim(),
          slug,
          product_code: codeData,
          location: product.location,
          stock_quantity: product.stock_quantity,
          price: product.price || null,
          published: true,
          status: 'active'
        });

      if (error) throw error;

      setAddedCount(prev => prev + 1);
      setLastAdded(product.name);
      toast.success(`Added: ${product.name}`);

      // Reset form for next product
      setProduct(prev => ({
        ...prev,
        name: '',
        stock_quantity: 1,
        price: 0
      }));

      // Focus name input for rapid entry
      const nameInput = document.getElementById('product-name');
      if (nameInput) nameInput.focus();

    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error(error.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <SEO title="Quick Add Product - Admin" />

      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin')} className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-foreground">
                <img src={razzaqLogo} alt="RA" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-lg font-heading font-bold">Quick Add</h1>
                <p className="text-xs text-muted-foreground">Rapid product entry</p>
              </div>
            </div>
            {addedCount > 0 && (
              <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">{addedCount} added</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Success Toast */}
          {lastAdded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-green-500 truncate">Last added: {lastAdded}</p>
                <p className="text-xs text-muted-foreground">Ready for next product</p>
              </div>
            </motion.div>
          )}

          {/* Quick Add Form */}
          <Card className="border-accent/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" />
                Add Product
              </CardTitle>
              <CardDescription>Enter minimum details for rapid inventory building</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Product Name - Large and Prominent */}
                <div className="space-y-2">
                  <Label htmlFor="product-name" className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Product Name *
                  </Label>
                  <Input
                    id="product-name"
                    value={product.name}
                    onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Tata 407 Cabin Assembly"
                    className="text-lg py-6 rounded-xl"
                    autoFocus
                    autoComplete="off"
                  />
                </div>

                {/* Location - Quick Select */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Warehouse Location
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {LOCATIONS.map(loc => (
                      <Button
                        key={loc}
                        type="button"
                        variant={product.location === loc ? 'default' : 'outline'}
                        onClick={() => setProduct(prev => ({ ...prev, location: loc }))}
                        className="rounded-xl py-5"
                      >
                        {loc}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Stock & Price Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock" className="flex items-center gap-2">
                      <Boxes className="w-4 h-4" />
                      Initial Stock
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={product.stock_quantity}
                      onChange={(e) => setProduct(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price" className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Price (₹)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={product.price || ''}
                      onChange={(e) => setProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      placeholder="Optional"
                      className="rounded-xl"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !product.name.trim()}
                  className="w-full btn-hero py-7 text-lg rounded-2xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Add Product & Continue
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-border/30 bg-muted/20">
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-2">Quick Tips</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Press Enter to add and start next product</li>
                <li>• Location stays same for batch entries</li>
                <li>• Product code is auto-generated</li>
                <li>• Edit details later in Products page</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default QuickAddProduct;
