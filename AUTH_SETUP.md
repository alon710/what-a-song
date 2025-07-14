# 🔐 Authentication Setup Guide

## Firebase Authentication Setup

### 1. Enable Firebase Authentication

1. Go to your [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Email/Password** authentication
5. Optionally enable **Google** sign-in for easier access

### 2. Create Your First Admin User

Since the admin panel is now protected, you need to create your first admin user manually:

#### Option A: Using Firebase Console (Recommended)

1. Go to **Authentication** → **Users** in Firebase Console
2. Click **Add user**
3. Enter email and password for your admin account
4. Click **Add user**
5. Note the **User UID** from the user list

#### Option B: Using the Sign-up Flow

1. Temporarily modify the code to allow sign-ups (not recommended for production)
2. Create an account through the app
3. Get the User UID from Firebase Console

### 3. Set Admin Role in Firestore

After creating the user, you need to manually set their role to "admin":

1. Go to **Firestore Database** in Firebase Console
2. Navigate to the `users` collection
3. Find the document with your user's UID
4. Edit the document and set:
   ```json
   {
     "role": "admin"
   }
   ```
5. Save the document

### 4. Update Environment Variables

Make sure your `.env.local` file includes all Firebase config variables:

```bash
# Firebase Authentication (these should already exist)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Security Rules for Firestore

Update your Firestore security rules to protect user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Games collection - read by everyone, write by admins only
    match /games/{gameId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Users collection - users can read their own data, admins can read all
    match /users/{userId} {
      allow read: if request.auth != null &&
        (request.auth.uid == userId || isAdmin());
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    function isAdmin() {
      return request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## How the Authentication System Works

### Protected Routes

- **Admin Panel** (`/admin`): Requires authentication + admin role
- **Home Page** (`/`): Public access for all users
- **Login Page** (`/auth/login`): Public access

### User Roles

- **`user`**: Default role for new registrations
- **`admin`**: Can access admin panel and create games

### Navigation Features

- **Login/Logout buttons**: Shown based on authentication status
- **Admin panel link**: Only visible to admin users
- **User indicator**: Shows admin shield icon for admin users

## Testing the Setup

1. **Test Public Access**: Visit `/` - should work without login
2. **Test Admin Protection**: Visit `/admin` - should redirect to login
3. **Test Login**: Use your admin credentials at `/auth/login`
4. **Test Admin Access**: After login, `/admin` should be accessible
5. **Test Admin UI**: Admin panel link should appear in navigation

## Making Additional Admin Users

To make existing users admins:

1. Go to Firebase Console → Firestore Database
2. Find the user in the `users` collection
3. Update their `role` field to `"admin"`
4. The user will have admin access on their next login

## Security Considerations

1. **Firestore Rules**: Always implement proper security rules
2. **Admin Creation**: Don't expose admin creation in production UI
3. **Role Validation**: Server-side validation for admin operations
4. **Regular Audits**: Periodically review admin users in Firebase Console

## Troubleshooting

### "Access Denied" after login

- Check that the user's role is set to "admin" in Firestore
- Verify Firestore security rules allow admin access

### Login page keeps redirecting

- Check Firebase Authentication configuration
- Verify environment variables are correct

### Admin panel not showing

- Confirm user has "admin" role in Firestore
- Check browser console for authentication errors
