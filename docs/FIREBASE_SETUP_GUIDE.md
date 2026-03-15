# Firebase Authentication Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or "Create a project"
3. Enter project name: **EasyBuyStore** (or your preferred name)
4. Click "Continue"
5. Disable Google Analytics (optional, you can enable it if needed)
6. Click "Create Project"
7. Wait for project to be created, then click "Continue"

## Step 2: Enable Authentication Methods

### Enable Email/Password Authentication
1. In Firebase Console, click "Authentication" in the left sidebar
2. Click "Get Started"
3. Go to "Sign-in method" tab
4. Click on "Email/Password"
5. Toggle "Enable"
6. Click "Save"

### Enable Google Sign-In
1. Still in "Sign-in method" tab
2. Click on "Google"
3. Toggle "Enable"
4. Enter support email (your email)
5. Click "Save"

### (Optional) Enable Other Providers
You can also enable:
- Facebook
- GitHub
- Twitter
- Microsoft
- Apple
- etc.

## Step 3: Get Firebase Configuration

1. In Firebase Console, click the gear icon next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>` to add a web app
5. Enter app nickname: **EasyBuyStore Web**
6. Check "Also set up Firebase Hosting" (optional)
7. Click "Register app"
8. Copy the Firebase configuration object - it will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Step 4: Add Configuration to .env File

Add these variables to your `.env` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

## Step 5: Configure Authorized Domains

1. In Firebase Console → Authentication → Settings
2. Go to "Authorized domains" tab
3. Add your domains:
   - `localhost` (already added by default)
   - Your production domain (e.g., `easybuystore.com`)
   - Your deployment preview domains (e.g., Vercel preview URLs)

## Step 6: Set Up OAuth Redirect URIs (For Google Sign-In)

Your redirect URI will be:
```
http://localhost:3000/api/auth/callback/google
```

For production:
```
https://yourdomain.com/api/auth/callback/google
```

## What We've Implemented

### Files Created/Modified:
1. `/lib/firebase/config.ts` - Firebase initialization
2. `/lib/auth/auth.ts` - NextAuth configuration with Google provider
3. `/app/signin/page.tsx` - Sign-in page with Google button
4. `/app/signup/page.tsx` - Sign-up page with Google button

### Features Added:
- Google Sign-In button on login page
- Google Sign-Up button on registration page
- Automatic user creation in Supabase when signing in with Google
- Seamless integration with existing email/password auth
- Session management through NextAuth

### User Flow:
1. **New User with Google:**
   - Clicks "Continue with Google"
   - Authenticates with Google
   - Automatically creates account in Supabase `users` table
   - Logs in successfully

2. **Existing User with Google:**
   - Clicks "Continue with Google"
   - Authenticates with Google
   - Finds existing account in Supabase
   - Logs in successfully

3. **Email/Password (Original Flow):**
   - Still works exactly as before
   - No changes to existing functionality

## Testing

### Test Google Sign-In:
1. Go to http://localhost:3000/signin
2. Click "Continue with Google"
3. Select your Google account
4. Authorize the app
5. Should redirect to homepage logged in

### Test Email/Password (Still Works):
1. Go to http://localhost:3000/signin
2. Enter: `customer@test.com` / `password123`
3. Should login normally

## Security Notes

1. **NEXT_PUBLIC_ prefix**: These env variables are exposed to the browser, which is safe for Firebase config
2. **API Keys**: Firebase API keys are safe to expose (they're restricted by domain and Firebase Security Rules)
3. **Admin Auth**: Admin login still uses email/password only (more secure)
4. **Role Management**: User roles are still stored in Supabase and validated on backend

## Troubleshooting

### "Redirect URI mismatch" error:
- Make sure you've added `http://localhost:3000` to authorized domains in Firebase Console

### "Google Sign-In popup blocked":
- Allow popups for localhost in your browser

### "User not found in database":
- The system automatically creates users in Supabase on first Google sign-in
- Check the console logs to see user creation process

## Next Steps (Optional Enhancements)

1. **Add more OAuth providers:**
   - Facebook, GitHub, Twitter, etc.

2. **Email Verification:**
   - Enable email verification in Firebase
   - Send verification emails on signup

3. **Password Reset:**
   - Implement forgot password functionality
   - Use Firebase's password reset emails

4. **Account Linking:**
   - Allow users to link Google account to existing email/password account

5. **Profile Management:**
   - Allow users to update display name and photo from Google
   - Sync with Supabase profile data

---

**Last Updated:** March 15, 2026
**Status:** Ready for Firebase configuration
