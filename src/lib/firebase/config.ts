// Firebase Configuration
// Replace these placeholder values with your actual Firebase project configuration

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export default firebaseConfig;

/*
 * HOW TO SET UP FIREBASE:
 * 
 * 1. Go to https://console.firebase.google.com
 * 2. Click "Create a project" (or select existing)
 * 3. Name your project (e.g., "recovery-workbook")
 * 4. Enable Google Analytics if desired
 * 5. Once created, click the web icon (</>)  to add a web app
 * 6. Register your app with a nickname
 * 7. Copy the firebaseConfig object and replace the values above
 * 
 * REQUIRED SERVICES TO ENABLE:
 * 
 * Authentication:
 * - Go to Authentication > Sign-in method
 * - Enable "Email/Password" provider
 * 
 * Firestore Database:
 * - Go to Firestore Database
 * - Click "Create database"
 * - Choose production mode or test mode
 * - Select a location close to your users
 * 
 * Cloud Messaging (for notifications):
 * - Go to Project Settings > Cloud Messaging
 * - Generate a web push certificate (VAPID key)
 * - Add NEXT_PUBLIC_VAPID_KEY to your .env.local file
 */
