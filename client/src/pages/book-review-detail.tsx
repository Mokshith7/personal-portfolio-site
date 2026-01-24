import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Star } from "lucide-react";
import type { BookReview } from "@shared/schema";

export default function BookReviewDetail() {
  const params = useParams<{ slug: string }>();

  const { data: review, isLoading, error } = useQuery<BookReview>({
    queryKey: ["/api/book-reviews", params.slug],
    queryFn: async () => {
      const res = await fetch(`/api/book-reviews/${params.slug}`);
      if (!res.ok) throw new Error("Book review not found");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-6 w-48 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center">
        <p className="text-muted-foreground mb-4">Book review not found.</p>
        <Link href="/book-reviews">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Book Reviews
          </Button>
        </Link>
      </div>
    );
  }

  // Simple markdown rendering
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-3xl font-serif font-bold mb-4 mt-8">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-serif font-semibold mb-3 mt-6">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-serif font-medium mb-2 mt-4">{line.slice(4)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-6 mb-2">{line.slice(2)}</li>;
      }
      if (line.match(/^\d+\./)) {
        return <li key={i} className="ml-6 mb-2 list-decimal">{line.replace(/^\d+\.\s*/, '')}</li>;
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      // Handle bold text
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/book-reviews">
        <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back-reviews">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Book Reviews
        </Button>
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2" data-testid="text-review-title">
            {review.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">by {review.author}</p>
          <div className="flex items-center gap-4 flex-wrap">
            {review.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Badge variant="secondary">
                  {review.rating}
                </Badge>
              </div>
            )}
            {review.publishedAt && (
              <span className="text-sm text-muted-foreground">
                {new Date(review.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>
        </header>

        <div className="prose" data-testid="text-review-content">
          {renderContent(review.content)}
        </div>
      </article>
    </div>
  );
}
