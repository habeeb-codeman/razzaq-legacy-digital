import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, FileJson, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

interface ProductImport {
  name: string;
  short_description?: string;
  description?: string;
  price?: number;
  phone?: string;
  tags?: string[];
  category?: string;
  published?: boolean;
}

const BulkImport = () => {
  const navigate = useNavigate();
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);

  const exampleJson = `[
  {
    "name": "Product Name 1",
    "short_description": "Brief description",
    "description": "Full product description",
    "price": 1299.99,
    "phone": "1234567890",
    "tags": ["tag1", "tag2"],
    "category": "category-slug",
    "published": true
  },
  {
    "name": "Product Name 2",
    "short_description": "Another product",
    "price": 599.50,
    "published": false
  }
]`;

  const downloadExample = () => {
    const blob = new Blob([exampleJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products-example.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJsonInput(text);
    };
    reader.readAsText(file);
  };

  const validateAndImport = async () => {
    if (!jsonInput.trim()) {
      toast.error('Please enter or upload JSON data');
      return;
    }

    setLoading(true);
    try {
      const products: ProductImport[] = JSON.parse(jsonInput);

      if (!Array.isArray(products)) {
        throw new Error('JSON must be an array of products');
      }

      // Validate required fields
      for (const product of products) {
        if (!product.name) {
          throw new Error('All products must have a name');
        }
      }

      // Get or create categories if specified
      const categoryMap = new Map<string, string>();
      
      for (const product of products) {
        if (product.category && !categoryMap.has(product.category)) {
          // Try to find existing category
          const { data: existingCategory } = await supabase
            .from('product_categories')
            .select('id')
            .eq('slug', product.category)
            .single();

          if (existingCategory) {
            categoryMap.set(product.category, existingCategory.id);
          }
        }
      }

      // Prepare products for insertion
      const productsToInsert = await Promise.all(
        products.map(async (product) => {
          // Generate product code
          const { data: codeData } = await supabase.rpc('generate_product_code');
          
          return {
            name: product.name,
            slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            short_description: product.short_description || null,
            description: product.description || null,
            price: product.price || null,
            phone: product.phone || null,
            tags: product.tags || [],
            category_id: product.category ? categoryMap.get(product.category) || null : null,
            published: product.published ?? false,
            product_code: codeData || `PRD-${Date.now()}`
          };
        })
      );

      // Insert products
      const { data, error } = await supabase
        .from('products')
        .insert(productsToInsert)
        .select();

      if (error) throw error;

      toast.success(`Successfully imported ${data.length} products as drafts! Now add images and publish them.`);
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(error.message || 'Failed to import products. Please check your JSON format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Bulk Import Products - Admin"
        description="Mass import products using JSON"
      />

      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/admin/products" className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </Link>
            <Button onClick={validateAndImport} disabled={loading} className="btn-hero">
              <Upload className="w-4 h-4 mr-2" />
              {loading ? 'Importing...' : 'Import Products'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Bulk Import Products</h1>
            <p className="text-muted-foreground">Import multiple products at once using JSON format</p>
            <div className="mt-3 p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <p className="text-sm font-medium text-accent mb-1">📋 Import Workflow:</p>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Import products using JSON (creates drafts by default)</li>
                <li>Go to Products page and edit each product</li>
                <li>Add images to individual products</li>
                <li>Toggle "Published" to make them visible to users</li>
              </ol>
            </div>
          </div>

          {/* Example & Download */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="w-5 h-5" />
                JSON Format
              </CardTitle>
              <CardDescription>
                Download the example file or copy the format below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={downloadExample} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Example JSON
              </Button>
              
              <div>
                <Label>Example Format</Label>
                <pre className="mt-2 bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{exampleJson}</code>
                </pre>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
                <p className="font-semibold">Field Descriptions:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><strong>name</strong> (required): Product name</li>
                  <li><strong>short_description</strong>: Brief description for listings</li>
                  <li><strong>description</strong>: Full product description</li>
                  <li><strong>price</strong>: Product price in ₹</li>
                  <li><strong>phone</strong>: Contact number</li>
                  <li><strong>tags</strong>: Array of tags for categorization</li>
                  <li><strong>category</strong>: Category slug (must exist)</li>
                  <li><strong>published</strong>: true/false (default: false - recommended for bulk imports)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Upload or Paste */}
          <Card>
            <CardHeader>
              <CardTitle>Upload or Paste JSON</CardTitle>
              <CardDescription>
                Upload a JSON file or paste your JSON data directly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Upload JSON File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="mt-2"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or paste JSON</span>
                </div>
              </div>

              <div>
                <Label htmlFor="json-input">JSON Data</Label>
                <Textarea
                  id="json-input"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Paste your JSON data here..."
                  rows={15}
                  className="mt-2 font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default BulkImport;
