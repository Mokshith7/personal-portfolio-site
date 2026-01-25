import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Search, BookOpen } from "lucide-react";
import { useState } from "react";
import type { Skill, LearningEntry } from "@shared/schema";

function EntryCard({ entry }: { entry: LearningEntry }) {
  return (
    <Link 
      href={`/learning/${entry.skillSlug}/${entry.slug}`} 
      data-testid={`card-entry-${entry.slug}`}
    >
      <Card className="hover-elevate cursor-pointer group">
        <CardContent className="py-4">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 text-primary shrink-0">
              <div className="text-center">
                <div className="text-lg font-bold leading-none">
                  {new Date(entry.date).getDate()}
                </div>
                <div className="text-xs uppercase">
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'short' })}
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold group-hover:text-primary transition-colors mb-1 line-clamp-1">
                {entry.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {entry.excerpt}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2 sm:hidden">
                <Calendar className="h-3 w-3" />
                {new Date(entry.date).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function LearningDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: skill, isLoading: skillLoading } = useQuery<Skill>({
    queryKey: ["/api/learning/skills", slug],
  });

  const { data: entries, isLoading: entriesLoading } = useQuery<LearningEntry[]>({
    queryKey: ["/api/learning/skills", slug, "entries", searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      const response = await fetch(`/api/learning/skills/${slug}/entries?${params}`);
      if (!response.ok) throw new Error("Failed to fetch entries");
      return response.json();
    },
  });

  const statusColors = {
    "in-progress": "bg-primary/10 text-primary border-primary/20",
    "completed": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "paused": "bg-muted text-muted-foreground border-muted-foreground/20",
  };

  const statusLabels = {
    "in-progress": "In Progress",
    "completed": "Completed",
    "paused": "Paused",
  };

  if (skillLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-4 w-full mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Skill Not Found</h1>
        <p className="text-muted-foreground mb-6">The learning journey you're looking for doesn't exist.</p>
        <Link href="/learning">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learning Journey
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/learning" data-testid="link-back-learning">
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Learning Journey
        </Button>
      </Link>

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h1 className="font-serif text-3xl font-bold" data-testid="text-skill-title">
            {skill.title}
          </h1>
          <Badge variant="outline" className={statusColors[skill.status]}>
            {statusLabels[skill.status]}
          </Badge>
        </div>
        <p className="text-muted-foreground">{skill.excerpt}</p>
        {skill.startedAt && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
            <Calendar className="h-4 w-4" />
            Started {new Date(skill.startedAt).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search journal entries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-entries"
        />
      </div>

      <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        Daily Journal
      </h2>

      {entriesLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : entries && entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map((entry) => (
            <EntryCard key={entry.slug} entry={entry} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No Journal Entries Yet</h3>
            <p className="text-muted-foreground text-sm">
              {searchQuery 
                ? "No entries match your search." 
                : "Start documenting your learning journey by adding journal entries."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
