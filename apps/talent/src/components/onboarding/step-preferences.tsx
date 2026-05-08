"use client";

import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface PreferencesData {
  employment_type: string;
  availability: string;
  salary_min: string;
  salary_max: string;
  salary_currency: string;
  open_to_remote: boolean;
  open_to_relocate: boolean;
}

interface StepPreferencesProps {
  data: PreferencesData;
  onChange: (data: PreferencesData) => void;
}

const EMPLOYMENT_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract / Freelance" },
  { value: "internship", label: "Internship" },
  { value: "any", label: "Open to any" },
];

const AVAILABILITY_OPTIONS = [
  { value: "immediately", label: "Immediately available" },
  { value: "2_weeks", label: "2 weeks notice" },
  { value: "1_month", label: "1 month notice" },
  { value: "2_months", label: "2 months notice" },
  { value: "3_months", label: "3+ months" },
  { value: "not_looking", label: "Not actively looking" },
];

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "NGN", label: "NGN (₦)" },
  { value: "KES", label: "KES (KSh)" },
  { value: "ZAR", label: "ZAR (R)" },
  { value: "GHS", label: "GHS (₵)" },
  { value: "EGP", label: "EGP (£E)" },
];

const SALARY_RANGES = Array.from({ length: 20 }, (_, i) => {
  const value = (i + 1) * 10000;
  return {
    value: value.toString(),
    label: `$${value.toLocaleString()}`,
  };
});

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description: string;
}

function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex items-center gap-4 w-full p-4 rounded-xl border text-left transition-all duration-200",
        checked
          ? "border-blue-700/50 bg-blue-900/20"
          : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
      )}
    >
      <div
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0",
          checked ? "bg-blue-600" : "bg-slate-700"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200",
            checked && "translate-x-5"
          )}
        />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
    </button>
  );
}

export function StepPreferences({ data, onChange }: StepPreferencesProps) {
  function handleChange(field: keyof PreferencesData, value: string | boolean) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Work Preferences</h2>
        <p className="text-sm text-slate-400 mt-1">
          Help companies understand what you&apos;re looking for.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Employment Type"
          required
          value={data.employment_type}
          onChange={(e) => handleChange("employment_type", e.target.value)}
          options={EMPLOYMENT_TYPES}
          placeholder="Select type"
        />

        <Select
          label="Availability"
          required
          value={data.availability}
          onChange={(e) => handleChange("availability", e.target.value)}
          options={AVAILABILITY_OPTIONS}
          placeholder="When can you start?"
        />
      </div>

      {/* Salary range */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">
          Expected Salary Range{" "}
          <span className="text-slate-500 font-normal">(annual)</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          <Select
            value={data.salary_currency}
            onChange={(e) => handleChange("salary_currency", e.target.value)}
            options={CURRENCIES}
          />
          <Select
            value={data.salary_min}
            onChange={(e) => handleChange("salary_min", e.target.value)}
            options={SALARY_RANGES}
            placeholder="Min"
          />
          <Select
            value={data.salary_max}
            onChange={(e) => handleChange("salary_max", e.target.value)}
            options={SALARY_RANGES}
            placeholder="Max"
          />
        </div>
        <p className="text-xs text-slate-500">
          This is visible only to approved companies.
        </p>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-300">
          Work Arrangements
        </label>
        <Toggle
          checked={data.open_to_remote}
          onChange={(v) => handleChange("open_to_remote", v)}
          label="Open to Remote Work"
          description="I'm willing to work fully or partially remote for international companies."
        />
        <Toggle
          checked={data.open_to_relocate}
          onChange={(v) => handleChange("open_to_relocate", v)}
          label="Open to Relocation"
          description="I'm willing to relocate to another country for the right opportunity."
        />
      </div>
    </div>
  );
}
