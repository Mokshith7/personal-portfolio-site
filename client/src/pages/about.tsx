import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dumbbell, Construction } from "lucide-react";
import { SiInstagram, SiYoutube, SiLinkedin } from "react-icons/si";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl font-bold mb-8 text-center" data-testid="text-about-heading">About Me</h1>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <Avatar className="h-48 w-48 border-4 border-primary/20">
          <AvatarImage src="/images/profile.jpg" alt="Profile" />
          <AvatarFallback className="text-4xl font-serif">You</AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center md:text-left">
          <h2 className="font-serif text-2xl font-semibold mb-4" data-testid="text-name">Your Name</h2>
          <p className="text-muted-foreground leading-relaxed mb-6" data-testid="text-bio">
            Welcome to my corner of the internet. I'm passionate about technology, philosophy, and personal growth. 
            Like Kintsugi, I believe our experiences - including the broken ones - make us who we are. 
            Through this blog, I share my thoughts on tech, travel adventures, philosophical musings, and the books that have shaped my thinking.
            When I'm not writing or coding, you'll find me exploring new places, hitting the gym, or lost in a good book.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <Button
              variant="outline"
              asChild
              data-testid="button-instagram"
            >
              <a href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer">
                <SiInstagram className="h-4 w-4 mr-2" />
                Instagram
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              data-testid="button-youtube"
            >
              <a href="https://youtube.com/@yourusername" target="_blank" rel="noopener noreferrer">
                <SiYoutube className="h-4 w-4 mr-2" />
                YouTube
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              data-testid="button-linkedin"
            >
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                <SiLinkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            Train With Me
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <Construction className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground text-sm">
            I'm putting together a fitness coaching program to help you achieve your health goals. 
            Stay tuned for personalized training plans and guidance!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
