export type AuditInfo = {
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
};

export type AuditEvent = {
  label: string;
  at: Date | null;
  by?: string | null;
};

export type AuditField = {
  label: string;
  value: string;
  valueType?: "date" | "reference";
};
