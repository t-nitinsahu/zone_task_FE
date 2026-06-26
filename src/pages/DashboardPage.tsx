import { useState } from "react";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { AnalyticsCards } from "../features/leads/components/AnalyticsCards";
import { LeadTable } from "../features/leads/components/LeadTable";
import {
  useDashboardStats,
  useHubspotStatus,
  useLeadRealtimeUpdates,
  useLeads,
  useRefreshDashboard
} from "../features/leads/lead.hooks";

export const DashboardPage = () => {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useDashboardStats();
  const { data: leads = [], isLoading: leadsLoading, isError: leadsError } = useLeads();
  const {
    data: hubspotStatus,
    isLoading: hubspotLoading,
    isError: hubspotError
  } = useHubspotStatus();
  const { refresh } = useRefreshDashboard();
  const [refreshing, setRefreshing] = useState(false);

  useLeadRealtimeUpdates();

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Analytics, HubSpot sync health, and live lead stream.</p>
        </div>
        <Button onClick={() => void handleRefresh()} disabled={refreshing} variant="ghost">
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <AnalyticsCards stats={stats} isLoading={statsLoading} isError={statsError} />

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <Card title="Live Lead Table" subtitle="Updates in real-time through Socket.IO events.">
          <LeadTable
            leads={leads}
            isLoading={leadsLoading}
            isError={leadsError}
            emptyTitle="No leads found"
            emptyDescription="Create a lead to populate the live table."
          />
        </Card>

        <Card title="HubSpot Status" subtitle="Current CRM integration health and availability.">
          {hubspotLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : hubspotError || !hubspotStatus ? (
            <EmptyState title="HubSpot unavailable" description="Status check failed." />
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Service</span>
                <span className="text-sm font-semibold text-slate-800">{hubspotStatus.service}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Configured</span>
                <span className="text-sm font-semibold text-slate-800">{hubspotStatus.configured ? "Yes" : "No"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Retries</span>
                <span className="text-sm font-semibold text-slate-800">{hubspotStatus.retries}</span>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
                <p
                  className={`mt-1 text-sm font-semibold ${
                    hubspotStatus.ok ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {hubspotStatus.details}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};
