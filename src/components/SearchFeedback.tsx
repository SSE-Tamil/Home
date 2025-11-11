import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Star, User, Calendar, BookOpen, GraduationCap, TrendingUp, Phone, ArrowLeft, Search, Sparkles } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface FeedbackData {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseCode: string;
  courseName: string;
  facultyName: string;
  facultyMobile: string;
  internalMarks: number;
  feedback: string;
  rating: number;
  createdAt: string;
}

interface SearchFeedbackProps {
  onBack: () => void;
  accessToken: string;
}

export function SearchFeedback({ onBack, accessToken }: SearchFeedbackProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FeedbackData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-233aa38f/search-feedback?query=${encodeURIComponent(searchQuery)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken || publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
      } else {
        console.error('Search error:', await response.text());
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching feedback:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
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

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-dark backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onBack}
              className="rounded-full hover:bg-slate-100 transition-all text-slate-700 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-slate-900">Search</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-8">
        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Search faculty, course name, or course code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 bg-secondary/50 border-slate-200/50 rounded-2xl h-14 text-base focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all shadow-glow text-slate-900 placeholder:text-slate-400"
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Results Count */}
        {hasSearched && !isSearching && (
          <div className="mb-4 px-2">
            <p className="text-sm text-slate-600 font-medium">
              {searchResults.length === 0 ? (
                <span>No results found for "{searchQuery}"</span>
              ) : (
                <span>
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                </span>
              )}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!hasSearched && (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-28 h-28 glass-card rounded-3xl flex items-center justify-center mb-6 backdrop-blur-lg shadow-glow">
              <Sparkles className="w-14 h-14 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">Search Feedback</h3>
            <p className="text-slate-600 text-center max-w-md">
              Search by faculty name, course name, or course code to find relevant feedback
            </p>
          </div>
        )}

        {/* No Results */}
        {hasSearched && searchResults.length === 0 && !isSearching && (
          <div className="glass-card rounded-3xl p-12 text-center border-glow">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
              <Search className="w-12 h-12 text-white" />
            </div>
            <p className="text-slate-600 text-lg">No feedback found matching your search.</p>
          </div>
        )}

        {/* Results */}
        <div className="space-y-5">
          {searchResults.map((feedback, index) => (
            <div
              key={feedback.id}
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
                        <span>{formatDate(feedback.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className={`flex items-center gap-1 bg-gradient-to-r ${getRatingColor(feedback.rating)} text-white px-2.5 py-1.5 rounded-full shadow-glow`}>
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold text-sm">{feedback.rating}</span>
                  </div>
                </div>

                {/* Course & Faculty Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  <div className="bg-secondary/40 rounded-xl p-3 border border-primary/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <BookOpen className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-slate-600 font-medium">Course</span>
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">{feedback.courseName}</p>
                    <p className="text-xs text-primary font-medium mt-0.5">{feedback.courseCode}</p>
                  </div>

                  <div className="bg-secondary/40 rounded-xl p-3 border border-pink-500/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <GraduationCap className="w-3.5 h-3.5 text-pink-400" />
                      <span className="text-xs text-slate-600 font-medium">Faculty</span>
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">{feedback.facultyName}</p>
                  </div>
                </div>

                {/* Mobile & Internal Marks Row */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-secondary/40 rounded-xl p-3 border border-pink-500/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Phone className="w-3.5 h-3.5 text-pink-400" />
                      <span className="text-xs text-slate-600 font-medium">Mobile</span>
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">{feedback.facultyMobile}</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-3 border border-blue-500/30">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-xs text-slate-700 font-medium">Internal Marks</span>
                    </div>
                    <p className="font-bold text-xl gradient-text">{feedback.internalMarks}</p>
                  </div>
                </div>

                {/* Feedback Text */}
                <div className="bg-secondary/30 rounded-xl p-3 border border-white/5">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {feedback.feedback}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}