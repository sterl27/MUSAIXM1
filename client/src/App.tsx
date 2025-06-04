import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import OpenAI from "@/pages/OpenAI";
import SongWriter from "@/pages/SongWriter";
import SongNotebook from "@/pages/SongNotebook";
import SoundDesign from "@/pages/SoundDesign";
import Personas from "@/pages/Personas";
import CreativeTools from "@/pages/CreativeTools";
import StyleTransformer from "@/pages/StyleTransformer";
import RhymeGenerator from "@/pages/RhymeGenerator";
import FlowAnalyzer from "@/pages/FlowAnalyzer";
import StructureFormatter from "@/pages/StructureFormatter";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Admin from "@/pages/Admin";
import ArtistProfile from "@/pages/ArtistProfile";
import MusicPlayerPage from "@/pages/MusicPlayerPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/openai" component={OpenAI} />
      <Route path="/songwriter" component={SongWriter} />
      <Route path="/notebook" component={SongNotebook} />
      <Route path="/sounddesign" component={SoundDesign} />
      <Route path="/personas" component={Personas} />
      <Route path="/tools" component={CreativeTools} />
      <Route path="/style-transformer" component={StyleTransformer} />
      <Route path="/rhyme-generator" component={RhymeGenerator} />
      <Route path="/flow-analyzer" component={FlowAnalyzer} />
      <Route path="/structure-formatter" component={StructureFormatter} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/admin" component={Admin} />
      <Route path="/artist-profile" component={ArtistProfile} />
      <Route path="/music-player" component={MusicPlayerPage} />
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
