export default function Footer() {
  return (
    <footer className="bg-card border-t border-muted py-6">
      <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Musaix Lyrics Enhancer. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-3">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Help</a>
        </div>
      </div>
    </footer>
  );
}
