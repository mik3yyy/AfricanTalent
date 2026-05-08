"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

const schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["talent", "company"], {
    errorMap: () => ({ message: "Please select your role" }),
  }),
});

type FormData = z.infer<typeof schema>;

interface WaitlistFormProps {
  defaultRole?: "talent" | "company";
  className?: string;
  compact?: boolean;
}

export function WaitlistForm({
  defaultRole,
  className,
  compact = false,
}: WaitlistFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: defaultRole,
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  if (submitted) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4 py-10 px-6 rounded-2xl glass-card text-center",
          className
        )}
      >
        <div className="w-16 h-16 rounded-full bg-[#10B981]/20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-[#10B981]" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">
            You&apos;re on the list!
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            We&apos;ll notify you when your spot opens up. Check your inbox for a confirmation email.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          Early access spots filling fast
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-4", className)}
    >
      {!compact && (
        <div className="grid grid-cols-2 gap-2">
          {(["talent", "company"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setValue("role", r, { shouldValidate: true })}
              className={cn(
                "py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200 capitalize",
                selectedRole === r
                  ? r === "talent"
                    ? "border-[#1B4FD8] bg-[#1B4FD8]/20 text-[#818CF8]"
                    : "border-[#10B981] bg-[#10B981]/20 text-[#34D399]"
                  : "border-slate-700 text-slate-400 hover:border-slate-500"
              )}
            >
              {r === "talent" ? "I&apos;m Talent" : "I&apos;m Hiring"}
            </button>
          ))}
        </div>
      )}

      {!compact && errors.role && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {errors.role.message}
        </p>
      )}

      {compact && (
        <input type="hidden" {...register("role")} value={defaultRole} />
      )}

      <div className={cn(compact ? "flex gap-2" : "space-y-3")}>
        {!compact && (
          <div>
            <input
              {...register("firstName")}
              type="text"
              placeholder="First name"
              autoComplete="given-name"
              className={cn(
                "w-full px-4 py-3 rounded-xl bg-slate-900 border text-white placeholder-slate-500 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/50",
                errors.firstName
                  ? "border-red-500/50 focus:ring-red-500/30"
                  : "border-slate-700 focus:border-[#1B4FD8]"
              )}
            />
            {errors.firstName && (
              <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.firstName.message}
              </p>
            )}
          </div>
        )}

        <div className={cn(compact ? "flex-1" : "")}>
          <input
            {...register("email")}
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-slate-900 border text-white placeholder-slate-500 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/50",
              errors.email
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-slate-700 focus:border-[#1B4FD8]"
            )}
          />
          {!compact && errors.email && (
            <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size={compact ? "md" : "lg"}
          loading={isSubmitting}
          fullWidth={!compact}
          className={cn(compact ? "shrink-0" : "")}
        >
          {compact ? (
            <ArrowRight className="w-4 h-4" />
          ) : (
            <>
              Join Waitlist
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {serverError && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {serverError}
        </p>
      )}

      <p className="text-slate-500 text-xs text-center">
        No spam, ever. Unsubscribe any time.
      </p>
    </form>
  );
}
