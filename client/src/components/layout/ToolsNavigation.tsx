import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  MusicIcon, 
  Sparkles, 
  Bot, 
  PenToolIcon, 
  Wand2Icon, 
  SlidersHorizontal,
  BookOpen
} from "lucide-react";

interface ToolNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function ToolNavItem({ href, icon, label, isActive }: ToolNavItemProps) {
  return (
    <Link href={href}>
      <div className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-colors cursor-pointer",
        isActive && "bg-primary/10 text-primary font-medium"
      )}>
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
}

export default function ToolsNavigation() {
  const [location] = useLocation();
  
  const tools = [
    {
      href: "/",
      icon: <Sparkles size={18} />,
      label: "Lyrics Enhancer"
    },

    {
      href: "/songwriter",
      icon: <PenToolIcon size={18} />,
      label: "Song Writer"
    },
    {
      href: "/notebook",
      icon: <BookOpen size={18} />,
      label: "Song Notebook"
    },
    {
      href: "/sounddesign",
      icon: <SlidersHorizontal size={18} />,
      label: "Sound Design"
    },
    {
      href: "/personas",
      icon: <MusicIcon size={18} />,
      label: "Personas"
    },
    {
      href: "/style-transformer",
      icon: <Wand2Icon size={18} />,
      label: "Style Transformer"
    },

  ];

  return (
    <div className="bg-card shadow-sm rounded-lg border border-border p-2 mb-6">
      <nav className="flex overflow-x-auto no-scrollbar">
        <div className="flex space-x-1">
          {tools.map(tool => (
            <ToolNavItem 
              key={tool.href}
              href={tool.href}
              icon={tool.icon}
              label={tool.label}
              isActive={location === tool.href}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}