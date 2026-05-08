"use client";

import { cn } from "@/lib/utils";

interface SliderProps {
  label?: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
  className?: string;
  step?: number;
}

export function Slider({
  label,
  min,
  max,
  value,
  onChange,
  formatValue,
  className,
  step = 1,
}: SliderProps) {
  const format = formatValue ?? ((v: number) => String(v));

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-xs text-gray-500">
            {format(value[0])} – {format(value[1])}
          </span>
        </div>
      )}
      <div className="space-y-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => {
            const newMin = Number(e.target.value);
            if (newMin <= value[1]) onChange([newMin, value[1]]);
          }}
          className="w-full h-1.5 accent-primary cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={(e) => {
            const newMax = Number(e.target.value);
            if (newMax >= value[0]) onChange([value[0], newMax]);
          }}
          className="w-full h-1.5 accent-primary cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

interface SingleSliderProps {
  label?: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  className?: string;
  step?: number;
}

export function SingleSlider({
  label,
  min,
  max,
  value,
  onChange,
  formatValue,
  className,
  step = 1,
}: SingleSliderProps) {
  const format = formatValue ?? ((v: number) => String(v));

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-xs text-gray-500">{format(value)}+</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 accent-primary cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>{format(min)}</span>
        <span>{format(max)}+</span>
      </div>
    </div>
  );
}
