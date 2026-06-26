import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import { useEffect } from "react";

import { env } from "../../config/env";
import { createLead, fetchDashboardStats, fetchHubspotStatus, fetchLeads } from "./lead.api";
import type { CreateLeadPayload } from "./lead.validation";
import type { DashboardStats, Lead } from "./lead.types";

export const LEADS_QUERY_KEY = ["leads"] as const;
export const DASHBOARD_QUERY_KEY = ["dashboard", "stats"] as const;
export const HUBSPOT_STATUS_QUERY_KEY = ["hubspot", "status"] as const;

export const useLeads = () => {
  return useQuery({
    queryKey: LEADS_QUERY_KEY,
    queryFn: fetchLeads
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: fetchDashboardStats,
    refetchInterval: 15_000,
    refetchIntervalInBackground: true
  });
};

export const useHubspotStatus = () => {
  return useQuery({
    queryKey: HUBSPOT_STATUS_QUERY_KEY,
    queryFn: fetchHubspotStatus,
    refetchOnWindowFocus: false
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLeadPayload) => createLead(payload),
    onSuccess: (newLead) => {
      queryClient.setQueryData<Lead[]>(LEADS_QUERY_KEY, (current) => {
        if (!current) {
          return [newLead];
        }

        const exists = current.some((item) => item.id === newLead.id);
        return exists ? current : [newLead, ...current];
      });

      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY }).catch(() => null);
    }
  });
};

export const useLeadRealtimeUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const applyLeadCreated = (lead: Lead): void => {
      queryClient.setQueryData<Lead[]>(LEADS_QUERY_KEY, (current) => {
        if (!current) {
          return [lead];
        }

        const exists = current.some((item) => item.id === lead.id);
        return exists ? current : [lead, ...current];
      });

      queryClient.setQueryData<DashboardStats>(DASHBOARD_QUERY_KEY, (current) => {
        if (!current) {
          return current;
        }

        const previousTotalLeads = current.totalLeads;
        const newTotalLeads = previousTotalLeads + 1;
        const estimatedValue = lead.estimatedValue ?? 0;
        const totalPipelineValue = current.totalPipelineValue + estimatedValue;
        const averagePipelineValue = newTotalLeads > 0 ? totalPipelineValue / newTotalLeads : 0;

        return {
          ...current,
          totalLeads: newTotalLeads,
          totalPipelineValue,
          averagePipelineValue,
          syncedLeads: current.syncedLeads + (lead.hubspotStatus === "SYNCED" ? 1 : 0),
          failedSync: current.failedSync + (lead.hubspotStatus === "FAILED" ? 1 : 0),
          statusBreakdown: {
            ...current.statusBreakdown,
            [lead.localStatus]: (current.statusBreakdown[lead.localStatus] ?? 0) + 1
          }
        };
      });
    };

    const applyHubspotSynced = (updatedLead: Lead): void => {
      let changedFromFailed = false;
      let changedFromNotSynced = false;

      queryClient.setQueryData<Lead[]>(LEADS_QUERY_KEY, (current) => {
        if (!current) {
          return current;
        }

        return current.map((lead) => {
          if (lead.id !== updatedLead.id) {
            return lead;
          }

          if (lead.hubspotStatus === "FAILED") {
            changedFromFailed = true;
          }

          if (lead.hubspotStatus !== "SYNCED") {
            changedFromNotSynced = true;
          }

          return {
            ...lead,
            hubspotStatus: "SYNCED",
            hubspotContactId: updatedLead.hubspotContactId ?? lead.hubspotContactId,
            updatedAt: updatedLead.updatedAt
          };
        });
      });

      if (changedFromFailed || changedFromNotSynced) {
        queryClient.setQueryData<DashboardStats>(DASHBOARD_QUERY_KEY, (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            syncedLeads: changedFromNotSynced ? current.syncedLeads + 1 : current.syncedLeads,
            failedSync: changedFromFailed ? Math.max(0, current.failedSync - 1) : current.failedSync
          };
        });
      }

      queryClient.invalidateQueries({ queryKey: HUBSPOT_STATUS_QUERY_KEY }).catch(() => null);
    };

    const socket: Socket = io(env.WEB_SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1_000,
      reconnectionDelayMax: 8_000,
      timeout: 20_000
    });

    socket.on("lead_created", (lead: Lead) => {
      applyLeadCreated(lead);
    });

    socket.on("hubspot_synced", (lead: Lead) => {
      applyHubspotSynced(lead);
    });

    socket.on("reconnect", () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY }).catch(() => null);
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY }).catch(() => null);
      queryClient.invalidateQueries({ queryKey: HUBSPOT_STATUS_QUERY_KEY }).catch(() => null);
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
};

export const sumPipeline = (leads: Lead[]): number => {
  return leads.reduce((acc, lead) => acc + (lead.estimatedValue ?? 0), 0);
};

export const getStatusCount = (stats: DashboardStats): number => {
  return Object.values(stats.statusBreakdown).reduce((acc, value) => acc + value, 0);
};

export const useRefreshDashboard = () => {
  const queryClient = useQueryClient();

  const refresh = async (): Promise<void> => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: HUBSPOT_STATUS_QUERY_KEY })
    ]);
  };

  return { refresh };
};
