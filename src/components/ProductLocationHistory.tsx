import { useEffect, useState } from 'react';
import { MapPin, ArrowRight, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface LocationHistory {
  id: string;
  old_location: string | null;
  new_location: string;
  changed_at: string;
  notes: string | null;
}

interface ProductLocationHistoryProps {
  productId: string;
}

const ProductLocationHistory = ({ productId }: ProductLocationHistoryProps) => {
  const [history, setHistory] = useState<LocationHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('product_location_history')
        .select('*')
        .eq('product_id', productId)
        .order('changed_at', { ascending: false });

      if (!error && data) {
        setHistory(data);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [productId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="w-5 h-5 text-accent" />
          Location History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No location changes recorded
          </p>
        ) : (
          <div className="space-y-4">
            {history.map((entry, index) => (
              <div
                key={entry.id}
                className={`relative pl-6 pb-4 ${
                  index !== history.length - 1 ? 'border-l-2 border-border' : ''
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-accent" />
                
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {entry.old_location || 'Initial'}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <Badge variant="default" className="text-xs">
                      {entry.new_location}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(entry.changed_at).toLocaleString()}
                    </span>
                  </div>
                  
                  {entry.notes && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {entry.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductLocationHistory;
