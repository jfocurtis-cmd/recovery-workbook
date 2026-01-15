// Demo mode flag - must match AuthContext
const DEMO_MODE = true;

import { doc, setDoc, getDoc, updateDoc, collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "./auth";

// Types
export interface StepProgress {
    id: string;
    userId: string;
    stepNumber: number;
    partNumber?: number;
    assignmentDate?: string;
    completionDate?: string;
    data: Record<string, unknown>;
    lastUpdated: string;
}

export interface ResentmentEntry {
    id: string;
    resentfulAt: string;
    theCause: string;
    affectsMy: {
        selfEsteem: boolean;
        pocketbook: boolean;
        ambition: boolean;
        personalRelations: boolean;
        sexualRelations: boolean;
        security: boolean;
    };
    myPart: string;
    myFears: string;
    sexReview: string;
}

// Demo data - sample progress for a user on step 4
const DEMO_PROGRESS: StepProgress[] = [
    {
        id: "demo_step1",
        userId: "demo-user-123",
        stepNumber: 1,
        assignmentDate: "2025-10-01T00:00:00.000Z",
        completionDate: "2025-10-15T00:00:00.000Z",
        data: {
            admit: "To acknowledge openly, often reluctantly",
            powerless: "Lacking strength, influence, or ability to control",
            unmanageable: "Difficult or impossible to control or organize",
        },
        lastUpdated: "2025-10-15T00:00:00.000Z",
    },
    {
        id: "demo_step2",
        userId: "demo-user-123",
        stepNumber: 2,
        assignmentDate: "2025-10-16T00:00:00.000Z",
        completionDate: "2025-11-01T00:00:00.000Z",
        data: {
            believe: "To accept as true or real",
            restore: "To bring back to a previous condition",
            sanity: "Soundness of mind, rational thinking",
            insanity: "Doing the same thing expecting different results",
        },
        lastUpdated: "2025-11-01T00:00:00.000Z",
    },
    {
        id: "demo_step3",
        userId: "demo-user-123",
        stepNumber: 3,
        assignmentDate: "2025-11-02T00:00:00.000Z",
        completionDate: "2025-11-20T00:00:00.000Z",
        data: {},
        lastUpdated: "2025-11-20T00:00:00.000Z",
    },
    {
        id: "demo_step4",
        userId: "demo-user-123",
        stepNumber: 4,
        assignmentDate: "2025-11-21T00:00:00.000Z",
        data: {
            launched: "To set in motion, begin",
            moral: "Concerned with principles of right and wrong",
        },
        lastUpdated: "2025-12-15T00:00:00.000Z",
    },
];

// In-memory storage for demo mode
let demoProgressData: StepProgress[] = [...DEMO_PROGRESS];
let localStepData: Record<string, Record<string, unknown>> = {};

// Subscribe to real-time updates for step progress
export function subscribeToStepProgress(
    userId: string,
    callback: (progress: StepProgress[]) => void
): () => void {
    if (DEMO_MODE) {
        setTimeout(() => callback(demoProgressData), 100);
        return () => { };
    }

    if (!db) {
        console.warn("Firestore not initialized");
        callback([]);
        return () => { };
    }

    const q = query(collection(db, "stepProgress"), where("userId", "==", userId));
    return onSnapshot(q, (snapshot) => {
        const progress: StepProgress[] = [];
        snapshot.forEach((docSnap) => {
            progress.push({ id: docSnap.id, ...docSnap.data() } as StepProgress);
        });
        callback(progress);
    }, (error) => {
        console.error("Error subscribing to step progress:", error);
        callback([]);
    });
}

// Get step progress for a user
export async function getStepProgress(
    userId: string,
    stepNumber: number,
    partNumber?: number
): Promise<StepProgress | null> {
    if (DEMO_MODE) {
        const stepData = demoProgressData.find(
            (p) => p.stepNumber === stepNumber && p.userId === userId
        );
        if (stepData) {
            const localKey = `${userId}_step${stepNumber}`;
            if (localStepData[localKey]) {
                return {
                    ...stepData,
                    data: { ...stepData.data, ...localStepData[localKey] },
                };
            }
            return stepData;
        }
        return {
            id: `${userId}_step${stepNumber}`,
            userId,
            stepNumber,
            data: localStepData[`${userId}_step${stepNumber}`] || {},
            lastUpdated: new Date().toISOString(),
        };
    }

    if (!db) {
        console.warn("Firestore not initialized");
        return null;
    }

    try {
        const docId = `${userId}_step${stepNumber}${partNumber ? `_part${partNumber}` : ""}`;
        const docRef = doc(db, "stepProgress", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as StepProgress;
        }

        return {
            id: docId,
            userId,
            stepNumber,
            partNumber,
            data: {},
            lastUpdated: new Date().toISOString(),
        };
    } catch (error) {
        console.error("Error getting step progress:", error);
        return null;
    }
}

// Create or update step progress
export async function saveStepProgress(
    userId: string,
    stepNumber: number,
    data: Partial<StepProgress>
): Promise<void> {
    if (DEMO_MODE) {
        const existingIndex = demoProgressData.findIndex(
            (p) => p.stepNumber === stepNumber && p.userId === userId
        );

        if (existingIndex >= 0) {
            demoProgressData[existingIndex] = {
                ...demoProgressData[existingIndex],
                ...data,
                lastUpdated: new Date().toISOString(),
            };
        } else {
            demoProgressData.push({
                id: `${userId}_step${stepNumber}`,
                userId,
                stepNumber,
                data: data.data || {},
                lastUpdated: new Date().toISOString(),
                ...data,
            } as StepProgress);
        }
        console.log("Demo: Saved step progress for step", stepNumber);
        return;
    }

    if (!db) {
        console.warn("Firestore not initialized");
        return;
    }

    try {
        const docId = `${userId}_step${stepNumber}`;
        const docRef = doc(db, "stepProgress", docId);

        await setDoc(docRef, {
            userId,
            stepNumber,
            ...data,
            lastUpdated: new Date().toISOString(),
        }, { merge: true });
    } catch (error) {
        console.error("Error saving step progress:", error);
    }
}

// Update specific data field in step progress
export async function updateStepData(
    userId: string,
    stepNumber: number,
    fieldPath: string,
    value: unknown,
    partNumber?: number
): Promise<void> {
    if (DEMO_MODE) {
        const localKey = `${userId}_step${stepNumber}`;
        localStepData[localKey] = {
            ...localStepData[localKey],
            [fieldPath]: value,
        };
        console.log("Demo: Saved field", fieldPath, "for step", stepNumber);
        return;
    }

    if (!db) {
        console.warn("Firestore not initialized");
        return;
    }

    try {
        const docId = `${userId}_step${stepNumber}${partNumber ? `_part${partNumber}` : ""}`;
        const docRef = doc(db, "stepProgress", docId);

        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            await setDoc(docRef, {
                userId,
                stepNumber,
                partNumber,
                data: { [fieldPath]: value },
                lastUpdated: new Date().toISOString(),
            });
        } else {
            await updateDoc(docRef, {
                [`data.${fieldPath}`]: value,
                lastUpdated: new Date().toISOString(),
            });
        }
    } catch (error) {
        console.error("Error updating step data:", error);
    }
}

// Mark step as assigned
export async function assignStep(
    userId: string,
    stepNumber: number,
    partNumber?: number
): Promise<void> {
    await saveStepProgress(userId, stepNumber, {
        partNumber,
        assignmentDate: new Date().toISOString(),
    });
}

// Mark step as completed
export async function completeStep(
    userId: string,
    stepNumber: number,
    partNumber?: number
): Promise<void> {
    if (DEMO_MODE) {
        const existingIndex = demoProgressData.findIndex(
            (p) => p.stepNumber === stepNumber && p.userId === userId
        );

        if (existingIndex >= 0) {
            demoProgressData[existingIndex] = {
                ...demoProgressData[existingIndex],
                completionDate: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
            };
        }
        console.log("Demo: Marked step", stepNumber, "as complete");
        return;
    }

    await saveStepProgress(userId, stepNumber, {
        partNumber,
        completionDate: new Date().toISOString(),
    });
}

// Calculate total days in program
export function calculateTotalDays(stepProgress: StepProgress[]): number {
    if (stepProgress.length === 0) return 0;

    const step1 = stepProgress.find((p) => p.stepNumber === 1);
    if (!step1?.assignmentDate) return 0;

    const startDate = new Date(step1.assignmentDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

// Calculate days on current step
export function calculateCurrentStepDays(
    stepProgress: StepProgress[],
    currentStepNumber: number
): number {
    const currentStep = stepProgress.find(
        (p) => p.stepNumber === currentStepNumber && !p.completionDate
    );

    if (!currentStep?.assignmentDate) return 0;

    const startDate = new Date(currentStep.assignmentDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

// Get current step number
export function getCurrentStepNumber(stepProgress: StepProgress[]): number {
    const inProgressSteps = stepProgress.filter(
        (p) => p.assignmentDate && !p.completionDate
    );

    if (inProgressSteps.length > 0) {
        return Math.max(...inProgressSteps.map((p) => p.stepNumber));
    }

    const completedSteps = stepProgress.filter((p) => p.completionDate);
    if (completedSteps.length > 0) {
        const maxCompleted = Math.max(...completedSteps.map((p) => p.stepNumber));
        return Math.min(maxCompleted + 1, 12);
    }

    return 1;
}

// Get completed steps count
export function getCompletedStepsCount(stepProgress: StepProgress[]): number {
    const completedSteps = new Set(
        stepProgress.filter((p) => p.completionDate).map((p) => p.stepNumber)
    );
    return completedSteps.size;
}

// Get all step progress for a user
export async function getAllStepProgress(userId: string): Promise<StepProgress[]> {
    if (DEMO_MODE) {
        return demoProgressData;
    }

    if (!db) {
        console.warn("Firestore not initialized");
        return [];
    }

    try {
        const q = query(collection(db, "stepProgress"), where("userId", "==", userId));
        const snapshot = await getDocs(q);
        const progress: StepProgress[] = [];
        snapshot.forEach((docSnap) => {
            progress.push({ id: docSnap.id, ...docSnap.data() } as StepProgress);
        });
        return progress;
    } catch (error) {
        console.error("Error getting all step progress:", error);
        return [];
    }
}
