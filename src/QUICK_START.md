# 🚀 SIMATS HUB - Quick Start

## ⚡ Getting 8-Digit OTP Codes?

### This is correct! Supabase sends 8-digit OTP codes by default.

The app is now configured to accept 8 digits. Just:
1. Check your email for the 8-digit code
2. Enter all 8 digits in the app
3. Login successfully! ✅

### Want a prettier email design? (Optional)
1. **Open Supabase Dashboard**: https://supabase.com/dashboard
2. **Go to**: `Authentication` → `Email Templates` → `Magic Link`
3. **Copy the email template** from: `/guidelines/SETUP_CHECKLIST.md` (Step 4)
4. **Paste it** in the template editor
5. **Save**

---

## 📚 Full Documentation

| Document | Purpose |
|----------|---------|
| **[SETUP_CHECKLIST.md](./guidelines/SETUP_CHECKLIST.md)** | ⭐ Step-by-step OTP configuration |
| **[README_ADMIN.md](./guidelines/README_ADMIN.md)** | Complete admin guide & troubleshooting |
| **[OTP_SETUP.md](./guidelines/OTP_SETUP.md)** | Detailed OTP technical documentation |

---

## 🎯 What's Working Now

✅ OTP authentication system (8-digit codes)  
✅ Email format validation (9digits.simats@saveetha.com)  
✅ Feedback posting with 15-day restriction  
✅ Anonymous posts for student privacy  
✅ Search by faculty/course name  
✅ Beautiful dark-themed UI  
✅ Mobile-responsive design  

---

## ⚠️ What You Need to Do

### Priority 1 (Ready to use!):
- ✅ OTP authentication is working with 8-digit codes

### Priority 2 (Recommended - 10 minutes):
- [ ] Configure SMTP for production email delivery

### Priority 3 (Optional):
- [ ] Customize email template for better design
- [ ] Test with real student emails

---

## 🧪 Test Your Setup

1. Open the app
2. Enter: `123456789.simats@saveetha.com`
3. Click "Send OTP"
4. Check email - should have **8-digit code**
5. Enter all 8 digits
6. Login successfully ✅

---

## 💡 Helpful Tips

- **Browser Console**: Press F12 → Console tab for helpful colored messages
- **Email Not Coming**: Check spam folder first
- **OTP Expired**: Codes are valid for 60 minutes
- **Need Fresh Code**: Click "Resend OTP"

---

## 🎓 App Overview

**SIMATS HUB** is a student feedback platform where:
- Students login with college email + 8-digit OTP (no passwords!)
- Share feedback on courses and faculty
- All posts are anonymous
- Can post once every 15 days
- Search feedback by faculty or course name

---

## 🔗 Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Email Templates**: Dashboard → Authentication → Email Templates
- **Auth Settings**: Dashboard → Authentication → Providers

---

**Ready?** → Go to [SETUP_CHECKLIST.md](./guidelines/SETUP_CHECKLIST.md) now! 🚀

---

*Made with ❤️ for Saveetha College Students*
