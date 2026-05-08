"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  talentName: string;
  talentHeadline: string;
}

export function ContactModal({
  open,
  onClose,
  talentName,
  talentHeadline,
}: ContactModalProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);

    toast.success(`Contact request sent to ${talentName}!`, {
      description: "They'll be notified and can choose to accept or decline.",
    });

    setMessage("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Request Contact – ${talentName}`}
      description={talentHeadline}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="contact-message"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Your message
          </label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder={`Hi ${talentName.split(" ")[0]}, I came across your profile and would love to connect about a potential opportunity at our company…`}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Be specific about the role and company to increase response rates.
          </p>
        </div>

        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
          <p className="text-xs text-amber-700">
            <strong>Note:</strong> {talentName} will receive a notification and can accept or decline your request. Their contact details are only shared after acceptance.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={!message.trim()}>
            Send Request
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
