import { Avatar, AvatarFallback } from './ui/avatar';
import { Star, User, Calendar, BookOpen, GraduationCap, TrendingUp, Phone } from 'lucide-react';

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

interface FeedbackListProps {
  feedback: Feedback[];
}

export function FeedbackList({ feedback }: FeedbackListProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (email: string) => {
    // Get initials from email prefix
    if (!email) return 'ST';
    const prefix = email.split('@')[0];
    const parts = prefix.split('.');
    if (parts.length >= 2) {
      return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
    }
    return prefix.substring(0, 2).toUpperCase();
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'from-emerald-500 to-green-600';
    if (rating >= 3) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  if (feedback.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-28 h-28 gradient-bg-purple rounded-3xl flex items-center justify-center mb-6 shadow-glow opacity-60 animate-pulse-glow">
          <BookOpen className="w-14 h-14 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-slate-900 mb-3">No feedback yet</h3>
        <p className="text-slate-600 text-center max-w-md">
          Be the first to share your thoughts! Tap the + button below to create a post.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">
      {feedback.map((item, index) => (
        <div 
          key={item.id}
          className="glass-card rounded-2xl overflow-hidden shadow-glow hover:shadow-glow-lg transition-all duration-300 border-glow"
          style={{
            animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
          }}
        >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <Avatar className="w-10 h-10 ring-2 ring-primary/30 shadow-glow">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-0.5">
                  <p className="font-semibold text-slate-900 text-sm">Anonymous Student</p>
                  <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Rating Badge */}
              <div className={`flex items-center gap-1 bg-gradient-to-r ${getRatingColor(item.rating)} text-white px-2.5 py-1.5 rounded-full shadow-glow`}>
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold text-sm">{item.rating}</span>
              </div>
            </div>

            {/* Course & Faculty Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <div className="bg-secondary/40 rounded-xl p-3 border border-primary/20">
                <div className="flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs text-slate-600 font-medium">Course</span>
                </div>
                <p className="font-semibold text-slate-900 text-sm">{item.courseName}</p>
                <p className="text-xs text-primary font-medium mt-0.5">{item.courseCode}</p>
              </div>

              <div className="bg-secondary/40 rounded-xl p-3 border border-pink-500/20">
                <div className="flex items-center gap-1.5 mb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-pink-400" />
                  <span className="text-xs text-slate-600 font-medium">Faculty</span>
                </div>
                <p className="font-semibold text-slate-900 text-sm">{item.facultyName}</p>
              </div>
            </div>

            {/* Mobile & Internal Marks Row */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-secondary/40 rounded-xl p-3 border border-pink-500/20">
                <div className="flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-pink-400" />
                  <span className="text-xs text-slate-600 font-medium">Mobile</span>
                </div>
                <p className="font-semibold text-slate-900 text-sm">{item.facultyMobile}</p>
              </div>

              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-3 border border-blue-500/30">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs text-slate-700 font-medium">Internal Marks</span>
                </div>
                <p className="font-bold text-xl gradient-text">{item.internalMarks}</p>
              </div>
            </div>

            {/* Feedback Text */}
            <div className="bg-secondary/30 rounded-xl p-3 border border-white/5">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{item.reason}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}