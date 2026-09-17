"use client";

import { useMutation } from "@tanstack/react-query";
import {
  createCheckoutSession,
  createPortalSession,
} from "@/services/billing";
import type { CheckoutSessionSchemaType } from "@/validations/billing.validations";

export function useCheckoutSession() {
  return useMutation({
    mutationFn: (body: CheckoutSessionSchemaType) => createCheckoutSession(body),
  });
}

export function usePortalSession() {
  return useMutation({
    mutationFn: () => createPortalSession(),
  });
}
