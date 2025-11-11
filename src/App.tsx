import { useState, useEffect } from 'react';
import { createClient } from './utils/supabase/client';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { FeedbackForm, FeedbackData } from './components/FeedbackForm';
import { FeedbackList } from './components/FeedbackList';
import { AuthForm } from './components/AuthForm';
import { SearchFeedback } from './components/SearchFeedback';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { LogOut, Search, Plus, X, Sparkles, Heart } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogFooter,
} from './components/ui/alert-dialog';

interface Feedback {
  id: string;
  courseCode: string;
  facultyName: string;
  facultyMobile: string;
  courseName: string;
  internalMarks: number;
  reason: string;
  rating: number;
  userEmail: string;
  userName: string;
  createdAt: number;
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [canPost, setCanPost] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // Log OTP setup info
    console.log('%c🎓 SIMATS HUB - Student Feedback Platform', 'background: #667eea; color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
    console.log('%c✨ 8-digit OTP authentication enabled', 'font-size: 14px; color: #4ecdc4;');
    
    checkSession();
    loadFeedback();
  }, []);

  useEffect(() => {
    if (user && accessToken) {
      checkPostEligibility();
    }
  }, [user, accessToken]);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setAccessToken(session.access_token);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (email: string) => {
    try {
      console.log('Sending OTP to:', email);
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: undefined, // Disable redirect - we want OTP only
        },
      });

      if (error) {
        console.error('OTP send error:', error);
        toast.error('Failed to send OTP. Please try again.');
        return false;
      }

      console.log('✅ OTP sent successfully!');
      console.log('📧 Check your email for an 8-digit code');
      
      toast.success('OTP sent to your email! Check your inbox 📧');
      return true;
    } catch (error) {
      console.error('OTP send error:', error);
      toast.error('Failed to send OTP. Please try again.');
      return false;
    }
  };

  const handleVerifyOtp = async (email: string, otp: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) {
        console.error('OTP verification error:', error);
        toast.error('Invalid OTP. Please try again.');
        return false;
      }

      if (data.session) {
        setUser(data.user);
        setAccessToken(data.session.access_token);
        // Ensure we're on the home page, not the post form or search page
        setShowPostForm(false);
        setShowSearch(false);
        setShowWelcomeDialog(true);
        toast.success('Welcome to SIMATS HUB! 🎉');
        return true;
      }
      return false;
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Verification failed. Please try again.');
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAccessToken('');
      toast.success('See you soon! 👋');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const checkPostEligibility = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-233aa38f/can-post`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCanPost(data.canPost);
        setDaysRemaining(data.daysRemaining);
      }
    } catch (error) {
      console.error('Error checking post eligibility:', error);
    }
  };

  const loadFeedback = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-233aa38f/feedback`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFeedback(data.feedback || []);
      } else {
        console.error('Failed to load feedback:', await response.text());
      }
    } catch (error) {
      console.error('Error loading feedback:', error);
    }
  };

  const handleSubmitFeedback = async (feedbackData: FeedbackData) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-233aa38f/feedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(feedbackData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Feedback posted! 🎉');
        await loadFeedback();
        await checkPostEligibility();
        setShowPostForm(false);
      } else if (response.status === 403) {
        toast.error(data.message || 'You can only post once every 15 days');
      } else {
        console.error('Feedback submission error:', data);
        toast.error(data.error || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 gradient-bg-purple rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow-lg animate-pulse-glow">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <p className="text-slate-900 font-medium text-lg">Loading your feed...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Toaster />
        <AuthForm onSendOtp={handleSendOtp} onVerifyOtp={handleVerifyOtp} />
      </>
    );
  }

  if (showSearch) {
    return (
      <>
        <Toaster />
        <SearchFeedback 
          onBack={() => setShowSearch(false)} 
          accessToken={accessToken}
        />
      </>
    );
  }

  if (showPostForm) {
    return (
      <>
        <Toaster />
        <div className="min-h-screen gradient-mesh">
          {/* Header */}
          <div className="sticky top-0 z-10 glass-dark backdrop-blur-xl border-b border-slate-200/50">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowPostForm(false)}
                    className="rounded-full hover:bg-slate-100 transition-all text-slate-700 hover:text-slate-900"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  <h1 className="text-xl font-bold text-slate-900">New Post</h1>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full px-4 transition-all"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          <main className="max-w-4xl mx-auto px-4 py-6">
            <FeedbackForm
              onSubmit={handleSubmitFeedback}
              canPost={canPost}
              daysRemaining={daysRemaining}
            />
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster />
      
      {/* Welcome Dialog */}
      <AlertDialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-3xl glass-card border-glow shadow-glow-lg p-6 sm:p-8">
          <AlertDialogHeader className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 gradient-bg-purple rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-glow animate-pulse-glow">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="white" />
            </div>
            <AlertDialogTitle className="text-2xl sm:text-3xl gradient-text mb-2">
              Welcome to SIMATS HUB! ✨
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 text-sm sm:text-base leading-relaxed pt-2">
              This platform is designed to empower students by sharing valuable feedback about faculty and courses. 
              By contributing your honest experiences, you help your peers make informed decisions and unlock the true potential of flexi-learn. 
              Together, we build a stronger learning community! 🎓
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 sm:mt-6">
            <AlertDialogAction className="w-full gradient-bg-purple text-white hover:opacity-90 rounded-xl py-3 sm:py-3.5 shadow-glow transition-all duration-300 hover:scale-105">
              Let's Go!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="min-h-screen gradient-mesh pb-24">
        {/* Header */}
        <div className="sticky top-0 z-10 glass-dark backdrop-blur-xl border-b border-slate-200/50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 gradient-bg-purple rounded-2xl flex items-center justify-center shadow-glow">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-slate-900 font-bold text-lg gradient-text">SIMATS HUB</h1>
                  <p className="text-slate-600 text-xs">{user.user_metadata?.name || user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowSearch(true)}
                  className="rounded-full hover:bg-slate-100 transition-all text-slate-700 hover:text-slate-900"
                >
                  <Search className="w-5 h-5" />
                </Button>
                {/* Mobile - Icon only */}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleLogout}
                  className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full sm:hidden transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
                {/* Desktop - Full button */}
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full px-4 hidden sm:flex items-center transition-all"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <main className="max-w-4xl mx-auto px-4 py-6">
          <FeedbackList feedback={feedback} />
        </main>

        {/* Floating Action Button */}
        <button
          onClick={() => setShowPostForm(true)}
          className="fixed bottom-6 right-6 w-16 h-16 gradient-bg-purple text-white rounded-full shadow-glow-lg hover:shadow-glow transition-all duration-300 flex items-center justify-center z-50 transform hover:scale-110 active:scale-95 animate-glow"
          aria-label="Create feedback"
        >
          <Plus className="w-7 h-7" strokeWidth={2.5} />
        </button>
      </div>
    </>
  );
}