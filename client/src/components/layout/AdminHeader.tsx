import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon, HomeIcon, LogOut, Settings } from "lucide-react";

export default function AdminHeader() {
  const [location] = useLocation();

  return (
    <header className="border-b bg-card">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <a className="flex items-center gap-2">
              <div className="flex items-center justify-center size-8 rounded-full bg-primary text-white font-semibold">
                M
              </div>
              <span className="text-lg font-semibold tracking-tight">Musaix Admin</span>
            </a>
          </Link>
          <nav className="hidden md:flex gap-6 ml-6">
            <Link href="/admin">
              <a className={`text-sm font-medium ${location === '/admin' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                Dashboard
              </a>
            </Link>
            <Link href="/admin?tab=users">
              <a className={`text-sm font-medium ${location === '/admin?tab=users' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                Users
              </a>
            </Link>
            <Link href="/admin?tab=lyrics">
              <a className={`text-sm font-medium ${location === '/admin?tab=lyrics' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                Lyrics
              </a>
            </Link>
            <Link href="/admin?tab=settings">
              <a className={`text-sm font-medium ${location === '/admin?tab=settings' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                Settings
              </a>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full" title="Back to Main Site">
              <HomeIcon className="h-5 w-5" />
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}