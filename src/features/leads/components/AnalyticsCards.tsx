import { Card } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Skeleton } from "../../../components/ui/Skeleton";

import { formatCurrency } from "../lead.hooks";
import type { DashboardStats } from "../lead.types";

type AnalyticsCardsProps = {
  stats?: DashboardStats;
  isLoading: boolean;
  isError: boolean;
};

const AnalyticsSkeleton = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-8 w-28" />
        </Card>
      ))}
    </div>
  );
};

export const AnalyticsCards = ({ stats, isLoading, isError }: AnalyticsCardsProps) => {
  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (isError || !stats) {
    return <EmptyState title="Analytics unavailable" description="Unable to load analytics right now." />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card title="Total Leads">
        <p className="text-2xl font-bold text-slate-900">{stats.totalLeads}</p>
      </Card>
      <Card title="Pipeline Value">
        <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalPipelineValue)}</p>
      </Card>
      <Card title="Synced Leads">
        <p className="text-2xl font-bold text-emerald-700">{stats.syncedLeads}</p>
      </Card>
      <Card title="Failed Sync">
        <p className="text-2xl font-bold text-red-700">{stats.failedSync}</p>
      </Card>
    </div>
  );
};
