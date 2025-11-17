import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, FileSpreadsheet, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import Papa from 'papaparse';

interface ProductImport {
  name: string;
  description?: string;
  short_description?: string;
  price?: number;
  location: 'RA1' | 'RA2' | 'RA3' | 'RA4';
  stock_quantity?: number;
  low_stock_threshold?: number;
  sku?: string;
  phone?: string;
  tags?: string;
  category?: string;
  published?: string | boolean;
}

const BulkImport = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const exampleCSV = `name,description,short_description,price,location,stock_quantity,low_stock_threshold,sku,phone,category,tags,published
Brake Pad Set,High-quality brake pads for commercial vehicles,Premium brake pads,2500,RA1,50,10,BRK-001,1234567890,Brake Systems,"brakes,safety,maintenance",false
Air Filter,Heavy-duty air filter for truck engines,Heavy-duty filter,850,RA2,100,20,FLT-001,1234567890,Filters,"filters,engine,maintenance",false
Oil Filter,Premium oil filter for diesel engines,Premium oil filter,450,RA1,150,25,FLT-002,1234567890,Filters,"filters,oil,engine",false`;

  const downloadExample = () => {
    const blob = new Blob([exampleCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products-example.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const validateAndImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a CSV or Excel file to import');
      return;
    }

    setLoading(true);

    try {
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const products = results.data as ProductImport[];

          if (products.length === 0) {
            toast.error('No products found in file');
            setLoading(false);
            return;
          }

          // Validate products
          for (const product of products) {
            if (!product.name) {
              toast.error('Each product must have a name');
              setLoading(false);
              return;
            }
            if (!product.location || !['RA1', 'RA2', 'RA3', 'RA4'].includes(product.location)) {
              toast.error(`Invalid or missing location for product: ${product.name}. Must be RA1, RA2, RA3, or RA4`);
              setLoading(false);
              return;
            }
          }

          let successCount = 0;
          let failedCount = 0;

          for (const product of products) {
            try {
              // Get or create category
              let categoryId = null;
              if (product.category) {
                const categorySlug = product.category.toLowerCase().replace(/\s+/g, '-');
                
                const { data: existingCategory } = await supabase
                  .from('product_categories')
                  .select('id')
                  .eq('slug', categorySlug)
                  .maybeSingle();

                if (existingCategory) {
                  categoryId = existingCategory.id;
                } else {
                  const { data: newCategory, error: categoryError } = await supabase
                    .from('product_categories')
                    .insert({
                      name: product.category,
                      slug: categorySlug,
                    })
                    .select()
                    .single();

                  if (!categoryError && newCategory) {
                    categoryId = newCategory.id;
                  }
                }
              }

              // Generate product code based on location
              const { data: productCode, error: codeError } = await supabase
                .rpc('generate_product_code', { p_location: product.location });

              if (codeError) {
                console.error('Error generating product code:', codeError);
                failedCount++;
                continue;
              }

              // Create slug
              const slug = product.name.toLowerCase().replace(/\s+/g, '-');

              // Parse tags if string
              const tags = typeof product.tags === 'string' 
                ? product.tags.split(',').map(tag => tag.trim()).filter(Boolean)
                : [];

              // Insert product
              const { error } = await supabase.from('products').insert({
                name: product.name,
                slug,
                description: product.description || null,
                short_description: product.short_description || null,
                price: product.price ? Number(product.price) : null,
                location: product.location,
                stock_quantity: product.stock_quantity ? Number(product.stock_quantity) : 0,
                low_stock_threshold: product.low_stock_threshold ? Number(product.low_stock_threshold) : 10,
                sku: product.sku || null,
                phone: product.phone || null,
                category_id: categoryId,
                tags,
                published: product.published === true || product.published === 'true' || product.published === 'TRUE',
                product_code: productCode,
              });

              if (error) {
                console.error('Error inserting product:', error);
                failedCount++;
              } else {
                successCount++;
              }
            } catch (error) {
              console.error('Error processing product:', error);
              failedCount++;
            }
          }

          toast.success(
            `Import completed: ${successCount} successful, ${failedCount} failed`
          );

          if (successCount > 0) {
            setTimeout(() => {
              navigate('/admin/products');
            }, 2000);
          }
          
          setLoading(false);
        },
        error: (error) => {
          console.error('CSV parse error:', error);
          toast.error('Failed to parse CSV file');
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import products');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Bulk Import Products | Admin"
        description="Import multiple products at once using CSV or Excel files"
      />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin/products">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold">Bulk Import Products</h1>
                <p className="text-muted-foreground mt-2">
                  Import multiple products at once using CSV or Excel files
                </p>
              </div>
            </div>
            <Button 
              onClick={validateAndImport} 
              disabled={!selectedFile || loading}
              size="lg"
            >
              <Upload className="mr-2 h-5 w-5" />
              {loading ? 'Importing...' : 'Start Import'}
            </Button>
          </div>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Import Products</CardTitle>
              <CardDescription>
                Follow these steps to bulk import your products
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Download Example CSV</h3>
                    <p className="text-sm text-muted-foreground">
                      Use the example below as a template for your data
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Fill in Your Product Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Open the CSV in Excel or Google Sheets and add your products. Make sure to include the location (RA1, RA2, RA3, or RA4) for each product.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Upload and Import</h3>
                    <p className="text-sm text-muted-foreground">
                      Products will be created as unpublished drafts. Add images and publish them from the Products page.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Example Format */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                Example CSV Format
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                {exampleCSV}
              </pre>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Field Descriptions</h3>
                <ul className="grid gap-2 text-sm">
                  <li className="flex gap-2">
                    <span className="font-semibold min-w-[180px]">name</span>
                    <span className="text-muted-foreground">(Required) Product name</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold min-w-[180px]">location</span>
                    <span className="text-muted-foreground">(Required) Warehouse location: RA1, RA2, RA3, or RA4</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold min-w-[180px]">description</span>
                    <span className="text-muted-foreground">(Optional) Detailed product description</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold min-w-[180px]">short_description</span>
                    <span className="text-muted-foreground">(Optional) Brief description</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold min-w-[180px]">price</span>
                    <span className="text-muted-foreground">(Optional) Product price in rupees</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold min-w-[180px]">stock_quantity</span>
                    <span className="text-muted-foreground">(Optional) Current stock level</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold min-w-[180px]">low_stock_threshold</span>
                    <span className="text-muted-foreground">(Optional) Alert threshold for low stock</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold min-w-[180px]">sku</span>
                    <span className="text-muted-foreground">(Optional) Stock Keeping Unit code</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold min-w-[180px]">phone</span>
                    <span className="text-muted-foreground">(Optional) Contact phone number</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold min-w-[180px]">category</span>
                    <span className="text-muted-foreground">(Optional) Product category (auto-created if new)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold min-w-[180px]">tags</span>
                    <span className="text-muted-foreground">(Optional) Comma-separated tags (e.g., "brakes,safety")</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold min-w-[180px]">published</span>
                    <span className="text-muted-foreground">(Optional) true/false to publish immediately</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg space-y-2">
                <p className="text-sm font-semibold flex items-center gap-2">
                  💡 Important Notes
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Product codes are auto-generated based on location (e.g., RA1-00001, RA2-00015)</li>
                  <li>Products are imported as unpublished drafts by default</li>
                  <li>After import, add images to products before publishing them</li>
                  <li>Categories will be created automatically if they don't exist</li>
                </ul>
              </div>

              <Button onClick={downloadExample} variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Example CSV
              </Button>
            </CardContent>
          </Card>

          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload CSV or Excel File</CardTitle>
              <CardDescription>
                Select a CSV or Excel (.xlsx, .xls) file to import products
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="flex-1">
                  <Button variant="outline" className="w-full" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      {selectedFile ? selectedFile.name : 'Select CSV/Excel File'}
                    </span>
                  </Button>
                </label>
              </div>
              {selectedFile && (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="font-medium">✓ File selected: {selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click "Start Import" button at the top to begin importing products
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BulkImport;
