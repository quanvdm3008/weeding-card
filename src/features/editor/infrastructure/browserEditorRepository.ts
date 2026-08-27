import {
  CARD_STUDIO_DRAFT_KEY,
  getCardDocument,
  listCardDocumentVersions,
  restoreCardDocumentVersion,
  saveCardDocument,
  type CardDocumentDto,
} from "@/lib/cardDocument";
import {
  createInvitation,
  getInvitation,
  publishInvitation,
  updateInvitation,
} from "@/lib/invitations";
import { parseCardDocument, serializeCardDocument } from "@/features/card-studio/schema/schema";
import type { GuidedInvitationConfig } from "../domain/types";
import {
  documentToGuidedConfig,
  guidedConfigToInvitationDocument,
  invitationDtoToDocument,
  invitationDtoToGuidedConfig,
  parseInvitationDocument,
  serializeInvitationDocument,
  withCanvasDocument,
  type EditorInvitationDocument,
} from "../domain/adapters";
import type { EditorRepository, EditorSaveResult } from "../application/EditorRepository";

export const EDITOR_DRAFT_KEY = "mireia-editor-document-draft";

export interface EditorApiGateway {
  getInvitation: typeof getInvitation;
  createInvitation: typeof createInvitation;
  updateInvitation: typeof updateInvitation;
  publishInvitation: typeof publishInvitation;
  getCardDocument: typeof getCardDocument;
  saveCardDocument: typeof saveCardDocument;
  listCardDocumentVersions: typeof listCardDocumentVersions;
  restoreCardDocumentVersion: typeof restoreCardDocumentVersion;
}

const defaultGateway: EditorApiGateway = {
  getInvitation,
  createInvitation,
  updateInvitation,
  publishInvitation,
  getCardDocument,
  saveCardDocument,
  listCardDocumentVersions,
  restoreCardDocumentVersion,
};

export class BrowserEditorRepository implements EditorRepository {
  constructor(
    private readonly gateway: EditorApiGateway = defaultGateway,
    private readonly storage: Pick<Storage, "getItem" | "setItem" | "removeItem"> | null =
      typeof window === "undefined" ? null : window.localStorage,
  ) {}

  async load(invitationId: string) {
    const [invitation, cardDto] = await Promise.all([
      this.gateway.getInvitation(invitationId),
      this.gateway.getCardDocument(invitationId).catch(() => null),
    ]);
    const canvas = parseCardDocument(cardDto?.document);
    const document = invitationDtoToDocument(invitation, canvas);
    if (cardDto?.version) document.metadata.serverVersion = cardDto.version;
    return document;
  }

  loadDraft(fallback: GuidedInvitationConfig) {
    const unifiedDraft = parseInvitationDocument(this.storage?.getItem(EDITOR_DRAFT_KEY));
    if (unifiedDraft) return unifiedDraft;
    const legacyCanvas = parseCardDocument(this.storage?.getItem(CARD_STUDIO_DRAFT_KEY));
    return guidedConfigToInvitationDocument(fallback, { canvas: legacyCanvas });
  }

  saveDraft(document: EditorInvitationDocument) {
    this.storage?.setItem(EDITOR_DRAFT_KEY, serializeInvitationDocument(document));
    if (document.canvas) {
      this.storage?.setItem(CARD_STUDIO_DRAFT_KEY, serializeCardDocument(document.canvas));
    }
  }

  async save(document: EditorInvitationDocument, workspace: "guided" | "canvas"): Promise<EditorSaveResult> {
    if (workspace === "canvas") return this.saveCanvas(document);
    return this.saveGuided(document);
  }

  async publish(document: EditorInvitationDocument, slug?: string): Promise<EditorSaveResult> {
    const saved = await this.saveGuided(document);
    if (!saved.invitationId) throw new Error("Invitation must exist before publishing");
    if (saved.document.canvas) {
      const cardDto = await this.gateway.saveCardDocument(
        saved.invitationId,
        serializeCardDocument(saved.document.canvas),
        saved.document.metadata.serverVersion,
      );
      saved.document.metadata.serverVersion = cardDto.version;
      saved.serverVersion = cardDto.version;
    }
    const published = await this.gateway.publishInvitation(saved.invitationId, slug);
    const next = guidedConfigToInvitationDocument(invitationDtoToGuidedConfig(published), {
      existing: saved.document,
      canvas: saved.document.canvas,
      source: "existing",
    });
    next.invitationId = published.id;
    next.guided.invitationId = published.id;
    this.clearDrafts();
    return { document: next, invitationId: published.id, serverVersion: saved.serverVersion };
  }

  listVersions(invitationId: string) {
    return this.gateway.listCardDocumentVersions(invitationId);
  }

  async restoreVersion(invitationId: string, version: number) {
    const dto = await this.gateway.restoreCardDocumentVersion(invitationId, version);
    const document = parseCardDocument(dto.document);
    if (!document) throw new Error("Invalid card document returned by version restore");
    return document;
  }

  private async saveGuided(document: EditorInvitationDocument): Promise<EditorSaveResult> {
    const config = documentToGuidedConfig(document);
    const dto = document.invitationId
      ? await this.gateway.updateInvitation(document.invitationId, config)
      : await this.gateway.createInvitation(config);
    const next = guidedConfigToInvitationDocument(invitationDtoToGuidedConfig(dto), {
      existing: document,
      canvas: document.canvas,
      source: "existing",
    });
    next.invitationId = dto.id;
    next.guided.invitationId = dto.id;
    this.storage?.setItem(EDITOR_DRAFT_KEY, serializeInvitationDocument(next));
    return { document: next, invitationId: dto.id, serverVersion: next.metadata.serverVersion };
  }

  private async saveCanvas(document: EditorInvitationDocument): Promise<EditorSaveResult> {
    if (!document.canvas) return { document, invitationId: document.invitationId };
    if (!document.invitationId) {
      this.saveDraft(document);
      return { document, invitationId: null };
    }
    const dto: CardDocumentDto = await this.gateway.saveCardDocument(
      document.invitationId,
      serializeCardDocument(document.canvas),
      document.metadata.serverVersion,
    );
    const next = withCanvasDocument(document, document.canvas);
    next.metadata.serverVersion = dto.version;
    return { document: next, invitationId: document.invitationId, serverVersion: dto.version };
  }

  private clearDrafts() {
    this.storage?.removeItem(EDITOR_DRAFT_KEY);
    this.storage?.removeItem(CARD_STUDIO_DRAFT_KEY);
  }
}

export const editorRepository = new BrowserEditorRepository();
