import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import type { Blog } from "@shared/schema";

function renderContent(content: string) {
  return content.split('\n').map((line, i) => {
    if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-serif font-bold mb-4 mt-8">{line.slice(2)}</h1>;
    if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-serif font-semibold mb-3 mt-6">{line.slice(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-serif font-medium mb-2 mt-4">{line.slice(4)}</h3>;
    if (line.startsWith('- ')) return <li key={i} className="ml-6 mb-2">{line.slice(2)}</li>;
    if (line.match(/^\d+\./)) return <li key={i} className="ml-6 mb-2 list-decimal">{line.replace(/^\d+\.\s*/, '')}</li>;
    if (line.trim() === '') return <br key={i} />;
    if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-muted pl-4 italic text-muted-foreground mb-4">{line.slice(2)}</blockquote>;
    const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <p key={i} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />;
  });
}

export default function BlogSeriesEntry() {
  const params = useParams<{ slug: string; entrySlug: string }>();

  const { data: entry, isLoading, error } = useQuery<Blog>({
    queryKey: ["/api/blogs", params.slug, params.entrySlug],
    queryFn: async () => {
      const res = await fetch(`/api/blogs/${params.slug}/${params.entrySlug}`);
      if (!res.ok) throw new Error("Entry not found");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-4 w-2/3 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center">
        <p className="text-muted-foreground mb-4">Entry not found.</p>
        <Link href={`/blogs/${params.slug}`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link href={`/blogs/${params.slug}`}>
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Daily Scribbles
        </Button>
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            {entry.title}
          </h1>
          {entry.publishedAt && (
            <span className="text-sm text-muted-foreground">
              {new Date(entry.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
          )}
        </header>

        <div className="prose">
          {renderContent(entry.content)}
        </div>
      </article>
    </div>
  );
}
