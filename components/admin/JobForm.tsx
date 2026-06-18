"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { JOB_TYPE_OPTIONS } from "@/lib/constants";
import type { ActionState } from "@/lib/actions";

interface DefaultValues {
  title?: string;
  company?: string;
  location?: string;
  type?: string;
  description?: string;
  requirements?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  contactEmail?: string;
}

interface JobFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: DefaultValues;
  heading: string;
  submitLabel: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} size="lg">
      {label}
    </Button>
  );
}

export function JobForm({
  action,
  defaultValues = {},
  heading,
  submitLabel,
}: JobFormProps) {
  const [state, formAction] = useFormState(action, null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-jb-text-muted hover:text-jb-text transition-colors"
      >
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>

      <h1 className="mb-8 text-3xl font-black text-jb-text">{heading}</h1>

      <div className="rounded-2xl bg-white p-5 sm:p-8 ring-1 ring-jb-border shadow-sm">
        <form action={formAction} className="flex flex-col gap-6">
          {state?.message && (
            <div className="rounded-lg bg-jb-danger-light px-4 py-3 text-sm text-jb-danger">
              {state.message}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Job Title"
              name="title"
              placeholder="e.g. Senior Product Manager"
              defaultValue={defaultValues.title}
              error={state?.errors?.title?.[0]}
              required
            />
            <Input
              label="Company"
              name="company"
              placeholder="e.g. Flutterwave"
              defaultValue={defaultValues.company}
              error={state?.errors?.company?.[0]}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Location"
              name="location"
              placeholder="e.g. Lagos, Nigeria"
              defaultValue={defaultValues.location}
              error={state?.errors?.location?.[0]}
              required
            />
            <Select
              label="Job Type"
              name="type"
              options={JOB_TYPE_OPTIONS}
              placeholder="Select a type…"
              defaultValue={defaultValues.type ?? ""}
              error={state?.errors?.type?.[0]}
              required
            />
          </div>

          <Textarea
            label="Job Description"
            name="description"
            defaultValue={defaultValues.description}
            error={state?.errors?.description?.[0]}
            hint="Minimum 50 characters — describe the role, team, and impact."
            required
            rows={7}
          />

          <Textarea
            label="Requirements"
            name="requirements"
            defaultValue={defaultValues.requirements}
            error={state?.errors?.requirements?.[0]}
            hint="Minimum 20 characters — list qualifications, experience, and skills."
            required
            rows={5}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Salary Min (NGN / month)"
              name="salaryMin"
              type="number"
              min={0}
              defaultValue={defaultValues.salaryMin ?? ""}
              error={state?.errors?.salaryMin?.[0]}
              placeholder="e.g. 400000"
            />
            <Input
              label="Salary Max (NGN / month)"
              name="salaryMax"
              type="number"
              min={0}
              defaultValue={defaultValues.salaryMax ?? ""}
              error={state?.errors?.salaryMax?.[0]}
              placeholder="e.g. 700000"
            />
          </div>

          <Input
            label="Contact Email"
            name="contactEmail"
            type="email"
            defaultValue={defaultValues.contactEmail}
            error={state?.errors?.contactEmail?.[0]}
            placeholder="careers@company.com"
            required
          />

          <div className="flex items-center gap-3 border-t border-jb-border pt-6">
            <SubmitButton label={submitLabel} />
            <Link href="/admin">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
