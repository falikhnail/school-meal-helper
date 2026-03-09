import { UtensilsCrossed, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary shadow-md">
              <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Sistem Pendataan Makan</h1>
              <p className="text-sm text-muted-foreground">Guru SR</p>
            </div>
          </div>
          <Link to="/help">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <HelpCircle className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
