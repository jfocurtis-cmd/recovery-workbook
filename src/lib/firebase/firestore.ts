import { doc, setDoc, getDoc, updateDoc, collection, query, where, onSnapshot } from "firebase/firestore";
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

// Subscribe to real-time updates for step progress
export function subscribeToStepProgress(
    userId: string,
    callback: (progress: StepProgress[]) => void
): () => void {
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

        // Return empty progress structure for new steps
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
    if (!db) {
        console.warn("Firestore not initialized");
        return;
    }

    try {
        const docId = `${userId}_step${stepNumber}${partNumber ? `_part${partNumber}` : ""}`;
        const docRef = doc(db, "stepProgress", docId);

        // First ensure the document exists
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            // Create the document first
            await setDoc(docRef, {
                userId,
                stepNumber,
                partNumber,
                data: { [fieldPath]: value },
                lastUpdated: new Date().toISOString(),
            });
        } else {
            // Update existing document
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
    // Find the highest step number that has an assignment date but no completion date
    const inProgressSteps = stepProgress.filter(
        (p) => p.assignmentDate && !p.completionDate
    );

    if (inProgressSteps.length > 0) {
        return Math.max(...inProgressSteps.map((p) => p.stepNumber));
    }

    // If all assigned steps are complete, return the next step
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
    if (!db) {
        console.warn("Firestore not initialized");
        return [];
    }

    try {
        const q = query(collection(db, "stepProgress"), where("userId", "==", userId));
        const snapshot = await import("firebase/firestore").then(m => m.getDocs(q));
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
