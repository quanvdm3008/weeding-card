import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, Download, Globe, Link2, LoaderCircle, Lock, QrCode, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api";
import { publishInvitation } from "@/lib/invitations";
import { useWeddingConfig } from "@/store/weddingConfigStore";

interface PublishShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const isMockApi = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === "true";

function publishErrorMessage(error: unknown) {
  return getApiErrorMessage(error, "Unable to update public status.");
}

export const PublishShareDialog: React.FC<PublishShareDialogProps> = ({ open, onOpenChange }) => {
  const { invitationId, slug, published, setField } = useWeddingConfig();
  const [customSlug, setCustomSlug] = useState(slug || "");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    if (open) setCustomSlug(slug || "");
  }, [open, slug]);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://mireia.wedding";
  const publicSlug = published ? customSlug || slug : "";
  const publicUrl = publicSlug ? `${baseUrl}/invitation/${publicSlug}` : "";

  useEffect(() => {
    let active = true;
    setQrDataUrl("");
    setQrError(false);
    if (!publicUrl) return () => { active = false; };

    void QRCode.toDataURL(publicUrl, { width: 260, margin: 1, errorCorrectionLevel: "M" })
      .then((dataUrl) => {
        if (active) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (active) setQrError(true);
      });

    return () => { active = false; };
  }, [publicUrl]);

  const handleTogglePublish = async () => {
    const nextPublished = !published;
    setLoading(true);
    try {
      if (!nextPublished && !isMockApi) {
        toast.error("The API currently does not support hiding public cards.");
        return;
      }
      if (nextPublished && !invitationId) {
        toast.error("Please save the card before publishing.");
        return;
      }

      const publishedInvitation = nextPublished
        ? await publishInvitation(invitationId, customSlug || undefined)
        : null;
      const nextSlug = publishedInvitation?.slug || customSlug || slug || "";

      setField("published", nextPublished);
      if (nextSlug) {
        setCustomSlug(nextSlug);
        setField("slug", nextSlug);
      }
      toast.success(nextPublished ? "The card has been published successfully." : "Hidden cards.");
    } catch (err) {
      if (isMockApi) {
        setField("published", nextPublished);
        toast.success(nextPublished ? "Public card has been turned on." : "Hidden cards.");
        return;
      }
      toast.error(publishErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!publicUrl) return;
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("The wedding invitation link has been copied.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-24px)] max-w-[560px] gap-0 overflow-hidden rounded-lg border border-rose-100 bg-[#fffaf8] p-0 shadow-[0_24px_80px_rgba(49,26,32,0.24)]">
        <div className="border-b border-rose-100 bg-[linear-gradient(135deg,#fffaf8_0%,#fff4f0_48%,#fffdfb_100%)] px-6 py-5">
          <DialogHeader className="space-y-2 text-left">
            <div className="flex items-start gap-3 pr-8">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-[#c49a4c] shadow-sm ring-1 ring-rose-100">
                <Globe className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="font-display text-2xl leading-tight text-[#2b171c]">
                  Publicize & share wedding invitations
                </DialogTitle>
                <DialogDescription className="mt-1 font-body text-sm leading-6 text-[#7d656b]">
                  Save the draft first, then turn it public so guests can see the card via link or QR code.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 py-5">
          <section className="flex items-center justify-between gap-4 rounded-lg border border-rose-100 bg-white p-4 shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${
                  published ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                }`}
              >
                {published ? <ShieldCheck className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </span>
              <div className="min-w-0">
                <p className="font-body text-sm font-semibold text-[#2b171c]">
                  {published ? "The card is public" : "The card is in draft"}
                </p>
                <p className="mt-0.5 font-body text-xs leading-5 text-[#7d656b]">
                  {published ? "Guests with the link can view the invitation." : "Only you can see it in Builder."}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              disabled={loading || (!published && !invitationId)}
              onClick={handleTogglePublish}
              data-testid="editor-publish-confirm"
              className={published ? "bg-[#8f5d2e] text-white hover:bg-[#7b4f27]" : "bg-emerald-600 text-white hover:bg-emerald-700"}
            >
              {loading && <LoaderCircle className="mr-1.5 h-4 w-4 animate-spin" />}
              {published ? "Hide cards" : "Turn on public"}
            </Button>
          </section>

          <section className="grid gap-4 rounded-lg border border-rose-100 bg-white p-4 shadow-sm">
            <div className="grid gap-2">
              <label htmlFor="public-slug" className="font-body text-xs font-semibold uppercase tracking-wide text-[#6c4f57]">
                Custom path
              </label>
              <div className="flex items-center overflow-hidden rounded-lg border border-rose-100 bg-[#fffaf8] focus-within:ring-2 focus-within:ring-[#c49a4c]/25">
                <span className="shrink-0 border-r border-rose-100 px-3 font-mono text-xs text-[#9a7a82]">
                  /invitation/
                </span>
                <Input
                  id="public-slug"
                  value={customSlug}
                  onChange={(event) => setCustomSlug(event.target.value.trim().toLowerCase())}
                  placeholder="leave-blank-to-generate"
                  className="h-11 border-0 bg-transparent font-mono text-sm text-[#2b171c] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <p className="font-body text-xs leading-5 text-[#8b7379]">
                You can leave it blank so the system can automatically create the slug when public.
              </p>
            </div>

            <div className="grid gap-2">
              <label className="font-body text-xs font-semibold uppercase tracking-wide text-[#6c4f57]">
                Public link
              </label>
              <div className="flex items-center gap-2">
                <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-rose-100 bg-[#fffaf8] px-3">
                  <Link2 className="h-4 w-4 shrink-0 text-[#c49a4c]" />
                  <span className={`truncate font-mono text-xs ${publicUrl ? "text-[#2b171c]" : "text-[#9a7a82]"}`}>
                    {publicUrl || "There is no public link yet. Click Turn on public to create the link."}
                  </span>
                </div>
                <Button
                  size="sm"
                  disabled={!publicUrl}
                  onClick={handleCopy}
                  className="h-11 shrink-0 bg-[#c49a4c] px-4 text-white hover:bg-[#b48b40]"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-rose-100 bg-white p-4 text-center shadow-sm">
            <p className="mb-3 flex items-center justify-center gap-1.5 font-body text-xs font-semibold uppercase tracking-wide text-[#6c4f57]">
              <QrCode className="h-4 w-4 text-[#c49a4c]" /> QR code
            </p>

            {qrDataUrl ? (
              <>
                <div className="mx-auto inline-block rounded-lg border border-rose-100 bg-white p-3 shadow-md">
                  <img src={qrDataUrl} alt="Wedding invitation QR code" className="h-40 w-40 object-contain" />
                </div>
                <a
                  href={qrDataUrl}
                  download="Mireia_Wedding_QRCode.png"
                  className="mx-auto mt-3 inline-flex items-center gap-1.5 font-body text-xs font-semibold text-[#b48b40] hover:underline"
                >
                  <Download className="h-3.5 w-3.5" /> Download QR code
                </a>
              </>
            ) : qrError ? (
              <div role="alert" className="rounded-lg border border-dashed border-destructive/30 bg-destructive/5 px-4 py-8 font-body text-sm text-destructive">
                Unable to generate QR code. You can still copy the public link above.
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-rose-200 bg-[#fffaf8] px-4 py-8 font-body text-sm text-[#8b7379]">
                {publicUrl ? "Generating QR codes…" : "The QR code will appear after the card is published."}
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublishShareDialog;
