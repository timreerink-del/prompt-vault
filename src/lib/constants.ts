import { Category, Status, ActionType } from "./types";

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: "agent", label: "Agent", emoji: "\uD83E\uDD16" },
  { value: "skill", label: "Skill", emoji: "\u26A1" },
  { value: "prompt", label: "Prompt", emoji: "\uD83D\uDCAC" },
  { value: "workflow", label: "Workflow", emoji: "\u2699\uFE0F" },
  { value: "system", label: "System Prompt", emoji: "\uD83E\uDDE0" },
  { value: "output", label: "Output/Artifact", emoji: "\uD83D\uDCE6" },
  { value: "snippet", label: "Snippet", emoji: "\u2702\uFE0F" },
];

export const STATUSES: { value: Status; label: string; color: string; dot: string }[] = [
  { value: "active", label: "Active", color: "bg-[#5CEFB5]/15 text-[#5CEFB5]", dot: "bg-[#5CEFB5]" },
  { value: "tested", label: "Tested", color: "bg-[#7B8FF7]/15 text-[#7B8FF7]", dot: "bg-[#7B8FF7]" },
  { value: "draft", label: "Draft", color: "bg-[#7A7F8E]/15 text-[#7A7F8E]", dot: "bg-[#7A7F8E]" },
  { value: "archived", label: "Archived", color: "bg-[#F7715C]/15 text-[#F7715C]", dot: "bg-[#F7715C]" },
];

export const LANDS_IN_OPTIONS = [
  "Claude.ai",
  "Claude Code",
  "Figma MCP",
  "Vercel",
  "GitHub",
  "Slack",
  "Terminal",
  "Browser",
  "Overig",
];

export const ACTION_TYPES: { value: ActionType; label: string; icon: string; color: string }[] = [
  { value: "copy", label: "Kopieer", icon: "\uD83D\uDCCB", color: "bg-[#5CEFB5]/15 text-[#5CEFB5]" },
  { value: "install", label: "Installeer", icon: "\u2699\uFE0F", color: "bg-[#7B8FF7]/15 text-[#7B8FF7]" },
  { value: "download", label: "Download", icon: "\u2B07", color: "bg-[#F7C948]/15 text-[#F7C948]" },
  { value: "link", label: "Open link", icon: "\uD83D\uDD17", color: "bg-[#7A7F8E]/15 text-[#7A7F8E]" },
];

export const getActionInfo = (actionType: ActionType) =>
  ACTION_TYPES.find((a) => a.value === actionType) ?? ACTION_TYPES[0];

export const getCategoryInfo = (category: Category) =>
  CATEGORIES.find((c) => c.value === category) ?? CATEGORIES[0];

export const getStatusInfo = (status: Status) =>
  STATUSES.find((s) => s.value === status) ?? STATUSES[0];
