import { z } from "zod";

export const budgetOptions = [
  { label: "$5,000", value: "5000" },
  { label: "$10,000", value: "10000" },
  { label: "$25,000", value: "25000" },
  { label: "$50,000", value: "50000" },
  { label: "$100,000", value: "100000" }
] as const;

export const createLeadFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().min(1, "Corporate email is required").email("Enter a valid corporate email"),
  company: z.string().trim().min(1, "Company is required"),
  budget: z
    .string()
    .min(1, "Budget is required")
    .refine((value) => budgetOptions.some((option) => option.value === value), "Select a valid budget range")
});

export type CreateLeadFormValues = z.infer<typeof createLeadFormSchema>;

export type CreateLeadPayload = Omit<CreateLeadFormValues, "budget"> & {
  budget: number;
};

export const mapLeadFormToPayload = (values: CreateLeadFormValues): CreateLeadPayload => {
  return {
    ...values,
    budget: Number(values.budget)
  };
};
