import type { InvitationDto } from "@/lib/invitations";
import { invitationDtoToConfig } from "@/lib/invitations";
import { resolveBuilderConfig, resolveInvitationContentConfig } from "@/lib/builderConfig";
import type { CardDocument } from "@/features/card-studio/schema/types";
import type { GuidedInvitationConfig, InvitationDocument } from "./types";
import { INVITATION_DOCUMENT_VERSION } from "./types";

export type EditorInvitationDocument = InvitationDocument<CardDocument>;

function createDocumentId(invitationId?: string | null) {
  if (invitationId) return `invitation-${invitationId}`;
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `draft-${Date.now().toString(36)}`;
}

export function guidedConfigToInvitationDocument(
  guided: GuidedInvitationConfig,
  options: {
    canvas?: CardDocument | null;
    activeWorkspace?: EditorInvitationDocument["activeWorkspace"];
    source?: EditorInvitationDocument["metadata"]["source"];
    existing?: EditorInvitationDocument | null;
  } = {},
): EditorInvitationDocument {
  const now = new Date().toISOString();
  const invitationId = guided.invitationId || null;
  return {
    schemaVersion: INVITATION_DOCUMENT_VERSION,
    id: options.existing?.id ?? createDocumentId(invitationId),
    invitationId,
    name: `${guided.groomName} & ${guided.brideName}`,
    activeWorkspace: options.activeWorkspace ?? options.existing?.activeWorkspace ?? "guided",
    guided: structuredClone(guided),
    canvas: options.canvas === undefined ? options.existing?.canvas ?? null : structuredClone(options.canvas),
    metadata: {
      createdAt: options.existing?.metadata.createdAt ?? now,
      updatedAt: now,
      source: options.source ?? options.existing?.metadata.source ?? (invitationId ? "existing" : "blank"),
      templateVersion: options.existing?.metadata.templateVersion,
      serverVersion: options.existing?.metadata.serverVersion,
    },
  };
}

export function invitationDtoToDocument(
  dto: InvitationDto,
  canvas: CardDocument | null = null,
): EditorInvitationDocument {
  return guidedConfigToInvitationDocument(invitationDtoToGuidedConfig(dto), {
    canvas,
    source: "existing",
  });
}

export function invitationDtoToGuidedConfig(dto: InvitationDto): GuidedInvitationConfig {
  const config = invitationDtoToConfig(dto);
  const builder = resolveBuilderConfig(dto.builderConfig, dto.extraInfoContent);
  const content = resolveInvitationContentConfig(dto.contentConfig, dto.builderConfig, dto.extraInfoContent);
  return {
    ...config,
    ...builder.config,
    ...content,
    extraInfoContent: builder.content,
    date: config.date ?? "",
    time: config.time ?? "",
    venue: config.venue ?? "",
    address: config.address ?? "",
  } as GuidedInvitationConfig;
}

export function documentToGuidedConfig(document: EditorInvitationDocument): GuidedInvitationConfig {
  return structuredClone({
    ...document.guided,
    invitationId: document.invitationId ?? document.guided.invitationId,
  });
}

export function withCanvasDocument(
  document: EditorInvitationDocument,
  canvas: CardDocument | null,
): EditorInvitationDocument {
  return {
    ...document,
    canvas: canvas ? structuredClone(canvas) : null,
    metadata: { ...document.metadata, updatedAt: new Date().toISOString() },
  };
}

export function withActiveWorkspace(
  document: EditorInvitationDocument,
  activeWorkspace: EditorInvitationDocument["activeWorkspace"],
): EditorInvitationDocument {
  if (document.activeWorkspace === activeWorkspace) return document;
  return {
    ...document,
    activeWorkspace,
    metadata: { ...document.metadata, updatedAt: new Date().toISOString() },
  };
}

export function serializeInvitationDocument(document: EditorInvitationDocument) {
  return JSON.stringify(document);
}

export function parseInvitationDocument(raw: string | null | undefined): EditorInvitationDocument | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<EditorInvitationDocument>;
    if (
      parsed.schemaVersion !== INVITATION_DOCUMENT_VERSION
      || !parsed.id
      || !parsed.guided
      || !parsed.metadata
    ) return null;
    return parsed as EditorInvitationDocument;
  } catch {
    return null;
  }
}
