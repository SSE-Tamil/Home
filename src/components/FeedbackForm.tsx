import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Star, Send, Clock } from 'lucide-react';

export interface FeedbackData {
  courseCode: string;
  facultyName: string;
  facultyMobile: string;
  courseName: string;
  internalMarks: number;
  reason: string;
  rating: number;
}

interface FeedbackFormProps {
  onSubmit: (data: FeedbackData) => Promise<void>;
  canPost: boolean;
  daysRemaining: number;
}

export function FeedbackForm({ onSubmit, canPost, daysRemaining }: FeedbackFormProps) {
  const [courseCode, setCourseCode] = useState('');
  const [facultyName, setFacultyName] = useState('');
  const [facultyMobile, setFacultyMobile] = useState('');
  const [courseName, setCourseName] = useState('');
  const [internalMarks, setInternalMarks] = useState('');
  const [reason, setReason] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsPosting(true);
    try {
      await onSubmit({
        courseCode,
        facultyName,
        facultyMobile,
        courseName,
        internalMarks: parseInt(internalMarks),
        reason,
        rating,
      });

      // Reset form only on success
      setCourseCode('');
      setFacultyName('');
      setFacultyMobile('');
      setCourseName('');
      setInternalMarks('');
      setReason('');
      setRating(0);
    } catch (error) {
      console.error('Error posting feedback:', error);
    } finally {
      setIsPosting(false);
    }
  };

  if (!canPost) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-card rounded-3xl p-8 text-center shadow-glow-lg border-glow">
          <div className="w-24 h-24 gradient-bg-pink rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse-glow">
            <Clock className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-4">
            Slow down there! 🚀
          </h3>
          <p className="text-slate-600 mb-3 text-lg">
            You can post feedback once every 15 days.
          </p>
          <p className="text-2xl font-bold gradient-text">
            Come back in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card rounded-3xl overflow-hidden shadow-glow-lg border-glow">
        <div className="p-6 sm:p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold gradient-text mb-3">
              Share Your Feedback
            </h2>
            <p className="text-slate-600">
              Your honest feedback helps everyone make better decisions ✨
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Code */}
            <div>
              <Label htmlFor="courseCode" className="text-slate-700 text-sm mb-2 block">
                Course Code
              </Label>
              <Input
                id="courseCode"
                type="text"
                placeholder="e.g., CSE01"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                pattern="[A-Z]{3}[0-9]{2}"
                maxLength={5}
                disabled={isPosting}
                className="bg-secondary/50 border-slate-200/50 rounded-xl h-12 focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all uppercase text-slate-900 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Format: 3 capital letters + 2 digits (e.g., CSE01, MAT99)
              </p>
            </div>

            {/* Course Name */}
            <div>
              <Label htmlFor="courseName" className="text-slate-700 text-sm mb-2 block">
                Course Name
              </Label>
              <Input
                id="courseName"
                type="text"
                placeholder="e.g., Introduction to Computer Science"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                disabled={isPosting}
                className="bg-secondary/50 border-slate-200/50 rounded-xl h-12 focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Faculty Name */}
            <div>
              <Label htmlFor="facultyName" className="text-slate-700 text-sm mb-2 block">
                Faculty Name
              </Label>
              <Input
                id="facultyName"
                type="text"
                placeholder="e.g., Dr. Jane Smith"
                value={facultyName}
                onChange={(e) => setFacultyName(e.target.value)}
                disabled={isPosting}
                className="bg-secondary/50 border-slate-200/50 rounded-xl h-12 focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Faculty Mobile Number */}
            <div>
              <Label htmlFor="facultyMobile" className="text-slate-700 text-sm mb-2 block">
                Faculty Mobile Number
              </Label>
              <Input
                id="facultyMobile"
                type="tel"
                placeholder="e.g., 9876543210"
                value={facultyMobile}
                onChange={(e) => setFacultyMobile(e.target.value)}
                pattern="[0-9]{10}"
                disabled={isPosting}
                className="bg-secondary/50 border-slate-200/50 rounded-xl h-12 focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                10-digit mobile number
              </p>
            </div>

            {/* Internal Marks */}
            <div>
              <Label htmlFor="internalMarks" className="text-slate-700 text-sm mb-2 block">
                Internal Marks Received
              </Label>
              <Input
                id="internalMarks"
                type="number"
                placeholder="e.g., 85"
                min="0"
                max="100"
                value={internalMarks}
                onChange={(e) => setInternalMarks(e.target.value)}
                disabled={isPosting}
                className="bg-secondary/50 border-slate-200/50 rounded-xl h-12 focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Rating */}
            <div>
              <Label className="text-slate-700 text-sm mb-3 block">
                Rating
              </Label>
              <div className="bg-secondary/40 rounded-xl p-6 border border-white/10">
                <div className="flex justify-center gap-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => !isPosting && setRating(star)}
                      onMouseEnter={() => !isPosting && setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      disabled={isPosting}
                      className="transform transition-all hover:scale-125 active:scale-110 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Star
                        className={`w-10 h-10 sm:w-12 sm:h-12 transition-all ${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center mt-4 text-base font-medium text-primary">
                    {rating === 5 && '🌟 Amazing!'}
                    {rating === 4 && '😊 Great!'}
                    {rating === 3 && '👍 Good'}
                    {rating === 2 && '😐 Okay'}
                    {rating === 1 && '😞 Needs Improvement'}
                  </p>
                )}
              </div>
            </div>

            {/* Feedback */}
            <div>
              <Label htmlFor="feedback" className="text-slate-700 text-sm mb-2 block">
                Your Feedback
              </Label>
              <Textarea
                id="feedback"
                placeholder="Share your experience, teaching style, course difficulty, etc..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isPosting}
                className="bg-secondary/50 border-slate-200/50 rounded-xl min-h-[140px] focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all resize-none text-slate-900 placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Be respectful and constructive in your feedback
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPosting}
              className="w-full gradient-bg-purple hover:opacity-90 rounded-xl h-13 text-white shadow-glow transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isPosting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Post Feedback</span>
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}