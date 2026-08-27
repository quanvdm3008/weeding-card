import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import type { GuestDto, GuestGroupDto, GuestStatus, GuestTagDto } from "@/lib/guests";
import { guestStatusFromValue } from "@/lib/guests";

interface GuestFormValues {
  fullName: string;
  phone: string;
  email: string;
  note: string;
  groupId: string | null;
  tagIds: string[];
  status: GuestStatus;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guest: GuestDto | null;
  groups: GuestGroupDto[];
  tags: GuestTagDto[];
  submitting: boolean;
  onSubmit: (values: GuestFormValues) => void;
}

const STATUS_OPTIONS: GuestStatus[] = ["PENDING", "OPENED", "ACCEPTED", "DECLINED"];
const STATUS_LABEL: Record<GuestStatus, string> = {
  PENDING: "Waiting for response",
  OPENED: "Viewed",
  ACCEPTED: "Attend",
  DECLINED: "Refuse",
};

const emptyValues: GuestFormValues = {
  fullName: "",
  phone: "",
  email: "",
  note: "",
  groupId: null,
  tagIds: [],
  status: "PENDING",
};

const GuestFormDialog = ({ open, onOpenChange, guest, groups, tags, submitting, onSubmit }: Props) => {
  const [values, setValues] = useState<GuestFormValues>(emptyValues);

  useEffect(() => {
    if (!open) return;
    if (guest) {
      setValues({
        fullName: guest.fullName,
        phone: guest.phone ?? "",
        email: guest.email ?? "",
        note: guest.note ?? "",
        groupId: guest.groupId,
        tagIds: guest.tagIds,
        status: guestStatusFromValue(guest.status),
      });
    } else {
      setValues(emptyValues);
    }
  }, [open, guest]);

  const toggleTag = (tagId: string) => {
    setValues((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId) ? prev.tagIds.filter((id) => id !== tagId) : [...prev.tagIds, tagId],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{guest ? "Edit guest" : "Add guest"}</DialogTitle>
          <DialogDescription>Enter the guest's contact details, group, tags, and RSVP status.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="guest-name">Full name *</Label>
            <Input
              id="guest-name"
              data-testid="guest-name"
              value={values.fullName}
              onChange={(e) => setValues((prev) => ({ ...prev, fullName: e.target.value }))}
              maxLength={200}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="guest-phone">Phone number</Label>
              <Input
                id="guest-phone"
                value={values.phone}
                onChange={(e) => setValues((prev) => ({ ...prev, phone: e.target.value }))}
                maxLength={40}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="guest-email">Email</Label>
              <Input
                id="guest-email"
                type="email"
                value={values.email}
                onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
                maxLength={255}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="guest-note">Note</Label>
            <Textarea
              id="guest-note"
              value={values.note}
              onChange={(e) => setValues((prev) => ({ ...prev, note: e.target.value }))}
              maxLength={2000}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Guest group</Label>
              <Select
                value={values.groupId ?? "none"}
                onValueChange={(value) => setValues((prev) => ({ ...prev, groupId: value === "none" ? null : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="There are no groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">There are no groups</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {guest && (
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={values.status} onValueChange={(value) => setValues((prev) => ({ ...prev, status: value as GuestStatus }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_LABEL[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {tags.length > 0 && (
            <div className="space-y-1.5">
              <Label>Card</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const active = values.tagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className="px-3 py-1 rounded-full text-xs font-medium border transition"
                      style={
                        active
                          ? { backgroundColor: tag.color, color: "#fff", borderColor: tag.color }
                          : { borderColor: tag.color, color: tag.color }
                      }
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button data-testid="guest-save" onClick={() => onSubmit(values)} disabled={submitting || !values.fullName.trim()}>
            {submitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GuestFormDialog;
