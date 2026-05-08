"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const AFRICAN_COUNTRIES = [
  { code: "NG", name: "Nigeria" }, { code: "KE", name: "Kenya" },
  { code: "GH", name: "Ghana" }, { code: "ZA", name: "South Africa" },
  { code: "EG", name: "Egypt" }, { code: "ET", name: "Ethiopia" },
  { code: "RW", name: "Rwanda" }, { code: "TZ", name: "Tanzania" },
  { code: "UG", name: "Uganda" }, { code: "SN", name: "Senegal" },
  { code: "CI", name: "Côte d'Ivoire" }, { code: "MA", name: "Morocco" },
  { code: "TN", name: "Tunisia" }, { code: "DZ", name: "Algeria" },
  { code: "CM", name: "Cameroon" }, { code: "ZW", name: "Zimbabwe" },
  { code: "ZM", name: "Zambia" }, { code: "BW", name: "Botswana" },
  { code: "NA", name: "Namibia" }, { code: "MZ", name: "Mozambique" },
  { code: "AO", name: "Angola" }, { code: "SD", name: "Sudan" },
  { code: "MG", name: "Madagascar" }, { code: "MW", name: "Malawi" },
  { code: "ML", name: "Mali" }, { code: "NE", name: "Niger" },
  { code: "BF", name: "Burkina Faso" }, { code: "TD", name: "Chad" },
  { code: "GN", name: "Guinea" }, { code: "BJ", name: "Benin" },
  { code: "TG", name: "Togo" }, { code: "SL", name: "Sierra Leone" },
  { code: "LR", name: "Liberia" }, { code: "MU", name: "Mauritius" },
  { code: "GA", name: "Gabon" }, { code: "GM", name: "Gambia" },
  { code: "XX", name: "Other" },
];

const SECTORS = [
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
  { value: "sales", label: "Sales" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
  { value: "other", label: "Other" },
];

const inputClass =
  "w-full px-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/[0.08] transition-colors";

type ProfileData = {
  fullName: string;
  countryCode: string;
  countryName: string;
  sectors: string[];
  bio: string;
  linkedinUrl: string;
  githubUrl: string;
  websiteUrl: string;
  employmentType: string;
  profilePhotoUrl: string;
  coverMediaUrl: string;
  coverMediaType: string;
  resumeUrl: string;
};

async function uploadFile(file: File, bucket: string, filename: string): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("bucket", bucket);
  fd.append("filename", filename);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = await res.json() as { url?: string; error?: string };
  if (!res.ok || !json.url) throw new Error(json.error ?? "Upload failed");
  return json.url;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileData>({
    fullName: "", countryCode: "", countryName: "", sectors: [],
    bio: "", linkedinUrl: "", githubUrl: "", websiteUrl: "",
    employmentType: "both", profilePhotoUrl: "", coverMediaUrl: "",
    coverMediaType: "", resumeUrl: "",
  });
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const [coverMode, setCoverMode] = useState<"image" | "video">("image");

  const portraitRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const od = (user.user_metadata?.onboarding_data ?? {}) as Partial<ProfileData> & { sector?: string };
      setForm({
        fullName: od.fullName ?? user.user_metadata?.full_name ?? "",
        countryCode: od.countryCode ?? "",
        countryName: od.countryName ?? "",
        sectors: od.sectors ?? (od.sector ? [od.sector] : []),
        bio: od.bio ?? "",
        linkedinUrl: od.linkedinUrl ?? "",
        githubUrl: od.githubUrl ?? "",
        websiteUrl: od.websiteUrl ?? "",
        employmentType: od.employmentType ?? "both",
        profilePhotoUrl: od.profilePhotoUrl ?? "",
        coverMediaUrl: od.coverMediaUrl ?? "",
        coverMediaType: od.coverMediaType ?? "",
        resumeUrl: od.resumeUrl ?? "",
      });
      if (od.coverMediaType === "video") setCoverMode("video");
      setLoading(false);
    });
  }, []);

  const update = (patch: Partial<ProfileData>) => setForm((f) => ({ ...f, ...patch }));

  function toggleSector(value: string) {
    setForm((f) => ({
      ...f,
      sectors: f.sectors.includes(value)
        ? f.sectors.filter((s) => s !== value)
        : [...f.sectors, value],
    }));
  }

  function handleCountryChange(code: string) {
    const country = AFRICAN_COUNTRIES.find((c) => c.code === code);
    update({ countryCode: code, countryName: country?.name ?? "" });
  }

  async function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    bucket: string,
    filename: string,
    field: keyof ProfileData,
    typeField?: keyof ProfileData,
    typeValue?: string
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading((u) => ({ ...u, [field]: true }));
    setUploadErrors((err) => ({ ...err, [field]: "" }));
    try {
      const url = await uploadFile(file, bucket, filename);
      const patch: Partial<ProfileData> = { [field]: url };
      if (typeField && typeValue) patch[typeField] = typeValue as never;
      update(patch);
    } catch (err) {
      setUploadErrors((errors) => ({
        ...errors,
        [field]: err instanceof Error ? err.message : "Upload failed",
      }));
    } finally {
      setUploading((u) => ({ ...u, [field]: false }));
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const existing = user.user_metadata ?? {};
      const existingOd = existing.onboarding_data ?? {};

      const { error } = await supabase.auth.updateUser({
        data: {
          ...existing,
          onboarding_data: {
            ...existingOd,
            ...form,
            // preserve email from original onboarding
            email: existingOd.email ?? user.email,
          },
        },
      });
      if (error) throw new Error(error.message);
      router.push("/profile");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto animate-pulse space-y-4">
        <div className="h-8 w-40 bg-white/[0.06] rounded-lg" />
        <div className="h-64 bg-white/[0.04] rounded-2xl" />
      </div>
    );
  }

  const coverAccept = coverMode === "video"
    ? "video/mp4,video/quicktime,video/webm"
    : "image/jpeg,image/png,image/webp";

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-xl font-bold text-white">Edit Profile</h1>
      </div>

      {/* Portrait Photo */}
      <section className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Portrait Photo</h2>
        <div className="flex items-start gap-4">
          <div className="w-24 h-32 rounded-xl overflow-hidden border-2 border-white/10 bg-white/[0.03] flex-shrink-0">
            {form.profilePhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.profilePhotoUrl} alt="Portrait" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20 text-xs text-center p-2">No photo</div>
            )}
          </div>
          <div className="space-y-2">
            <button type="button" onClick={() => portraitRef.current?.click()}
              disabled={uploading.profilePhotoUrl}
              className="px-4 py-2 rounded-lg border border-white/20 text-white/70 hover:bg-white/[0.06] text-sm transition-colors disabled:opacity-50">
              {uploading.profilePhotoUrl ? "Uploading…" : "Change photo"}
            </button>
            <p className="text-xs text-white/30">JPG, PNG, WebP · max 5 MB · Portrait (3:4)</p>
            {uploadErrors.profilePhotoUrl && <p className="text-xs text-red-400">{uploadErrors.profilePhotoUrl}</p>}
          </div>
        </div>
        <input ref={portraitRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
          onChange={(e) => handleFileUpload(e, "talent-portraits", "portrait", "profilePhotoUrl")} />
      </section>

      {/* Basic Info */}
      <section className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Basic Info</h2>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Full Name</label>
          <input type="text" value={form.fullName} onChange={(e) => update({ fullName: e.target.value })}
            placeholder="e.g. Amara Diallo" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Country</label>
          <select value={form.countryCode} onChange={(e) => handleCountryChange(e.target.value)}
            className={inputClass + " appearance-none"}>
            <option value="" disabled className="bg-[#0a0a0a] text-white/40">Select your country</option>
            {AFRICAN_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code} className="bg-[#0a0a0a] text-white">{c.name}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Professional */}
      <section className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Professional</h2>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Sector(s) <span className="text-white/30 font-normal">(select all that apply)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {SECTORS.map((s) => {
              const selected = form.sectors.includes(s.value);
              return (
                <button key={s.value} type="button" onClick={() => toggleSector(s.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                    selected ? "bg-white text-black border-white" : "bg-white/[0.04] text-white/60 border-white/10 hover:bg-white/[0.08]"
                  )}>
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1.5">Professional Bio</label>
          <textarea rows={7} value={form.bio}
            onChange={(e) => update({ bio: e.target.value })}
            placeholder="Your background, what you've built, impact and results..."
            className={inputClass + " resize-none"} />
          <p className="text-xs text-white/30 mt-1">{form.bio.trim().length} / 1000 characters</p>
        </div>
      </section>

      {/* Cover Media */}
      <section className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Cover Media</h2>
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            {(["image", "video"] as const).map((mode) => (
              <button key={mode} type="button"
                onClick={() => { setCoverMode(mode); update({ coverMediaType: "" }); }}
                className={cn("px-3 py-1 text-xs font-medium transition-colors",
                  coverMode === mode ? "bg-white text-black" : "text-white/40 hover:text-white/60")}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button type="button" onClick={() => coverRef.current?.click()}
          className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-white/20 hover:border-white/30 bg-white/[0.03] flex items-center justify-center transition-colors group">
          {form.coverMediaUrl && form.coverMediaType === "video" ? (
            <video src={form.coverMediaUrl} className="w-full h-full object-cover" muted />
          ) : form.coverMediaUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.coverMediaUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <p className="text-white/30 group-hover:text-white/50 text-sm">
              Click to upload {coverMode === "video" ? "landscape video" : "landscape image"}
            </p>
          )}
          {uploading.coverMediaUrl && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <svg className="w-6 h-6 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            </div>
          )}
        </button>
        {form.coverMediaUrl && (
          <button type="button" onClick={() => update({ coverMediaUrl: "", coverMediaType: "" })}
            className="text-xs text-white/30 hover:text-white/50 transition-colors">
            Remove cover
          </button>
        )}
        {uploadErrors.coverMediaUrl && <p className="text-xs text-red-400">{uploadErrors.coverMediaUrl}</p>}
        <input ref={coverRef} type="file" accept={coverAccept} className="hidden"
          onChange={(e) => handleFileUpload(e, "talent-covers", "cover", "coverMediaUrl", "coverMediaType", coverMode)} />
      </section>

      {/* Resume */}
      <section className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 space-y-3">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Resume / CV</h2>
        {form.resumeUrl ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/10">
            <svg className="w-7 h-7 text-white/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium">Resume uploaded</p>
              <a href={form.resumeUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white/60 underline">View</a>
            </div>
            <button type="button" onClick={() => resumeRef.current?.click()}
              disabled={uploading.resumeUrl}
              className="text-xs border border-white/20 text-white/50 px-3 py-1.5 rounded-lg hover:bg-white/[0.06] transition-colors disabled:opacity-50">
              {uploading.resumeUrl ? "Uploading…" : "Replace"}
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => resumeRef.current?.click()}
            disabled={uploading.resumeUrl}
            className="w-full py-5 rounded-xl border-2 border-dashed border-white/20 hover:border-white/30 text-white/40 hover:text-white/60 text-sm transition-colors disabled:opacity-50">
            {uploading.resumeUrl ? "Uploading…" : "Click to upload PDF resume"}
          </button>
        )}
        {uploadErrors.resumeUrl && <p className="text-xs text-red-400">{uploadErrors.resumeUrl}</p>}
        <input ref={resumeRef} type="file" accept="application/pdf" className="hidden"
          onChange={(e) => handleFileUpload(e, "talent-resumes", "resume", "resumeUrl")} />
      </section>

      {/* Links */}
      <section className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Links</h2>
        {[
          { label: "LinkedIn URL", key: "linkedinUrl" as const, placeholder: "https://linkedin.com/in/yourprofile" },
          { label: "GitHub URL", key: "githubUrl" as const, placeholder: "https://github.com/yourusername" },
          { label: "Personal Website", key: "websiteUrl" as const, placeholder: "https://yoursite.com" },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-white/70 mb-1.5">{label}</label>
            <input type="url" value={form[key]} onChange={(e) => update({ [key]: e.target.value })}
              placeholder={placeholder} className={inputClass} />
          </div>
        ))}
      </section>

      {/* Availability */}
      <section className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 space-y-3">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Availability</h2>
        <div className="space-y-2">
          {[
            { value: "full_time", label: "Full-time only" },
            { value: "contract", label: "Contract only" },
            { value: "both", label: "Open to both" },
          ].map((opt) => (
            <button key={opt.value} type="button" onClick={() => update({ employmentType: opt.value })}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all",
                form.employmentType === opt.value
                  ? "border-white bg-white/10 text-white"
                  : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
              )}>
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Save */}
      {saveError && <p className="text-red-400 text-sm text-center">{saveError}</p>}
      <div className="flex gap-3 pb-6">
        <button onClick={() => router.back()}
          className="flex-1 py-3 rounded-xl border border-white/20 text-white/50 hover:bg-white/[0.06] font-medium text-sm transition-colors">
          Cancel
        </button>
        <button onClick={handleSave} disabled={saving}
          className="flex-1 py-3 rounded-xl bg-white hover:bg-white/90 disabled:bg-white/10 disabled:text-white/30 text-black font-semibold text-sm transition-colors flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
