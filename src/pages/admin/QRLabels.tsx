import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, QrCode, Download, Printer, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import QRCode from 'qrcode';

interface Product {
  id: string;
  product_code: string;
  name: string;
  location: string | null;
  stock_quantity: number | null;
}

const QRLabels = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [filterLocation, setFilterLocation] = useState('all');
  const [loading, setLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

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

  const generateQRData = (product: Product) => {
    return JSON.stringify({
      id: product.id,
      code: product.product_code,
      location: product.location,
      stock: product.stock_quantity,
    });
  };

  const generateQRCodes = async () => {
    setLoading(true);
    try {
      const selectedProductsList = products.filter(p => selectedProducts.has(p.id));
      
      for (const product of selectedProductsList) {
        const qrData = generateQRData(product);
        const canvas = document.getElementById(`qr-${product.id}`) as HTMLCanvasElement;
        
        if (canvas) {
          await QRCode.toCanvas(canvas, qrData, {
            width: 200,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF',
            },
          });
        }
      }
      
      toast.success('QR codes generated successfully!');
    } catch (error) {
      console.error('Error generating QR codes:', error);
      toast.error('Failed to generate QR codes');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (selectedProducts.size === 0) {
      toast.error('Please select products to print');
      return;
    }
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (selectedProducts.size === 0) {
      toast.error('Please select products to download');
      return;
    }
    
    toast.info('Generating PDF... Please use the print dialog to save as PDF');
    window.print();
  };

  const filteredProducts = products.filter(product => {
    if (filterLocation === 'all') return true;
    return product.location === filterLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO title="QR Label Generator - Admin" />

      {/* Header - Hidden when printing */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10 print:hidden">
        <div className="container mx-auto px-6 py-4">
          <Link to="/admin/products" className="inline-flex items-center text-accent hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Controls - Hidden when printing */}
          <div className="print:hidden mb-8 space-y-6">
            <div className="flex items-center gap-3">
              <QrCode className="w-8 h-8 text-accent" />
              <h1 className="text-3xl font-heading font-bold">QR Label Generator</h1>
            </div>

            <Card>
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
                    <Button variant="outline" size="sm" onClick={toggleAll}>
                      {selectedProducts.size === filteredProducts.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={selectedProducts.has(product.id)}
                        onCheckedChange={() => toggleProduct(product.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.product_code}</p>
                        {product.location && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {product.location}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {selectedProducts.size} of {filteredProducts.length} products selected
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={generateQRCodes}
                      disabled={loading || selectedProducts.size === 0}
                      variant="outline"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {loading ? 'Generating...' : 'Generate QR Codes'}
                    </Button>
                    <Button
                      onClick={handleDownloadPDF}
                      disabled={selectedProducts.size === 0}
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button
                      onClick={handlePrint}
                      disabled={selectedProducts.size === 0}
                      className="btn-hero"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print Labels
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Print Area */}
          <div ref={printRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 print:grid-cols-3">
            {products
              .filter(p => selectedProducts.has(p.id))
              .map((product) => (
                <Card key={product.id} className="p-4 break-inside-avoid">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <canvas
                      id={`qr-${product.id}`}
                      className="w-full max-w-[200px] aspect-square border border-border rounded"
                    />
                    <div className="w-full">
                      <p className="font-bold text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{product.product_code}</p>
                      {product.location && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {product.location}
                        </Badge>
                      )}
                      {product.stock_quantity !== null && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Stock: {product.stock_quantity}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </motion.div>
      </main>

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default QRLabels;