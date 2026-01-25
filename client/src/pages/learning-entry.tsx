import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar } from "lucide-react";
import type { Skill, LearningEntry } from "@shared/schema";

function renderContent(content: string) {
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
    const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <p key={i} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
  });
}

export default function LearningEntryPage() {
  const { slug, entrySlug } = useParams<{ slug: string; entrySlug: string }>();

  const { data: skill } = useQuery<Skill>({
    queryKey: ["/api/learning/skills", slug],
  });

  const { data: entry, isLoading } = useQuery<LearningEntry>({
    queryKey: ["/api/learning/skills", slug, "entries", entrySlug],
    queryFn: async () => {
      const response = await fetch(`/api/learning/skills/${slug}/entries/${entrySlug}`);
      if (!response.ok) throw new Error("Failed to fetch entry");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-4 w-32 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Entry Not Found</h1>
        <p className="text-muted-foreground mb-6">The journal entry you're looking for doesn't exist.</p>
        <Link href={`/learning/${slug}`}>
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {skill?.title || "Skill"}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Link href="/learning" data-testid="link-breadcrumb-learning">
          <Button variant="ghost" size="sm">
            Learning Journey
          </Button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link href={`/learning/${slug}`} data-testid="link-breadcrumb-skill">
          <Button variant="ghost" size="sm">
            {skill?.title || slug}
          </Button>
        </Link>
      </div>

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {skill?.title}
            </Badge>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-4" data-testid="text-entry-title">
            {entry.title}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <time dateTime={entry.date}>
              {new Date(entry.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </header>

        <div className="prose" data-testid="text-entry-content">
          {renderContent(entry.content)}
        </div>
      </article>

      <div className="mt-12 pt-8 border-t">
        <Link href={`/learning/${slug}`} data-testid="link-back-skill">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {skill?.title || "Journal"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
