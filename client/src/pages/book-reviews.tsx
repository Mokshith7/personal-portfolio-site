import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Star } from "lucide-react";
import type { BookReview } from "@shared/schema";

export default function BookReviews() {
  const [search, setSearch] = useState("");

  const { data: reviews, isLoading } = useQuery<BookReview[]>({
    queryKey: ["/api/book-reviews", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/book-reviews?${params}`);
      return res.json();
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-3xl font-bold mb-8" data-testid="text-reviews-heading">Book Reviews</h1>

      {/* Search */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search book reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
          data-testid="input-search-reviews"
        />
      </div>

      {/* Reviews Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="hover-elevate">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Link key={review.slug} href={`/book-reviews/${review.slug}`} data-testid={`link-review-${review.slug}`}>
              <Card className="h-full hover-elevate cursor-pointer transition-all">
                <CardHeader>
                  <CardTitle className="font-serif text-lg line-clamp-2">{review.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">by {review.author}</p>
                  {review.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <Badge variant="outline" className="text-xs">
                        {review.rating}
                      </Badge>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-3">{review.excerpt}</p>
                  {review.publishedAt && (
                    <p className="text-xs text-muted-foreground mt-4">
                      {new Date(review.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground" data-testid="text-no-reviews">No book reviews found.</p>
        </div>
      )}
    </div>
  );
}
