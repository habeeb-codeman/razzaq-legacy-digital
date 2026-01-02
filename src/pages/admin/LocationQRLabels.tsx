import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, QrCode, Download, Printer, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import QRCode from 'qrcode';

const LOCATIONS = [
  { id: 'RA1', name: 'Warehouse 1', description: 'Main storage area' },
  { id: 'RA2', name: 'Warehouse 2', description: 'Secondary storage' },
  { id: 'RA3', name: 'Warehouse 3', description: 'Overflow storage' },
  { id: 'RA4', name: 'Warehouse 4', description: 'Special items' },
];

const LocationQRLabels = () => {
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const toggleLocation = (locationId: string) => {
    setSelectedLocations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(locationId)) {
        newSet.delete(locationId);
      } else {
        newSet.add(locationId);
      }
      return newSet;
    });
  };

  const toggleAll = () => {
    if (selectedLocations.size === LOCATIONS.length) {
      setSelectedLocations(new Set());
    } else {
      setSelectedLocations(new Set(LOCATIONS.map(l => l.id)));
    }
  };

  const generateQRData = (locationId: string) => {
    // Create a URL that will open the scanner page with location context
    const baseUrl = window.location.origin;
    return `${baseUrl}/qr-scanner?location=${locationId}`;
  };

  const generateQRCodes = async () => {
    setLoading(true);
    try {
      for (const locationId of selectedLocations) {
        const qrData = generateQRData(locationId);
        const canvas = document.getElementById(`qr-location-${locationId}`) as HTMLCanvasElement;
        
        if (canvas) {
          await QRCode.toCanvas(canvas, qrData, {
            width: 300,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF',
            },
          });
        }
      }
      
      toast.success('Location QR codes generated!');
    } catch (error) {
      console.error('Error generating QR codes:', error);
      toast.error('Failed to generate QR codes');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (selectedLocations.size === 0) {
      toast.error('Please select locations to print');
      return;
    }
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Location QR Labels - Admin" />

      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10 print:hidden">
        <div className="container mx-auto px-6 py-4">
          <Link to="/admin" className="inline-flex items-center text-accent hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="print:hidden mb-8 space-y-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-accent" />
              <div>
                <h1 className="text-3xl font-heading font-bold">Location QR Labels</h1>
                <p className="text-muted-foreground">Generate QR codes for each warehouse location - scan to view all products at that location</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Select Locations</CardTitle>
                    <CardDescription>Choose which location QR codes to generate</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={toggleAll}>
                    {selectedLocations.size === LOCATIONS.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {LOCATIONS.map((location) => (
                    <div
                      key={location.id}
                      className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                        selectedLocations.has(location.id) 
                          ? 'border-accent bg-accent/5' 
                          : 'border-border hover:border-accent/50'
                      }`}
                      onClick={() => toggleLocation(location.id)}
                    >
                      <Checkbox
                        checked={selectedLocations.has(location.id)}
                        onCheckedChange={() => toggleLocation(location.id)}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">{location.id}</Badge>
                          <span className="font-medium">{location.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{location.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {selectedLocations.size} of {LOCATIONS.length} locations selected
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={generateQRCodes}
                      disabled={loading || selectedLocations.size === 0}
                      variant="outline"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      {loading ? 'Generating...' : 'Generate QR Codes'}
                    </Button>
                    <Button
                      onClick={handlePrint}
                      disabled={selectedLocations.size === 0}
                      className="btn-hero"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print Labels
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardContent className="p-6">
                <h3 className="font-medium mb-2">How Location QR Works</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Print and place one QR code at each warehouse location/shelf</li>
                  <li>• When scanned, it opens the scanner page filtered to that location</li>
                  <li>• Staff can view, update, or search all products at that location</li>
                  <li>• Much more efficient than individual product QR codes</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Print Area */}
          <div ref={printRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">
            {LOCATIONS
              .filter(l => selectedLocations.has(l.id))
              .map((location) => (
                <Card key={location.id} className="p-8 break-inside-avoid">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <canvas
                      id={`qr-location-${location.id}`}
                      className="w-full max-w-[300px] aspect-square border border-border rounded"
                    />
                    <div className="w-full">
                      <Badge className="text-2xl px-4 py-2 font-mono">{location.id}</Badge>
                      <h2 className="text-xl font-bold mt-3">{location.name}</h2>
                      <p className="text-muted-foreground">{location.description}</p>
                      <p className="text-xs text-muted-foreground mt-4">
                        Scan to view all products at this location
                      </p>
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
            margin: 15mm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default LocationQRLabels;