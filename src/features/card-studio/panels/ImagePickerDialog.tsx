import { useMemo, useRef, useState } from "react";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useEditorStore } from "../store/editorStore";
import { useInteractionStore } from "../store/interactionStore";
import * as ops from "../store/documentOps";
import { useWeddingConfig } from "@/store/weddingConfigStore";
import { uploadMedia, isMediaUploadUnavailable } from "@/lib/media";
import { getApiErrorMessage } from "@/lib/api";

/**
 * Select image for component (image/frame/gallery): import directly from the original card
 * (cover art + album saved in Builder) or paste URL — open with double-click
 * on canvas or button in Inspector.
 */
export function ImagePickerDialog() {
  const componentId = useInteractionStore((s) => s.imagePickerFor);
  const close = useInteractionStore((s) => s.closeImagePicker);
  const documentState = useEditorStore((s) => s.document);
  const coverImageUrl = useWeddingConfig((s) => s.coverImageUrl);
  const galleryImageUrls = useWeddingConfig((s) => s.galleryImageUrls);
  const [urlDraft, setUrlDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const component = componentId ? ops.findComponent(documentState, componentId) : undefined;

  const sourceImages = useMemo(() => {
    const urls = [coverImageUrl, ...(galleryImageUrls ?? [])].filter((u): u is string => !!u?.trim());
    return [...new Set(urls)];
  }, [coverImageUrl, galleryImageUrls]);

  if (!componentId || !component) return null;

  const isGallery = component.type === "gallery";

  const applyImage = (url: string) => {
    const store = useEditorStore.getState();
    store.apply((doc) =>
      ops.updateComponents(doc, [componentId], (c) => {
        if (c.type === "gallery") {
          const current = (c.content.images as string[]) ?? [];
          c.content = { ...c.content, images: [...current, url] };
        } else {
          c.content = { ...c.content, src: url };
        }
      })
    );
    toast.success(isGallery ? "Photos added to collection" : "Photo placed");
    if (!isGallery) close();
  };

  const importWholeAlbum = () => {
    if (!sourceImages.length) return;
    const store = useEditorStore.getState();
    store.apply((doc) =>
      ops.updateComponents(doc, [componentId], (c) => {
        c.content = { ...c.content, images: sourceImages };
      })
    );
    toast.success(`Entered ${sourceImages.length} Photo from original card`);
    close();
  };

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadMedia(file);
      applyImage(result.url);
    } catch (error) {
      toast.error(
        isMediaUploadUnavailable(error)
          ? "Upload is not enabled on the server (needs CLOUDINARY_ENABLED=true — see SETUP.md)"
          : getApiErrorMessage(error, "Unable to upload photos")
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={close}>
      <div
        className="bg-card rounded-xl shadow-2xl w-full max-w-lg max-h-[75vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-semibold">{isGallery ? "Add photos to the collection" : "Select photo"}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Cover photo + album from the original card, upload photos from your device, or paste any URL.
            </p>
          </div>
          <button onClick={close} className="p-1 rounded-md hover:bg-muted shrink-0" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {sourceImages.length > 0 ? (
            <>
              {isGallery && (
                <button
                  className="h-9 rounded-md border border-primary/50 text-primary text-sm font-semibold hover:bg-primary/10 transition"
                  onClick={importWholeAlbum}
                >
                  Enter all {sourceImages.length} Photo from original card
                </button>
              )}
              <div className="grid grid-cols-3 gap-2">
                {sourceImages.map((url) => (
                  <button
                    key={url}
                    className="relative aspect-square rounded-lg overflow-hidden border border-border hover:border-primary hover:shadow-md transition group"
                    onClick={() => applyImage(url)}
                    title={url}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    <span className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors grid place-items-center">
                      <ImagePlus className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              The original card does not have any photos — upload photos from your device below, or paste the URL.
            </p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files?.[0])}
          />
          <button
            className="h-9 rounded-md border border-primary/50 text-primary text-sm font-semibold hover:bg-primary/10 transition disabled:opacity-50 flex items-center justify-center gap-1.5"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading..." : "Upload photos from your device"}
          </button>

          <div className="flex gap-1.5">
            <input
              className="flex-1 h-9 px-3 rounded-md border border-border bg-background text-sm outline-none focus:border-primary/60"
              placeholder="https://... (paste the image URL)"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && urlDraft.trim()) {
                  applyImage(urlDraft.trim());
                  setUrlDraft("");
                }
                e.stopPropagation();
              }}
            />
            <button
              className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50"
              disabled={!urlDraft.trim()}
              onClick={() => {
                applyImage(urlDraft.trim());
                setUrlDraft("");
              }}
            >
              Use
            </button>
          </div>
        </div>

        {isGallery && (
          <div className="px-5 py-3 border-t border-border text-right">
            <button onClick={close} className="text-sm text-muted-foreground hover:text-foreground">
              Xong
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
