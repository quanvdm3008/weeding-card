import { toast } from "sonner";

/**
 * Copies `text` to the system clipboard and shows a success toast.
 * Replaces the duplicated copyToClipboard helper across all template files.
 */
export function copyToClipboard(text: string, message = "Copied!"): void {
  void navigator.clipboard.writeText(text).then(() => {
    toast.success(message);
  });
}
