# 👨‍💼 SIMATS HUB - Administrator Guide

## ✅ Update: 8-Digit OTP Working!

### Good News! 
The app now accepts **8-digit OTP codes** (Supabase default). You should be able to login successfully!

Just check your email, copy the 8-digit code, paste it in the app, and login. ✨

---

## 🎨 Optional: Customize Email Design

Want a prettier email template? See [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) for a beautiful custom email design.

---

## 📋 Current App Configuration

### Authentication Method
- **Type**: Email OTP (One-Time Password)
- **No passwords needed** - completely passwordless
- **Email format**: `123456789.simats@saveetha.com`
- **OTP length**: 8 digits (Supabase default)
- **Validity**: 60 minutes

### User Flow
1. Student enters college email
2. System sends 8-digit OTP
3. Student enters OTP
4. System creates account automatically (first time) or logs in
5. Student can post feedback!

### Post Restrictions
- Students can post once every **15 days**
- All posts are **anonymous** (identity protected)
- Posts include:
  - Course code (e.g., CSE01)
  - Faculty name
  - Faculty mobile
  - Course name
  - Internal marks received
  - Detailed feedback
  - 5-star rating

---

## 🔧 What's Already Working

✅ **Frontend**: Beautiful dark-themed UI with glassmorphism  
✅ **Backend**: Supabase edge functions with KV storage  
✅ **Auth Flow**: OTP send and verify functions  
✅ **Feedback System**: Create and view posts  
✅ **Search**: Find feedback by faculty or course name  
✅ **15-Day Restriction**: Automatic enforcement  
✅ **Anonymous Posts**: Privacy protected  

---

## ❌ What Needs Your Action

### 1. Email Template Configuration (URGENT)
**Status**: ⚠️ Not configured  
**Impact**: Users receive magic links instead of numeric OTP codes  
**Fix**: Update email template (see SETUP_CHECKLIST.md)  
**Time**: 2 minutes  

### 2. SMTP Configuration (Recommended for Production)
**Status**: ⚠️ Using Supabase default  
**Impact**: Limited email delivery in production  
**Fix**: Configure custom SMTP provider  
**Time**: 10 minutes  

---

## 📧 Email Template - What to Change

### Current State (What Supabase sends by default):
```
Subject: Confirm your signup
Body: Click this link to confirm...
[Contains a magic link URL OR 8-digit OTP in plain text]
```

### What You're Getting:
Supabase sends **8-digit OTP codes** by default. The app is now configured to accept 8 digits!

### Optional: Customize the Email Template
If you want a prettier email format, replace `{{ .ConfirmationURL }}` with `{{ .Token }}` in the email template.

See the **complete styled template** in [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) Step 4.

---

## 🧪 How to Test

### Test the OTP System:
1. Open your SIMATS HUB app
2. Enter email: `123456789.simats@saveetha.com`
3. Click "Send OTP"
4. Check the email inbox
5. **Expected**: Email with 8-digit code (Supabase default)
6. Copy the 8-digit code from the email
7. Enter the 8-digit code in the app
8. Click "Verify & Login"
9. Should login successfully ✅

### Test the Feedback System:
1. After login, click the "+" button
2. Fill in the feedback form:
   - Course Code: `CSE01` (format: 3 letters + 2 digits)
   - Faculty Name: Any name
   - Faculty Mobile: 10 digits
   - Course Name: Any course
   - Internal Marks: 0-100
   - Feedback: Detailed text
   - Rating: 1-5 stars
3. Submit
4. Check if it appears in the feed (should be anonymous)
5. Try posting again → Should say "wait 15 days"

### Test Search:
1. Click search icon
2. Search for faculty name or course name
3. Results should appear

---

## 🚨 Common Issues & Solutions

### Issue 1: "Getting magic link instead of OTP"
**Cause**: Email template not updated  
**Fix**: Update the Magic Link template in Supabase  
**Guide**: SETUP_CHECKLIST.md  

### Issue 2: "No email received"
**Causes**:
- Email in spam folder
- Email provider not configured
- Wrong email format

**Fixes**:
- Check spam folder
- Enable email provider in Supabase
- Verify email format: `9digits.simats@saveetha.com`

### Issue 3: "OTP code doesn't work"
**Causes**:
- Code expired (>60 minutes old)
- Typo in the code
- Using old code

**Fixes**:
- Click "Resend OTP" to get fresh code
- Double-check the 6 digits
- Use only the most recent code

### Issue 4: "Can't post feedback again"
**Cause**: 15-day restriction in effect  
**This is expected behavior**  
**Note**: The app shows how many days remaining  

---

## 📊 Database Structure

### Tables Used:
- **Built-in Supabase Auth**: User accounts
- **kv_store_233aa38f**: Key-value storage for:
  - `feedback:{timestamp}:{userId}`: Feedback posts
  - `user:lastpost:{userId}`: Last post timestamp

### Data Flow:
```
Frontend (React) 
    ↓ API calls
Edge Function (Hono Server)
    ↓ Auth & Storage
Supabase (Auth + KV Store)
```

---

## 🔐 Security Notes

### Email Validation
- Only allows: `^[0-9]{9}\.simats@saveetha\.com$`
- Example valid: `123456789.simats@saveetha.com`
- Example invalid: `test@gmail.com`

### Anonymous Posts
- User email and name are replaced with "Anonymous"
- Only course and faculty details are shown
- Student identity is protected

### Authorization
- All post/edit endpoints require valid access token
- Token validated against Supabase Auth
- 15-day restriction enforced server-side

---

## 📱 Frontend Features

### Pages:
1. **Login/OTP Page**: Email + OTP verification
2. **Home/Feed**: View all feedback posts
3. **Post Form**: Create new feedback (if eligible)
4. **Search Page**: Search by faculty/course

### UI/UX:
- Dark theme with purple/indigo gradients
- Glassmorphism effects
- Smooth animations
- Mobile-optimized
- Responsive design

---

## 🎨 Branding

- **App Name**: SIMATS HUB
- **Tagline**: "Your voice matters ✨"
- **Colors**: Purple/Indigo gradients
- **Audience**: Saveetha College Students

---

## 📞 Getting Help

### Check These First:
1. Browser console (F12 → Console tab)
2. Supabase logs (Dashboard → Logs)
3. Email spam folder

### Documentation:
- **Quick Setup**: `SETUP_CHECKLIST.md`
- **Detailed Guide**: `OTP_SETUP.md`
- **This File**: Overview and troubleshooting

### Console Messages:
The app logs helpful colored messages in the browser console:
- Red: Setup warnings
- Green: Success messages
- Blue: Info about OTP

---

## ✅ Launch Checklist

Before going live with students:

- [ ] Update email template (SETUP_CHECKLIST.md)
- [ ] Test OTP login with real email
- [ ] Test posting feedback
- [ ] Test 15-day restriction
- [ ] Test search functionality
- [ ] Configure SMTP for production (optional but recommended)
- [ ] Test on mobile devices
- [ ] Verify all emails arrive (not in spam)
- [ ] Test with multiple users
- [ ] Confirm anonymity is working

---

## 🎯 Success Metrics

You'll know everything is working when:

✅ Students receive numeric OTP codes (not links)  
✅ Login completes successfully  
✅ Feedback posts appear in the feed  
✅ All posts show "Anonymous Student"  
✅ 15-day restriction blocks duplicate posts  
✅ Search finds relevant feedback  
✅ UI looks great on mobile and desktop  

---

**Ready to fix the OTP issue?**  
👉 **Go to [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) now!**

---

*Last Updated: November 2025*  
*SIMATS HUB v1.0*
