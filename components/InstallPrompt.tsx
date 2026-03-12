
import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Platform detection
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    setIsIOS(ios);

    // 1. Android / Chrome Logic
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      if (!isStandalone) {
        const hasSeenPrompt = sessionStorage.getItem('pwa_prompt_dismissed');
        if (!hasSeenPrompt) {
          setShowPrompt(true);
        }
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 2. iOS Logic (iOS doesn't fire beforeinstallprompt)
    if (ios && !isStandalone) {
      const hasSeenPrompt = sessionStorage.getItem('pwa_prompt_dismissed');
      if (!hasSeenPrompt) {
        const timer = setTimeout(() => setShowPrompt(true), 2000);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the native install prompt
    await deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleClose = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-scaleIn p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideUp">
        <div className="p-8 text-center">
          <div className="bg-emerald-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
             <div className="bg-white border-2 border-[#00915a] w-14 h-14 rounded-2xl flex items-center justify-center text-[#00915a] font-bold text-2xl">
               CB
             </div>
          </div>
          
          <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Używaj CarbonBiz jako aplikacji</h3>
          <p className="text-gray-500 text-sm mb-8 px-4 leading-relaxed">
            Dodaj CarbonBiz do swojego ekranu głównego, aby uzyskać błyskawiczny dostęp do bazy wiedzy nawet bez stabilnego łącza.
          </p>
          
          {isIOS ? (
            /* iOS Specific Instructions */
            <div className="space-y-6 text-left bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-8">
              <div className="flex items-center space-x-4">
                <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-700">1. Kliknij ikonę „Udostępnij” w Safari</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-700">2. Wybierz „Do ekranu początkowego”</p>
              </div>
            </div>
          ) : (
            /* Android / Chrome Specific Button */
            <div className="mb-8">
               <button 
                 onClick={handleNativeInstall}
                 className="w-full bg-[#00915a] text-white py-5 rounded-2xl font-bold hover:bg-[#006646] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center space-x-3"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                 </svg>
                 <span>Zainstaluj teraz</span>
               </button>
            </div>
          )}

          <button 
            onClick={handleClose}
            className={`w-full py-4 rounded-2xl font-bold transition-all ${isIOS ? 'bg-[#00915a] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {isIOS ? 'Rozumiem, zrobię to później' : 'Pomiń instalację'}
          </button>
        </div>
        <div className="h-6 bg-gray-50 border-t border-gray-100"></div>
      </div>
    </div>
  );
};

export default InstallPrompt;
