import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoogleReview {
  author_name: string;
  author_url: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface GooglePlacesResponse {
  result?: {
    reviews: GoogleReview[];
    rating?: number;
    user_ratings_total?: number;
  };
  status: string;
  error_message?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    
    if (!apiKey) {
      console.error('GOOGLE_PLACES_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Razzaq Automotives Place ID - You'll need to get this from Google Places
    // For now, using a search query approach
    const query = 'Razzaq Automotives Vijayawada';
    
    console.log('Fetching place details for:', query);

    // First, find the place ID
    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${apiKey}`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    console.log('Search response:', searchData);

    if (!searchData.candidates || searchData.candidates.length === 0) {
      console.error('Place not found');
      return new Response(
        JSON.stringify({ error: 'Place not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const placeId = searchData.candidates[0].place_id;
    console.log('Found place ID:', placeId);

    // Now fetch the place details with reviews
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`;
    
    const detailsResponse = await fetch(detailsUrl);
    const detailsData: GooglePlacesResponse = await detailsResponse.json();
    
    console.log('Details response status:', detailsData.status);

    if (detailsData.status !== 'OK') {
      console.error('Google Places API error:', detailsData.error_message);
      return new Response(
        JSON.stringify({ error: detailsData.error_message || 'Failed to fetch reviews' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const reviews = detailsData.result?.reviews || [];
    const rating = detailsData.result?.rating || 0;
    const totalRatings = detailsData.result?.user_ratings_total || 0;

    console.log(`Successfully fetched ${reviews.length} reviews`);

    return new Response(
      JSON.stringify({
        reviews,
        rating,
        totalRatings,
        placeId
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in fetch-google-reviews function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
