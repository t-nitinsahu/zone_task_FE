import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useHubspotStatus } from "../../leads/lead.hooks";

const formatLastSync = (timestamp: number): string => {
  if (timestamp <= 0) {
    return "-";
  }

  return new Date(timestamp).toLocaleString();
};

const statusBadgeClass = (connected: boolean): string => {
  return connected ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700";
};

export const HubspotStatusCard = () => {
  const { data, isLoading, isError, refetch, isFetching, dataUpdatedAt } = useHubspotStatus();

  const connected = Boolean(data?.ok);

  return (
    <Card title="HubSpot Status" subtitle="Current CRM integration health and availability.">
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ) : isError || !data ? (
        <EmptyState title="HubSpot unavailable" description="Status check failed." />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Connection</span>
            <span className="text-sm font-semibold text-slate-800">{connected ? "Connected" : "Disconnected"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Last Sync</span>
            <span className="text-sm font-semibold text-slate-800">{formatLastSync(dataUpdatedAt)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Status Badge</span>
            <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusBadgeClass(connected)}`}>
              {connected ? "Connected" : "Disconnected"}
            </span>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Details</p>
            <p className={`mt-1 text-sm font-semibold ${connected ? "text-emerald-700" : "text-red-700"}`}>
              {data.details}
            </p>
          </div>

          <Button variant="ghost" disabled={isFetching} onClick={() => void refetch()}>
            {isFetching ? "Refreshing..." : "Refresh Status"}
          </Button>
        </div>
      )}
    </Card>
  );
};
