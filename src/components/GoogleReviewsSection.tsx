import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, MapPin, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface GoogleReview {
  author_name: string;
  author_url: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface ReviewsData {
  reviews: GoogleReview[];
  rating: number;
  totalRatings: number;
  placeId: string;
}

const GoogleReviewsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: functionError } = await supabase.functions.invoke(
          'fetch-google-reviews'
        );

        if (functionError) {
          console.error('Function error:', functionError);
          setError('Failed to load reviews');
          return;
        }

        if (data.error) {
          console.error('API error:', data.error);
          setError(data.error);
          return;
        }

        setReviewsData(data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating
            ? 'fill-accent text-accent'
            : 'fill-muted/20 text-muted/20'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <section className="py-24 px-4 bg-gradient-to-b from-background via-background/95 to-secondary/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !reviewsData) {
    return null; // Silently fail if reviews can't be loaded
  }

  const { reviews, rating, totalRatings } = reviewsData;

  return (
    <section
      ref={ref}
      className="py-24 px-4 bg-gradient-to-b from-background via-background/95 to-secondary/20 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Google Reviews</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
            What Our Customers Say
          </h2>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">{renderStars(Math.round(rating))}</div>
              <span className="text-2xl font-bold text-foreground">{rating.toFixed(1)}</span>
            </div>
            <div className="h-6 w-px bg-border"></div>
            <p className="text-muted-foreground">
              Based on <span className="font-semibold text-foreground">{totalRatings}</span> reviews
            </p>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=Razzaq+Automotives+Vijayawada`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <span className="text-sm">View all on Google</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow h-full flex flex-col">
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={review.profile_photo_url}
                    alt={review.author_name}
                    className="w-12 h-12 rounded-full ring-2 ring-primary/20"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <a
                      href={review.author_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-foreground hover:text-primary transition-colors truncate block"
                    >
                      {review.author_name}
                    </a>
                    <p className="text-xs text-muted-foreground">
                      {review.relative_time_description}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-3">{renderStars(review.rating)}</div>

                {/* Review Text */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-6">
                  {review.text}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href={`https://www.google.com/maps/search/?api=1&query=Razzaq+Automotives+Vijayawada`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="btn-hero group"
            >
              <span>Read All Reviews</span>
              <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default GoogleReviewsSection;
