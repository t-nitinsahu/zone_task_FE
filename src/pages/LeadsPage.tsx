import { useEffect, useState } from "react";

import { Card } from "../components/ui/Card";
import { Toast } from "../components/ui/Toast";
import { LeadForm } from "../features/leads/components/LeadForm";
import { LeadTable } from "../features/leads/components/LeadTable";
import { formatCurrency, sumPipeline, useCreateLead, useLeadRealtimeUpdates, useLeads } from "../features/leads/lead.hooks";
import type { CreateLeadPayload } from "../features/leads/lead.validation";

export const LeadsPage = () => {
  const { data: leads = [], isLoading, isError } = useLeads();
  const createLeadMutation = useCreateLead();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useLeadRealtimeUpdates();

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSuccessMessage(null);
    }, 2500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [successMessage]);

  const handleCreateLead = async (values: CreateLeadPayload): Promise<void> => {
    try {
      await createLeadMutation.mutateAsync(values);
      setSubmitError(null);
      setSuccessMessage("Lead created successfully.");
    } catch {
      setSubmitError("Unable to create lead right now.");
      setSuccessMessage(null);
    }
  };

  return (
    <section className="space-y-5">
      <Card title="Create Lead" subtitle="Add a new lead with validated fields.">
        {successMessage ? <Toast message={successMessage} variant="success" /> : null}
        {submitError ? <Toast message={submitError} variant="error" /> : null}
        <LeadForm onSubmit={handleCreateLead} isSubmitting={createLeadMutation.isPending} />
      </Card>

      <Card title="Lead Pipeline" subtitle={`Current pipeline value: ${formatCurrency(sumPipeline(leads))}`}>
        <LeadTable
          leads={leads}
          isLoading={isLoading}
          isError={isError}
          emptyTitle="No leads yet"
          emptyDescription="Create your first lead to start tracking pipeline."
        />
      </Card>
    </section>
  );
};
