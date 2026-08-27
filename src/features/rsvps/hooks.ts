import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rsvpKeys } from "./queryKeys";
import {
  cancelRsvp,
  getRsvpStatistics,
  listRsvps,
  updateRsvp,
  type RsvpUpdateInput,
} from "@/lib/rsvps";

export function useRsvpsQuery(invitationId: string, page: number, pageSize = 20) {
  return useQuery({
    queryKey: rsvpKeys.list(invitationId, page, pageSize),
    queryFn: () => listRsvps(invitationId, page, pageSize),
    enabled: Boolean(invitationId),
    placeholderData: (previous) => previous,
  });
}

export function useRsvpStatisticsQuery(invitationId: string) {
  return useQuery({
    queryKey: rsvpKeys.statistics(invitationId),
    queryFn: () => getRsvpStatistics(invitationId),
    enabled: Boolean(invitationId),
  });
}

export function useUpdateRsvpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ rsvpId, input }: { rsvpId: string; input: RsvpUpdateInput }) => updateRsvp(rsvpId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rsvpKeys.all }),
  });
}

export function useCancelRsvpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rsvpId: string) => cancelRsvp(rsvpId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rsvpKeys.all }),
  });
}
