"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  useAddCreatorToList,
  useCreateCreator,
  useCreateCreatorList,
  useCreatorLists,
  useCreators,
  useDeleteCreator,
  usePatchCreator,
} from "@/hooks/use-creators";
import type { CreatorStage } from "@/types/creators";

const STAGES: CreatorStage[] = [
  "LEAD",
  "CONTACTED",
  "INVITED",
  "ACTIVE",
  "REJECTED",
];

export function CreatorsPageContent() {
  const creatorsQuery = useCreators();
  const listsQuery = useCreatorLists();
  const create = useCreateCreator();
  const patch = usePatchCreator();
  const remove = useDeleteCreator();
  const createList = useCreateCreatorList();
  const addToList = useAddCreatorToList();
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [listName, setListName] = useState("");

  async function onAddCreator(e: React.FormEvent) {
    e.preventDefault();
    if (!handle.trim()) return;
    try {
      await create.mutateAsync({
        handle: handle.trim(),
        contactEmail: email.trim() || null,
      });
      setHandle("");
      setEmail("");
      toast.success("Creator added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add");
    }
  }

  async function onAddList(e: React.FormEvent) {
    e.preventDefault();
    if (!listName.trim()) return;
    try {
      await createList.mutateAsync({ name: listName.trim() });
      setListName("");
      toast.success("List created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create list");
    }
  }

  if (creatorsQuery.isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  const creators = creatorsQuery.data?.creators ?? [];
  const lists = listsQuery.data?.lists ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Creators</h1>
        <p className="text-sm text-muted-foreground">
          Manual CRM for TikTok Shop creators. Add a contact email to enable
          outreach.
        </p>
      </div>

      <form
        onSubmit={(e) => void onAddCreator(e)}
        className="flex flex-wrap items-end gap-2"
      >
        <div className="min-w-[10rem] flex-1 space-y-1">
          <label htmlFor="creator-handle" className="text-xs text-muted-foreground">
            Handle
          </label>
          <Input
            id="creator-handle"
            placeholder="@creator"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
          />
        </div>
        <div className="min-w-[12rem] flex-1 space-y-1">
          <label htmlFor="creator-email" className="text-xs text-muted-foreground">
            Contact email
          </label>
          <Input
            id="creator-email"
            type="email"
            placeholder="optional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={create.isPending}>
          {create.isPending ? "Adding…" : "Add creator"}
        </Button>
      </form>

      {creatorsQuery.isError ? (
        <p className="text-sm text-destructive" role="alert">
          {creatorsQuery.error instanceof Error
            ? creatorsQuery.error.message
            : "Unable to load creators"}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-left text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Handle</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Stage</th>
              <th className="px-3 py-2 font-medium">List</th>
              <th className="px-3 py-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {creators.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-8 text-center text-muted-foreground"
                >
                  No creators yet.
                </td>
              </tr>
            ) : (
              creators.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 font-medium">@{c.handle}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {c.contactEmail ?? "—"}
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                      value={c.stage}
                      onChange={(e) => {
                        void patch
                          .mutateAsync({
                            id: c.id,
                            body: { stage: e.target.value },
                          })
                          .then(() => toast.success("Stage updated"))
                          .catch((err) =>
                            toast.error(
                              err instanceof Error
                                ? err.message
                                : "Update failed",
                            ),
                          );
                      }}
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    {lists.length === 0 ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <select
                        className="max-w-[9rem] rounded-md border border-border bg-background px-2 py-1 text-xs"
                        defaultValue=""
                        onChange={(e) => {
                          const listId = e.target.value;
                          if (!listId) return;
                          void addToList
                            .mutateAsync({ listId, creatorId: c.id })
                            .then(() => toast.success("Added to list"))
                            .catch((err) =>
                              toast.error(
                                err instanceof Error
                                  ? err.message
                                  : "Add failed",
                              ),
                            );
                          e.target.value = "";
                        }}
                      >
                        <option value="">Add to…</option>
                        {lists.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={remove.isPending}
                      onClick={() => {
                        void remove
                          .mutateAsync(c.id)
                          .then(() => toast.success("Removed"))
                          .catch((err) =>
                            toast.error(
                              err instanceof Error
                                ? err.message
                                : "Delete failed",
                            ),
                          );
                      }}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Lists</h2>
        <form
          onSubmit={(e) => void onAddList(e)}
          className="flex flex-wrap items-end gap-2"
        >
          <Input
            placeholder="List name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className="max-w-xs"
          />
          <Button type="submit" variant="outline" disabled={createList.isPending}>
            Create list
          </Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {lists.map((l) => (
            <Badge key={l.id} variant="outline" className="rounded-md px-2.5 py-1">
              {l.name} · {l.memberCount}
            </Badge>
          ))}
          {lists.length === 0 ? (
            <p className="text-sm text-muted-foreground">No lists yet.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
