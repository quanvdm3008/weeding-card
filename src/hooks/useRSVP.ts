import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api";
import { submitPublicRsvp } from "@/lib/invitations";

export interface RSVPFormState {
  name: string;
  guests: string;
  attending: "yes" | "no";
  message: string;
}

export function useRSVP(publicSlug?: string, initialGuestName?: string, guestToken?: string) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [form, setForm] = useState<RSVPFormState>({ 
    name: initialGuestName ?? "", 
    guests: "1", 
    attending: "yes", 
    message: "" 
  });

  const urlGuestToken = typeof window === "undefined" ? undefined : new URLSearchParams(window.location.search).get("guest") || undefined;
  const resolvedGuestToken = guestToken || urlGuestToken;

  useEffect(() => {
    if (initialGuestName) {
      setForm((current) => current.name ? current : { ...current, name: initialGuestName });
    }
  }, [initialGuestName]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!form.name.trim()) return;
    
    setSubmitting(true);
    try {
      if (publicSlug) {
        await submitPublicRsvp(
          publicSlug,
          form.name.trim(),
          Number(form.guests),
          form.attending,
          form.message.trim() || undefined,
          resolvedGuestToken,
        );
      }
      setSubmitted(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to send RSVP"));
    } finally {
      setSubmitting(false);
    }
  };

  const updateForm = (updates: Partial<RSVPFormState>) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  return {
    form,
    updateForm,
    submitted,
    submitting,
    handleSubmit
  };
}
