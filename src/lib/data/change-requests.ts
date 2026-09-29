import "server-only";
import { createItem, readItems, updateItem } from "@directus/sdk";
import { directus } from "@/lib/directus/client";
import { stripNulls } from "@/lib/directus/normalize";
import {
  changeRequestSchema,
  type ChangeRequest,
  type ChangeRequestAction,
  type ChangeRequestStatus,
  type FavoriteSubjectKind,
} from "@/lib/schemas";

/** Every change request awaiting admin review, oldest first. */
export async function getPendingChangeRequests(): Promise<ChangeRequest[]> {
  const items = await directus.request(
    readItems("change_requests", {
      filter: { status: { _eq: "pending" } },
      sort: ["createdAt"],
      limit: -1,
    }),
  );
  return changeRequestSchema.array().parse(stripNulls(items));
}

export async function updateChangeRequestStatus(
  id: string,
  status: ChangeRequestStatus,
): Promise<void> {
  await directus.request(updateItem("change_requests", id, { status }));
}

export async function createChangeRequest(input: {
  subjectKind: FavoriteSubjectKind;
  subjectId: string;
  action: ChangeRequestAction;
  reason: string;
  reporterName?: string;
  reporterEmail?: string;
}): Promise<ChangeRequest> {
  const item = await directus.request(
    createItem("change_requests", {
      subjectKind: input.subjectKind,
      subjectId: input.subjectId,
      action: input.action,
      reason: input.reason,
      reporterName: input.reporterName,
      reporterEmail: input.reporterEmail,
      status: "pending",
      createdAt: new Date().toISOString(),
    }),
  );
  return changeRequestSchema.parse(stripNulls(item));
}
