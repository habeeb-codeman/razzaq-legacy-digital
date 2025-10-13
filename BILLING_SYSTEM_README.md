# Billing System Documentation

## Overview
The billing system is a comprehensive invoicing solution integrated with product management, PDF generation, and cloud storage. It allows admins to create, manage, and download professional tax invoices.

## Features

### 1. Bill Creation
- **Location**: `/admin/bills/new`
- **Authentication**: Admin role required
- **Capabilities**:
  - Select from existing products or create custom line items
  - Auto-fill product details (description, rate, HSN/SAC)
  - Real-time calculation of:
    - Taxable value
    - CGST & SGST (default 14% each)
    - Total amount
  - Party details with GSTIN validation
  - Invoice date and place of supply
  - Optional notes

### 2. Validation
- **Party Name**: Required
- **GSTIN**: Optional, but if provided must be valid 15-character format: `00AAAAA0000A0Z0`
- **Phone**: Optional, but if provided must be 10 digits
- **Line Items**: At least one item required with valid description, rate, and quantity
- All calculations are done automatically

### 3. PDF Generation & Storage
- Professional tax invoice with:
  - Company header (RAZZAQ AUTOMOTIVES)
  - Bill-to section
  - Itemized table with HSN/SAC codes
  - Tax breakdown (CGST/SGST)
  - HSN summary table
  - Bank details
  - Authorized signatory
- PDFs are automatically:
  - Generated when bill is created
  - Uploaded to secure cloud storage (`bills` bucket)
  - Linked to the bill record via `pdf_url`
  - Downloadable from Bills list

### 4. Bills Management
- **Location**: `/admin/bills`
- **Features**:
  - View all bills in a sortable table
  - Search by bill number, party name, or GSTIN
  - Download PDFs (from storage or regenerate)
  - Delete bills (with confirmation)
  - Displays: bill number, date, party, GSTIN, amount

### 5. Bill Numbering
- Auto-generated sequential format: `INV00001`, `INV00002`, etc.
- Uses database function `generate_bill_number()` for thread-safe generation
- Cannot be manually edited

## Workflow

1. **Create Bill**: Admin navigates to Create Bill page
2. **Fill Details**: Enter party information and select/add items
3. **Auto-Calculate**: System calculates taxes and totals in real-time
4. **Save**: Click "Save Bill"
5. **Process**:
   - Validates all inputs
   - Generates unique bill number
   - Saves bill record to database
   - Inserts all line items
   - Generates PDF document
   - Uploads PDF to secure storage
   - Updates bill with PDF URL
6. **Success**: Redirects to Bills list where PDF can be downloaded

## Database Schema

### Bills Table
- `id`: UUID (primary key)
- `bill_number`: Text (unique, auto-generated)
- `invoice_date`: Date
- `party_name`: Text (required)
- `party_address`: Text
- `party_gstin`: Text (validated if provided)
- `party_phone`: Text (validated if provided)
- `place_of_supply`: Text (default: "Andhra Pradesh - 37")
- `subtotal`: Numeric (sum of taxable values)
- `cgst_amount`: Numeric (sum of CGST)
- `sgst_amount`: Numeric (sum of SGST)
- `total_tax`: Numeric (CGST + SGST)
- `total_amount`: Numeric (subtotal + total_tax)
- `remaining_amount`: Numeric (for payment tracking)
- `notes`: Text
- `pdf_url`: Text (storage path to PDF)
- `created_by`: UUID (admin user ID)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Bill Items Table
- `id`: UUID (primary key)
- `bill_id`: UUID (foreign key to bills)
- `product_id`: UUID (optional link to products)
- `description`: Text (required)
- `hsn_sac`: Text (default: "8708")
- `quantity`: Numeric (required, > 0)
- `unit`: Text (default: "Pcs")
- `rate`: Numeric (required, > 0)
- `taxable_value`: Numeric (quantity × rate)
- `cgst_rate`: Numeric (default: 14%)
- `sgst_rate`: Numeric (default: 14%)
- `cgst_amount`: Numeric (taxable_value × cgst_rate/100)
- `sgst_amount`: Numeric (taxable_value × sgst_rate/100)
- `total_amount`: Numeric (taxable_value + cgst + sgst)

## Security

### Row-Level Security (RLS)
- All tables have RLS enabled
- Only users with `admin` role can:
  - Create bills
  - View bills
  - Update bills
  - Delete bills
  - View bill items
  - Insert bill items
  - Upload/download PDFs

### Storage Security
- `bills` bucket is private (not publicly accessible)
- Only admins can upload/download/delete PDFs
- Files organized by user ID: `{user_id}/{bill_number}_{timestamp}.pdf`

## Troubleshooting

### Blank Page Issues
- **Cause**: Authentication issues or missing admin role
- **Solution**: Ensure user is logged in and has admin role in `user_roles` table

### PDF Generation Fails
- **Cause**: Missing bill data or invalid item values
- **Solution**: Check that all required fields are filled and valid
- **Fallback**: Bill is saved to database; PDF can be regenerated from Bills list

### Download Not Working
- **Cause**: Missing `pdf_url` or storage access issues
- **Solution**: System automatically regenerates PDF from database if storage fails

### GSTIN Validation Errors
- **Format**: Must be exactly 15 characters
- **Pattern**: `00AAAAA0000A0Z0` where:
  - First 2 characters: State code (numbers)
  - Next 5: PAN card (5 letters)
  - Next 4: Registration number
  - 13th: Entity type (letter)
  - 14th: Default 'Z'
  - 15th: Check digit

### Bill Number Already Exists
- **Cause**: Rare race condition or manual database edits
- **Solution**: Delete the conflicting bill or retry (system will generate next number)

## Tips

1. **Use Existing Products**: Selecting a product auto-fills description and rate
2. **Custom Items**: Leave product dropdown as "Custom Item" to enter manual details
3. **Tax Rates**: Default is 14% CGST + 14% SGST (28% total), can be changed per item
4. **Search**: Use bill number, party name, or GSTIN to quickly find bills
5. **Backup**: PDFs are stored in cloud, but also keep local copies if needed
6. **Bulk Operations**: For multiple similar bills, consider duplicating an existing one (future feature)

## API Endpoints Used

- `supabase.rpc('generate_bill_number')`: Generate unique bill number
- `supabase.from('bills')`: CRUD operations on bills
- `supabase.from('bill_items')`: CRUD operations on line items
- `supabase.storage.from('bills')`: Upload/download PDFs

## Future Enhancements

- [ ] Payment tracking (utilize `remaining_amount` field)
- [ ] Email bills to customers
- [ ] Bulk bill generation
- [ ] Invoice templates/customization
- [ ] Reports & analytics
- [ ] Export to Excel
- [ ] Bill duplication
- [ ] Credit notes/returns
- [ ] Multi-currency support
- [ ] Recurring invoices
