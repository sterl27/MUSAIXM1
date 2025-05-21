import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function PageLayout({ 
  children,
  title,
  description
}: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 overflow-hidden">
        {title && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{title}</h1>
            {description && <p className="text-muted-foreground mt-2">{description}</p>}
          </div>
        )}
        {children}
      </main>
      
      <Footer />
    </div>
  );
}