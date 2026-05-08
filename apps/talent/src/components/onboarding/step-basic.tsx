"use client";

import { useState, useRef } from "react";
import { OnboardingData } from "@/app/(authenticated)/onboarding/page";

const AFRICAN_COUNTRIES = [
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
  { code: "GH", name: "Ghana" },
  { code: "ZA", name: "South Africa" },
  { code: "EG", name: "Egypt" },
  { code: "ET", name: "Ethiopia" },
  { code: "RW", name: "Rwanda" },
  { code: "TZ", name: "Tanzania" },
  { code: "UG", name: "Uganda" },
  { code: "SN", name: "Senegal" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "MA", name: "Morocco" },
  { code: "TN", name: "Tunisia" },
  { code: "DZ", name: "Algeria" },
  { code: "CM", name: "Cameroon" },
  { code: "ZW", name: "Zimbabwe" },
  { code: "ZM", name: "Zambia" },
  { code: "BW", name: "Botswana" },
  { code: "NA", name: "Namibia" },
  { code: "MZ", name: "Mozambique" },
  { code: "AO", name: "Angola" },
  { code: "SD", name: "Sudan" },
  { code: "LY", name: "Libya" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "ML", name: "Mali" },
  { code: "NE", name: "Niger" },
  { code: "BF", name: "Burkina Faso" },
  { code: "TD", name: "Chad" },
  { code: "GN", name: "Guinea" },
  { code: "BJ", name: "Benin" },
  { code: "TG", name: "Togo" },
  { code: "SL", name: "Sierra Leone" },
  { code: "LR", name: "Liberia" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "SC", name: "Seychelles" },
  { code: "KM", name: "Comoros" },
  { code: "DJ", name: "Djibouti" },
  { code: "ER", name: "Eritrea" },
  { code: "SO", name: "Somalia" },
  { code: "GM", name: "Gambia" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "GA", name: "Gabon" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "DR Congo" },
  { code: "CF", name: "Central African Republic" },
  { code: "BI", name: "Burundi" },
  { code: "XX", name: "Other" },
];

const inputClass =
  "w-full px-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/[0.08] transition-colors";

interface StepBasicProps {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  userId: string;
}

export function StepBasic({ data, onChange, onNext, userId }: StepBasicProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid =
    data.fullName.trim().length >= 2 &&
    data.countryCode.length > 0 &&
    data.profilePhotoUrl.length > 0;

  function handleCountryChange(code: string) {
    const country = AFRICAN_COUNTRIES.find((c) => c.code === code);
    onChange({ countryCode: code, countryName: country?.name ?? "" });
  }

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Photo must be under 5 MB.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "talent-portraits");
      formData.append("filename", "portrait");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      onChange({ profilePhotoUrl: json.url });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isValid) onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Your Profile</h2>
        <p className="text-sm text-white/40 mt-1">
          Let&apos;s start with the basics. This is what companies see first.
        </p>
      </div>

      {/* Portrait Photo Upload */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-white/70">
          Profile Photo <span className="text-red-400">*</span>
          <span className="text-white/30 font-normal ml-1">(portrait, 3:4 ratio)</span>
        </label>
        <div className="flex items-start gap-4">
          {/* Preview */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative flex-shrink-0 w-24 h-32 rounded-xl overflow-hidden border-2 border-dashed border-white/20 hover:border-white/40 transition-colors bg-white/[0.03] flex items-center justify-center group"
          >
            {data.profilePhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.profilePhotoUrl}
                alt="Portrait"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-2">
                <svg className="w-6 h-6 mx-auto mb-1 text-white/30 group-hover:text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-xs text-white/30 group-hover:text-white/50 leading-tight">Click to upload</p>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <svg className="w-5 h-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              </div>
            )}
          </button>

          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 rounded-lg border border-white/20 text-white/70 hover:bg-white/[0.06] text-sm transition-colors disabled:opacity-50"
            >
              {uploading ? "Uploading…" : data.profilePhotoUrl ? "Change photo" : "Upload photo"}
            </button>
            <p className="text-xs text-white/30">JPG, PNG, WebP · max 5 MB<br />Portrait orientation (e.g. 600×800)</p>
            {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handlePhotoSelect}
        />
      </div>

      {/* Full Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-white/70">
          Full Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Amara Diallo"
          value={data.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          className={inputClass}
        />
      </div>

      {/* Email — read-only */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-white/70">Email</label>
        <input
          type="email"
          readOnly
          value={data.email}
          className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/40 cursor-not-allowed select-none"
        />
        <p className="text-xs text-white/30">Linked to your Google account.</p>
      </div>

      {/* Country */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-white/70">
          Country <span className="text-red-400">*</span>
        </label>
        <select
          required
          value={data.countryCode}
          onChange={(e) => handleCountryChange(e.target.value)}
          className={inputClass + " appearance-none"}
        >
          <option value="" disabled className="bg-[#0a0a0a] text-white/40">
            Select your country
          </option>
          {AFRICAN_COUNTRIES.map((country) => (
            <option key={country.code} value={country.code} className="bg-[#0a0a0a] text-white">
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={!isValid || uploading}
          className="px-6 py-2.5 rounded-lg bg-white hover:bg-white/90 disabled:bg-white/10 disabled:text-white/30 text-black font-medium text-sm transition-colors"
        >
          Next
        </button>
      </div>
    </form>
  );
}
