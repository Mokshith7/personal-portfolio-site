import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, Calendar, ArrowRight } from "lucide-react";
import type { Skill } from "@shared/schema";

function SkillCard({ skill }: { skill: Skill }) {
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

  return (
    <Link href={`/learning/${skill.slug}`} data-testid={`card-skill-${skill.slug}`}>
      <Card className="h-full hover-elevate cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors">
              {skill.title}
            </CardTitle>
            <Badge variant="outline" className={statusColors[skill.status]}>
              {statusLabels[skill.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {skill.excerpt}
          </p>
          <div className="flex items-center justify-between">
            {skill.startedAt && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Started {new Date(skill.startedAt).toLocaleDateString()}
              </div>
            )}
            <div className="flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
              View Journal <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Learning() {
  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/learning/skills"],
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="font-serif text-3xl font-bold" data-testid="text-learning-heading">
            Learning Journey
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Documenting my path of continuous growth. Each skill represents a new chapter, 
          and every journal entry is a step forward on this never-ending journey of learning.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : skills && skills.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <SkillCard key={skill.slug} skill={skill} />
          ))}
        </div>
      ) : (
        <Card className="max-w-lg mx-auto text-center py-12">
          <CardContent>
            <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No Skills Yet</h3>
            <p className="text-muted-foreground text-sm">
              Learning journeys will appear here once you start documenting your growth.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
