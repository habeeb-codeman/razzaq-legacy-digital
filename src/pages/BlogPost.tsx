import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft } from 'lucide-react';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface BlogPostData {
  id: string;
  title: string;
  content: any;
  featured_image: string | null;
  published_at: string;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) {
        console.error('Error fetching blog post:', error);
      } else if (data) {
        setPost(data);
        
        // Generate HTML from TipTap JSON
        const html = generateHTML(data.content as any, [
          StarterKit,
          Image,
          LinkExtension,
        ]);
        setHtmlContent(html);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-8" />
            <div className="h-12 bg-muted rounded animate-pulse mb-4" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-8" />
            <div className="aspect-video bg-muted rounded-lg animate-pulse mb-8" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Post not found</h1>
            <Link to="/blog">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={post.meta_title || post.title}
        description={post.meta_description || htmlContent.replace(/<[^>]*>/g, '').slice(0, 160)}
        image={post.featured_image || undefined}
      />
      <Navigation />
      
      <main className="pt-24 pb-16">
        <article className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link to="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex gap-2 mb-4 flex-wrap">
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {format(new Date(post.published_at), 'MMMM dd, yyyy')}
            </div>
          </motion.div>

          {/* Featured Image */}
          {post.featured_image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full rounded-2xl shadow-lg"
              />
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="prose prose-lg prose-slate dark:prose-invert max-w-none 
                       prose-headings:font-heading prose-headings:scroll-mt-24
                       prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-4
                       prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4
                       prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
                       prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6
                       prose-a:text-accent prose-a:no-underline prose-a:font-medium hover:prose-a:underline
                       prose-strong:text-foreground prose-strong:font-semibold
                       prose-ul:my-6 prose-ol:my-6 prose-li:my-2
                       prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground
                       prose-code:text-accent prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                       prose-pre:bg-muted prose-pre:border prose-pre:border-border
                       prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
