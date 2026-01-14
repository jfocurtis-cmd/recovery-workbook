// Step content data extracted from the 12-Step workbook

export interface SectionItem {
    key: string;
    prompt?: string;
    text?: string;
    count?: number;
    hasDate?: boolean;
    hasRippleEffects?: boolean;
    checklistOptions?: string[];
    subItems?: string[];
    dateLabel?: string;
    rippleEffectsLabel?: string;
}

export interface StepSection {
    type: "definitions" | "reading" | "writing" | "list" | "checklist" | "todo" | "resentment" | "prayer";
    title: string;
    instruction?: string;
    items: SectionItem[];
    resourceUrl?: string;
    resourceLabel?: string;
}

export interface StepPart {
    partNumber: number;
    title?: string;
    hasAssignmentDate: boolean;
    sections: StepSection[];
}

export interface Step {
    number: number;
    title: string;
    quote: string;
    parts?: StepPart[];
    sections?: StepSection[];
}

export const steps: Step[] = [
    {
        number: 1,
        title: "Powerlessness",
        quote: "We admitted we were powerless over alcohol—that our lives had become unmanageable.",
        parts: [
            {
                partNumber: 1,
                hasAssignmentDate: true,
                sections: [
                    {
                        type: "definitions",
                        title: "Definitions",
                        items: [
                            { key: "admit", prompt: "Define: Admit" },
                            { key: "powerless", prompt: "Define: Powerless" },
                            { key: "unmanageable", prompt: "Define: Unmanageable" },
                        ],
                    },
                    {
                        type: "reading",
                        title: "Read With Intent and Purpose",
                        resourceUrl: "https://www.aa.org/the-big-book",
                        resourceLabel: "Read Big Book Online",
                        instruction: "Highlight areas that demonstrate 'powerless' and 'unmanageability'",
                        items: [{ key: "pages_xi_43", text: "Pages xi-43" }],
                    },
                ],
            },
            {
                partNumber: 2,
                hasAssignmentDate: true,
                sections: [
                    {
                        type: "list",
                        title: "Examples of Powerlessness",
                        instruction: "List (5) specific examples of 'powerlessness' when you were drinking.",
                        items: [
                            { key: "powerless_examples", count: 5, hasDate: true, hasRippleEffects: true },
                        ],
                    },
                    {
                        type: "list",
                        title: "Examples of Unmanageability",
                        instruction: "List (5) specific examples of 'unmanageability' when you were drinking.",
                        items: [
                            { key: "unmanageable_examples", count: 5, hasDate: true, hasRippleEffects: true },
                        ],
                    },
                ],
            },
        ],
    },
    {
        number: 2,
        title: "Higher Power",
        quote: "Came to believe that a Power greater than ourselves could restore us to sanity.",
        sections: [
            {
                type: "definitions",
                title: "Definitions",
                items: [
                    { key: "believe", prompt: "Define: Believe" },
                    { key: "restore", prompt: "Define: Restore" },
                    { key: "sanity", prompt: "Define: Sanity" },
                    { key: "insanity", prompt: "Define: Insanity" },
                ],
            },
            {
                type: "reading",
                title: "Read With Intent and Purpose",
                resourceUrl: "https://www.aa.org/the-big-book",
                resourceLabel: "Read Big Book Online",
                instruction: "Highlight areas that demonstrate 'insanity'",
                items: [{ key: "pages_44_60", text: "Pages 44-60 (stop at ABC's)" }],
            },
            {
                type: "writing",
                title: "Writing",
                items: [
                    {
                        key: "insanity_examples",
                        prompt: "Provide (10) specific examples of insanity from your own story",
                        count: 10,
                        subItems: [
                            "whether you were drunk or not",
                            "relate back to the Big Book if possible",
                            "try not to be vague",
                        ],
                    },
                    {
                        key: "higher_power",
                        prompt: "Write (1) paragraph, tight and concise, of your higher power as you understand it.",
                    },
                    {
                        key: "hp_examples",
                        prompt: "Write (5) examples of higher power and you working together",
                        count: 5,
                    },
                ],
            },
        ],
    },
    {
        number: 3,
        title: "Decision",
        quote: "Made a decision to turn our will and our lives over to the care of God as we understood Him.",
        parts: [
            {
                partNumber: 1,
                hasAssignmentDate: true,
                sections: [
                    {
                        type: "definitions",
                        title: "Definitions",
                        items: [
                            { key: "selfish", prompt: "Define: Selfish" },
                            { key: "self", prompt: "Define: Self" },
                            { key: "decision", prompt: "Define: Decision" },
                            { key: "convinced", prompt: "Define: Convinced" },
                            { key: "life", prompt: "Define: Life" },
                            { key: "will", prompt: "Define: Will" },
                            { key: "requirement", prompt: "Define: Requirement" },
                        ],
                    },
                    {
                        type: "reading",
                        title: "Read With Intent and Purpose",
                        resourceUrl: "https://www.aa.org/the-big-book",
                        resourceLabel: "Read Big Book Online",
                        items: [{ key: "pages_60_63", text: "Pages 60-63 (stop at 'Next we launched')" }],
                    },
                    {
                        type: "todo",
                        title: "To Do",
                        items: [
                            { key: "memorize_prayer", text: "Start to memorize the 3rd Step Prayer" },
                            { key: "informal_prayer", text: "Okay to make the prayer less formal" },
                            { key: "pray_10_days", text: "Say 3rd step prayer every morning for 10 straight days" },
                            { key: "knees_together", text: "End Step 3 assignment by getting on knees together. Hold hands and say 3rd step prayer together." },
                        ],
                    },
                ],
            },
        ],
    },
    {
        number: 4,
        title: "Moral Inventory",
        quote: "Made a searching and fearless moral inventory of ourselves.",
        sections: [
            {
                type: "prayer",
                title: "Prayer",
                instruction: "Say prayer, 'God, please help me with my inventory' prior to working on each portion of your step 4 list.",
                items: [],
            },
            {
                type: "definitions",
                title: "Definitions",
                items: [
                    { key: "launched", prompt: "Define: Launched" },
                    { key: "moral", prompt: "Define: Moral" },
                    { key: "vigorous", prompt: "Define: Vigorous" },
                    { key: "resentment", prompt: "Define: Resentment" },
                    { key: "action", prompt: "Define: Action" },
                    { key: "strenuous", prompt: "Define: Strenuous" },
                ],
            },
            {
                type: "reading",
                title: "Read With Intent and Purpose",
                resourceUrl: "https://www.aa.org/the-big-book",
                resourceLabel: "Read Big Book Online",
                items: [{ key: "pages_63_64", text: "Pages 63-64 (stop at 'Next we launched')" }],
            },
            {
                type: "resentment",
                title: "Resentment List",
                instruction: "Complete the 6-column resentment inventory",
                items: [
                    {
                        key: "column1",
                        prompt: "Column 1 - Resentment",
                        text: "List of your resentments (people, principals, things). Don't hold back. List anything and everything that you have resentment for; childhood through current.",
                    },
                    {
                        key: "column2",
                        prompt: "Column 2 - Cause",
                        text: "Brief description of events with short paragraphs. List the top 2-3 events that led to this resentment.",
                    },
                    {
                        key: "column3",
                        prompt: "Column 3 - Affects My",
                        text: "Read with intent and purpose: pg 64 (start at 'we asked ourself') - pg 65 (stop at 'considered it carefully')",
                        checklistOptions: [
                            "Self-esteem",
                            "Pocketbook",
                            "Ambition (things I want)",
                            "Personal relationships",
                            "Sexual relationships",
                            "Security (things I need)",
                        ],
                    },
                    {
                        key: "column4",
                        prompt: "Column 4 - My Part",
                        text: "First, read and highlight with intent and purpose, pg 65 (start at 'the first thing') - pg 67 (stop at 'these matters straight'). Define: Selfish, Dishonest, Self-seeking. List where you were selfish, dishonest, or self-seeking.",
                    },
                    {
                        key: "column5",
                        prompt: "Column 5 - Fear",
                        text: "First, make list of your fears (dump your list of fears. IE, fear of being judged, fear of failure, fear of financial insecurity). Then, write the following: 'God, why do I have this fear (insert the fear). Was it because self-reliance failed me? God, please remove this fear (insert fear) and direct my attention to what you would have me be.' Lastly, list the fear associated with each resentment.",
                    },
                    {
                        key: "column6",
                        prompt: "Column 6 - Sex",
                        text: "First, read and highlight with intent and purpose, pg 68-70 (stop at 'heartache'). Review your sex conduct. Review each relationship whether that person is on your resentment list or not.",
                        subItems: [
                            "Where was I selfish?",
                            "Where was I dishonest?",
                            "Where was I inconsiderate?",
                            "Who did I hurt?",
                            "Did I unjustifiably arouse jealousy?",
                            "Did I unjustifiably arouse suspicion?",
                            "Did I unjustifiably arouse bitterness?",
                            "Where was I at fault?",
                            "What should I have done instead?",
                        ],
                    },
                    {
                        key: "sexual_ideal",
                        prompt: "Write paragraph of your sexual ideal.",
                    },
                ],
            },
        ],
    },
    {
        number: 5,
        title: "Admission",
        quote: "Admitted to God, to ourselves, and to another human being the exact nature of our wrongs.",
        sections: [
            {
                type: "reading",
                title: "Read With Intent and Purpose",
                resourceUrl: "https://www.aa.org/the-big-book",
                resourceLabel: "Read Big Book Online",
                items: [{ key: "pages_72_75", text: "Pages 72-75 (stop at 'returning home')" }],
            },
            {
                type: "definitions",
                title: "Definitions",
                items: [
                    { key: "admit", prompt: "Define: Admit" },
                    { key: "exact", prompt: "Define: Exact" },
                    { key: "nature", prompt: "Define: Nature" },
                    { key: "wrong", prompt: "Define: Wrong" },
                ],
            },
            {
                type: "todo",
                title: "To Do",
                items: [
                    { key: "check_ideal", text: "Check your description of Sexual Ideal and Ideal Partner" },
                    { key: "5th_step_day", text: "Set aside the entire day for 5th step meeting with step guide." },
                    { key: "meditation", text: "After 5th step session, receive receipt, and meditate for 1 hour focusing on what you covered during session." },
                ],
            },
        ],
    },
    {
        number: 6,
        title: "Readiness",
        quote: "Were entirely ready to have God remove all these defects of character.",
        sections: [
            {
                type: "reading",
                title: "Read With Intent and Purpose",
                resourceUrl: "https://www.aa.org/the-big-book",
                resourceLabel: "Read Big Book Online",
                items: [{ key: "page_76_1", text: "Page 76 (first paragraph)" }],
            },
            {
                type: "definitions",
                title: "Definitions",
                items: [
                    { key: "objectionable", prompt: "Define: Objectionable" },
                    { key: "defect", prompt: "Define: Defect" },
                    { key: "willingness", prompt: "Define: Willingness" },
                    { key: "indispensable", prompt: "Define: Indispensable" },
                    { key: "character", prompt: "Define: Character" },
                ],
            },
            {
                type: "list",
                title: "Character Defects",
                instruction: "Make a list of your character defects.",
                items: [
                    { key: "defects_receipt", text: "Start with receipt" },
                    { key: "defects_spot", text: "If you spot it, you got it. List it." },
                    { key: "defects_manifest", prompt: "Detail how each character defect manifests." },
                    { key: "defects_opposite", prompt: "List the opposite action of the character defect." },
                ],
            },
            {
                type: "list",
                title: "Character Assets",
                instruction: "Make a list of your character assets",
                items: [{ key: "assets_list", prompt: "List your character assets" }],
            },
        ],
    },
    {
        number: 7,
        title: "Humility",
        quote: "Humbly asked Him to remove our shortcomings.",
        sections: [
            {
                type: "reading",
                title: "Read With Intent and Purpose",
                resourceUrl: "https://www.aa.org/the-big-book",
                resourceLabel: "Read Big Book Online",
                items: [{ key: "page_76_2", text: "Page 76 (second paragraph)" }],
            },
            {
                type: "prayer",
                title: "7th Step Prayer",
                instruction: "Say the 7th step prayer each day upon awakening and/or at end of day for 14 days in a row.",
                items: [
                    { key: "focus_defects", text: "Focus on 3 of your character defects in particular and ask them to be removed." },
                    { key: "start_over", text: "Start day over when character defect(s) show up (say 7th step prayer)" },
                    { key: "8th_step_note", text: "The 7th step will only have depth and weight if followed by an 8th step list" },
                ],
            },
        ],
    },
    {
        number: 8,
        title: "Amends List",
        quote: "Made a list of all persons we had harmed, and became willing to make amends to them all.",
        sections: [
            {
                type: "reading",
                title: "Read With Intent and Purpose",
                resourceUrl: "https://www.aa.org/the-big-book",
                resourceLabel: "Read Big Book Online",
                items: [{ key: "page_76_3", text: "Page 76 (third paragraph)" }],
            },
            {
                type: "definitions",
                title: "Definitions",
                items: [{ key: "harm", prompt: "Define: Harm" }],
            },
            {
                type: "prayer",
                title: "Prayer",
                instruction: "Pray for your higher power to give you the will and courage to make 8th step list",
                items: [],
            },
            {
                type: "list",
                title: "8th Step List",
                instruction: "Make your list. Include people, places, and institutions. Include everything; don't hold back or edit.",
                items: [
                    {
                        key: "amends_list_dynamic",
                        count: 10,
                        hasRippleEffects: true,
                        rippleEffectsLabel: "Specific Harm Committed",
                        prompt: "List people, places, and institutions.",
                    },
                ],
            },
        ],
    },
    {
        number: 9,
        title: "Direct Amends",
        quote: "Made direct amends to such people wherever possible, except when to do so would injure them or others.",
        sections: [
            {
                type: "todo",
                title: "Review",
                items: [
                    { key: "review_list", text: "Review list with step guide to determine which are appropriate to put on step 9 list, or not." },
                ],
            },
            {
                type: "reading",
                title: "Read With Intent and Purpose",
                resourceUrl: "https://www.aa.org/the-big-book",
                resourceLabel: "Read Big Book Online",
                items: [{ key: "pages_76_83", text: "Pages 76-83 (stop at 'the promises')" }],
            },
            {
                type: "writing",
                title: "9th Step Scripts",
                instruction: "Buy 4x6 or 3x5 cards for 9th step scripts. Write script for each person/place on 9th step list.",
                items: [
                    {
                        key: "script_template",
                        text: "Script: 'I have been sober a while, but I might not stay sober unless I have done my utmost to straighten out my past. [State the specific harm]. I truly regret my behaviour and choices. What can I do to make this right.' [LISTEN]. Follow up with 'Did I leave anything out?' 3 times.",
                    },
                ],
            },
        ],
    },
    {
        number: 10,
        title: "Continued Inventory",
        quote: "Continued to take personal inventory and when we were wrong promptly admitted it.",
        sections: [
            {
                type: "reading",
                title: "Read With Intent and Purpose",
                resourceUrl: "https://www.aa.org/the-big-book",
                resourceLabel: "Read Big Book Online",
                items: [{ key: "pages_83_88", text: "Pages 83-88 (through 'promises')" }],
            },
            {
                type: "todo",
                title: "Daily Practice (30 Days)",
                instruction: "Go through the following each time a resentment comes up for 30 days.",
                items: [
                    { key: "look_for", text: "Look for where you were Selfish, Dishonest, Resentful, or Fearful." },
                    { key: "ask_hp", text: "Ask your higher power at once to remove the resentment." },
                    { key: "call_sponsor", text: "Call sponsor, step guide, or another person who has been through the steps in this format each time a resentment comes up and discuss." },
                    { key: "make_amends", text: "Make amends quickly if appropriate." },
                    { key: "turn_thoughts", text: "Resolutely turn your thoughts to someone you can help (alcoholic or not)" },
                    { key: "no_chit_chat", text: "Don't chit chat with person before you make the list." },
                    { key: "take_notes", text: "Take notes daily on your resentments" },
                ],
            },
        ],
    },
    {
        number: 11,
        title: "Prayer & Meditation",
        quote: "Sought through prayer and meditation to improve our conscious contact with God as we understood Him, praying only for knowledge of His will for us and the power to carry that out.",
        sections: [
            {
                type: "todo",
                title: "Continue Previous Steps",
                items: [
                    { key: "continue_9", text: "Continue 9th Step if you haven't made amends to everyone on your list." },
                    { key: "continue_10", text: "Continue 10th Step" },
                ],
            },
            {
                type: "reading",
                title: "Daily Practice",
                resourceUrl: "https://www.aa.org/the-big-book",
                resourceLabel: "Read Big Book Online",
                instruction: "Read 'Upon Awakening' each morning",
                items: [{ key: "upon_awakening", text: "Pages 86-89" }],
            },
            {
                type: "prayer",
                title: "Prayer & Meditation",
                items: [
                    { key: "pray_meditate", text: "Pray and meditate as described in pgs 86-89." },
                    { key: "pray_sponsees", text: "Pray specifically for sponsees; especially newcomers to work the 12th step" },
                ],
            },
        ],
    },
    {
        number: 12,
        title: "Spiritual Awakening",
        quote: "Having had a spiritual awakening as the result of these steps, we tried to carry this message to alcoholics, and to practice these principles in all our affairs.",
        sections: [
            {
                type: "reading",
                title: "Read With Intent and Purpose",
                resourceUrl: "https://www.aa.org/the-big-book",
                resourceLabel: "Read Big Book Online",
                instruction: "Study the 12th Step chapter",
                items: [{ key: "pages_89_103", text: "Pages 89-103 ('Working With Others')" }],
            },
            {
                type: "definitions",
                title: "Definitions",
                items: [
                    { key: "spiritual", prompt: "Define: Spiritual" },
                    { key: "awakening", prompt: "Define: Awakening" },
                    { key: "principles", prompt: "Define: Principles" },
                ],
            },
            {
                type: "todo",
                title: "Carrying the Message",
                instruction: "The 12th Step is about service and helping others (check to indicate you read)",
                items: [
                    { key: "identify_help", text: "Identify alcoholics or others you can help carry this message to." },
                    { key: "available", text: "Make yourself available to newcomers and those seeking help." },
                    { key: "sponsor_ready", text: "Consider becoming a sponsor when you have completed all 12 steps and discussed readiness with your step guide." },
                    { key: "meeting_service", text: "Find ways to be of service in meetings and your recovery community." },
                    { key: "daily_practice", text: "Practice these steps daily as a way of life, not just a program to complete." },
                ],
            },
            {
                type: "prayer",
                title: "11th Step Daily Practice",
                instruction: "Continue the practices from Step 11 as a lifelong commitment (check to indicate you read)",
                items: [
                    { key: "morning_meditation", text: "Morning prayer and meditation" },
                    { key: "evening_review", text: "Evening review of the day - where were you selfish, dishonest, resentful, or afraid?" },
                    { key: "spot_check", text: "Spot-check inventory throughout the day" },
                ],
            },
        ],
    },
];

// 3rd Step Prayer
export const thirdStepPrayer = `God, I offer myself to Thee—to build with me and to do with me as Thou wilt. Relieve me of the bondage of self, that I may better do Thy will. Take away my difficulties, that victory over them may bear witness to those I would help of Thy Power, Thy Love, and Thy Way of life. May I do Thy will always!`;

// 7th Step Prayer
export const seventhStepPrayer = `My Creator, I am now willing that you should have all of me, good and bad. I pray that you now remove from me every single defect of character which stands in the way of my usefulness to you and my fellows. Grant me strength, as I go out from here, to do your bidding. Amen.`;

// Get step by number
export function getStepByNumber(stepNumber: number): Step | undefined {
    return steps.find((s) => s.number === stepNumber);
}

// Get step title
export function getStepTitle(stepNumber: number): string {
    const step = getStepByNumber(stepNumber);
    return step ? `Step ${stepNumber}: ${step.title}` : `Step ${stepNumber}`;
}
