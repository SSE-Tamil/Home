# 📋 SIMATS HUB Setup Checklist

## ✅ Supabase OTP Configuration

### Good News! 
Supabase sends **8-digit OTP codes** by default. The app is now configured to work with these!

### Want to Customize the Email Design?
Follow these steps to make the OTP email prettier (optional):

---

## Step-by-Step Configuration

### 1️⃣ Open Supabase Dashboard
```
🔗 https://supabase.com/dashboard
```
- Select your SIMATS HUB project

---

### 2️⃣ Navigate to Email Templates
- **Left Sidebar**: Click `Authentication`
- Then click: `Email Templates`

---

### 3️⃣ Edit the Magic Link Template
- Click on **"Magic Link"** (this is the template used for OTP)
- You'll see an HTML editor

---

### 4️⃣ Replace with This OTP Template

**Delete everything** in the template editor and paste this:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 30px 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
      color: white;
    }
    .otp-code {
      background: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-radius: 12px;
      margin: 30px 0;
      border: 2px dashed #667eea;
    }
    .otp-code h1 {
      font-size: 56px;
      letter-spacing: 16px;
      color: #667eea;
      margin: 0;
      font-family: 'Courier New', monospace;
      font-weight: bold;
    }
    .info-box {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      text-align: center;
      color: #6c757d;
      font-size: 14px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #dee2e6;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 32px;">🎓 SIMATS HUB</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Student Feedback Platform</p>
  </div>

  <div style="padding: 20px 0;">
    <h2 style="color: #333;">Hello Student! 👋</h2>
    <p>Your one-time password for accessing SIMATS HUB is:</p>

    <div class="otp-code">
      <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your OTP Code</p>
      <h1>{{ .Token }}</h1>
      <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Valid for 60 minutes</p>
    </div>

    <div class="info-box">
      <strong>⏱️ Important:</strong> This code expires in <strong>1 hour</strong>. Enter it in the app to complete your login.
    </div>

    <p><strong>How to use this code:</strong></p>
    <ol>
      <li>Return to the SIMATS HUB app</li>
      <li>Enter this 8-digit code when prompted</li>
      <li>Click "Verify & Login"</li>
    </ol>

    <div style="background: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <strong>🔒 Security Note:</strong> Never share this code with anyone. SIMATS HUB staff will never ask for your OTP code.
    </div>

    <p style="color: #666; font-size: 14px;">
      If you didn't request this code, please ignore this email. Your account remains secure.
    </p>
  </div>

  <div class="footer">
    <p style="margin: 5px 0;">SIMATS HUB - Saveetha College</p>
    <p style="margin: 5px 0; font-size: 12px;">Making your voice heard ✨</p>
  </div>
</body>
</html>
```

---

### 5️⃣ Save the Template
- Scroll to the bottom
- Click **"Save"** button
- You should see a success message

---

### 6️⃣ Test the OTP System

1. **Go back to your app**
2. Enter a test email: `123456789.simats@saveetha.com`
3. Click "Send OTP"
4. **Check your email** - you should receive an 8-digit code
5. Enter the code in the app (all 8 digits)
6. Login successfully! 🎉

---

## 🔍 Troubleshooting

### Issue: Still receiving magic link?
- **Solution**: Make sure you saved the template correctly
- Try clearing your browser cache
- Check that you edited the "Magic Link" template (not a different one)

### Issue: Not receiving any email?
- Check spam/junk folder
- Verify email provider is enabled in Supabase
- Go to: `Authentication` → `Providers` → `Email` (make sure it's enabled)

### Issue: OTP code doesn't work?
- Make sure the code hasn't expired (60 minutes)
- Check for typos - codes are case-sensitive
- Try requesting a new code with "Resend OTP"

### Issue: Can't find Email Templates?
```
Navigation Path:
Supabase Dashboard 
  → Your Project 
  → Authentication (left sidebar) 
  → Email Templates
  → Magic Link
```

---

## 📧 Email Settings (Optional but Recommended)

For production use, configure custom SMTP:

1. Go to: `Project Settings` → `Auth`
2. Scroll to "SMTP Settings"
3. Configure your email provider:
   - **Gmail**: Use app-specific password
   - **SendGrid**: Use API key
   - **AWS SES**: Use SMTP credentials

---

## ✨ Success Indicators

You'll know OTP is working correctly when:

✅ Email contains an 8-digit numeric code  
✅ Code can be copied and pasted  
✅ Login works after entering the code  
✅ Optional: Email has your custom design (if you updated the template)  

---

## 🎯 Quick Reference

| Item | Value |
|------|-------|
| **Template to Edit** | Magic Link (optional) |
| **Key Variable** | `{{ .Token }}` |
| **Code Length** | 8 digits (Supabase default) |
| **Code Expiry** | 60 minutes |
| **Email Format** | `9digits.simats@saveetha.com` |

---

## 📞 Need Help?

Check the browser console for helpful messages:
- Open Developer Tools (F12)
- Go to Console tab
- Look for colored messages about OTP setup

---

**Last Updated**: November 2025  
**Version**: 1.0
