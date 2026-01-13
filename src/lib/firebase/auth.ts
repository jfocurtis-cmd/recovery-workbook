import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
    Auth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, Firestore } from "firebase/firestore";
import firebaseConfig from "./config";

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== "undefined") {
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApps()[0];
    }
    // Initialize Auth
    auth = getAuth(app);
    // Initialize Firestore
    db = getFirestore(app);
}

export type UserRole = "sponsor" | "sponsee";

export interface UserProfile {
    uid: string;
    email?: string;
    phoneNumber?: string;
    role: UserRole;
    createdAt: Date;
    displayName?: string;
}

// ... (keep existing signUp, signIn, signOut, getUserProfile, onAuthChange, getCurrentUser functions)

export { auth, db };

// Update user role
export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, { role });
}

// --- PHONE AUTH UTILITIES ---

export function setupRecaptcha(elementId: string): RecaptchaVerifier {
    if (!auth) throw new Error("Auth not initialized");

    // Clear existing recaptcha if any
    const existingVerifier = (window as any).recaptchaVerifier;
    if (existingVerifier) {
        existingVerifier.clear();
    }

    const verifier = new RecaptchaVerifier(auth, elementId, {
        'size': 'invisible',
        'callback': () => {
            // reCAPTCHA solved
        }
    });

    (window as any).recaptchaVerifier = verifier;
    return verifier;
}

export async function signInWithPhone(phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<ConfirmationResult> {
    return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
}

// Get user profile from Firestore
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            ...data,
            createdAt: new Date(data.createdAt),
        } as UserProfile;
    }

    return null;
}

// Check if user profile exists (wrapper for getUserProfile)
export async function checkUserProfileExists(uid: string): Promise<boolean> {
    const profile = await getUserProfile(uid);
    return !!profile;
}

// Create profile for phone user
export async function createPhoneUserProfile(user: User, role: UserRole, displayName?: string): Promise<void> {
    const userProfile: UserProfile = {
        uid: user.uid,
        phoneNumber: user.phoneNumber || undefined,
        role: role,
        createdAt: new Date(),
        displayName: displayName || "User",
    };

    await setDoc(doc(db, "users", user.uid), {
        ...userProfile,
        createdAt: userProfile.createdAt.toISOString(),
    });
}
