export type Lead = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  budget: number | null;
  estimatedValue: number | null;
  hubspotContactId: string | null;
  localStatus: "NEW" | "QUALIFIED" | "CONTACTED" | "WON" | "LOST" | "ARCHIVED";
  hubspotStatus: "PENDING_SYNC" | "SYNCED" | "FAILED";
  createdAt: string;
  updatedAt: string;
};

export type DashboardStats = {
  totalLeads: number;
  totalPipelineValue: number;
  averagePipelineValue: number;
  syncedLeads: number;
  failedSync: number;
  statusBreakdown: Record<Lead["localStatus"], number>;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    count?: number;
  };
};

export type HubspotStatus = {
  service: "hubspot";
  ok: boolean;
  configured: boolean;
  retries: number;
  details: string;
};
