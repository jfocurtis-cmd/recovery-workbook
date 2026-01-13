import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
    Auth,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, Firestore } from "firebase/firestore";
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
    auth = getAuth(app);
    db = getFirestore(app);
}

export type UserRole = "sponsor" | "sponsee";

export interface UserProfile {
    uid: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    displayName?: string;
}

// Sign up with email, password, and role
export async function signUp(
    email: string,
    password: string,
    role: UserRole,
    displayName?: string
): Promise<UserProfile> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userProfile: UserProfile = {
        uid: user.uid,
        email: email,
        role: role,
        createdAt: new Date(),
        displayName: displayName || email.split("@")[0],
    };

    // Save user profile to Firestore
    await setDoc(doc(db, "users", user.uid), {
        ...userProfile,
        createdAt: userProfile.createdAt.toISOString(),
    });

    return userProfile;
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}

// Sign out
export async function signOut(): Promise<void> {
    await firebaseSignOut(auth);
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

// Listen to auth state changes
export function onAuthChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
}

// Get current user
export function getCurrentUser(): User | null {
    return auth?.currentUser || null;
}

export { auth, db };
