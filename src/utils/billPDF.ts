import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface BillItem {
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

interface BillData {
  bill_number: string;
  invoice_date: string;
  party_name: string;
  party_address: string;
  party_gstin: string;
  party_phone: string;
  place_of_supply: string;
  items: BillItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  total: number;
  remaining_amount: number;
}

export const generateBillPDF = async (data: BillData): Promise<Blob> => {
  try {
    if (!data.bill_number || !data.party_name || !data.items || data.items.length === 0) {
      throw new Error('Invalid bill data. Missing required fields.');
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
  
  // Company Header
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RAZZAQ AUTOMOTIVES', pageWidth / 2, 12, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('3rd CROSS, 2nd ROAD, AUTONAGAR, VIJAYAWADA-7', pageWidth / 2, 18, { align: 'center' });
  doc.text('Andhra Pradesh', pageWidth / 2, 23, { align: 'center' });
  doc.text('GSTIN: 37AFWPA9668K1ZH', pageWidth / 2, 28, { align: 'center' });
  
  // Tax Invoice Label
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Tax Invoice', pageWidth / 2, 40, { align: 'center' });
  
  // Invoice Details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Invoice No: ${data.bill_number}`, 14, 50);
  doc.setFont('helvetica', 'normal');
  
  const formattedDate = new Date(data.invoice_date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  doc.text(`Date of Invoice: ${formattedDate}`, 14, 56);
  doc.text(`Place of Supply: ${data.place_of_supply}`, 14, 62);
  
  // Bill To Section
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To', 14, 72);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  let yPos = 78;
  doc.text(data.party_name, 14, yPos);
  
  if (data.party_address) {
    yPos += 5;
    const addressLines = doc.splitTextToSize(data.party_address, 180);
    doc.text(addressLines, 14, yPos);
    yPos += addressLines.length * 5;
  }
  
  if (data.party_phone) {
    yPos += 5;
    doc.text(`Ph: ${data.party_phone}`, 14, yPos);
  }
  
  if (data.party_gstin) {
    yPos += 5;
    doc.text(`GSTIN: ${data.party_gstin}`, 14, yPos);
  }
  
  yPos += 10;
  
  // Items Table
  const tableData = data.items.map((item) => [
    item.description || 'N/A',
    item.hsn_sac || '8708',
    (item.quantity || 0).toFixed(2),
    item.unit || 'Pcs',
    (item.rate || 0).toFixed(2),
    (item.taxable_value || 0).toFixed(2),
    (item.cgst_amount || 0).toFixed(2),
    (item.sgst_amount || 0).toFixed(2),
    (item.total_amount || 0).toFixed(2)
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Description', 'HSN/SAC', 'Qty', 'Unit', 'Rate', 'Taxable Value', 'CGST', 'SGST', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8
    },
    bodyStyles: {
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 20 },
      2: { cellWidth: 15, halign: 'right' },
      3: { cellWidth: 15 },
      4: { cellWidth: 20, halign: 'right' },
      5: { cellWidth: 25, halign: 'right' },
      6: { cellWidth: 20, halign: 'right' },
      7: { cellWidth: 20, halign: 'right' },
      8: { cellWidth: 25, halign: 'right' }
    }
  });
  
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Summary
  doc.setFontSize(10);
  const rightX = pageWidth - 14;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Total (₹): ${data.items.length}`, rightX, finalY, { align: 'right' });
  doc.text(`Taxable Amount (₹): ${data.subtotal.toFixed(2)}`, rightX, finalY + 6, { align: 'right' });
  
  const totalTax = data.cgst + data.sgst;
  const taxPercent = data.items.length > 0 ? ((totalTax / data.subtotal) * 100).toFixed(0) : '0';
  doc.text(`Tax @${taxPercent}% (₹): ${totalTax.toFixed(2)}`, rightX, finalY + 12, { align: 'right' });
  
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Amount (₹): ${data.total.toFixed(2)}`, rightX, finalY + 18, { align: 'right' });
  doc.text(`Remaining Amount (₹): ${data.remaining_amount.toFixed(2)}`, rightX, finalY + 24, { align: 'right' });
  
  // HSN Summary Table
  const hsnGroups: { [key: string]: { taxable: number; cgst: number; sgst: number } } = {};
  
  data.items.forEach(item => {
    const hsn = item.hsn_sac || '8708';
    if (!hsnGroups[hsn]) {
      hsnGroups[hsn] = { taxable: 0, cgst: 0, sgst: 0 };
    }
    hsnGroups[hsn].taxable += item.taxable_value || 0;
    hsnGroups[hsn].cgst += item.cgst_amount || 0;
    hsnGroups[hsn].sgst += item.sgst_amount || 0;
  });
  
  const hsnData = Object.entries(hsnGroups).map(([hsn, values]) => [
    hsn,
    values.taxable.toFixed(2),
    values.cgst.toFixed(2),
    values.sgst.toFixed(2),
    (values.cgst + values.sgst).toFixed(2)
  ]);
  
  hsnData.push([
    'Total',
    data.subtotal.toFixed(2),
    data.cgst.toFixed(2),
    data.sgst.toFixed(2),
    totalTax.toFixed(2)
  ]);
  
  autoTable(doc, {
    startY: finalY + 30,
    head: [['HSN/SAC', 'Taxable Value', 'CGST', 'SGST', 'Total Tax']],
    body: hsnData,
    theme: 'grid',
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8
    },
    bodyStyles: {
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 35, halign: 'right' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' }
    },
    foot: [[{
      content: '',
      colSpan: 5
    }]],
    didParseCell: function(data) {
      if (data.row.index === hsnData.length - 1) {
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });
  
  const termsY = (doc as any).lastAutoTable.finalY + 10;
  
  // Terms & Bank Details
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Terms:', 14, termsY);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('1. All disputes are subject to {VIJAYAWADA} Jurisdiction.', 14, termsY + 5);
  doc.text('2. Certified that the particulars given above are true and correct.', 14, termsY + 10);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('BANK:- UNION BANK', 14, termsY + 18);
  doc.setFont('helvetica', 'normal');
  doc.text('ACCOUNT NO:- 071411011001693', 14, termsY + 23);
  doc.text('BRANCH:- AUTONAGAR', 14, termsY + 28);
  doc.text('IFS CODE:- UBIN0807141', 14, termsY + 33);
  
  // Signature
  doc.setFont('helvetica', 'italic');
  doc.text('_____________________________', rightX - 60, termsY + 30);
  doc.text('Authorised Signatory', rightX - 60, termsY + 36);
  
  // Return PDF as blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
  } catch (error: any) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error.message || 'Unknown error'}`);
  }
};

export const downloadBillPDF = async (data: BillData) => {
  try {
    const pdfBlob = await generateBillPDF(data);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.bill_number.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error('PDF Download Error:', error);
    throw new Error(`Failed to download PDF: ${error.message || 'Unknown error'}`);
  }
};