import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Download, Trash2, ArrowLeft, Search, MessageCircle, CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generateBillPDF } from '@/utils/billPDF';
import SEO from '@/components/SEO';

interface Bill {
  id: string;
  bill_number: string;
  invoice_date: string;
  party_name: string;
  party_address: string;
  party_gstin: string;
  party_phone: string;
  place_of_supply: string;
  subtotal: number;
  cgst_amount: number;
  sgst_amount: number;
  total_amount: number;
  remaining_amount: number;
  created_at: string;
}

interface BillPayment {
  id: string;
  bill_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  notes: string | null;
}

const Bills = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [payments, setPayments] = useState<Record<string, BillPayment[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  
  // Payment dialog state
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBills(data || []);

      // Fetch all payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('bill_payments')
        .select('*')
        .order('payment_date', { ascending: false });

      if (paymentsError) throw paymentsError;

      // Group payments by bill_id
      const paymentsMap: Record<string, BillPayment[]> = {};
      (paymentsData || []).forEach((payment: BillPayment) => {
        if (!paymentsMap[payment.bill_id]) {
          paymentsMap[payment.bill_id] = [];
        }
        paymentsMap[payment.bill_id].push(payment);
      });
      setPayments(paymentsMap);
    } catch (error: any) {
      toast.error('Failed to load bills');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatus = (bill: Bill) => {
    const billPayments = payments[bill.id] || [];
    const totalPaid = billPayments.reduce((sum, p) => sum + p.amount, 0);
    
    if (totalPaid >= bill.total_amount) {
      return { status: 'paid', label: 'Paid', icon: CheckCircle, color: 'text-green-500 border-green-500' };
    }
    if (totalPaid > 0) {
      return { status: 'partial', label: `₹${totalPaid.toFixed(0)} Paid`, icon: Clock, color: 'text-yellow-500 border-yellow-500' };
    }
    return { status: 'unpaid', label: 'Unpaid', icon: AlertCircle, color: 'text-destructive border-destructive' };
  };

  const downloadBill = async (billId: string) => {
    setDownloadingId(billId);
    try {
      const { data: bill, error: billError } = await supabase
        .from('bills')
        .select('*')
        .eq('id', billId)
        .single();

      if (billError) throw billError;

      if (bill.pdf_url) {
        const { data: pdfData, error: downloadError } = await supabase.storage
          .from('bills')
          .download(bill.pdf_url);

        if (downloadError) throw downloadError;

        const url = URL.createObjectURL(pdfData);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${bill.bill_number.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        link.click();
        URL.revokeObjectURL(url);

        toast.success('Bill PDF downloaded successfully');
      } else {
        const { data: items, error: itemsError } = await supabase
          .from('bill_items')
          .select('*')
          .eq('bill_id', billId)
          .order('created_at');

        if (itemsError) throw itemsError;

        if (!items || items.length === 0) {
          toast.error('No items found for this bill');
          return;
        }

        const pdfBlob = await generateBillPDF({
          bill_number: bill.bill_number,
          invoice_date: bill.invoice_date,
          party_name: bill.party_name,
          party_address: bill.party_address,
          party_gstin: bill.party_gstin,
          party_phone: bill.party_phone,
          place_of_supply: bill.place_of_supply,
          items: items.map(item => ({
            id: item.id,
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
          })),
          subtotal: bill.subtotal,
          cgst: bill.cgst_amount,
          sgst: bill.sgst_amount,
          total: bill.total_amount,
          remaining_amount: bill.remaining_amount
        });

        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${bill.bill_number.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        link.click();
        URL.revokeObjectURL(url);

        toast.success('Bill PDF regenerated and downloaded successfully');
      }
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(error.message || 'Failed to download bill. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const shareOnWhatsApp = (bill: Bill) => {
    const paymentStatus = getPaymentStatus(bill);
    const message = encodeURIComponent(
      `*Invoice: ${bill.bill_number}*\n` +
      `Date: ${new Date(bill.invoice_date).toLocaleDateString('en-IN')}\n` +
      `Party: ${bill.party_name}\n` +
      `Amount: ₹${bill.total_amount.toFixed(2)}\n` +
      `Status: ${paymentStatus.label}\n\n` +
      `Thank you for your business!\n` +
      `- Razzaq Automotives`
    );
    
    const whatsappUrl = bill.party_phone 
      ? `https://wa.me/91${bill.party_phone.replace(/\D/g, '')}?text=${message}`
      : `https://wa.me/?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const recordPayment = async () => {
    if (!selectedBill || !paymentAmount) return;

    setSubmittingPayment(true);
    try {
      const amount = parseFloat(paymentAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }

      const { error } = await supabase
        .from('bill_payments')
        .insert({
          bill_id: selectedBill.id,
          amount,
          payment_method: paymentMethod,
          notes: paymentNotes || null
        });

      if (error) throw error;

      toast.success('Payment recorded successfully');
      setPaymentDialogOpen(false);
      setSelectedBill(null);
      setPaymentAmount('');
      setPaymentMethod('cash');
      setPaymentNotes('');
      fetchBills();
    } catch (error: any) {
      toast.error('Failed to record payment');
      console.error('Error:', error);
    } finally {
      setSubmittingPayment(false);
    }
  };

  const deleteBill = async (id: string, billNumber: string) => {
    if (!confirm(`Are you sure you want to delete bill ${billNumber}?`)) return;

    try {
      const { error } = await supabase
        .from('bills')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Bill deleted successfully');
      fetchBills();
    } catch (error: any) {
      toast.error('Failed to delete bill');
      console.error('Error:', error);
    }
  };

  const filteredBills = bills.filter(bill =>
    bill.bill_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.party_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.party_gstin?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Bills - Admin"
        description="Manage invoices and bills"
      />

      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading font-bold text-2xl text-foreground">Billing System</h1>
              <p className="text-muted-foreground">Manage Invoices</p>
            </div>

            <Link to="/admin/bills/new">
              <Button className="btn-hero">
                <Plus className="w-4 h-4 mr-2" />
                Create Bill
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">All Bills</h2>
              <p className="text-muted-foreground">Manage your invoices and payments</p>
            </div>
            <Link to="/admin">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by bill number, party name, or GSTIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Bills Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Party Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading bills...
                        </TableCell>
                      </TableRow>
                    ) : filteredBills.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          {searchTerm ? 'No bills found matching your search' : 'No bills created yet'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBills.map((bill) => {
                        const status = getPaymentStatus(bill);
                        const StatusIcon = status.icon;
                        return (
                          <TableRow key={bill.id}>
                            <TableCell className="font-medium">{bill.bill_number}</TableCell>
                            <TableCell>
                              {new Date(bill.invoice_date).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </TableCell>
                            <TableCell>{bill.party_name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={status.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              ₹{bill.total_amount.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  onClick={() => {
                                    setSelectedBill(bill);
                                    setPaymentDialogOpen(true);
                                  }}
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 hover:text-green-700"
                                  title="Record Payment"
                                >
                                  <CreditCard className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => shareOnWhatsApp(bill)}
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 hover:text-green-700"
                                  title="Share on WhatsApp"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => downloadBill(bill.id)}
                                  size="sm"
                                  variant="outline"
                                  disabled={downloadingId === bill.id}
                                  title="Download PDF"
                                >
                                  {downloadingId === bill.id ? (
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Download className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  onClick={() => deleteBill(bill.id, bill.bill_number)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment for {selectedBill?.bill_number}
            </DialogDescription>
          </DialogHeader>

          {selectedBill && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-semibold">₹{selectedBill.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Already Paid:</span>
                  <span className="font-semibold text-green-500">
                    ₹{(payments[selectedBill.id] || []).reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Remaining:</span>
                  <span className="font-bold text-accent">
                    ₹{(selectedBill.total_amount - (payments[selectedBill.id] || []).reduce((sum, p) => sum + p.amount, 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Amount</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (Optional)</label>
                <Input
                  placeholder="Payment reference, remarks..."
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={recordPayment} disabled={submittingPayment || !paymentAmount}>
              {submittingPayment ? 'Recording...' : 'Record Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bills;