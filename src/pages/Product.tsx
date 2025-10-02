import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Phone, Mail, MessageCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Product {
  id: string;
  product_code: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  images: string[];
  phone: string | null;
  price: number | null;
  tags: string[] | null;
  category_id: string | null;
  published: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const Product = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load products');
      console.error(error);
    } else {
      const formattedProducts = (data || []).map(p => ({
        ...p,
        images: Array.isArray(p.images) ? p.images as string[] : []
      }));
      setProducts(formattedProducts);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.short_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'all' || product.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleWhatsAppInquiry = (product: Product) => {
    const phone = product.phone || '+919876543210'; // Default company phone
    const message = `Hello Razzaq Automotives — I'm interested in Product ${product.product_code}: "${product.name}". Please share details & availability.`;
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailInquiry = (product: Product) => {
    const subject = `Inquiry about ${product.product_code}: ${product.name}`;
    const body = `Hello,\n\nI'm interested in:\n\nProduct Code: ${product.product_code}\nProduct Name: ${product.name}\n\nPlease provide more details and pricing information.\n\nThank you.`;
    window.location.href = `mailto:info@razzaqautomotives.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handlePhoneCall = (product: Product) => {
    const phone = product.phone || '+919876543210';
    window.location.href = `tel:${phone}`;
  };

  const openLightbox = (product: Product, index: number) => {
    setSelectedProduct(product);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showPrevImage = () => {
    if (selectedProduct && lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + selectedProduct.images.length) % selectedProduct.images.length);
    }
  };

  const showNextImage = () => {
    if (selectedProduct && lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % selectedProduct.images.length);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO 
        title="Premium Truck Parts & Components - Browse Our Products"
        description="Explore Razzaq Automotives' extensive range of truck parts including cabins, fuel tanks, body parts, and electrical systems. Quality parts for TATA, Ashok Leyland & Bharat Benz vehicles."
        keywords="truck parts catalog, heavy vehicle components, TATA parts, Ashok Leyland spares, truck body parts, electrical systems"
      />
      
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="heading-primary mb-6">Our Products</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our extensive catalog of premium truck parts and components
            </p>
          </motion.div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Products Grid */}
        <section className="container mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No products found matching your search.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                >
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    {/* Product Image */}
                    <div 
                      className="relative aspect-square overflow-hidden cursor-pointer bg-muted"
                      onClick={() => setSelectedProduct(product)}
                    >
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No Image
                        </div>
                      )}
                      
                      {/* Product Code Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                          {product.product_code}
                        </Badge>
                      </div>

                      {/* Price Badge */}
                      {product.price && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-accent text-accent-foreground">
                            ₹{product.price.toLocaleString()}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-heading font-bold text-lg mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                        {product.name}
                      </h3>
                      
                      {product.short_description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                          {product.short_description}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-auto">
                        <Button
                          onClick={() => handleWhatsAppInquiry(product)}
                          className="flex-1 btn-hero"
                          size="sm"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          WhatsApp
                        </Button>
                        <Button
                          onClick={() => setSelectedProduct(product)}
                          variant="outline"
                          size="sm"
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-heading">
                  {selectedProduct.name}
                </DialogTitle>
                <Badge variant="secondary" className="w-fit mt-2">
                  {selectedProduct.product_code}
                </Badge>
              </DialogHeader>

              <div className="space-y-6">
                {/* Image Gallery */}
                {selectedProduct.images && selectedProduct.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedProduct.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => openLightbox(selectedProduct, idx)}
                      >
                        <img
                          src={img}
                          alt={`${selectedProduct.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Price */}
                {selectedProduct.price && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Price</h4>
                    <p className="text-2xl font-bold text-accent">
                      ₹{selectedProduct.price.toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Description */}
                {selectedProduct.description && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Description</h4>
                    <p className="text-foreground whitespace-pre-wrap">{selectedProduct.description}</p>
                  </div>
                )}

                {/* Tags */}
                {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleWhatsAppInquiry(selectedProduct)}
                    className="btn-hero"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={() => handlePhoneCall(selectedProduct)}
                    variant="outline"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button
                    onClick={() => handleEmailInquiry(selectedProduct)}
                    variant="outline"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      {lightboxIndex !== null && selectedProduct && selectedProduct.images[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-accent transition-colors z-10"
          >
            <X size={32} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrevImage();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-accent transition-colors z-10"
          >
            <ChevronLeft size={48} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              showNextImage();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-accent transition-colors z-10"
          >
            <ChevronRight size={48} />
          </button>

          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={selectedProduct.images[lightboxIndex]}
            alt={selectedProduct.name}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {lightboxIndex + 1} / {selectedProduct.images.length}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Product;
