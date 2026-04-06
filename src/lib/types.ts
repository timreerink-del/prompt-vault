export type Category =
  | "prompt"
  | "skill"
  | "workflow"
  | "system"
  | "agent"
  | "output"
  | "snippet";

export type Status = "active" | "tested" | "draft" | "archived";

export type SortOption = "recent" | "az" | "usage";

export type ViewMode = "cards" | "database";

export type ActionType = "copy" | "install" | "download" | "link";

export interface Attachment {
  name: string;
  type: string;
  size: number;
  data: string; // base64
}

export interface Prompt {
  id: string;
  title: string;
  category: Category;
  status: Status;
  description: string;
  content: string;
  output: string;
  landsIn: string;
  tags: string[];
  files: string[];
  attachments: Attachment[];
  actionType: ActionType;
  installCommand: string;
  sourceUrl: string;
  linkedItems: string[];
  author: string;
  starred: boolean;
  usageCount: number;
  createdAt: { toDate(): Date } | null;
  updatedAt: { toDate(): Date } | null;
}

export interface PromptVersion {
  id: string;
  content: string;
  output: string;
  author: string;
  savedAt: { toDate(): Date } | null;
}
