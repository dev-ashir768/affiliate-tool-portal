"use client";

import { useMutation } from "@tanstack/react-query";
import { acceptInvite } from "@/services/orgs";
import type { AcceptInviteSchemaType } from "@/validations/org.validations";

export function useAcceptInvite(token: string) {
  return useMutation({
    mutationFn: (body: AcceptInviteSchemaType = {}) =>
      acceptInvite(token, body),
  });
}
