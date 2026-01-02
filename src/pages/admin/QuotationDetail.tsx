import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Check, X, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Quotation {
  id: string;
  quotation_number: string;
  party_name: string;
  party_address: string | null;
  vehicle_number: string | null;
  comments: string | null;
  status: 'pending' | 'accepted' | 'declined';
  subtotal: number;
  total_amount: number;
  created_at: string;
}

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  total_amount: number;
}

const QuotationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchQuotation();
    }
  }, [id]);

  const fetchQuotation = async () => {
    try {
      const { data: quotationData, error: quotationError } = await supabase
        .from('quotations')
        .select('*')
        .eq('id', id)
        .single();

      if (quotationError) throw quotationError;
      setQuotation(quotationData);

      const { data: itemsData, error: itemsError } = await supabase
        .from('quotation_items')
        .select('*')
        .eq('quotation_id', id)
        .order('created_at');

      if (itemsError) throw itemsError;
      setItems(itemsData || []);
    } catch (error: any) {
      console.error('Error fetching quotation:', error);
      toast.error('Failed to load quotation');
      navigate('/admin/quotations');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!quotation) return;
    
    try {
      const { error: updateError } = await supabase
        .from('quotations')
        .update({ status: 'accepted' })
        .eq('id', quotation.id);

      if (updateError) throw updateError;

      const { data: orderNumberData, error: orderNumberError } = await supabase
        .rpc('generate_order_number');

      if (orderNumberError) throw orderNumberError;

      const { data: orderData, error: orderError } = await supabase
        .from('active_orders')
        .insert({
          quotation_id: quotation.id,
          order_number: orderNumberData,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      if (items.length > 0) {
        const orderItems = items.map((item) => ({
          order_id: orderData.id,
          quotation_item_id: item.id,
          description: item.description,
          quantity: item.quantity,
        }));

        const { error: insertItemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (insertItemsError) throw insertItemsError;
      }

      toast.success('Quotation accepted! Order created.');
      navigate('/admin/quotations');
    } catch (error: any) {
      console.error('Error accepting quotation:', error);
      toast.error('Failed to accept quotation');
    }
  };

  const handleDecline = async () => {
    if (!quotation) return;
    
    try {
      const { error } = await supabase
        .from('quotations')
        .update({ status: 'declined' })
        .eq('id', quotation.id);

      if (error) throw error;

      toast.success('Quotation declined');
      navigate('/admin/quotations');
    } catch (error: any) {
      console.error('Error declining quotation:', error);
      toast.error('Failed to decline quotation');
    }
  };

  const generatePDF = () => {
    if (!quotation) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('RAZZAQ AUTOMOTIVES', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('3rd Cross Road, Auto Nagar, Vijayawada - 520007', 105, 28, { align: 'center' });
    doc.text('Phone: +91-888-567-3388', 105, 34, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('QUOTATION', 105, 48, { align: 'center' });
    
    // Quotation details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const startY = 58;
    doc.text(`Quotation No: ${quotation.quotation_number}`, 14, startY);
    doc.text(`Date: ${format(new Date(quotation.created_at), 'dd/MM/yyyy')}`, 140, startY);
    
    doc.text(`Party: ${quotation.party_name}`, 14, startY + 8);
    if (quotation.vehicle_number) {
      doc.text(`Vehicle: ${quotation.vehicle_number}`, 140, startY + 8);
    }
    if (quotation.party_address) {
      doc.text(`Address: ${quotation.party_address}`, 14, startY + 16);
    }

    // Items table
    const tableData = items.map((item, index) => [
      index + 1,
      item.description,
      item.quantity,
      `₹${item.rate.toLocaleString()}`,
      `₹${item.total_amount.toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: startY + 28,
      head: [['#', 'Description', 'Qty', 'Rate', 'Amount']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [50, 50, 50] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 35, halign: 'right' },
      },
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY || startY + 50;
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ₹${quotation.total_amount.toLocaleString()}`, 180, finalY + 10, { align: 'right' });

    // Comments
    if (quotation.comments) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Notes:', 14, finalY + 25);
      doc.text(quotation.comments, 14, finalY + 32, { maxWidth: 180 });
    }

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('This is a computer generated quotation.', 105, 280, { align: 'center' });
    doc.text('Prices are subject to change without prior notice.', 105, 285, { align: 'center' });

    doc.save(`${quotation.quotation_number}.pdf`);
    toast.success('PDF downloaded!');
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: Quotation['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'accepted':
        return <Badge className="bg-green-500">Accepted</Badge>;
      case 'declined':
        return <Badge variant="destructive">Declined</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!quotation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title={`${quotation.quotation_number} - Quotation`} />

      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10 print:hidden">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/admin/quotations" className="inline-flex items-center text-accent hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Quotations
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" onClick={generatePDF}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              {quotation.status === 'pending' && (
                <>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleAccept}>
                    <Check className="w-4 h-4 mr-2" />
                    Accept
                  </Button>
                  <Button variant="destructive" onClick={handleDecline}>
                    <X className="w-4 h-4 mr-2" />
                    Decline
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          ref={printRef}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              {/* Header */}
              <div className="text-center mb-8 print:mb-6">
                <h1 className="text-3xl font-heading font-bold">RAZZAQ AUTOMOTIVES</h1>
                <p className="text-muted-foreground">3rd Cross Road, Auto Nagar, Vijayawada - 520007</p>
                <p className="text-muted-foreground">Phone: +91-888-567-3388</p>
                <h2 className="text-2xl font-bold mt-4">QUOTATION</h2>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 print:hidden">
                    <span className="font-medium">Status:</span>
                    {getStatusBadge(quotation.status)}
                  </div>
                  <p><span className="font-medium">Quotation No:</span> {quotation.quotation_number}</p>
                  <p><span className="font-medium">Party:</span> {quotation.party_name}</p>
                  {quotation.party_address && (
                    <p><span className="font-medium">Address:</span> {quotation.party_address}</p>
                  )}
                </div>
                <div className="text-right space-y-2">
                  <p><span className="font-medium">Date:</span> {format(new Date(quotation.created_at), 'dd/MM/yyyy')}</p>
                  {quotation.vehicle_number && (
                    <p><span className="font-medium">Vehicle:</span> {quotation.vehicle_number}</p>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="border rounded-lg overflow-hidden mb-8">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium">#</th>
                      <th className="text-left py-3 px-4 font-medium">Description</th>
                      <th className="text-center py-3 px-4 font-medium">Qty</th>
                      <th className="text-right py-3 px-4 font-medium">Rate</th>
                      <th className="text-right py-3 px-4 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id} className="border-t border-border">
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">{item.description}</td>
                        <td className="py-3 px-4 text-center">{item.quantity}</td>
                        <td className="py-3 px-4 text-right">₹{item.rate.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-medium">₹{item.total_amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="flex justify-end mb-8">
                <div className="w-64 space-y-2">
                  <Separator />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>₹{quotation.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Comments */}
              {quotation.comments && (
                <div className="mb-8">
                  <h3 className="font-medium mb-2">Notes:</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{quotation.comments}</p>
                </div>
              )}

              {/* Footer */}
              <div className="text-center text-sm text-muted-foreground mt-12 pt-8 border-t">
                <p>This is a computer generated quotation.</p>
                <p>Prices are subject to change without prior notice.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <style>{`
        @media print {
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:mb-6 { margin-bottom: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default QuotationDetail;