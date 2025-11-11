import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from './ui/input-otp';
import { Mail, Sparkles, ArrowRight, Shield } from 'lucide-react';

interface AuthFormProps {
  onSendOtp: (email: string) => Promise<boolean>;
  onVerifyOtp: (email: string, otp: string) => Promise<boolean>;
}

export function AuthForm({ onSendOtp, onVerifyOtp }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Email validation for college format: 9digits.simats@saveetha.com
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^\d{9}\.simats@saveetha\.com$/;
    return emailRegex.test(email);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      alert('Please use your college email in the format: 9digits.simats@saveetha.com (e.g., 123456789.simats@saveetha.com)');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await onSendOtp(email);
      if (success) {
        setOtpSent(true);
        // Log helpful message
        console.log('📧 OTP sent! Check your email for an 8-digit code');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 8) {
      alert('Please enter the complete 8-digit OTP');
      return;
    }
    
    setIsLoading(true);
    try {
      await onVerifyOtp(email, otp);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtp('');
    setIsLoading(true);
    try {
      await onSendOtp(email);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-3 sm:p-4 overflow-hidden relative">
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-500/20 rounded-full filter blur-3xl opacity-60 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-500/20 rounded-full filter blur-3xl opacity-60 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full filter blur-3xl opacity-60 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative z-10 animate-slideUp">
        <div className="glass-card rounded-2xl sm:rounded-3xl shadow-glow-lg overflow-hidden border-glow">
          {/* Header */}
          <div className="p-6 sm:p-8 pb-4 sm:pb-6 text-center">
            <div className="mx-auto mb-4 sm:mb-6 w-16 h-16 sm:w-20 sm:h-20 gradient-bg-purple rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-glow animate-pulse-glow">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2 sm:mb-3">
              SIMATS HUB
            </h1>
            <p className="text-sm sm:text-base text-slate-600 px-2">
              {otpSent ? 'Enter the 8-digit OTP sent to your email 🔐' : 'Your voice matters ✨'}
            </p>
          </div>

          {/* Form */}
          <div className="px-5 sm:px-8 pb-6 sm:pb-8">
            {!otpSent ? (
              // Email Input Form
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-slate-700 text-sm mb-2 block">College Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="123456789.simats@saveetha.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 bg-secondary/50 border-slate-200/50 rounded-xl h-12 focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all text-slate-900 placeholder:text-slate-400"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-primary mt-2 font-medium">
                    Use format: 9digits.simats@saveetha.com
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full gradient-bg-purple hover:opacity-90 rounded-xl h-12 text-white shadow-glow transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Sending OTP...'
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400 bg-secondary/30 rounded-xl p-3 border border-white/5">
                    <Shield className="w-4 h-4 text-primary" />
                    <p>We'll send an 8-digit code to verify your email</p>
                  </div>
                  <div className="text-xs text-center text-gray-500">
                    <p>💡 First time? Check your spam folder if you don't see the email</p>
                  </div>
                </div>
              </form>
            ) : (
              // OTP Verification Form
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <Label className="text-slate-700 text-sm mb-4 block text-center">Enter 8-Digit OTP</Label>
                  <div className="flex justify-center mb-3 px-2">
                    <InputOTP
                      maxLength={8}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                      disabled={isLoading}
                    >
                      <InputOTPGroup className="gap-1 sm:gap-1.5">
                        <InputOTPSlot index={0} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg bg-secondary/50 border-slate-200/50 text-slate-900 rounded-lg sm:rounded-xl" />
                        <InputOTPSlot index={1} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg bg-secondary/50 border-slate-200/50 text-slate-900 rounded-lg sm:rounded-xl" />
                        <InputOTPSlot index={2} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg bg-secondary/50 border-slate-200/50 text-slate-900 rounded-lg sm:rounded-xl" />
                        <InputOTPSlot index={3} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg bg-secondary/50 border-slate-200/50 text-slate-900 rounded-lg sm:rounded-xl" />
                        <InputOTPSlot index={4} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg bg-secondary/50 border-slate-200/50 text-slate-900 rounded-lg sm:rounded-xl" />
                        <InputOTPSlot index={5} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg bg-secondary/50 border-slate-200/50 text-slate-900 rounded-lg sm:rounded-xl" />
                        <InputOTPSlot index={6} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg bg-secondary/50 border-slate-200/50 text-slate-900 rounded-lg sm:rounded-xl" />
                        <InputOTPSlot index={7} className="w-9 h-11 sm:w-11 sm:h-13 text-base sm:text-lg bg-secondary/50 border-slate-200/50 text-slate-900 rounded-lg sm:rounded-xl" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-xs text-gray-400 text-center px-2 break-all">
                    OTP sent to <span className="text-primary font-medium">{email}</span>
                  </p>
                  <div className="mt-3 text-xs text-center space-y-1 px-2">
                    <p className="text-gray-500">💡 Check your email for an <span className="text-primary font-medium">8-digit code</span></p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full gradient-bg-purple hover:opacity-90 rounded-xl h-12 text-white shadow-glow transition-all transform hover:scale-[1.02] active:scale-[0.98]" 
                  disabled={isLoading || otp.length !== 8}
                >
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                </Button>

                <div className="flex flex-col gap-2">
                  <Button 
                    type="button"
                    variant="ghost"
                    onClick={handleResendOtp}
                    className="w-full text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm"
                    disabled={isLoading}
                  >
                    Resend OTP
                  </Button>
                  <Button 
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                    }}
                    className="w-full text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm"
                    disabled={isLoading}
                  >
                    Change Email
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        <p className="text-center text-xs sm:text-sm text-slate-600 mt-4 sm:mt-6 px-4">
          Share your thoughts and help make your college better! 🎓
        </p>
      </div>
    </div>
  );
}