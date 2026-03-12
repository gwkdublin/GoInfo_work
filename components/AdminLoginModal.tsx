
import React, { useState } from 'react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type LoginStep = 1 | 2;

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<LoginStep>(1);
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [error, setError] = useState(false);
  
  const CORRECT_PIN = '1683';
  const CORRECT_AUTH_CODE = '1514orsza';

  if (!isOpen) return null;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@') && pin === CORRECT_PIN) {
      setStep(2);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authCode.toLowerCase() === CORRECT_AUTH_CODE.toLowerCase()) {
      onSuccess();
      resetForm();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const resetForm = () => {
    setStep(1);
    setEmail('');
    setPin('');
    setAuthCode('');
    setError(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn">
        {/* Progress bar */}
        <div className="flex h-1.5 w-full bg-gray-100">
          <div 
            className={`h-full bg-[#00915a] transition-all duration-500 ${step === 1 ? 'w-1/2' : 'w-full'}`}
          />
        </div>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center text-[#00915a]">
              {step === 1 ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.444c-1.348 0-2.63-.232-3.818-.658a11.955 11.955 0 01-8.618-3.04C3.064 7.55 7.152 3.46 12 3.46c4.848 0 8.936 4.09 9.436 9.284.496 5.194-3.592 9.284-8.436 9.284z" />
                </svg>
              )}
            </div>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-900">
              {step === 1 ? 'Logowanie służbowe' : 'Weryfikacja II stopnia'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {step === 1 ? 'Krok 1 z 2: Tożsamość' : 'Krok 2 z 2: Kod dostępu'}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Email służbowy</label>
                <input 
                  type="email" 
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00915a] focus:bg-white outline-none transition-all"
                  placeholder="imię.nazwisko@bank.pl"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Kod PIN</label>
                <input 
                  type="password" 
                  maxLength={4}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00915a] focus:bg-white outline-none transition-all text-center tracking-[1em] font-mono"
                  placeholder="••••"
                  value={pin}
                  onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              
              {error && (
                <p className="text-xs text-red-500 text-center font-medium animate-shake">
                  Nieprawidłowy email lub kod PIN.
                </p>
              )}

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-[#00915a] text-white py-4 rounded-xl font-bold hover:bg-[#006646] active:scale-[0.98] transition-all shadow-lg shadow-emerald-100"
                >
                  Kontynuuj
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Kod weryfikacyjny (9 znaków)</label>
                <input 
                  type="text" 
                  maxLength={9}
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00915a] focus:bg-white outline-none transition-all text-center font-mono uppercase tracking-widest"
                  placeholder="_________"
                  value={authCode}
                  onChange={e => setAuthCode(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 text-center font-medium animate-shake">
                  Kod weryfikacyjny jest nieprawidłowy.
                </p>
              )}

              <div className="pt-2 flex flex-col space-y-3">
                <button 
                  type="submit"
                  className="w-full bg-[#00915a] text-white py-4 rounded-xl font-bold hover:bg-[#006646] active:scale-[0.98] transition-all shadow-lg shadow-emerald-100"
                >
                  Autoryzuj dostęp
                </button>
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-xs text-gray-400 font-bold uppercase hover:text-gray-600 transition-colors"
                >
                  Wstecz
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button 
              onClick={handleClose}
              className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Anuluj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;
