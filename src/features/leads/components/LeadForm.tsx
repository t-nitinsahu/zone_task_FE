import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import {
  budgetOptions,
  createLeadFormSchema,
  mapLeadFormToPayload,
  type CreateLeadPayload,
  type CreateLeadFormValues
} from "../lead.validation";

type LeadFormProps = {
  onSubmit: (values: CreateLeadPayload) => Promise<void>;
  isSubmitting: boolean;
};

export const LeadForm = ({ onSubmit, isSubmitting }: LeadFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateLeadFormValues>({
    resolver: zodResolver(createLeadFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      budget: ""
    }
  });

  const submitHandler = async (values: CreateLeadFormValues): Promise<void> => {
    await onSubmit(mapLeadFormToPayload(values));
    reset({
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      budget: ""
    });
  };

  return (
    <form className="grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit(submitHandler)}>
      <Input label="First Name" placeholder="Ava" error={errors.firstName?.message} {...register("firstName")} />
      <Input label="Last Name" placeholder="Turner" error={errors.lastName?.message} {...register("lastName")} />
      <Input
        label="Corporate Email"
        type="email"
        placeholder="ava.turner@northstar.io"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input label="Company" placeholder="Northstar Labs" error={errors.company?.message} {...register("company")} />
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        <span>Budget</span>
        <select
          className={`h-10 rounded-lg border px-3 text-sm outline-none transition focus:ring-2 ${
            errors.budget ? "border-red-400 ring-red-200" : "border-slate-300 ring-brand-200"
          }`}
          {...register("budget")}
        >
          <option value="">Select budget</option>
          {budgetOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.budget ? <span className="text-xs text-red-600">{errors.budget.message}</span> : null}
      </label>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Lead"}
        </Button>
      </div>
    </form>
  );
};
