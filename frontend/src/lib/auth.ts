export const USER_CATEGORIES = [
  "School / Boards",
  "JEE / NEET",
  "College",
  "Medical",
] as const;

export type UserCategory = (typeof USER_CATEGORIES)[number];

export type UserSession = {
  token: string;
  email: string;
  fullName: string;
  category: UserCategory;
  targetExam?: string;
  studyGoal?: string;
};

const STORAGE_KEY = "flow-user-session";

export const categoryProfiles: Record<
  UserCategory,
  {
    focus: string;
    strategy: string;
    weakTopics: string[];
    nextActions: string[];
  }
> = {
  "School / Boards": {
    focus: "Chapter clarity, board-friendly answers, and steady daily revision.",
    strategy: "Prioritize summaries, short tests, and concept reinforcement.",
    weakTopics: ["Word problems", "Long-answer structure", "Diagram labeling"],
    nextActions: ["Convert notes into chapter summaries", "Run a 10-minute recall quiz"],
  },
  "JEE / NEET": {
    focus: "Speed, accuracy, formula retention, and tough concept drilling.",
    strategy: "Prioritize weak-topic loops, timed tests, and PYQ-style practice.",
    weakTopics: ["Organic reaction chains", "Rotation mechanics", "Assertion-reason"],
    nextActions: ["Create a weak-topic revision sprint", "Generate mixed-difficulty MCQs"],
  },
  College: {
    focus: "Lecture compression, exam prep, and topic-to-topic understanding.",
    strategy: "Prioritize structured notes, examples, and assignment-ready concepts.",
    weakTopics: ["Dense theory recall", "Numerical application", "Cross-topic links"],
    nextActions: ["Ingest lecture PDFs", "Build a unit-wise revision map"],
  },
  Medical: {
    focus: "High-volume recall, mechanism linkage, and case-oriented retention.",
    strategy: "Prioritize spaced repetition, pathways, and high-yield recall cards.",
    weakTopics: ["Pathway memorization", "Drug differentiation", "Case recall speed"],
    nextActions: ["Generate rapid recall cards", "Create system-wise concept maps"],
  },
};

export function saveSession(session: UserSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function getSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function buildFallbackSession(email: string): UserSession {
  const fullName = email.split("@")[0].replace(/[._-]/g, " ");
  return {
    token: "demo-session",
    email,
    fullName: fullName.replace(/\b\w/g, (char) => char.toUpperCase()),
    category: "School / Boards",
  };
}
