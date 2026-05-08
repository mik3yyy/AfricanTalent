"use client";

import { useState, CSSProperties } from "react";

interface TalentImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
}

/**
 * Fade-in image component — renders a dark placeholder, then cross-fades to
 * the real image once loaded. Same technique Netflix uses on their cards.
 */
export function TalentImage({ src, alt, className = "", style, priority }: TalentImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Placeholder shown until image loads */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundColor: "rgba(255,255,255,0.05)",
          opacity: loaded ? 0 : 1,
          backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 100%)",
        }}
      />

      {!error && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={className}
          style={{
            ...style,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.45s ease",
          }}
        />
      )}

      {/* Fallback initials when image fails */}
      {error && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        >
          <span className="text-xl font-bold" style={{ color: "rgba(255,255,255,0.25)" }}>
            {alt.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
          </span>
        </div>
      )}
    </div>
  );
}
