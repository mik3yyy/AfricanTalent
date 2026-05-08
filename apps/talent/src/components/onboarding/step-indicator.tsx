import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number; // 0-based index
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const progressPercent =
    steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;

  return (
    <div className="w-full">
      <div className="relative mb-8">
        {/* Track */}
        <div className="absolute top-4 left-0 right-0 h-px bg-white/10">
          <div
            className="h-full bg-white/40 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-all duration-300 z-10 relative",
                    isCompleted
                      ? "bg-white border-white text-black"
                      : isCurrent
                      ? "bg-white/10 border-white/60 text-white"
                      : "bg-transparent border-white/20 text-white/30"
                  )}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium whitespace-nowrap hidden sm:block",
                    isCurrent ? "text-white" : isCompleted ? "text-white/50" : "text-white/25"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile label */}
      <p className="text-xs text-white/40 sm:hidden mb-4">
        Step {currentStep + 1} of {steps.length}:{" "}
        <span className="text-white font-medium">{steps[currentStep]?.label}</span>
      </p>
    </div>
  );
}
