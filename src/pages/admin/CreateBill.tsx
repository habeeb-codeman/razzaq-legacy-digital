import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { generateBillPDF } from '@/utils/billPDF';
import SEO from '@/components/SEO';

interface Product {
  id: string;
  name: string;
  price: number;
  product_code: string;
}

interface BillItem {
  id: string;
  product_id?: string;
  description: string;
  hsn_sac: string;
  quantity: number;
  unit: string;
  rate: number;
  taxable_value: number;
  cgst_rate: number;
  sgst_rate: number;
  cgst_amount: number;
  sgst_amount: number;
  total_amount: number;
}

const CreateBill = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  
  // Party details
  const [partyName, setPartyName] = useState('');
  const [partyAddress, setPartyAddress] = useState('');
  const [partyGstin, setPartyGstin] = useState('');
  const [partyPhone, setPartyPhone] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState('Andhra Pradesh - 37');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Bill items
  const [items, setItems] = useState<BillItem[]>([{
    id: crypto.randomUUID(),
    description: '',
    hsn_sac: '8708',
    quantity: 1,
    unit: 'Pcs',
    rate: 0,
    taxable_value: 0,
    cgst_rate: 14,
    sgst_rate: 14,
    cgst_amount: 0,
    sgst_amount: 0,
    total_amount: 0
  }]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, product_code')
        .eq('published', true)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products. You can still create custom items.');
    } finally {
      setProductsLoading(false);
    }
  };

  const calculateItemValues = (item: BillItem): BillItem => {
    const taxable_value = item.quantity * item.rate;
    const cgst_amount = (taxable_value * item.cgst_rate) / 100;
    const sgst_amount = (taxable_value * item.sgst_rate) / 100;
    const total_amount = taxable_value + cgst_amount + sgst_amount;

    return {
      ...item,
      taxable_value,
      cgst_amount,
      sgst_amount,
      total_amount
    };
  };

  const updateItem = (index: number, field: keyof BillItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // If product is selected, auto-fill details
    if (field === 'product_id' && value) {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].description = product.name;
        newItems[index].rate = product.price || 0;
      }
    }
    
    // Recalculate values
    newItems[index] = calculateItemValues(newItems[index]);
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, {
      id: crypto.randomUUID(),
      description: '',
      hsn_sac: '8708',
      quantity: 1,
      unit: 'Pcs',
      rate: 0,
      taxable_value: 0,
      cgst_rate: 14,
      sgst_rate: 14,
      cgst_amount: 0,
      sgst_amount: 0,
      total_amount: 0
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.taxable_value, 0);
    const cgst = items.reduce((sum, item) => sum + item.cgst_amount, 0);
    const sgst = items.reduce((sum, item) => sum + item.sgst_amount, 0);
    const total = items.reduce((sum, item) => sum + item.total_amount, 0);

    return { subtotal, cgst, sgst, total };
  };

  const saveBill = async () => {
    // Validation
    if (!partyName.trim()) {
      toast.error('Please enter party name');
      return;
    }

    if (partyGstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(partyGstin)) {
      toast.error('Invalid GSTIN format. Please check and try again.');
      return;
    }

    if (partyPhone && !/^[0-9]{10}$/.test(partyPhone.replace(/\s+/g, ''))) {
      toast.error('Phone number should be 10 digits');
      return;
    }

    if (items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    if (items.some(item => !item.description.trim() || item.rate <= 0 || item.quantity <= 0)) {
      toast.error('Please fill all item details with valid values');
      return;
    }

    setLoading(true);
    try {
      // Generate bill number
      const { data: billNumberData, error: billNumberError } = await supabase
        .rpc('generate_bill_number');

      if (billNumberError) throw billNumberError;

      const totals = calculateTotals();

      // Insert bill
      const { data: billData, error: billError } = await supabase
        .from('bills')
        .insert({
          bill_number: billNumberData,
          invoice_date: invoiceDate,
          party_name: partyName,
          party_address: partyAddress,
          party_gstin: partyGstin,
          party_phone: partyPhone,
          place_of_supply: placeOfSupply,
          subtotal: totals.subtotal,
          cgst_amount: totals.cgst,
          sgst_amount: totals.sgst,
          total_tax: totals.cgst + totals.sgst,
          total_amount: totals.total,
          remaining_amount: totals.total,
          notes,
          created_by: user?.id
        })
        .select()
        .single();

      if (billError) throw billError;

      // Insert bill items
      const billItems = items.map(item => ({
        bill_id: billData.id,
        product_id: item.product_id || null,
        description: item.description,
        hsn_sac: item.hsn_sac,
        quantity: item.quantity,
        unit: item.unit,
        rate: item.rate,
        taxable_value: item.taxable_value,
        cgst_rate: item.cgst_rate,
        sgst_rate: item.sgst_rate,
        cgst_amount: item.cgst_amount,
        sgst_amount: item.sgst_amount,
        total_amount: item.total_amount
      }));

      const { error: itemsError } = await supabase
        .from('bill_items')
        .insert(billItems);

      if (itemsError) throw itemsError;

      toast.success(`Bill ${billNumberData} created successfully!`);
      
      // Generate PDF and upload to storage
      try {
        const pdfBlob = await generateBillPDF({
          bill_number: billNumberData,
          invoice_date: invoiceDate,
          party_name: partyName,
          party_address: partyAddress,
          party_gstin: partyGstin,
          party_phone: partyPhone,
          place_of_supply: placeOfSupply,
          items,
          subtotal: totals.subtotal,
          cgst: totals.cgst,
          sgst: totals.sgst,
          total: totals.total,
          remaining_amount: totals.total
        });

        const fileName = `${billNumberData.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
        const filePath = `${user?.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('bills')
          .upload(filePath, pdfBlob, {
            contentType: 'application/pdf',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Update bill with PDF URL
        const { error: updateError } = await supabase
          .from('bills')
          .update({ pdf_url: filePath })
          .eq('id', billData.id);

        if (updateError) throw updateError;

        toast.success('Bill and PDF created successfully!');
      } catch (pdfError: any) {
        console.error('PDF generation/upload error:', pdfError);
        toast.error('Bill saved but PDF upload failed. You can regenerate it from the Bills page.');
      }

      setTimeout(() => navigate('/admin/bills'), 1000);
    } catch (error: any) {
      console.error('Error creating bill:', error);
      if (error.message?.includes('generate_bill_number')) {
        toast.error('Failed to generate bill number. Please try again.');
      } else if (error.message?.includes('permission')) {
        toast.error('You do not have permission to create bills. Please contact admin.');
      } else {
        toast.error(error.message || 'Failed to create bill. Please check all fields and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Please log in to access billing</p>
            <Button onClick={() => navigate('/auth')}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Create Bill - Admin"
        description="Create new invoice"
      />

      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/admin/bills" className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Bills
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button onClick={saveBill} disabled={loading} className="btn-hero">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Bill'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Create New Bill</h1>
            <p className="text-muted-foreground">Generate a professional tax invoice</p>
          </div>

          {/* Party Details */}
          <Card>
            <CardHeader>
              <CardTitle>Party Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="partyName">Party Name *</Label>
                <Input
                  id="partyName"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  placeholder="Enter party name"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="partyAddress">Party Address</Label>
                <Textarea
                  id="partyAddress"
                  value={partyAddress}
                  onChange={(e) => setPartyAddress(e.target.value)}
                  placeholder="Enter complete address"
                  rows={3}
                />
              </div>
                <div>
                  <Label htmlFor="partyGstin">GSTIN (Optional)</Label>
                  <Input
                    id="partyGstin"
                    value={partyGstin}
                    onChange={(e) => setPartyGstin(e.target.value.toUpperCase())}
                    placeholder="e.g., 37AAICP9359G1ZU"
                    maxLength={15}
                  />
                  <p className="text-xs text-muted-foreground mt-1">15 characters, format: 00AAAAA0000A0Z0</p>
                </div>
                <div>
                  <Label htmlFor="partyPhone">Phone (Optional)</Label>
                  <Input
                    id="partyPhone"
                    type="tel"
                    value={partyPhone}
                    onChange={(e) => setPartyPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit number"
                    maxLength={10}
                  />
                </div>
              <div>
                <Label htmlFor="invoiceDate">Invoice Date</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="placeOfSupply">Place of Supply</Label>
                <Input
                  id="placeOfSupply"
                  value={placeOfSupply}
                  onChange={(e) => setPlaceOfSupply(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bill Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Bill Items</CardTitle>
              <Button onClick={addItem} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="border border-border/30 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Item {index + 1}</h3>
                    {items.length > 1 && (
                      <Button
                        onClick={() => removeItem(index)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                      <Label>Select Product (Optional)</Label>
                      <Select
                        value={item.product_id || ''}
                        onValueChange={(value) => updateItem(index, 'product_id', value || undefined)}
                        disabled={productsLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={
                            productsLoading 
                              ? "Loading products..." 
                              : "Select existing product or enter custom"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Custom Item</SelectItem>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.product_code} - {product.name} {product.price ? `(₹${product.price})` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <Label>Description *</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Product description"
                      />
                    </div>

                    <div>
                      <Label>HSN/SAC</Label>
                      <Input
                        value={item.hsn_sac}
                        onChange={(e) => updateItem(index, 'hsn_sac', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Quantity *</Label>
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label>Unit</Label>
                      <Select
                        value={item.unit}
                        onValueChange={(value) => updateItem(index, 'unit', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pcs">Pcs</SelectItem>
                          <SelectItem value="Kg">Kg</SelectItem>
                          <SelectItem value="Set">Set</SelectItem>
                          <SelectItem value="Box">Box</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Rate (₹) *</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label>Taxable Value</Label>
                      <Input
                        value={item.taxable_value.toFixed(2)}
                        disabled
                        className="bg-muted"
                      />
                    </div>

                    <div>
                      <Label>CGST %</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.cgst_rate}
                        onChange={(e) => updateItem(index, 'cgst_rate', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label>SGST %</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.sgst_rate}
                        onChange={(e) => updateItem(index, 'sgst_rate', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label>Total Amount</Label>
                      <Input
                        value={`₹${item.total_amount.toFixed(2)}`}
                        disabled
                        className="bg-muted font-bold"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Bill Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-lg">
                <span>Taxable Amount:</span>
                <span className="font-semibold">₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST:</span>
                <span>₹{totals.cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST:</span>
                <span>₹{totals.sgst.toFixed(2)}</span>
              </div>
              <div className="border-t border-border/30 pt-3 flex justify-between text-xl font-bold">
                <span>Total Amount:</span>
                <span className="text-accent">₹{totals.total.toFixed(2)}</span>
              </div>

              <div className="pt-4">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes (optional)"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateBill;