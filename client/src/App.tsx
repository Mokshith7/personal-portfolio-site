import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import Home from "@/pages/home";
import Blogs from "@/pages/blogs";
import BlogDetail from "@/pages/blog-detail";
import BookReviews from "@/pages/book-reviews";
import BookReviewDetail from "@/pages/book-review-detail";
import Projects from "@/pages/projects";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blogs" component={Blogs} />
      <Route path="/blogs/:slug" component={BlogDetail} />
      <Route path="/book-reviews" component={BookReviews} />
      <Route path="/book-reviews/:slug" component={BookReviewDetail} />
      <Route path="/projects" component={Projects} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
