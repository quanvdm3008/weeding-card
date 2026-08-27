import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { guestKeys } from "./queryKeys";
import {
  checkInGuest,
  createGuest,
  createGuestGroup,
  createGuestTag,
  deleteGuest,
  deleteGuestGroup,
  deleteGuestTag,
  getAttendanceSummary,
  importGuests,
  listGuestGroups,
  listGuestTags,
  listGuests,
  updateGuest,
  updateGuestGroup,
  updateGuestTag,
  type GuestImportRowInput,
  type GuestInput,
  type GuestSearchParams,
  type GuestStatus,
} from "@/lib/guests";

export function useGuestsQuery(invitationId: string, params: GuestSearchParams) {
  return useQuery({
    queryKey: guestKeys.list(invitationId, params),
    queryFn: () => listGuests(invitationId, params),
    enabled: Boolean(invitationId),
    placeholderData: (previous) => previous,
  });
}

export function useGuestGroupsQuery(invitationId: string) {
  return useQuery({
    queryKey: guestKeys.groups(invitationId),
    queryFn: () => listGuestGroups(invitationId),
    enabled: Boolean(invitationId),
  });
}

export function useGuestTagsQuery(invitationId: string) {
  return useQuery({
    queryKey: guestKeys.tags(invitationId),
    queryFn: () => listGuestTags(invitationId),
    enabled: Boolean(invitationId),
  });
}

export function useCreateGuestMutation(invitationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: GuestInput) => createGuest(invitationId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: guestKeys.all }),
  });
}

export function useUpdateGuestMutation(_invitationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ guestId, input }: { guestId: string; input: GuestInput & { status: GuestStatus } }) =>
      updateGuest(guestId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: guestKeys.all }),
  });
}

export function useDeleteGuestMutation(_invitationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (guestId: string) => deleteGuest(guestId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: guestKeys.all }),
  });
}

export function useImportGuestsMutation(invitationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rows: GuestImportRowInput[]) => importGuests(invitationId, rows),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: guestKeys.all }),
  });
}

export function useCreateGuestGroupMutation(invitationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createGuestGroup(invitationId, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: guestKeys.groups(invitationId) }),
  });
}

export function useUpdateGuestGroupMutation(invitationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, name }: { groupId: string; name: string }) => updateGuestGroup(groupId, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: guestKeys.groups(invitationId) }),
  });
}

export function useDeleteGuestGroupMutation(invitationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => deleteGuestGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guestKeys.groups(invitationId) });
      queryClient.invalidateQueries({ queryKey: guestKeys.all });
    },
  });
}

export function useCreateGuestTagMutation(invitationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, color }: { name: string; color: string }) => createGuestTag(invitationId, name, color),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: guestKeys.tags(invitationId) }),
  });
}

export function useUpdateGuestTagMutation(invitationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tagId, name, color }: { tagId: string; name: string; color: string }) => updateGuestTag(tagId, name, color),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: guestKeys.tags(invitationId) }),
  });
}

export function useDeleteGuestTagMutation(invitationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tagId: string) => deleteGuestTag(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guestKeys.tags(invitationId) });
      queryClient.invalidateQueries({ queryKey: guestKeys.all });
    },
  });
}

export function useAttendanceSummaryQuery(invitationId: string) {
  return useQuery({
    queryKey: guestKeys.attendance(invitationId),
    queryFn: () => getAttendanceSummary(invitationId),
    enabled: Boolean(invitationId),
  });
}

export function useCheckInGuestMutation(invitationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (guestId: string) => checkInGuest(guestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guestKeys.all });
      queryClient.invalidateQueries({ queryKey: guestKeys.attendance(invitationId) });
    },
  });
}
