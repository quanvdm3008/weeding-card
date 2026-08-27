import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GuestGroupDto, GuestTagDto } from "@/lib/guests";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: GuestGroupDto[];
  tags: GuestTagDto[];
  onCreateGroup: (name: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onCreateTag: (name: string, color: string) => void;
  onDeleteTag: (tagId: string) => void;
}

const DEFAULT_TAG_COLOR = "#E8B4B8";

const GuestGroupTagManagerDialog = ({
  open,
  onOpenChange,
  groups,
  tags,
  onCreateGroup,
  onDeleteGroup,
  onCreateTag,
  onDeleteTag,
}: Props) => {
  const [groupName, setGroupName] = useState("");
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState(DEFAULT_TAG_COLOR);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage groups & guest cards</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="groups">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="groups">Guest group</TabsTrigger>
            <TabsTrigger value="tags">Card</TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="New group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                maxLength={100}
              />
              <Button
                type="button"
                onClick={() => {
                  if (!groupName.trim()) return;
                  onCreateGroup(groupName.trim());
                  setGroupName("");
                }}
              >
                More
              </Button>
            </div>
            <ul className="space-y-1 max-h-60 overflow-y-auto">
              {groups.length === 0 && <p className="text-sm text-muted-foreground py-2">There are no groups yet.</p>}
              {groups.map((group) => (
                <li key={group.id} className="flex items-center justify-between px-3 py-2 rounded-md border border-border text-sm">
                  {group.name}
                  <button onClick={() => onDeleteGroup(group.id)} className="text-muted-foreground hover:text-destructive" aria-label={`Delete group ${group.name}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="tags" className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="New card name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                maxLength={100}
              />
              <input
                type="color"
                value={tagColor}
                onChange={(e) => setTagColor(e.target.value)}
                className="w-10 h-9 rounded border border-border"
                aria-label="Card color"
              />
              <Button
                type="button"
                onClick={() => {
                  if (!tagName.trim()) return;
                  onCreateTag(tagName.trim(), tagColor);
                  setTagName("");
                }}
              >
                More
              </Button>
            </div>
            <ul className="space-y-1 max-h-60 overflow-y-auto">
              {tags.length === 0 && <p className="text-sm text-muted-foreground py-2">No cards yet.</p>}
              {tags.map((tag) => (
                <li key={tag.id} className="flex items-center justify-between px-3 py-2 rounded-md border border-border text-sm">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                    {tag.name}
                  </span>
                  <button onClick={() => onDeleteTag(tag.id)} className="text-muted-foreground hover:text-destructive" aria-label={`Delete card ${tag.name}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GuestGroupTagManagerDialog;
