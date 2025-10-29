# 📧 Email Password Recovery Setup Guide

## ✅ What's Been Implemented

The password recovery system now works as follows:

### For Default Email (admin@site.com)
- Instantly resets password to `admin123`
- No email required

### For Custom Email (after changing in dashboard)
- Generates a secure reset token
- Sends password reset email with clickable link
- Link expires in 1 hour
- Token can only be used once

## 🔧 Setup Instructions

### Step 1: Configure Gmail App Password

**IMPORTANT:** Gmail requires an "App Password" for third-party applications.

1. **Enable 2-Step Verification:**
   - Go to: https://myaccount.google.com/security
   - Find "2-Step Verification" and enable it

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Name it: **IPTV Admin Panel**
   - Click **Generate**
   - Copy the 16-character password (looks like: `abcd efgh ijkl mnop`)

### Step 2: Update .env File

Open `backend/.env` and update these lines:

```env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM=IPTV Admin <your-actual-email@gmail.com>
```

Replace:
- `your-actual-email@gmail.com` with your real Gmail address
- `abcdefghijklmnop` with the App Password you generated (remove spaces)

### Step 3: Test Email Configuration

Run this command to test if email is working:

```bash
cd backend
node test-email.js
```

This will:
1. Verify your SMTP connection
2. Optionally send a test email

If you see ✅, your email is configured correctly!

## 📋 How It Works

### User Flow:

1. **User clicks "Recover Password"** on login page
2. **System checks email:**
   - If `admin@site.com` → Instant reset to `admin123`
   - If custom email → Send reset link email

3. **User receives email** with reset link
4. **User clicks link** → Opens reset password page
5. **User enters new password** (min 8 characters)
6. **Password is reset** → Redirected to login

### Security Features:

- ✅ Tokens expire after 1 hour
- ✅ Tokens can only be used once
- ✅ Secure random token generation (32 bytes)
- ✅ Tokens stored in database
- ✅ Old tokens automatically invalidated

## 🧪 Testing the System

### Test 1: Default Email Reset
1. Go to login page
2. Enter: `admin@site.com`
3. Click "🔑 Recover Password"
4. Should see: "Password has been reset to: admin123"
5. Login with `admin@site.com` / `admin123`

### Test 2: Custom Email Reset
1. Login to admin dashboard
2. Go to Account Settings
3. Change email to your real email
4. Logout
5. On login page, enter your new email
6. Click "🔑 Recover Password"
7. Check your email inbox
8. Click the reset link
9. Enter new password
10. Login with new password

## 🐛 Troubleshooting

### "Failed to send reset email"

**Possible causes:**
1. Gmail App Password not set correctly
2. 2-Step Verification not enabled
3. Wrong email in EMAIL_USER
4. Spaces in EMAIL_PASSWORD (remove them)

**Solution:**
```bash
cd backend
node test-email.js
```

Follow the error messages to identify the issue.

### Email not received

**Check:**
1. Spam folder
2. Email address is correct
3. Gmail account has space (not full)
4. App Password is valid

### "Invalid or expired reset token"

**Causes:**
1. Link is older than 1 hour
2. Link already used
3. Token manually deleted from database

**Solution:**
Request a new password reset email.

## 📁 Files Created/Modified

### Backend Files:
- ✅ `routes/auth.js` - Added reset endpoints
- ✅ `utils/emailService.js` - Email sending logic
- ✅ `create-password-reset-table.js` - Database setup
- ✅ `test-email.js` - Email testing tool
- ✅ `.env` - Email configuration

### Frontend Files:
- ✅ `app/admin/reset-password/page.jsx` - Reset password UI
- ✅ `app/admin/login/page.jsx` - Recovery button

### Database:
- ✅ `password_resets` table created

## 🎯 Next Steps

1. **Configure your Gmail App Password** in `.env`
2. **Run email test:** `node test-email.js`
3. **Test recovery flow** with custom email
4. **Keep your App Password secure!**

## 📞 Support

If you encounter issues:
1. Run `node test-email.js` first
2. Check the backend console for error logs
3. Verify Gmail settings are correct
4. Make sure 2-Step Verification is ON

---

**Remember:** Keep your `EMAIL_PASSWORD` (App Password) secret and never commit it to version control!
