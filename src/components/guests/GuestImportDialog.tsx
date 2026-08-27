import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { GuestImportRowInput } from "@/lib/guests";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submitting: boolean;
  onSubmit: (rows: GuestImportRowInput[]) => void;
}

function parseRows(raw: string): GuestImportRowInput[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [fullName, phone, email, note, groupName] = line.split(",").map((part) => part.trim());
      return {
        fullName: fullName ?? "",
        phone: phone || null,
        email: email || null,
        note: note || null,
        groupName: groupName || null,
      };
    });
}

const GuestImportDialog = ({ open, onOpenChange, submitting, onSubmit }: Props) => {
  const [raw, setRaw] = useState("");
  const rows = parseRows(raw);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import guest list</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Each line is a guest: <code className="text-xs">Full name, phone number, email, notes, group</code>.
            Only Full Name is required, the remaining fields can be left blank.
          </p>
          <Textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={10}
            placeholder={"Nguyen Van A, 0900000000, a@example.com, School Board, Family\nTran Thi B,,,,"}
            className="font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">{rows.length} lines will be imported.</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={() => onSubmit(rows)} disabled={submitting || rows.length === 0}>
            {submitting ? "Importing..." : `Import ${rows.length} guest`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GuestImportDialog;
