import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Music, 
  Bot, 
  PenTool, 
  BookOpen, 
  SlidersHorizontal, 
  Users, 
  Wand2, 
  Sparkles,
  ChevronDown,
  Menu,
  Settings,
  Home,
  Activity,
  FileText
} from "lucide-react";

export default function UnifiedHeader() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const creativeTools = [
    { href: "/openai", icon: <Bot size={16} />, label: "AI Enhancer", description: "OpenAI-powered lyric enhancement" },
    { href: "/songwriter", icon: <PenTool size={16} />, label: "Song Writer", description: "Generate complete songs with AI" },
    { href: "/notebook", icon: <BookOpen size={16} />, label: "Song Notebook", description: "Write and save lyrics with AI assistance" },
    { href: "/rhyme-generator", icon: <Sparkles size={16} />, label: "Rhyme Generator", description: "Find perfect rhymes for your lyrics" },
    { href: "/flow-analyzer", icon: <Activity size={16} />, label: "Flow Analyzer", description: "Analyze your flow and cadence" },
    { href: "/structure-formatter", icon: <FileText size={16} />, label: "Structure Formatter", description: "Format your song structure" },
    { href: "/sounddesign", icon: <SlidersHorizontal size={16} />, label: "Sound Design", description: "Audio production suggestions" },
    { href: "/style-transformer", icon: <Wand2 size={16} />, label: "Style Transformer", description: "Transform lyrics between styles" },
  ];

  const explorePages = [
    { href: "/personas", icon: <Users size={16} />, label: "Artist Personas", description: "Explore different artist styles" },
    { href: "/tools", icon: <Sparkles size={16} />, label: "Creative Tools", description: "Additional creative utilities" },
  ];

  const NavLink = ({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => (
    <Link href={href}>
      <Button 
        variant="ghost" 
        className={`text-white hover:text-[#FF4081] hover:bg-white/5 transition-colors ${isActive(href) ? 'text-[#FF4081] bg-white/5' : ''} ${className}`}
      >
        {children}
      </Button>
    </Link>
  );

  const MobileNavItem = ({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick?: () => void }) => (
    <Link href={href}>
      <div 
        className={`flex items-center gap-3 px-4 py-3 text-white hover:text-[#FF4081] hover:bg-white/5 transition-colors rounded-md ${isActive(href) ? 'text-[#FF4081] bg-white/10' : ''}`}
        onClick={onClick}
      >
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Music className="h-8 w-8 text-[#FF4081]" />
              <h1 className="text-xl font-bold musaix-gradient-text">Musaix Rap Pro</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/">
              <Home size={16} className="mr-2" />
              Home
            </NavLink>

            {/* Creative Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={`text-white hover:text-[#FF4081] hover:bg-white/5 transition-colors ${
                    creativeTools.some(tool => isActive(tool.href)) ? 'text-[#FF4081] bg-white/5' : ''
                  }`}
                >
                  <Sparkles size={16} className="mr-2" />
                  Create
                  <ChevronDown size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-black border-gray-700">
                {creativeTools.map((tool) => (
                  <DropdownMenuItem key={tool.href} asChild>
                    <Link href={tool.href}>
                      <div className="flex items-start gap-3 p-2 w-full cursor-pointer hover:bg-gray-800 rounded-md">
                        <div className="mt-1 text-[#FF4081]">{tool.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-white">{tool.label}</div>
                          <div className="text-xs text-gray-400 mt-1">{tool.description}</div>
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Explore Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={`text-white hover:text-[#FF4081] hover:bg-white/5 transition-colors ${
                    explorePages.some(page => isActive(page.href)) ? 'text-[#FF4081] bg-white/5' : ''
                  }`}
                >
                  <Users size={16} className="mr-2" />
                  Explore
                  <ChevronDown size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-black border-gray-700">
                {explorePages.map((page) => (
                  <DropdownMenuItem key={page.href} asChild>
                    <Link href={page.href}>
                      <div className="flex items-start gap-3 p-2 w-full cursor-pointer hover:bg-gray-800 rounded-md">
                        <div className="mt-1 text-[#FF4081]">{page.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-white">{page.label}</div>
                          <div className="text-xs text-gray-400 mt-1">{page.description}</div>
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Admin */}
            <NavLink href="/admin">
              <Settings size={16} className="mr-2" />
              Admin
            </NavLink>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" className="text-white hover:text-[#FF4081] hover:bg-white/5">
              Sign In
            </Button>
            <Button className="musaix-gradient-button">
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-black border-gray-700 p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <Music className="h-6 w-6 text-[#FF4081]" />
                    <h2 className="text-lg font-bold musaix-gradient-text">Musaix Rap Pro</h2>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-6">
                    {/* Home */}
                    <div>
                      <MobileNavItem 
                        href="/" 
                        icon={<Home size={18} />} 
                        label="Home" 
                        onClick={() => setIsOpen(false)}
                      />
                    </div>

                    {/* Creative Tools Section */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 px-4">
                        Creative Tools
                      </h3>
                      <div className="space-y-1">
                        {creativeTools.map((tool) => (
                          <MobileNavItem 
                            key={tool.href}
                            href={tool.href} 
                            icon={tool.icon} 
                            label={tool.label} 
                            onClick={() => setIsOpen(false)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Explore Section */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 px-4">
                        Explore
                      </h3>
                      <div className="space-y-1">
                        {explorePages.map((page) => (
                          <MobileNavItem 
                            key={page.href}
                            href={page.href} 
                            icon={page.icon} 
                            label={page.label} 
                            onClick={() => setIsOpen(false)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Admin */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 px-4">
                        Settings
                      </h3>
                      <MobileNavItem 
                        href="/admin" 
                        icon={<Settings size={18} />} 
                        label="Admin Panel" 
                        onClick={() => setIsOpen(false)}
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Auth */}
                <div className="p-4 border-t border-gray-700">
                  <div className="flex flex-col gap-3">
                    <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800">
                      Sign In
                    </Button>
                    <Button className="w-full musaix-gradient-button">
                      Sign Up
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}