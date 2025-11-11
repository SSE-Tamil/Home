# OTP Authentication Setup

## 🚀 Quick Start
**Getting magic links instead of OTP codes?**  
👉 **See [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) for step-by-step instructions!**

## Overview
SIMATS HUB uses OTP (One-Time Password) authentication for secure, passwordless login for students.

## Email Configuration
**IMPORTANT**: To enable numeric OTP codes (instead of magic links), follow these steps:

### Steps to Configure OTP in Supabase:

1. **Go to Supabase Dashboard**
   - Open your project at https://supabase.com/dashboard

2. **Enable Email OTP**
   - Navigate to: `Authentication` → `Providers` → `Email`
   - Make sure "Enable Email provider" is turned ON
   - Scroll down and find "Email OTP" settings
   - **CRITICAL**: Look for the option "Secure email change" or "Email OTP" toggle
   - Ensure it's configured to send numeric OTP codes

3. **Configure Auth Settings**
   - Go to: `Authentication` → `Settings`
   - Under "Auth Providers", click on "Email"
   - Enable "Confirm email" if you want email verification
   - **Important**: Ensure "Enable email confirmations" uses OTP method

4. **Update Email Template (REQUIRED)**
   - Go to: `Authentication` → `Email Templates`
   - Click on "Magic Link" template
   - **Replace the magic link with OTP token**
   - Change the template to display: `{{ .Token }}` instead of the link
   - Example template:
     ```html
     <h2>Your SIMATS HUB Login Code</h2>
     <p>Enter this code to access your account:</p>
     <h1 style="font-size: 32px; letter-spacing: 8px;">{{ .Token }}</h1>
     <p>This code expires in 60 minutes.</p>
     <p>If you didn't request this code, please ignore this email.</p>
     ```

5. **Configure SMTP Settings** (Optional but recommended for production)
   - Go to: `Project Settings` → `Auth` → `SMTP Settings`
   - Configure your SMTP provider (Gmail, SendGrid, etc.)
   - OR use Supabase's built-in email service (limited to development)

## How It Works

### User Flow:
1. Student enters their college email (format: `123456789.simats@saveetha.com`)
2. System sends a 6-digit OTP to their email
3. Student enters the OTP
4. System verifies OTP and logs them in
5. User account is created automatically on first login

### Email Validation:
- Only emails matching the pattern `9digits.simats@saveetha.com` are accepted
- Example: `123456789.simats@saveetha.com`

### Security:
- OTPs are valid for a limited time (default: 1 hour)
- Users are created automatically via Supabase Auth
- No passwords to remember or manage

## Quick Fix: Update Email Template Now

### The Issue:
You're receiving a magic link instead of a 6-digit OTP code because the default Supabase email template sends links.

### The Solution (5 minutes):

**Step 1**: Go to your Supabase Dashboard
- URL: https://supabase.com/dashboard/project/YOUR_PROJECT_ID

**Step 2**: Navigate to Email Templates
- Sidebar: `Authentication` → `Email Templates`
- Click on **"Magic Link"** template

**Step 3**: Edit the Email Template
Replace the existing template with this OTP-friendly version:

```html
<h2>Welcome to SIMATS HUB! 🎓</h2>

<p>Hi there,</p>

<p>Your one-time password (OTP) for login is:</p>

<div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
  <h1 style="font-size: 48px; letter-spacing: 12px; color: #333; margin: 0; font-family: monospace;">
    {{ .Token }}
  </h1>
</div>

<p><strong>This code will expire in 60 minutes.</strong></p>

<p>Enter this 6-digit code in the SIMATS HUB app to complete your login.</p>

<p style="color: #666; font-size: 14px;">
  If you didn't request this code, please ignore this email. Your account is safe.
</p>

<hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

<p style="color: #999; font-size: 12px;">
  SIMATS HUB - Student Feedback Platform<br>
  Saveetha College
</p>
```

**Step 4**: Save the Template
- Click "Save" at the bottom

**Step 5**: Test
- Try logging in again
- You should now receive a 6-digit numeric code!

### Key Template Variable:
- `{{ .Token }}` - This displays the 6-digit OTP code
- `{{ .ConfirmationURL }}` - This is the magic link (DON'T use this)

## Testing

### Development Testing:
1. Enter your email in the login form
2. Check your email inbox for the OTP code
3. The code should be an 8-digit number (e.g., 12345678)
4. Enter the code and login

### If Email Doesn't Arrive:
1. Check your spam folder
2. Verify email is configured in Supabase settings
3. Check Supabase logs for any errors
4. For development, you can view OTP codes in: `Authentication` → `Logs`

### Production:
Ensure SMTP is properly configured before deploying to production.

## Benefits of OTP Authentication

✅ **No passwords** - Users don't need to remember passwords  
✅ **More secure** - No password leaks or weak passwords  
✅ **Easier onboarding** - One-click login for returning users  
✅ **Email verification** - Ensures valid college email addresses  
✅ **Auto account creation** - No separate signup flow needed  
✅ **8-digit codes** - Supabase default provides strong security
