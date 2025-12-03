import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  QrCode, 
  Package, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

interface QRData {
  id: string;
  code: string;
  location: string;
  stock: number;
}

interface Product {
  id: string;
  product_code: string;
  name: string;
  location: string | null;
  stock_quantity: number | null;
  low_stock_threshold: number | null;
  price: number | null;
}

const QRScanner = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<QRData | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [action, setAction] = useState<'view' | 'stock' | 'location'>('view');
  const [stockChange, setStockChange] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [loading, setLoading] = useState(false);

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-accent" />
              QR Scanner - Login Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Please log in with an admin account to access the QR scanner.
            </p>
            <Button onClick={() => navigate('/auth')} className="w-full btn-hero">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if logged in but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Admin privileges are required to access the QR scanner.
            </p>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const startScanning = async () => {
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        async (decodedText) => {
          try {
            const qrData = JSON.parse(decodedText) as QRData;
            setScannedData(qrData);
            
            // Fetch full product details
            const { data, error } = await supabase
              .from('products')
              .select('*')
              .eq('id', qrData.id)
              .single();

            if (error) throw error;
            setProduct(data);
            
            await html5QrCode.stop();
            setScanning(false);
            toast.success('QR code scanned successfully!');
          } catch (e) {
            toast.error('Invalid QR code format');
          }
        },
        (errorMessage) => {
          // Ignore scanning errors (just means no QR code detected yet)
        }
      );
      
      setScanning(true);
    } catch (err) {
      console.error('Error starting scanner:', err);
      toast.error('Failed to start camera. Please check permissions.');
      setScanning(false);
    }
  };

  const stopScanning = async () => {
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      await html5QrCode.stop();
      setScanning(false);
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
  };

  const handleStockUpdate = async () => {
    if (!product || !stockChange) return;

    setLoading(true);
    try {
      const change = parseInt(stockChange);
      const newStock = (product.stock_quantity || 0) + change;

      if (newStock < 0) {
        toast.error('Stock cannot be negative');
        return;
      }

      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', product.id);

      if (error) throw error;

      setProduct({ ...product, stock_quantity: newStock });
      setStockChange('');
      toast.success(`Stock updated: ${product.stock_quantity} → ${newStock}`);
    } catch (error: any) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationUpdate = async () => {
    if (!product || !newLocation) return;

    setLoading(true);
    try {
      const oldLocation = product.location;

      const { error: updateError } = await supabase
        .from('products')
        .update({ location: newLocation as 'RA1' | 'RA2' | 'RA3' | 'RA4' })
        .eq('id', product.id);

      if (updateError) throw updateError;

      // Record location history
      const { error: historyError } = await supabase
        .from('product_location_history')
        .insert([{
          product_id: product.id,
          old_location: oldLocation as 'RA1' | 'RA2' | 'RA3' | 'RA4' | null,
          new_location: newLocation as 'RA1' | 'RA2' | 'RA3' | 'RA4',
          changed_by: user?.id,
          notes: 'Updated via QR scanner',
        }]);

      if (historyError) {
        console.error('Failed to record history:', historyError);
      }

      setProduct({ ...product, location: newLocation });
      setNewLocation('');
      toast.success(`Location updated: ${oldLocation} → ${newLocation}`);
    } catch (error: any) {
      console.error('Error updating location:', error);
      toast.error('Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScannedData(null);
    setProduct(null);
    setAction('view');
    setStockChange('');
    setNewLocation('');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <SEO title="QR Scanner - Inventory Management" />

      {/* Mobile-optimized Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <QrCode className="w-6 h-6 text-accent" />
              <h1 className="text-xl font-heading font-bold">QR Scanner</h1>
            </div>
            {scannedData && (
              <Button variant="ghost" size="sm" onClick={resetScanner}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <AnimatePresence mode="wait">
          {!scannedData ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div id="qr-reader" className="w-full aspect-square border-2 border-dashed border-border rounded-lg overflow-hidden mb-4" />
                  
                  <div className="space-y-4">
                    {!scanning ? (
                      <Button
                        onClick={startScanning}
                        className="w-full btn-hero text-lg py-6"
                      >
                        <QrCode className="w-6 h-6 mr-2" />
                        Start Scanning
                      </Button>
                    ) : (
                      <Button
                        onClick={stopScanning}
                        variant="outline"
                        className="w-full text-lg py-6"
                      >
                        <X className="w-6 h-6 mr-2" />
                        Stop Scanning
                      </Button>
                    )}

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground text-center">
                        Point your camera at a product QR code to view details and perform quick actions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="product-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Product Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-accent" />
                    Product Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold">{product?.name}</p>
                    <p className="text-sm text-muted-foreground font-mono">{product?.product_code}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {product?.location && (
                      <Badge variant="outline" className="text-sm">
                        <MapPin className="w-3 h-3 mr-1" />
                        {product.location}
                      </Badge>
                    )}
                    {product?.stock_quantity !== null && (
                      <Badge
                        variant={
                          product.stock_quantity === 0 ? "destructive" :
                          product.stock_quantity <= (product.low_stock_threshold || 10) ? "secondary" :
                          "default"
                        }
                      >
                        Stock: {product.stock_quantity}
                      </Badge>
                    )}
                    {product?.price && (
                      <Badge variant="outline">
                        ₹{product.price.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Tabs */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={action === 'view' ? 'default' : 'outline'}
                      onClick={() => setAction('view')}
                      className="flex-1"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant={action === 'stock' ? 'default' : 'outline'}
                      onClick={() => setAction('stock')}
                      className="flex-1"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Stock
                    </Button>
                    <Button
                      variant={action === 'location' ? 'default' : 'outline'}
                      onClick={() => setAction('location')}
                      className="flex-1"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Location
                    </Button>
                  </div>

                  {/* Stock Update */}
                  {action === 'stock' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3"
                    >
                      <Label>Update Stock Quantity</Label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setStockChange('-1')}
                          className="flex-1"
                        >
                          <TrendingDown className="w-4 h-4 mr-2" />
                          -1
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setStockChange('-10')}
                          className="flex-1"
                        >
                          -10
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setStockChange('+1')}
                          className="flex-1"
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          +1
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setStockChange('+10')}
                          className="flex-1"
                        >
                          +10
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={stockChange}
                        onChange={(e) => setStockChange(e.target.value)}
                        placeholder="Enter custom change (e.g., +5 or -3)"
                      />
                      <Button
                        onClick={handleStockUpdate}
                        disabled={loading || !stockChange}
                        className="w-full btn-hero"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Update Stock
                      </Button>
                    </motion.div>
                  )}

                  {/* Location Update */}
                  {action === 'location' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3"
                    >
                      <Label>Move to New Location</Label>
                      <Select value={newLocation} onValueChange={setNewLocation}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select warehouse location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RA1">RA1 - Warehouse 1</SelectItem>
                          <SelectItem value="RA2">RA2 - Warehouse 2</SelectItem>
                          <SelectItem value="RA3">RA3 - Warehouse 3</SelectItem>
                          <SelectItem value="RA4">RA4 - Warehouse 4</SelectItem>
                        </SelectContent>
                      </Select>
                      {product?.location && newLocation && newLocation !== product.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted/50 rounded">
                          <AlertCircle className="w-4 h-4" />
                          <span>{product.location} → {newLocation}</span>
                        </div>
                      )}
                      <Button
                        onClick={handleLocationUpdate}
                        disabled={loading || !newLocation || newLocation === product?.location}
                        className="w-full btn-hero"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Update Location
                      </Button>
                    </motion.div>
                  )}

                  {/* View Only */}
                  {action === 'view' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-center py-8"
                    >
                      <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Select an action above to update stock or location
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              <Button
                onClick={resetScanner}
                variant="outline"
                className="w-full"
              >
                Scan Another Product
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default QRScanner;