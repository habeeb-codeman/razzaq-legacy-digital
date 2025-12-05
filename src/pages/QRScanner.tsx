import { useState, useEffect, useRef } from 'react';
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
  AlertCircle,
  ShoppingCart,
  PackagePlus,
  Camera,
  RotateCcw,
  Boxes,
  Tag,
  DollarSign,
  Clock,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
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
  short_description: string | null;
  description: string | null;
  location: string | null;
  stock_quantity: number | null;
  low_stock_threshold: number | null;
  price: number | null;
  sku: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

const QRScanner = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<QRData | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [stockChange, setStockChange] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePanel, setActivePanel] = useState<'info' | 'stock' | 'location'>('info');
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerInitializedRef = useRef(false);

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && scannerInitializedRef.current) {
        html5QrCodeRef.current.stop().catch(console.error);
      }
    };
  }, []);

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <SEO title="QR Scanner - Login Required" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="max-w-md w-full border-accent/20">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-accent" />
              </div>
              <CardTitle>Login Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                Please log in with an admin account to access the inventory scanner.
              </p>
              <Button onClick={() => navigate('/auth')} className="w-full btn-hero">
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Show access denied if logged in but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <SEO title="QR Scanner - Access Denied" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="max-w-md w-full border-destructive/20">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-destructive">Access Denied</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                Admin privileges are required to access the QR scanner.
              </p>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                Go to Home
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const startScanning = async () => {
    try {
      // Create new instance each time
      html5QrCodeRef.current = new Html5Qrcode("qr-reader");
      scannerInitializedRef.current = true;
      
      const config = {
        fps: 10,
        qrbox: { width: 280, height: 280 },
        aspectRatio: 1.0,
      };

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          try {
            const qrData = JSON.parse(decodedText) as QRData;
            setScannedData(qrData);
            
            // Fetch full product details
            const { data, error } = await supabase
              .from('products')
              .select('*')
              .eq('id', qrData.id)
              .maybeSingle();

            if (error) throw error;
            
            if (!data) {
              toast.error('Product not found in database');
              return;
            }
            
            setProduct(data);
            
            // Stop scanner after successful scan
            if (html5QrCodeRef.current) {
              await html5QrCodeRef.current.stop();
              scannerInitializedRef.current = false;
            }
            setScanning(false);
            toast.success('Product scanned successfully!');
          } catch (e) {
            console.error('QR Parse error:', e);
            toast.error('Invalid QR code format');
          }
        },
        () => {
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
      if (html5QrCodeRef.current && scannerInitializedRef.current) {
        await html5QrCodeRef.current.stop();
        scannerInitializedRef.current = false;
      }
      setScanning(false);
    } catch (err) {
      console.error('Error stopping scanner:', err);
      setScanning(false);
    }
  };

  const handleQuickSold = async (quantity: number = 1) => {
    if (!product) return;

    setLoading(true);
    try {
      const newStock = Math.max(0, (product.stock_quantity || 0) - quantity);

      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', product.id);

      if (error) throw error;

      setProduct({ ...product, stock_quantity: newStock });
      toast.success(`Sold ${quantity} unit${quantity > 1 ? 's' : ''} - Stock: ${newStock}`);
    } catch (error: any) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStockUp = async (quantity: number = 1) => {
    if (!product) return;

    setLoading(true);
    try {
      const newStock = (product.stock_quantity || 0) + quantity;

      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', product.id);

      if (error) throw error;

      setProduct({ ...product, stock_quantity: newStock });
      toast.success(`Stocked up ${quantity} unit${quantity > 1 ? 's' : ''} - Stock: ${newStock}`);
    } catch (error: any) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomStockUpdate = async () => {
    if (!product || !stockChange) return;

    setLoading(true);
    try {
      const change = parseInt(stockChange);
      if (isNaN(change)) {
        toast.error('Please enter a valid number');
        return;
      }
      
      const newStock = Math.max(0, (product.stock_quantity || 0) + change);

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
      toast.success(`Location: ${oldLocation || 'None'} → ${newLocation}`);
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
    setActivePanel('info');
    setStockChange('');
    setNewLocation('');
  };

  const getStockStatus = (): { color: 'default' | 'destructive' | 'secondary'; text: string } => {
    if (!product) return { color: 'secondary', text: 'Unknown' };
    const stock = product.stock_quantity || 0;
    const threshold = product.low_stock_threshold || 10;
    
    if (stock === 0) return { color: 'destructive', text: 'Out of Stock' };
    if (stock <= threshold) return { color: 'secondary', text: 'Low Stock' };
    return { color: 'default', text: 'In Stock' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <SEO title="QR Scanner - Inventory Management" />

      {/* Mobile-optimized Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/30 sticky top-0 z-50">
        <div className="px-4 py-3 safe-area-inset">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <QrCode className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h1 className="text-lg font-heading font-bold">Inventory Scanner</h1>
                <p className="text-xs text-muted-foreground">Scan to manage stock</p>
              </div>
            </div>
            {scannedData && (
              <Button variant="ghost" size="icon" onClick={resetScanner} className="rounded-xl">
                <RotateCcw className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="px-4 py-4 pb-24 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {!scannedData ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Scanner View - Made larger */}
              <Card className="overflow-hidden border-accent/20">
                <CardContent className="p-0">
                  <div 
                    id="qr-reader" 
                    className="w-full aspect-square bg-muted/50"
                    style={{ minHeight: '350px' }}
                  />
                </CardContent>
              </Card>
              
              {/* Scanner Controls */}
              <div className="space-y-3">
                {!scanning ? (
                  <Button
                    onClick={startScanning}
                    className="w-full btn-hero text-lg py-7 rounded-2xl shadow-lg"
                  >
                    <Camera className="w-6 h-6 mr-3" />
                    Start Camera
                  </Button>
                ) : (
                  <Button
                    onClick={stopScanning}
                    variant="outline"
                    className="w-full text-lg py-7 rounded-2xl border-2"
                  >
                    <X className="w-6 h-6 mr-3" />
                    Stop Scanning
                  </Button>
                )}

                <div className="bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/30">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <QrCode className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Point at Product QR Code</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Position the QR code within the frame. The scanner will automatically detect and read it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="product-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Product Header Card */}
              <Card className="overflow-hidden border-accent/20">
                <div className="bg-gradient-to-br from-accent/10 to-accent/5 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold truncate">{product?.name}</h2>
                      <p className="text-sm text-muted-foreground font-mono mt-1">{product?.product_code}</p>
                    </div>
                    <Badge variant={getStockStatus().color} className="ml-3 flex-shrink-0">
                      {getStockStatus().text}
                    </Badge>
                  </div>
                </div>
                
                {/* Stock Display */}
                <div className="p-4 bg-card">
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-accent">{product?.stock_quantity ?? 0}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Current Stock</p>
                    </div>
                    <Separator orientation="vertical" className="h-12" />
                    <div className="text-center">
                      <p className="text-2xl font-semibold">{product?.low_stock_threshold ?? 10}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Low Threshold</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions - Sold & Stocking Up */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => handleQuickSold(1)}
                  disabled={loading || (product?.stock_quantity || 0) === 0}
                  variant="outline"
                  className="h-20 flex-col gap-2 rounded-2xl border-2 border-destructive/30 hover:bg-destructive/10 hover:border-destructive"
                >
                  <ShoppingCart className="w-6 h-6 text-destructive" />
                  <span className="font-semibold">Sold 1</span>
                </Button>
                <Button 
                  onClick={() => handleQuickStockUp(1)}
                  disabled={loading}
                  variant="outline"
                  className="h-20 flex-col gap-2 rounded-2xl border-2 border-green-500/30 hover:bg-green-500/10 hover:border-green-500"
                >
                  <PackagePlus className="w-6 h-6 text-green-500" />
                  <span className="font-semibold">Stock +1</span>
                </Button>
              </div>

              {/* Bulk Quick Actions */}
              <div className="grid grid-cols-4 gap-2">
                <Button 
                  onClick={() => handleQuickSold(5)}
                  disabled={loading || (product?.stock_quantity || 0) < 5}
                  variant="ghost"
                  size="sm"
                  className="h-12 rounded-xl text-destructive hover:bg-destructive/10"
                >
                  -5
                </Button>
                <Button 
                  onClick={() => handleQuickSold(10)}
                  disabled={loading || (product?.stock_quantity || 0) < 10}
                  variant="ghost"
                  size="sm"
                  className="h-12 rounded-xl text-destructive hover:bg-destructive/10"
                >
                  -10
                </Button>
                <Button 
                  onClick={() => handleQuickStockUp(5)}
                  disabled={loading}
                  variant="ghost"
                  size="sm"
                  className="h-12 rounded-xl text-green-500 hover:bg-green-500/10"
                >
                  +5
                </Button>
                <Button 
                  onClick={() => handleQuickStockUp(10)}
                  disabled={loading}
                  variant="ghost"
                  size="sm"
                  className="h-12 rounded-xl text-green-500 hover:bg-green-500/10"
                >
                  +10
                </Button>
              </div>

              {/* Panel Tabs */}
              <div className="flex gap-2 bg-muted/50 p-1 rounded-2xl">
                <Button
                  variant={activePanel === 'info' ? 'default' : 'ghost'}
                  onClick={() => setActivePanel('info')}
                  className="flex-1 rounded-xl"
                  size="sm"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Details
                </Button>
                <Button
                  variant={activePanel === 'stock' ? 'default' : 'ghost'}
                  onClick={() => setActivePanel('stock')}
                  className="flex-1 rounded-xl"
                  size="sm"
                >
                  <Boxes className="w-4 h-4 mr-2" />
                  Custom
                </Button>
                <Button
                  variant={activePanel === 'location' ? 'default' : 'ghost'}
                  onClick={() => setActivePanel('location')}
                  className="flex-1 rounded-xl"
                  size="sm"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Move
                </Button>
              </div>

              {/* Panel Content */}
              <Card className="border-border/30">
                <CardContent className="pt-4">
                  <AnimatePresence mode="wait">
                    {/* Info Panel */}
                    {activePanel === 'info' && (
                      <motion.div
                        key="info"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                      >
                        {/* Location */}
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Location</p>
                            <p className="font-semibold">{product?.location || 'Not assigned'}</p>
                          </div>
                        </div>

                        {/* Price */}
                        {product?.price && (
                          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                              <DollarSign className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Price</p>
                              <p className="font-semibold">₹{product.price.toLocaleString()}</p>
                            </div>
                          </div>
                        )}

                        {/* SKU */}
                        {product?.sku && (
                          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                              <Hash className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">SKU</p>
                              <p className="font-semibold font-mono">{product.sku}</p>
                            </div>
                          </div>
                        )}

                        {/* Description */}
                        {product?.short_description && (
                          <div className="p-3 bg-muted/30 rounded-xl">
                            <p className="text-xs text-muted-foreground mb-1">Description</p>
                            <p className="text-sm">{product.short_description}</p>
                          </div>
                        )}

                        {/* Tags */}
                        {product?.tags && product.tags.length > 0 && (
                          <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
                            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Tag className="w-5 h-5 text-purple-500" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground mb-2">Tags</p>
                              <div className="flex flex-wrap gap-1">
                                {product.tags.map((tag, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Last Updated */}
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Last Updated</p>
                            <p className="font-medium text-sm">
                              {product?.updated_at ? new Date(product.updated_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'Unknown'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Custom Stock Panel */}
                    {activePanel === 'stock' && (
                      <motion.div
                        key="stock"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                      >
                        <div>
                          <Label className="text-sm font-medium">Custom Stock Change</Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Enter a positive number to add stock, or negative to reduce
                          </p>
                        </div>
                        
                        <Input
                          type="number"
                          value={stockChange}
                          onChange={(e) => setStockChange(e.target.value)}
                          placeholder="e.g., +25 or -10"
                          className="text-lg h-14 rounded-xl text-center font-semibold"
                        />
                        
                        {stockChange && (
                          <div className="p-3 bg-muted/50 rounded-xl text-center">
                            <p className="text-sm text-muted-foreground">
                              New stock will be: <span className="font-bold text-foreground">
                                {Math.max(0, (product?.stock_quantity || 0) + parseInt(stockChange || '0'))}
                              </span>
                            </p>
                          </div>
                        )}
                        
                        <Button
                          onClick={handleCustomStockUpdate}
                          disabled={loading || !stockChange}
                          className="w-full btn-hero h-14 rounded-xl text-lg"
                        >
                          <Check className="w-5 h-5 mr-2" />
                          Apply Change
                        </Button>
                      </motion.div>
                    )}

                    {/* Location Panel */}
                    {activePanel === 'location' && (
                      <motion.div
                        key="location"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                      >
                        <div>
                          <Label className="text-sm font-medium">Move to Location</Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Current: <span className="font-semibold">{product?.location || 'Not assigned'}</span>
                          </p>
                        </div>
                        
                        <Select value={newLocation} onValueChange={setNewLocation}>
                          <SelectTrigger className="h-14 rounded-xl text-lg">
                            <SelectValue placeholder="Select warehouse" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="RA1">RA1 - Warehouse 1</SelectItem>
                            <SelectItem value="RA2">RA2 - Warehouse 2</SelectItem>
                            <SelectItem value="RA3">RA3 - Warehouse 3</SelectItem>
                            <SelectItem value="RA4">RA4 - Warehouse 4</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {product?.location && newLocation && newLocation !== product.location && (
                          <div className="flex items-center justify-center gap-3 p-4 bg-accent/10 rounded-xl">
                            <Badge variant="outline" className="text-sm">{product.location}</Badge>
                            <TrendingUp className="w-4 h-4 text-accent" />
                            <Badge variant="default" className="text-sm">{newLocation}</Badge>
                          </div>
                        )}
                        
                        <Button
                          onClick={handleLocationUpdate}
                          disabled={loading || !newLocation || newLocation === product?.location}
                          className="w-full btn-hero h-14 rounded-xl text-lg"
                        >
                          <MapPin className="w-5 h-5 mr-2" />
                          Move Product
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Scan Another Button */}
              <Button
                onClick={resetScanner}
                variant="outline"
                className="w-full h-14 rounded-2xl border-2"
              >
                <QrCode className="w-5 h-5 mr-2" />
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
