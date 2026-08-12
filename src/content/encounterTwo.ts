export const encounterTwoPromptIds = [
  "e2-preserve-values",
  "e2-top-priority",
  "e2-pressure",
  "e2-private-checkout",
] as const;

export const preservationValues = [
  "Faithfulness to our convictions",
  "Financial peace",
  "Family belonging",
  "Emotional presence",
  "Joy",
  "Rest",
  "Adventure",
  "Accessibility",
  "Hospitality",
  "Cultural identity",
  "Our future goals",
  "Simplicity",
  "Something else",
  "I am not sure yet",
];

export const pressureOptions = [
  "Family expectations",
  "Faith or church expectations",
  "Money",
  "Including everyone",
  "Travel or adventure",
  "Making everyone happy",
  "Social comparison",
  "Our own expectations",
  "I do not feel much pressure right now",
  "Something else",
  "I am not sure yet",
];

export const meaningOptions = [
  "This is part of who I am",
  "This protects our peace",
  "This protects our future",
  "This helps people we love feel included",
  "This helps me feel present and connected",
  "This reflects our faith or conscience",
  "I feel pressure around this",
  "I am still figuring it out",
  "Something else",
];

export const tensionOptions = [
  "Family belonging",
  "Financial peace",
  "Emotional presence",
  "Hospitality",
  "Rest",
  "Adventure",
  "Accessibility",
  "Future goals",
  "Simplicity",
  "Faith or conscience",
  "Something else",
  "None of these yet",
];

export const encounterTwoNextSteps = [
  "Continue to the next encounter later",
  "Talk about this again",
  "Gather information",
  "Seek pastoral guidance",
  "Verify a church requirement",
  "Pause for now",
  "We are not sure yet",
];

export const encounterTwoContent = {
  landing: {
    title: "What Are We Trying to Preserve?",
    body: "Before comparing wedding ideas, take time to notice what you do not want the planning process—or the celebration itself—to cost you. This encounter is about the things you want to protect: your convictions, your peace, your relationships, your future and the way you want to experience this season together.",
  },
  intro: {
    title: "What Do I Want Us to Protect?",
    body: "Imagine planning is fully underway. People have opinions. Money is being spent. Decisions are piling up. What would you most regret losing along the way?",
  },
};

export function encounterTwoSummary(
  promptId: string,
  response?: {
    selectedValues?: string[];
    selectedValue?: string;
    customValue?: string;
  },
) {
  if (!response) return "";
  if (promptId === "e2-preserve-values") {
    const values =
      response.selectedValues?.map((value) =>
        value === "Something else" && response.customValue
          ? response.customValue
          : value,
      ) ?? [];
    return values.length
      ? `I most want this season to protect ${values.join(", ").toLowerCase()}.`
      : "";
  }
  if (promptId === "e2-top-priority")
    return response.selectedValue
      ? `${response.selectedValue} feels especially important to protect.`
      : "";
  if (promptId === "e2-pressure")
    return response.selectedValue
      ? `I notice some pressure around ${response.selectedValue.toLowerCase()}.`
      : "";
  return "";
}
