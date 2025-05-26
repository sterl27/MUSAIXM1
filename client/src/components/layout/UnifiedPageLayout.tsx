import { ReactNode } from "react";
import UnifiedHeader from "./UnifiedHeader";

interface UnifiedPageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function UnifiedPageLayout({ 
  children, 
  title, 
  description 
}: UnifiedPageLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      <main className="container mx-auto px-4 py-8">
        {(title || description) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-3xl font-bold musaix-gradient-text mb-2">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-gray-400 text-lg">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}