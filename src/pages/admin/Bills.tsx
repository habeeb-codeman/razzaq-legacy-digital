import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Download, Eye, Trash2, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

const Bills = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

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
    } catch (error: any) {
      toast.error('Failed to load bills');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
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

      await generateBillPDF({
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

      toast.success('Bill PDF downloaded successfully');
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(error.message || 'Failed to download bill. Please try again.');
    } finally {
      setDownloadingId(null);
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
              <p className="text-muted-foreground">Manage your invoices and bills</p>
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
                      <TableHead>GSTIN</TableHead>
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
                      filteredBills.map((bill) => (
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
                          <TableCell className="text-muted-foreground">
                            {bill.party_gstin || '-'}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ₹{bill.total_amount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                onClick={() => downloadBill(bill.id)}
                                size="sm"
                                variant="outline"
                                disabled={downloadingId === bill.id}
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
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Bills;