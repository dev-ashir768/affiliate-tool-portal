"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchConversationMessages,
  fetchConversations,
  markConversationsRead,
  openConversation,
  sendImMessage,
} from "@/services/messages";

export function useConversations(shopId: string | null) {
  return useQuery({
    queryKey: ["messages", "conversations", shopId],
    queryFn: ({ signal }) => fetchConversations(shopId!, { signal }),
    enabled: Boolean(shopId),
    retry: false,
  });
}

export function useConversationMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ["messages", "thread", conversationId],
    queryFn: ({ signal }) =>
      fetchConversationMessages(conversationId!, { signal }),
    enabled: Boolean(conversationId),
    retry: false,
    refetchInterval: conversationId ? 15_000 : false,
  });
}

export function useOpenConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: openConversation,
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: ["messages", "conversations"] });
      void qc.invalidateQueries({
        queryKey: ["messages", "thread", data.conversation.id],
      });
    },
  });
}

export function useSendImMessage(conversationId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => {
      if (!conversationId) throw new Error("No conversation selected");
      return sendImMessage(conversationId, text);
    },
    onSuccess: () => {
      if (conversationId) {
        void qc.invalidateQueries({
          queryKey: ["messages", "thread", conversationId],
        });
      }
      void qc.invalidateQueries({ queryKey: ["messages", "conversations"] });
    },
  });
}

export function useMarkConversationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markConversationsRead,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["messages", "conversations"] });
    },
  });
}
