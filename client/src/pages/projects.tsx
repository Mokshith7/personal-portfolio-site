import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function Projects() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl font-bold mb-8 text-center" data-testid="text-projects-heading">Projects</h1>
      
      <Card className="max-w-lg mx-auto">
        <CardContent className="py-12 text-center">
          <Construction className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h2 className="font-serif text-2xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            I'm currently working on documenting my personal projects. Check back soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
