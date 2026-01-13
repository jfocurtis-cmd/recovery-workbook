// Step passwords for sponsee access control
// Sponsors provide these passwords to sponsees when they're ready for each step

export const stepPasswords: Record<number, string> = {
    1: "honest",
    2: "hope",
    3: "faith",
    4: "courage",
    5: "truth",
    6: "prepare",
    7: "asking",
    8: "accountable",
    9: "healing",
    10: "watchful",
    11: "conscious",
    12: "carry",
};

// Verify a password for a step (case-insensitive)
export function verifyStepPassword(stepNumber: number, password: string): boolean {
    const correctPassword = stepPasswords[stepNumber];
    if (!correctPassword) return false;
    return password.toLowerCase().trim() === correctPassword.toLowerCase();
}

// Get password hint (first letter only)
export function getPasswordHint(stepNumber: number): string {
    const password = stepPasswords[stepNumber];
    if (!password) return "";
    return `Starts with "${password[0].toUpperCase()}"`;
}
