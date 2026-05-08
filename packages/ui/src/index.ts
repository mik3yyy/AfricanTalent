// Shared UI components — re-exported for use across apps
// Each app also has its own local ui components for app-specific needs

export { cn } from "./utils";

// Base utility
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}
