"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { OnboardingData } from "@/app/(authenticated)/onboarding/page";

interface StepMediaProps {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  userId: string;
}

async function uploadFile(
  file: File,
  bucket: "talent-covers" | "talent-resumes",
  filename: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", bucket);
  formData.append("filename", filename);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Upload failed");
  return json.url as string;
}

export function StepMedia({ data, onChange, onNext, onBack }: StepMediaProps) {
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [coverMode, setCoverMode] = useState<"image" | "video">(
    data.coverMediaType === "video" ? "video" : "image"
  );

  const coverInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const isValid = data.resumeUrl.length > 0;

  async function handleCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = coverMode === "video" ? 200 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > maxSize) {
      setCoverError(`File too large. Max ${coverMode === "video" ? "200 MB" : "15 MB"}.`);
      return;
    }
    setCoverUploading(true);
    setCoverError(null);
    try {
      const url = await uploadFile(file, "talent-covers", "cover");
      onChange({ coverMediaUrl: url, coverMediaType: coverMode });
    } catch (err) {
      setCoverError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setCoverUploading(false);
    }
  }

  async function handleResumeSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setResumeError("Resume must be under 10 MB.");
      return;
    }
    setResumeUploading(true);
    setResumeError(null);
    try {
      const url = await uploadFile(file, "talent-resumes", "resume");
      onChange({ resumeUrl: url });
    } catch (err) {
      setResumeError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setResumeUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isValid) onNext();
  }

  const coverAccept = coverMode === "video"
    ? "video/mp4,video/quicktime,video/webm"
    : "image/jpeg,image/png,image/webp";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-white">Media &amp; Resume</h2>
        <p className="text-sm text-white/40 mt-1">
          Upload your cover media and resume. These appear on your public profile.
        </p>
      </div>

      {/* Cover Image / Video */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white/70">
            Cover Media
            <span className="text-white/30 font-normal ml-1">(optional · landscape 16:9)</span>
          </label>
          {/* Image / Video toggle */}
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            <button
              type="button"
              onClick={() => { setCoverMode("image"); onChange({ coverMediaType: "" }); }}
              className={cn(
                "px-3 py-1 text-xs font-medium transition-colors",
                coverMode === "image"
                  ? "bg-white text-black"
                  : "text-white/40 hover:text-white/60"
              )}
            >
              Image
            </button>
            <button
              type="button"
              onClick={() => { setCoverMode("video"); onChange({ coverMediaType: "" }); }}
              className={cn(
                "px-3 py-1 text-xs font-medium transition-colors",
                coverMode === "video"
                  ? "bg-white text-black"
                  : "text-white/40 hover:text-white/60"
              )}
            >
              Video
            </button>
          </div>
        </div>

        {/* Cover preview / upload area */}
        <button
          type="button"
          onClick={() => coverInputRef.current?.click()}
          className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-white/20 hover:border-white/30 transition-colors bg-white/[0.03] flex items-center justify-center group"
        >
          {data.coverMediaUrl && data.coverMediaType === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.coverMediaUrl} alt="Cover" className="w-full h-full object-cover" />
          )}
          {data.coverMediaUrl && data.coverMediaType === "video" && (
            <video src={data.coverMediaUrl} className="w-full h-full object-cover" muted />
          )}
          {!data.coverMediaUrl && (
            <div className="text-center">
              <svg className="w-8 h-8 mx-auto mb-2 text-white/30 group-hover:text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {coverMode === "video" ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                )}
              </svg>
              <p className="text-sm text-white/40 group-hover:text-white/60">
                Click to upload {coverMode === "video" ? "landscape video" : "landscape image"}
              </p>
              <p className="text-xs text-white/25 mt-1">
                {coverMode === "video" ? "MP4, MOV, WebM · max 200 MB" : "JPG, PNG, WebP · max 15 MB"}
              </p>
            </div>
          )}
          {coverUploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <svg className="w-6 h-6 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          )}
        </button>

        {data.coverMediaUrl && (
          <button
            type="button"
            onClick={() => onChange({ coverMediaUrl: "", coverMediaType: "" })}
            className="text-xs text-white/30 hover:text-white/50 self-start transition-colors"
          >
            Remove cover media
          </button>
        )}
        {coverError && <p className="text-xs text-red-400">{coverError}</p>}

        <input
          ref={coverInputRef}
          type="file"
          accept={coverAccept}
          className="hidden"
          onChange={handleCoverSelect}
        />
      </div>

      {/* Resume */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-white/70">
          Resume / CV <span className="text-red-400">*</span>
          <span className="text-white/30 font-normal ml-1">(PDF)</span>
        </label>

        {data.resumeUrl ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.06] border border-white/10">
            <svg className="w-8 h-8 text-white/50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium">Resume uploaded</p>
              <a
                href={data.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white/60 underline truncate block"
              >
                View resume
              </a>
            </div>
            <button
              type="button"
              onClick={() => resumeInputRef.current?.click()}
              className="text-xs text-white/50 hover:text-white/70 border border-white/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              Replace
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => resumeInputRef.current?.click()}
            disabled={resumeUploading}
            className="w-full p-6 rounded-xl border-2 border-dashed border-white/20 hover:border-white/30 bg-white/[0.03] flex flex-col items-center gap-2 transition-colors disabled:opacity-50 group"
          >
            {resumeUploading ? (
              <svg className="w-6 h-6 animate-spin text-white/50" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white/30 group-hover:text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            <p className="text-sm text-white/40 group-hover:text-white/60">
              {resumeUploading ? "Uploading…" : "Click to upload your resume"}
            </p>
            <p className="text-xs text-white/25">PDF only · max 10 MB</p>
          </button>
        )}
        {resumeError && <p className="text-xs text-red-400">{resumeError}</p>}
        <input
          ref={resumeInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleResumeSelect}
        />
      </div>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-lg border border-white/20 text-white/50 hover:bg-white/[0.06] font-medium text-sm transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!isValid || coverUploading || resumeUploading}
          className="px-6 py-2.5 rounded-lg bg-white hover:bg-white/90 disabled:bg-white/10 disabled:text-white/30 text-black font-medium text-sm transition-colors"
        >
          Next
        </button>
      </div>
    </form>
  );
}
