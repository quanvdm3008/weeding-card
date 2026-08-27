import type { CardDocument } from "@/features/card-studio/schema/types";
import type { CardDocumentVersionDto } from "@/lib/cardDocument";
import type { GuidedInvitationConfig } from "../domain/types";
import type { EditorInvitationDocument } from "../domain/adapters";

export interface EditorSaveResult {
  document: EditorInvitationDocument;
  invitationId: string | null;
  serverVersion?: number;
}

export interface EditorRepository {
  load(invitationId: string): Promise<EditorInvitationDocument>;
  loadDraft(fallback: GuidedInvitationConfig): EditorInvitationDocument;
  saveDraft(document: EditorInvitationDocument): void;
  save(document: EditorInvitationDocument, workspace: "guided" | "canvas"): Promise<EditorSaveResult>;
  publish(document: EditorInvitationDocument, slug?: string): Promise<EditorSaveResult>;
  listVersions(invitationId: string): Promise<CardDocumentVersionDto[]>;
  restoreVersion(invitationId: string, version: number): Promise<CardDocument>;
}
