import { useState, useEffect, useRef, useCallback } from 'react';
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
  Hash,
  Flag,
  AlertTriangle,
  History,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
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
  status: string;
  review_notes: string | null;
}

interface ScanHistoryItem {
  id: string;
  action: string;
  quantity_change: number | null;
  old_stock: number | null;
  new_stock: number | null;
  notes: string | null;
  scanned_at: string;
}

// Audio feedback functions
const playSound = (type: 'success' | 'error' | 'action') => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch (type) {
    case 'success':
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1108.73, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      break;
    case 'error':
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
      break;
    case 'action':
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
      break;
  }
};

const QRScanner = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<QRData | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [stockChange, setStockChange] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePanel, setActivePanel] = useState<'info' | 'stock' | 'location' | 'flag' | 'history'>('info');
  const [flagNote, setFlagNote] = useState('');
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
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

  // Fetch scan history when product changes
  const fetchScanHistory = useCallback(async (productId: string) => {
    const { data, error } = await supabase
      .from('scan_history')
      .select('*')
      .eq('product_id', productId)
      .order('scanned_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setScanHistory(data);
    }
  }, []);

  // Record scan action
  const recordScanAction = async (
    action: 'view' | 'sold' | 'stock_up' | 'location_change' | 'flag' | 'unflag',
    details?: {
      quantity_change?: number;
      old_stock?: number;
      new_stock?: number;
      old_location?: string;
      new_location?: string;
      notes?: string;
    }
  ) => {
    if (!product || !user) return;

    try {
      await supabase.from('scan_history').insert({
        product_id: product.id,
        scanned_by: user.id,
        action,
        ...details,
      });
    } catch (error) {
      console.error('Failed to record scan action:', error);
    }
  };

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
            
            const { data, error } = await supabase
              .from('products')
              .select('*')
              .eq('id', qrData.id)
              .maybeSingle();

            if (error) throw error;
            
            if (!data) {
              playSound('error');
              toast.error('Product not found in database');
              return;
            }
            
            setProduct(data);
            fetchScanHistory(data.id);
            
            // Record view action
            await supabase.from('scan_history').insert({
              product_id: data.id,
              scanned_by: user?.id,
              action: 'view',
            });
            
            if (html5QrCodeRef.current) {
              await html5QrCodeRef.current.stop();
              scannerInitializedRef.current = false;
            }
            setScanning(false);
            playSound('success');
            toast.success('Product scanned successfully!');
          } catch (e) {
            console.error('QR Parse error:', e);
            playSound('error');
            toast.error('Invalid QR code format');
          }
        },
        () => {}
      );
      
      setScanning(true);
    } catch (err) {
      console.error('Error starting scanner:', err);
      playSound('error');
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
      const oldStock = product.stock_quantity || 0;
      const newStock = Math.max(0, oldStock - quantity);

      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', product.id);

      if (error) throw error;

      await recordScanAction('sold', {
        quantity_change: -quantity,
        old_stock: oldStock,
        new_stock: newStock,
      });

      setProduct({ ...product, stock_quantity: newStock });
      playSound('action');
      toast.success(`Sold ${quantity} unit${quantity > 1 ? 's' : ''} - Stock: ${newStock}`);
      fetchScanHistory(product.id);
    } catch (error: any) {
      console.error('Error updating stock:', error);
      playSound('error');
      toast.error('Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStockUp = async (quantity: number = 1) => {
    if (!product) return;

    setLoading(true);
    try {
      const oldStock = product.stock_quantity || 0;
      const newStock = oldStock + quantity;

      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', product.id);

      if (error) throw error;

      await recordScanAction('stock_up', {
        quantity_change: quantity,
        old_stock: oldStock,
        new_stock: newStock,
      });

      setProduct({ ...product, stock_quantity: newStock });
      playSound('action');
      toast.success(`Stocked up ${quantity} unit${quantity > 1 ? 's' : ''} - Stock: ${newStock}`);
      fetchScanHistory(product.id);
    } catch (error: any) {
      console.error('Error updating stock:', error);
      playSound('error');
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
      
      const oldStock = product.stock_quantity || 0;
      const newStock = Math.max(0, oldStock + change);

      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', product.id);

      if (error) throw error;

      await recordScanAction(change > 0 ? 'stock_up' : 'sold', {
        quantity_change: change,
        old_stock: oldStock,
        new_stock: newStock,
      });

      setProduct({ ...product, stock_quantity: newStock });
      setStockChange('');
      playSound('action');
      toast.success(`Stock updated: ${oldStock} → ${newStock}`);
      fetchScanHistory(product.id);
    } catch (error: any) {
      console.error('Error updating stock:', error);
      playSound('error');
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

      await recordScanAction('location_change', {
        old_location: oldLocation || undefined,
        new_location: newLocation,
      });

      setProduct({ ...product, location: newLocation });
      setNewLocation('');
      playSound('action');
      toast.success(`Location: ${oldLocation || 'None'} → ${newLocation}`);
      fetchScanHistory(product.id);
    } catch (error: any) {
      console.error('Error updating location:', error);
      playSound('error');
      toast.error('Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  const handleFlagProduct = async () => {
    if (!product) return;

    setLoading(true);
    try {
      const newStatus = product.status === 'under_review' ? 'available' : 'under_review';
      
      const { error } = await supabase
        .from('products')
        .update({ 
          status: newStatus,
          review_notes: newStatus === 'under_review' ? flagNote : null,
          flagged_at: newStatus === 'under_review' ? new Date().toISOString() : null,
          flagged_by: newStatus === 'under_review' ? user?.id : null,
        })
        .eq('id', product.id);

      if (error) throw error;

      await recordScanAction(newStatus === 'under_review' ? 'flag' : 'unflag', {
        notes: flagNote || undefined,
      });

      setProduct({ 
        ...product, 
        status: newStatus,
        review_notes: newStatus === 'under_review' ? flagNote : null,
      });
      setFlagNote('');
      playSound('action');
      toast.success(newStatus === 'under_review' ? 'Product flagged for review' : 'Product cleared from review');
      fetchScanHistory(product.id);
    } catch (error: any) {
      console.error('Error flagging product:', error);
      playSound('error');
      toast.error('Failed to update product status');
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
    setFlagNote('');
    setScanHistory([]);
  };

  const getStockStatus = (): { color: 'default' | 'destructive' | 'secondary'; text: string } => {
    if (!product) return { color: 'secondary', text: 'Unknown' };
    const stock = product.stock_quantity || 0;
    const threshold = product.low_stock_threshold || 10;
    
    if (stock === 0) return { color: 'destructive', text: 'Out of Stock' };
    if (stock <= threshold) return { color: 'secondary', text: 'Low Stock' };
    return { color: 'default', text: 'In Stock' };
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'sold': return <ShoppingCart className="w-4 h-4 text-destructive" />;
      case 'stock_up': return <PackagePlus className="w-4 h-4 text-green-500" />;
      case 'location_change': return <MapPin className="w-4 h-4 text-blue-500" />;
      case 'flag': return <Flag className="w-4 h-4 text-orange-500" />;
      case 'unflag': return <Check className="w-4 h-4 text-green-500" />;
      case 'view': return <QrCode className="w-4 h-4 text-muted-foreground" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatActionText = (item: ScanHistoryItem) => {
    switch (item.action) {
      case 'sold': return `Sold ${Math.abs(item.quantity_change || 0)} units`;
      case 'stock_up': return `Stocked up ${item.quantity_change || 0} units`;
      case 'location_change': return `Moved to ${item.new_stock}`;
      case 'flag': return 'Flagged for review';
      case 'unflag': return 'Cleared from review';
      case 'view': return 'Scanned';
      default: return item.action;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <SEO title="QR Scanner - Inventory Management" />

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
              <Card className="overflow-hidden border-accent/20">
                <CardContent className="p-0">
                  <div 
                    id="qr-reader" 
                    className="w-full aspect-square bg-muted/50"
                    style={{ minHeight: '350px' }}
                  />
                </CardContent>
              </Card>
              
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
                    <div className="flex flex-col gap-1 ml-3 items-end">
                      <Badge variant={getStockStatus().color}>
                        {getStockStatus().text}
                      </Badge>
                      {product?.status === 'under_review' && (
                        <Badge variant="outline" className="border-orange-500 text-orange-500">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Under Review
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Review Notes if flagged */}
                {product?.status === 'under_review' && product.review_notes && (
                  <div className="px-4 py-2 bg-orange-500/10 border-t border-orange-500/20">
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      <strong>Review Note:</strong> {product.review_notes}
                    </p>
                  </div>
                )}
                
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

              {/* Panel Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'info', icon: Package, label: 'Info' },
                  { id: 'stock', icon: Boxes, label: 'Stock' },
                  { id: 'location', icon: MapPin, label: 'Move' },
                  { id: 'flag', icon: Flag, label: 'Flag' },
                  { id: 'history', icon: History, label: 'History' },
                ].map(({ id, icon: Icon, label }) => (
                  <Button
                    key={id}
                    variant={activePanel === id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActivePanel(id as any)}
                    className="rounded-xl flex-shrink-0"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>

              {/* Info Panel */}
              <AnimatePresence mode="wait">
                {activePanel === 'info' && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Card className="border-border/30">
                      <CardContent className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl">
                            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[10px] text-muted-foreground uppercase">Location</p>
                              <p className="font-medium truncate">{product?.location || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl">
                            <DollarSign className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[10px] text-muted-foreground uppercase">Price</p>
                              <p className="font-medium truncate">
                                {product?.price ? `₹${product.price.toLocaleString()}` : 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl">
                            <Hash className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[10px] text-muted-foreground uppercase">SKU</p>
                              <p className="font-medium truncate">{product?.sku || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl">
                            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[10px] text-muted-foreground uppercase">Updated</p>
                              <p className="font-medium truncate text-xs">
                                {product?.updated_at ? new Date(product.updated_at).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {product?.short_description && (
                          <div className="p-3 bg-muted/30 rounded-xl">
                            <p className="text-[10px] text-muted-foreground uppercase mb-1">Description</p>
                            <p className="text-sm">{product.short_description}</p>
                          </div>
                        )}

                        {product?.tags && product.tags.length > 0 && (
                          <div className="p-3 bg-muted/30 rounded-xl">
                            <p className="text-[10px] text-muted-foreground uppercase mb-2">Tags</p>
                            <div className="flex flex-wrap gap-1">
                              {product.tags.map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Custom Stock Panel */}
                {activePanel === 'stock' && (
                  <motion.div
                    key="stock"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Card className="border-border/30">
                      <CardHeader className="pb-2 pt-4 px-4">
                        <CardTitle className="text-base">Custom Stock Update</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 space-y-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setStockChange('-5')}
                            className="flex-1 rounded-xl"
                          >
                            <TrendingDown className="w-4 h-4 mr-1 text-destructive" />
                            -5
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setStockChange('-10')}
                            className="flex-1 rounded-xl"
                          >
                            <TrendingDown className="w-4 h-4 mr-1 text-destructive" />
                            -10
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setStockChange('+5')}
                            className="flex-1 rounded-xl"
                          >
                            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                            +5
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setStockChange('+10')}
                            className="flex-1 rounded-xl"
                          >
                            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                            +10
                          </Button>
                        </div>

                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter change (e.g., -3 or +5)"
                            value={stockChange}
                            onChange={(e) => setStockChange(e.target.value)}
                            className="rounded-xl"
                          />
                          <Button
                            onClick={handleCustomStockUpdate}
                            disabled={loading || !stockChange}
                            className="rounded-xl btn-hero"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Location Panel */}
                {activePanel === 'location' && (
                  <motion.div
                    key="location"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Card className="border-border/30">
                      <CardHeader className="pb-2 pt-4 px-4">
                        <CardTitle className="text-base">Change Location</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="px-3 py-1">
                            Current: {product?.location || 'None'}
                          </Badge>
                          <span className="text-muted-foreground">→</span>
                          <Badge variant="secondary" className="px-3 py-1">
                            {newLocation || 'Select'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          {['RA1', 'RA2', 'RA3', 'RA4'].map((loc) => (
                            <Button
                              key={loc}
                              variant={newLocation === loc ? 'default' : 'outline'}
                              onClick={() => setNewLocation(loc)}
                              disabled={product?.location === loc}
                              className="rounded-xl"
                            >
                              {loc}
                            </Button>
                          ))}
                        </div>

                        <Button
                          onClick={handleLocationUpdate}
                          disabled={loading || !newLocation || newLocation === product?.location}
                          className="w-full rounded-xl btn-hero"
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          Confirm Move
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Flag Panel */}
                {activePanel === 'flag' && (
                  <motion.div
                    key="flag"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Card className="border-border/30">
                      <CardHeader className="pb-2 pt-4 px-4">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Flag className="w-4 h-4" />
                          Flag for Review
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Flag this product if it's damaged, defective, or needs inspection before sale.
                        </p>
                        
                        {product?.status !== 'under_review' && (
                          <div className="space-y-2">
                            <Label className="text-xs">Add a note (optional)</Label>
                            <Textarea
                              placeholder="e.g., Packaging damaged, needs inspection..."
                              value={flagNote}
                              onChange={(e) => setFlagNote(e.target.value)}
                              className="rounded-xl resize-none"
                              rows={3}
                            />
                          </div>
                        )}

                        <Button
                          onClick={handleFlagProduct}
                          disabled={loading}
                          variant={product?.status === 'under_review' ? 'default' : 'destructive'}
                          className="w-full rounded-xl"
                        >
                          {product?.status === 'under_review' ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Clear from Review
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Flag for Review
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* History Panel */}
                {activePanel === 'history' && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Card className="border-border/30">
                      <CardHeader className="pb-2 pt-4 px-4">
                        <CardTitle className="text-base flex items-center gap-2">
                          <History className="w-4 h-4" />
                          Scan History
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        {scanHistory.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No scan history yet
                          </p>
                        ) : (
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {scanHistory.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl"
                              >
                                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                                  {getActionIcon(item.action)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm">{formatActionText(item)}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(item.scanned_at).toLocaleString()}
                                  </p>
                                  {item.notes && (
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                      <MessageSquare className="w-3 h-3" />
                                      {item.notes}
                                    </p>
                                  )}
                                </div>
                                {(item.old_stock !== null && item.new_stock !== null) && (
                                  <Badge variant="outline" className="text-xs flex-shrink-0">
                                    {item.old_stock} → {item.new_stock}
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scan Another Button */}
              <Button
                onClick={resetScanner}
                variant="outline"
                className="w-full py-6 rounded-2xl border-2"
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