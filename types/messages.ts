export type CreatorConversation = {
  id: string;
  shopId: string;
  shopDisplayName: string | null;
  shopRegion: string | null;
  creatorId: string | null;
  creatorHandle: string | null;
  creatorDisplayName: string | null;
  externalConversationId: string;
  creatorImId: string | null;
  creatorUsername: string | null;
  avatarUrl: string | null;
  unreadCount: number;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreatorImMessage = {
  id: string;
  externalMessageId: string | null;
  direction: string;
  msgType: string;
  contentText: string | null;
  contentRaw: string | null;
  senderImId: string | null;
  status: string;
  lastError: string | null;
  sentAt: string | null;
  createdAt: string;
};
