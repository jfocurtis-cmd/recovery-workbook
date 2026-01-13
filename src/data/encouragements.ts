// Rotating encouragement messages for daily notifications
// 30+ messages to avoid repetition

export const encouragementMessages: string[] = [
    // Progress & Growth
    "Every step forward is progress. You're doing great work today.",
    "Recovery is a journey, not a destination. Keep walking the path.",
    "Today is a gift. Use it wisely on your recovery.",
    "Small steps lead to big changes. Keep going!",
    "Your commitment to growth is inspiring. Keep it up!",

    // Self-Compassion
    "Be gentle with yourself today. You're doing hard work.",
    "Progress, not perfection. That's all that's asked of you.",
    "You are worthy of the life you're building.",
    "Give yourself credit for showing up each day.",
    "Self-compassion is a strength, not a weakness.",

    // Courage & Strength
    "Courage isn't the absence of fear—it's taking action despite it.",
    "You have the strength within you. Trust the process.",
    "Every day you stay the course, you grow stronger.",
    "Your bravery in facing yourself is remarkable.",
    "The work you're doing takes real courage.",

    // Connection & Community
    "You're not alone on this journey. Reach out today.",
    "Connection is the opposite of addiction. Stay connected.",
    "Consider calling your sponsor or a friend today.",
    "Being of service to others strengthens your own recovery.",
    "The fellowship is here for you. Lean on it.",

    // Gratitude & Mindfulness
    "Take a moment to notice three things you're grateful for today.",
    "Each sober day is a blessing. Acknowledge your progress.",
    "Stay present in this moment—it's all we truly have.",
    "Gratitude turns what we have into enough.",
    "Pause today and appreciate how far you've come.",

    // Spiritual Growth
    "Your higher power is with you today. Trust the plan.",
    "Prayer and meditation can center you when things feel uncertain.",
    "Turn it over. You don't have to carry everything alone.",
    "Faith can move mountains, one day at a time.",
    "Seek conscious contact with your higher power today.",

    // Action & Service
    "Today, look for ways to be of service to others.",
    "Action is the magic word. What can you do today?",
    "Your recovery can inspire someone else's beginning.",
    "Helping others is healing for yourself.",
    "Practice these principles in all your affairs today.",

    // Patience & Trust
    "Trust the process, even when you can't see the outcome.",
    "Patience is a virtue—especially in recovery.",
    "One day at a time. Sometimes one moment at a time.",
    "Good things are unfolding, even if you can't see them yet.",
    "Let go of what you can't control. Focus on what you can.",

    // Hope & Renewal
    "Every sunrise is a new beginning. Start fresh today.",
    "Hope is the foundation of recovery. Never give up.",
    "Today holds possibilities you haven't imagined yet.",
    "Your story isn't over—the best chapters may lie ahead.",
    "Believe in the person you're becoming.",
];

// Get a random encouragement message
export function getRandomEncouragement(): string {
    const index = Math.floor(Math.random() * encouragementMessages.length);
    return encouragementMessages[index];
}

// Get encouragement by day (cycles through all messages)
export function getEncouragementByDay(dayNumber: number): string {
    const index = dayNumber % encouragementMessages.length;
    return encouragementMessages[index];
}

// Get encouragement based on current step
export function getStepSpecificEncouragement(stepNumber: number): string {
    const stepMessages: Record<number, string[]> = {
        1: [
            "Admitting powerlessness is the first act of true strength.",
            "Recognizing unmanageability opens the door to a new life.",
            "The first step is the foundation for everything that follows.",
        ],
        2: [
            "Belief in something greater opens new possibilities.",
            "Sanity is found when we stop trying to control everything.",
            "Hope begins when we look beyond ourselves.",
        ],
        3: [
            "Turning it over doesn't mean giving up—it means trusting.",
            "The decision you made today changes everything.",
            "God's will often leads to better outcomes than our own plans.",
        ],
        4: [
            "Honest self-examination is the path to freedom.",
            "Looking at resentments helps us release them.",
            "Your fearless inventory is an act of courage.",
        ],
        5: [
            "Sharing our wrongs with another brings light to the darkness.",
            "Admission is liberation. You're setting yourself free.",
            "What we share loses its power over us.",
        ],
        6: [
            "Willingness is the key that opens every door.",
            "Being ready for change is itself a change.",
            "Let go of what no longer serves you.",
        ],
        7: [
            "Humility is not thinking less of yourself, but thinking of yourself less.",
            "Asking for help is a sign of wisdom, not weakness.",
            "Character transformation is happening within you.",
        ],
        8: [
            "Making the list begins the healing.",
            "Willingness to make amends is already progress.",
            "Freedom from the past starts with acknowledging it.",
        ],
        9: [
            "Each amend you make lightens your load.",
            "Cleaning up your side of the street brings peace.",
            "The promises are becoming real in your life.",
        ],
        10: [
            "Daily inventory keeps you on the right path.",
            "Catching resentments early prevents them from growing.",
            "Prompt admission maintains your spiritual condition.",
        ],
        11: [
            "Prayer and meditation deepen your conscious contact.",
            "Seek guidance, not outcomes.",
            "The still, small voice is worth listening for.",
        ],
        12: [
            "Carrying the message solidifies your own recovery.",
            "Service to others is the spiritual foundation of this work.",
            "Practice these principles in all your affairs—you've earned it.",
        ],
    };

    const messages = stepMessages[stepNumber] || encouragementMessages;
    const index = Math.floor(Math.random() * messages.length);
    return messages[index];
}
