import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guestName: string;
  link: string;
}

const GuestQRCodeDialog = ({ open, onOpenChange, guestName, link }: Props) => {
  const [rsvpQr, setRsvpQr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    QRCode.toDataURL(link, { width: 220, margin: 1 })
      .then((url) => !cancelled && setRsvpQr(url))
      .catch(() => !cancelled && setRsvpQr(null));
    return () => {
      cancelled = true;
    };
  }, [link, open]);

  const copyLink = async (value: string) => {
    await navigator.clipboard.writeText(value);
    toast.success("Link copied");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" data-testid="guest-qr-dialog">
        <DialogHeader>
          <DialogTitle>Magic links for {guestName}</DialogTitle>
          <DialogDescription>Share this personal RSVP link with the guest. Check-in is performed by an authenticated host.</DialogDescription>
        </DialogHeader>

        <div className="mx-auto w-full max-w-sm">
          <QrPanel title="Magic RSVP" image={rsvpQr} alt={`RSVP's QR code ${guestName}`} link={link} onCopy={copyLink} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

function QrPanel({
  title,
  image,
  alt,
  link,
  onCopy,
}: {
  title: string;
  image: string | null;
  alt: string;
  link: string;
  onCopy: (link: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      {image ? (
        <img src={image} alt={alt} width={220} height={220} className="mx-auto rounded-lg border border-border" />
      ) : (
        <div className="mx-auto flex h-[220px] w-[220px] items-center justify-center rounded-lg border border-border text-xs text-muted-foreground">
          Generating QR code...
        </div>
      )}
      <div className="flex gap-2">
        <Input readOnly value={link} className="text-xs" />
        <Button type="button" onClick={() => onCopy(link)}>
          Copy
        </Button>
      </div>
    </div>
  );
}

export default GuestQRCodeDialog;
