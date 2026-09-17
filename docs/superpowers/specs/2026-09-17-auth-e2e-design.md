# Portal Auth E2E — Design

Date: 2026-09-17  
Status: Approved for implementation  
Scope: Activate session protection, `/api/auth/me` BFF, topbar from real user

## Goal

Complete Auth E2E so the portal consumes Foundation API sessions: protected routes via Next.js 16 `proxy.ts`, Bearer-authenticated `/me`, topbar shows live user.

## Decisions

| Decision | Choice |
|----------|--------|
| Slice | Auth E2E only |
| Architecture | Existing cookie BFF + `proxy.ts` (not client-direct) |
| Route guard | Root `proxy.ts` (Next.js 16 convention; no `middleware.ts`) |
| User display | `useMe` → `GET /api/auth/me` → backend `/api/v1/auth/me` |

## Changes

1. Extend `apiFetch` with optional `accessToken` → `Authorization: Bearer`
2. `GET /api/auth/me` BFF using cookie access token
3. `types/auth.ts`, `services/auth.ts`, `hooks/use-me.ts`
4. Topbar: name, email, initials from `useMe`; fallback while loading
5. Confirm `proxy.ts` matcher covers dashboard + backoffice (already present)

## Out of scope

Forgot-password, users/members table, shops UI, navigation API.
