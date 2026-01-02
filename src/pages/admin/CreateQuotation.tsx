import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Search, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Product {
  id: string;
  name: string;
  product_code: string;
  price: number | null;
}

interface QuotationItem {
  id: string;
  product_id: string | null;
  description: string;
  quantity: number;
  rate: number;
  total_amount: number;
}

const CreateQuotation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchOpen, setSearchOpen] = useState<number | null>(null);
  
  // Form state
  const [partyName, setPartyName] = useState('');
  const [partyAddress, setPartyAddress] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [comments, setComments] = useState('');
  const [items, setItems] = useState<QuotationItem[]>([
    { id: crypto.randomUUID(), product_id: null, description: '', quantity: 1, rate: 0, total_amount: 0 }
  ]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, product_code, price')
      .order('name');

    if (!error && data) {
      setProducts(data);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: crypto.randomUUID(), product_id: null, description: '', quantity: 1, rate: 0, total_amount: 0 }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof QuotationItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Recalculate total if quantity or rate changed
        if (field === 'quantity' || field === 'rate') {
          updated.total_amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    }));
  };

  const selectProduct = (itemId: string, product: Product) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          product_id: product.id,
          description: `${product.name} (${product.product_code})`,
          rate: product.price || 0,
          total_amount: (product.price || 0) * item.quantity,
        };
      }
      return item;
    }));
    setSearchOpen(null);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total_amount, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!partyName.trim()) {
      toast.error('Party name is required');
      return;
    }

    const validItems = items.filter(item => item.description.trim() && item.rate > 0);
    if (validItems.length === 0) {
      toast.error('Please add at least one item with description and rate');
      return;
    }

    setLoading(true);
    try {
      // Generate quotation number
      const { data: quotationNumber, error: numberError } = await supabase
        .rpc('generate_quotation_number');

      if (numberError) throw numberError;

      // Create quotation
      const { data: quotation, error: quotationError } = await supabase
        .from('quotations')
        .insert({
          quotation_number: quotationNumber,
          party_name: partyName.trim(),
          party_address: partyAddress.trim() || null,
          vehicle_number: vehicleNumber.trim() || null,
          comments: comments.trim() || null,
          subtotal,
          total_amount: subtotal,
          created_by: user?.id,
        })
        .select()
        .single();

      if (quotationError) throw quotationError;

      // Insert items
      const itemsToInsert = validItems.map(item => ({
        quotation_id: quotation.id,
        product_id: item.product_id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        total_amount: item.total_amount,
      }));

      const { error: itemsError } = await supabase
        .from('quotation_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      toast.success('Quotation created successfully!');
      navigate(`/admin/quotations/${quotation.id}`);
    } catch (error: any) {
      console.error('Error creating quotation:', error);
      toast.error('Failed to create quotation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Create Quotation - Admin" />

      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <Link to="/admin/quotations" className="inline-flex items-center text-accent hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quotations
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <FileText className="w-8 h-8 text-accent" />
            <h1 className="text-3xl font-heading font-bold">Create Quotation</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Party Details */}
            <Card>
              <CardHeader>
                <CardTitle>Party Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="partyName">Party Name *</Label>
                    <Input
                      id="partyName"
                      value={partyName}
                      onChange={(e) => setPartyName(e.target.value)}
                      placeholder="Customer / Company name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                    <Input
                      id="vehicleNumber"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      placeholder="e.g., AP 39 AB 1234"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partyAddress">Address</Label>
                  <Textarea
                    id="partyAddress"
                    value={partyAddress}
                    onChange={(e) => setPartyAddress(e.target.value)}
                    placeholder="Full address"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Items *</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="space-y-3 p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Item {index + 1}</span>
                      {items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <div className="flex gap-2">
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Item description"
                          className="flex-1"
                        />
                        <Popover open={searchOpen === index} onOpenChange={(open) => setSearchOpen(open ? index : null)}>
                          <PopoverTrigger asChild>
                            <Button type="button" variant="outline" size="icon">
                              <Search className="w-4 h-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0" align="end">
                            <Command>
                              <CommandInput placeholder="Search products..." />
                              <CommandList>
                                <CommandEmpty>No products found.</CommandEmpty>
                                <CommandGroup>
                                  {products.map((product) => (
                                    <CommandItem
                                      key={product.id}
                                      value={`${product.name} ${product.product_code}`}
                                      onSelect={() => selectProduct(item.id, product)}
                                      className="cursor-pointer"
                                    >
                                      <div className="flex-1">
                                        <p className="font-medium">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">{product.product_code}</p>
                                      </div>
                                      {product.price && (
                                        <span className="text-sm font-medium">₹{product.price}</span>
                                      )}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Rate (₹)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Amount</Label>
                        <Input
                          value={`₹${item.total_amount.toLocaleString()}`}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Subtotal</p>
                    <p className="text-3xl font-bold">₹{subtotal.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Any additional notes or terms..."
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-3">
              <Link to="/admin/quotations">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" className="btn-hero" disabled={loading}>
                {loading ? 'Creating...' : 'Create Quotation'}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateQuotation;