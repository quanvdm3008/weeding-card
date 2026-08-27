import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { rsvpStatusFromValue, type RsvpCompanionInput, type RsvpDto, type RsvpStatus, type RsvpUpdateInput } from "@/lib/rsvps";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rsvp: RsvpDto | null;
  submitting: boolean;
  onSubmit: (input: RsvpUpdateInput) => void;
}

const STATUS_OPTIONS: RsvpStatus[] = ["ATTENDING", "DECLINED", "MAYBE"];
const STATUS_LABEL: Record<RsvpStatus, string> = {
  ATTENDING: "Attend",
  DECLINED: "Refuse",
  MAYBE: "Doubt",
};

const RsvpEditDialog = ({ open, onOpenChange, rsvp, submitting, onSubmit }: Props) => {
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [status, setStatus] = useState<RsvpStatus>("ATTENDING");
  const [message, setMessage] = useState("");
  const [mealSelection, setMealSelection] = useState("");
  const [companions, setCompanions] = useState<RsvpCompanionInput[]>([]);

  useEffect(() => {
    if (!open || !rsvp) return;
    setGuestName(rsvp.guestName);
    setGuestCount(rsvp.guestCount);
    setStatus(rsvpStatusFromValue(rsvp.status));
    setMessage(rsvp.message ?? "");
    setMealSelection(rsvp.mealSelection ?? "");
    setCompanions(rsvp.companions.map((c) => ({ name: c.name, mealSelection: c.mealSelection })));
  }, [open, rsvp]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit RSVP</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="rsvp-name">Guest name *</Label>
              <Input id="rsvp-name" value={guestName} onChange={(e) => setGuestName(e.target.value)} maxLength={200} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rsvp-count">Quantity *</Label>
              <Input
                id="rsvp-count"
                type="number"
                min={1}
                max={10}
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as RsvpStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rsvp-meal">Main dish</Label>
              <Input id="rsvp-meal" value={mealSelection} onChange={(e) => setMealSelection(e.target.value)} maxLength={100} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rsvp-message">Message</Label>
            <Textarea id="rsvp-message" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} rows={2} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Accompanying person</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCompanions((prev) => [...prev, { name: "", mealSelection: "" }])}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> More
              </Button>
            </div>
            {companions.map((companion, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Name of person accompanying"
                  value={companion.name}
                  onChange={(e) =>
                    setCompanions((prev) => prev.map((c, i) => (i === index ? { ...c, name: e.target.value } : c)))
                  }
                  maxLength={200}
                />
                <Input
                  placeholder="Dish"
                  value={companion.mealSelection ?? ""}
                  onChange={(e) =>
                    setCompanions((prev) => prev.map((c, i) => (i === index ? { ...c, mealSelection: e.target.value } : c)))
                  }
                  maxLength={100}
                  className="max-w-[140px]"
                />
                <Button variant="ghost" size="icon" onClick={() => setCompanions((prev) => prev.filter((_, i) => i !== index))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            disabled={submitting || !guestName.trim()}
            onClick={() =>
              onSubmit({
                guestName: guestName.trim(),
                guestCount,
                status,
                message: message.trim() || null,
                mealSelection: mealSelection.trim() || null,
                companions: companions.filter((c) => c.name.trim()).map((c) => ({ name: c.name.trim(), mealSelection: c.mealSelection?.trim() || null })),
              })
            }
          >
            {submitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RsvpEditDialog;
