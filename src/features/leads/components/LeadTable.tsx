import { useMemo, useState } from "react";

import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Skeleton } from "../../../components/ui/Skeleton";
import type { Lead } from "../lead.types";

type SortKey = "name" | "email" | "company" | "budget" | "localStatus" | "hubspotStatus" | "createdAt";
type SortDirection = "asc" | "desc";

type LeadTableProps = {
  leads: Lead[];
  isLoading?: boolean;
  isError?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

const sortOptions: Array<{ label: string; value: SortKey }> = [
  { label: "Created At", value: "createdAt" },
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Company", value: "company" },
  { label: "Budget", value: "budget" },
  { label: "Local Status", value: "localStatus" },
  { label: "HubSpot Status", value: "hubspotStatus" }
];

const formatCurrency = (value: number | null): string => {
  if (value === null) {
    return "-";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
};

const formatDateTime = (value: string): string => {
  return new Date(value).toLocaleString();
};

const localStatusBadgeClass = (status: Lead["localStatus"]): string => {
  switch (status) {
    case "WON":
      return "bg-emerald-100 text-emerald-700";
    case "LOST":
      return "bg-red-100 text-red-700";
    case "QUALIFIED":
    case "CONTACTED":
      return "bg-sky-100 text-sky-700";
    case "ARCHIVED":
      return "bg-slate-200 text-slate-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
};

const hubspotStatusBadgeClass = (status: Lead["hubspotStatus"]): string => {
  switch (status) {
    case "SYNCED":
      return "bg-emerald-100 text-emerald-700";
    case "FAILED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
};

const sortLeads = (leads: Lead[], sortKey: SortKey, direction: SortDirection): Lead[] => {
  const sorted = [...leads].sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();

    const valueA = {
      name: nameA,
      email: a.email.toLowerCase(),
      company: (a.company ?? "").toLowerCase(),
      budget: a.budget ?? 0,
      localStatus: a.localStatus,
      hubspotStatus: a.hubspotStatus,
      createdAt: new Date(a.createdAt).getTime()
    }[sortKey];

    const valueB = {
      name: nameB,
      email: b.email.toLowerCase(),
      company: (b.company ?? "").toLowerCase(),
      budget: b.budget ?? 0,
      localStatus: b.localStatus,
      hubspotStatus: b.hubspotStatus,
      createdAt: new Date(b.createdAt).getTime()
    }[sortKey];

    if (valueA < valueB) {
      return direction === "asc" ? -1 : 1;
    }

    if (valueA > valueB) {
      return direction === "asc" ? 1 : -1;
    }

    return 0;
  });

  return sorted;
};

export const LeadTable = ({
  leads,
  isLoading = false,
  isError = false,
  emptyTitle = "No leads found",
  emptyDescription = "Create a lead to populate the table."
}: LeadTableProps) => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filteredLeads = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) {
      return leads;
    }

    return leads.filter((lead) => {
      const composite = `${lead.firstName} ${lead.lastName} ${lead.email} ${lead.company ?? ""}`.toLowerCase();
      return composite.includes(normalizedSearch);
    });
  }, [leads, search]);

  const sortedLeads = useMemo(() => {
    return sortLeads(filteredLeads, sortKey, sortDirection);
  }, [filteredLeads, sortDirection, sortKey]);

  const pageCount = Math.max(1, Math.ceil(sortedLeads.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * pageSize;
  const pageItems = sortedLeads.slice(start, start + pageSize);

  const handleSearchChange = (value: string): void => {
    setSearch(value);
    setPage(1);
  };

  const handleSortChange = (value: SortKey): void => {
    setSortKey(value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="grid grid-cols-7 gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <EmptyState title="Leads unavailable" description="Unable to fetch leads right now." />;
  }

  if (leads.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none ring-brand-200 transition focus:ring-2 sm:max-w-xs"
          placeholder="Search name, email, company"
        />
        <div className="flex items-center gap-2">
          <select
            value={sortKey}
            onChange={(event) => handleSortChange(event.target.value as SortKey)}
            className="h-10 rounded-lg border border-slate-300 px-3 text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                Sort by {option.label}
              </option>
            ))}
          </select>
          <Button
            variant="ghost"
            onClick={() => setSortDirection((current) => (current === "asc" ? "desc" : "asc"))}
          >
            {sortDirection === "asc" ? "Asc" : "Desc"}
          </Button>
        </div>
      </div>

      {pageItems.length === 0 ? (
        <EmptyState title="No matching leads" description="Try a different search term." />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Company</th>
                <th className="py-3 pr-4">Budget</th>
                <th className="py-3 pr-4">Local Status</th>
                <th className="py-3 pr-4">HubSpot Status</th>
                <th className="py-3 pr-4">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageItems.map((lead) => (
                <tr key={lead.id}>
                  <td className="py-3 pr-4 font-medium text-slate-800">{lead.firstName} {lead.lastName}</td>
                  <td className="py-3 pr-4 text-slate-600">{lead.email}</td>
                  <td className="py-3 pr-4 text-slate-600">{lead.company ?? "-"}</td>
                  <td className="py-3 pr-4 text-slate-700">{formatCurrency(lead.budget)}</td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${localStatusBadgeClass(lead.localStatus)}`}>
                      {lead.localStatus}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${hubspotStatusBadgeClass(lead.hubspotStatus)}`}
                    >
                      {lead.hubspotStatus}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{formatDateTime(lead.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-200 pt-3">
        <p className="text-xs text-slate-500">
          Showing {pageItems.length === 0 ? 0 : start + 1}-{start + pageItems.length} of {sortedLeads.length}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" disabled={safePage <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
            Previous
          </Button>
          <span className="text-sm text-slate-600">
            Page {safePage} / {pageCount}
          </span>
          <Button
            variant="ghost"
            disabled={safePage >= pageCount}
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
