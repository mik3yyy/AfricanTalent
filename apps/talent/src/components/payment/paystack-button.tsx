"use client";

import { useRef } from "react";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        metadata?: Record<string, unknown>;
        callback: (response: { reference: string; status: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

interface PaystackButtonProps {
  email: string;
  amountUsd: number;
  userId: string;
  onSuccess: (reference: string) => void;
  onClose?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function PaystackButton({
  email,
  amountUsd,
  userId,
  onSuccess,
  onClose,
  disabled,
  loading,
  children,
  className,
}: PaystackButtonProps) {
  const scriptLoaded = useRef(false);

  function loadScriptAndPay() {
    const doPay = () => {
      if (!window.PaystackPop) {
        console.error("Paystack not loaded");
        return;
      }
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
        email,
        amount: amountUsd * 100, // Paystack uses minor units (cents for USD)
        currency: "USD",
        ref: `afritalent_${userId}_${Date.now()}`,
        metadata: { userId, platform: "afritalent" },
        callback: (response) => {
          if (response.status === "success" || response.reference) {
            onSuccess(response.reference);
          }
        },
        onClose: () => onClose?.(),
      });
      handler.openIframe();
    };

    if (window.PaystackPop) {
      doPay();
      return;
    }

    if (scriptLoaded.current) {
      // Script tag added but not yet ready — wait
      const interval = setInterval(() => {
        if (window.PaystackPop) {
          clearInterval(interval);
          doPay();
        }
      }, 100);
      return;
    }

    scriptLoaded.current = true;
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = doPay;
    document.head.appendChild(script);
  }

  return (
    <button
      type="button"
      onClick={loadScriptAndPay}
      disabled={disabled || loading}
      className={className}
    >
      {children}
    </button>
  );
}
