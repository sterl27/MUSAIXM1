import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import OpenAI from "@/pages/OpenAI";
import SongWriter from "@/pages/SongWriter";
import SoundDesign from "@/pages/SoundDesign";
import Personas from "@/pages/Personas";
import CreativeTools from "@/pages/CreativeTools";
import StyleTransformer from "@/pages/StyleTransformer";
import Admin from "@/pages/Admin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/openai" component={OpenAI} />
      <Route path="/songwriter" component={SongWriter} />
      <Route path="/sounddesign" component={SoundDesign} />
      <Route path="/personas" component={Personas} />
      <Route path="/tools" component={CreativeTools} />
      <Route path="/style-transformer" component={StyleTransformer} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
