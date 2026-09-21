"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCampaign,
  createCreator,
  createCreatorList,
  addCreatorToList,
  deleteCreator,
  fetchCampaigns,
  fetchCreatorLists,
  fetchCreators,
  patchCampaign,
  patchCreator,
} from "@/services/creators";
import {
  createOutreachTemplate,
  fetchOutreachMessages,
  fetchOutreachTemplates,
  patchOutreachTemplate,
  sendOutreach,
} from "@/services/outreach";

export function useCreators() {
  return useQuery({
    queryKey: ["creators"],
    queryFn: ({ signal }) => fetchCreators(signal),
    retry: false,
  });
}

export function useCreateCreator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCreator,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["creators"] }),
  });
}

export function usePatchCreator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Parameters<typeof patchCreator>[1];
    }) => patchCreator(id, body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["creators"] }),
  });
}

export function useDeleteCreator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCreator,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["creators"] }),
  });
}

export function useCreatorLists() {
  return useQuery({
    queryKey: ["creators", "lists"],
    queryFn: ({ signal }) => fetchCreatorLists(signal),
    retry: false,
  });
}

export function useCreateCreatorList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCreatorList,
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["creators", "lists"] }),
  });
}

export function useAddCreatorToList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      listId,
      creatorId,
    }: {
      listId: string;
      creatorId: string;
    }) => addCreatorToList(listId, creatorId),
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["creators", "lists"] }),
  });
}

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: ({ signal }) => fetchCampaigns(signal),
    retry: false,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}

export function usePatchCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Parameters<typeof patchCampaign>[1];
    }) => patchCampaign(id, body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}

export function useOutreachTemplates() {
  return useQuery({
    queryKey: ["outreach", "templates"],
    queryFn: ({ signal }) => fetchOutreachTemplates(signal),
    retry: false,
  });
}

export function useCreateOutreachTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createOutreachTemplate,
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["outreach", "templates"] }),
  });
}

export function usePatchOutreachTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Parameters<typeof patchOutreachTemplate>[1];
    }) => patchOutreachTemplate(id, body),
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ["outreach", "templates"] }),
  });
}

export function useOutreachMessages() {
  return useQuery({
    queryKey: ["outreach", "messages"],
    queryFn: ({ signal }) => fetchOutreachMessages(signal),
    retry: false,
  });
}

export function useSendOutreach() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sendOutreach,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["outreach", "messages"] });
      void qc.invalidateQueries({ queryKey: ["creators"] });
    },
  });
}
