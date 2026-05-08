"use client";

import { X, SlidersHorizontal } from "lucide-react";
import { Slider, SingleSlider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import type { RoleCategory, Availability, EmploymentType } from "@/lib/mock-data";

export interface FilterState {
  roleCategory: RoleCategory | "";
  minExperience: number;
  location: string;
  availability: Availability | "";
  salaryRange: [number, number];
  employmentType: EmploymentType | "";
}

interface SearchFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
}

const roleCategories: { value: RoleCategory | ""; label: string }[] = [
  { value: "", label: "All roles" },
  { value: "software_engineering", label: "Software Engineering" },
  { value: "mobile_development", label: "Mobile Development" },
  { value: "web_development", label: "Web Development" },
  { value: "vibe_coding", label: "Vibe Coding" },
  { value: "product_management", label: "Product Management" },
  { value: "design_ux", label: "Design / UX" },
  { value: "data_analytics", label: "Data & Analytics" },
  { value: "ai_ml", label: "AI / Machine Learning" },
  { value: "devops_infrastructure", label: "DevOps / Infrastructure" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "marketing", label: "Marketing" },
];

const availabilityOptions: { value: Availability | ""; label: string }[] = [
  { value: "", label: "Any availability" },
  { value: "Immediate", label: "Immediate" },
  { value: "2 weeks", label: "2 weeks" },
  { value: "1 month", label: "1 month" },
  { value: "3 months", label: "3 months" },
];

const employmentTypes: { value: EmploymentType | ""; label: string }[] = [
  { value: "", label: "Any type" },
  { value: "Full-time", label: "Full-time" },
  { value: "Contract", label: "Contract" },
  { value: "Part-time", label: "Part-time" },
];

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function SearchFilters({ filters, onChange, resultCount }: SearchFiltersProps) {
  const hasActiveFilters =
    filters.roleCategory !== "" ||
    filters.minExperience > 0 ||
    filters.location !== "" ||
    filters.availability !== "" ||
    filters.salaryRange[0] > 0 ||
    filters.salaryRange[1] < 200000 ||
    filters.employmentType !== "";

  const resetFilters = () => {
    onChange({
      roleCategory: "",
      minExperience: 0,
      location: "",
      availability: "",
      salaryRange: [0, 200000],
      employmentType: "",
    });
  };

  return (
    <aside className="flex w-64 flex-shrink-0 flex-col">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-900">Filters</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {resultCount}
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-800 transition-colors"
          >
            <X className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5 overflow-y-auto rounded-xl border border-gray-200 bg-white p-5">
        <FilterSection title="Role">
          <div className="space-y-1.5">
            {roleCategories.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onChange({ ...filters, roleCategory: value })}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  filters.roleCategory === value
                    ? "bg-primary-50 text-primary-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Experience">
          <SingleSlider
            min={0}
            max={10}
            value={filters.minExperience}
            onChange={(v) => onChange({ ...filters, minExperience: v })}
            formatValue={(v) => (v === 10 ? "10+" : String(v))}
            label="Min. years"
          />
        </FilterSection>

        <FilterSection title="Location">
          <input
            type="text"
            value={filters.location}
            onChange={(e) => onChange({ ...filters, location: e.target.value })}
            placeholder="City or country…"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </FilterSection>

        <FilterSection title="Availability">
          <div className="space-y-1.5">
            {availabilityOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onChange({ ...filters, availability: value })}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  filters.availability === value
                    ? "bg-primary-50 text-primary-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Salary Range (USD/yr)">
          <Slider
            min={0}
            max={200000}
            step={5000}
            value={filters.salaryRange}
            onChange={(v) => onChange({ ...filters, salaryRange: v })}
            formatValue={(v) => formatCurrency(v)}
          />
        </FilterSection>

        <FilterSection title="Employment Type">
          <div className="space-y-1.5">
            {employmentTypes.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onChange({ ...filters, employmentType: value })}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  filters.employmentType === value
                    ? "bg-primary-50 text-primary-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </FilterSection>
      </div>
    </aside>
  );
}
