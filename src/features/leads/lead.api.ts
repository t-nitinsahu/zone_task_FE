import type { DashboardStats, HubspotStatus, Lead, ApiResponse } from "./lead.types";
import type { CreateLeadPayload } from "./lead.validation";

import { apiClient } from "../../lib/axios";

export const fetchLeads = async (): Promise<Lead[]> => {
  const response = await apiClient.get<ApiResponse<Lead[]>>("/leads");
  return response.data.data;
};

export const createLead = async (payload: CreateLeadPayload): Promise<Lead> => {
  const response = await apiClient.post<ApiResponse<Lead>>("/leads", payload);
  return response.data.data;
};

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<ApiResponse<DashboardStats>>("/dashboard/stats");
  return response.data.data;
};

export const fetchHubspotStatus = async (): Promise<HubspotStatus> => {
  const response = await apiClient.get<ApiResponse<HubspotStatus>>("/hubspot/status", {
    validateStatus: (status) => status === 200 || status === 503
  });

  return response.data.data;
};
