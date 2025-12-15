import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Smartphone, CheckCircle, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <CardTitle className="text-xl">Aplikasi Terinstall!</CardTitle>
            <CardDescription>
              Sistem Pendataan Makan Guru SR sudah terinstall di perangkat Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <a href="/">Buka Aplikasi</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Smartphone className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Install Aplikasi</CardTitle>
          <CardDescription>
            Install Sistem Pendataan Makan Guru SR ke perangkat Anda untuk akses cepat.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isIOS ? (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium text-foreground">Cara install di iPhone/iPad:</p>
                <ol className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">1</span>
                    <span>Ketuk tombol <Share className="inline w-4 h-4" /> Share di Safari</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">2</span>
                    <span>Scroll ke bawah dan pilih "Add to Home Screen"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">3</span>
                    <span>Ketuk "Add" di pojok kanan atas</span>
                  </li>
                </ol>
              </div>
            </div>
          ) : deferredPrompt ? (
            <Button onClick={handleInstall} className="w-full gap-2">
              <Download className="w-4 h-4" />
              Install Sekarang
            </Button>
          ) : (
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">Cara install:</p>
              <ol className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">1</span>
                  <span>Buka menu browser (⋮ atau ⋯)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">2</span>
                  <span>Pilih "Install app" atau "Add to Home Screen"</span>
                </li>
              </ol>
            </div>
          )}
          
          <Button variant="outline" asChild className="w-full">
            <a href="/">Kembali ke Aplikasi</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Install;
