export const STATUSES = ["new", "contacted", "won", "lost"] as const;
export type Status = (typeof STATUSES)[number];
