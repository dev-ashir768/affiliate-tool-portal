# Graph Report - affiliate-tool-portal  (2026-09-17)

## Corpus Check
- 180 files · ~225,017 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 912 nodes · 1558 edges · 75 communities (42 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e5fe088a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Portal Auth E2E — Design
- invite-member-dialog.tsx
- package.json
- components.json
- app-shell.tsx
- data-table.tsx
- app/layout.tsx
- compilerOptions
- dependencies
- data-table-toolbar.tsx
- members/route.ts
- Shopify-style App Shell Design
- Production DataTable Design
- data-table-pagination.tsx
- shadcn
- Slice 1 Task 6 Report: Login redirectTo + proxy area guards
- users-table.tsx
- eslint.config.mjs
- postcss.config.mjs
- Task 7 Report: Toolbar pieces (header, visibility, pagination, export, toolbar)
- File structure
- Task 10 Report: Manual verification pass
- Task 6 Report: DataTable types, empty/error/skeleton, download + page helpers
- Task 8 Report: Main DataTable (TanStack v9 + DnD + resize)
- Task 9 Report: Users columns + page wiring
- Task 1 Report: Dependencies, NuqsAdapter, shadcn primitives
- Steps Completed
- File structure
- Task 3 Report: Mock API routes (list + export)
- Task 4 Report: Client service + React Query hooks
- Task 5 Report: Zustand preferences store
- Final DataTable review fixes
- README.md
- task-10-brief.md
- AGENTS.md
- services/orgs.ts
- proxy.ts
- Tiksly Complete SaaS — Master Design (Portal)
- 2026-09-17-saas-slice-1-platform-nav.md
- devDependencies
- 2026-09-17-saas-slice-2-merchant-team.md
- Slice 1 Task 5 Report: Portal BFF navigation + useNavigation
- auth-wrapper.tsx
- badge.tsx
- Slice 1 Task 7 Report: Stub pages for new nav hrefs
- scripts
- members-table.tsx
- types/orgs.ts
- @tanstack/react-query
- InviteMemberDialog

## God Nodes (most connected - your core abstractions)
1. `react` - 35 edges
2. `cn` - 30 edges
3. `Button()` - 20 edges
4. `lucide-react` - 17 edges
5. `compilerOptions` - 16 edges
6. `ApiClientError` - 14 edges
7. `Production DataTable Design` - 14 edges
8. `apiFetch()` - 13 edges
9. `@tanstack/react-table` - 13 edges
10. `Task 10 Report: Manual verification pass` - 12 edges

## Surprising Connections (you probably didn't know these)
- `OrgSettingsForm()` --calls--> `useMe()`  [EXTRACTED]
  components/settings/org-settings-form.tsx → hooks/use-me.ts
- `AcceptInviteForm()` --calls--> `useMe()`  [EXTRACTED]
  components/invites/accept-invite-form.tsx → hooks/use-me.ts
- `onAcceptAsSession()` --calls--> `acceptInvite()`  [EXTRACTED]
  components/invites/accept-invite-form.tsx → services/orgs.ts
- `onSubmitNewUser()` --calls--> `acceptInvite()`  [EXTRACTED]
  components/invites/accept-invite-form.tsx → services/orgs.ts
- `useAcceptInvite()` --calls--> `acceptInvite()`  [EXTRACTED]
  hooks/use-accept-invite.ts → services/orgs.ts

## Import Cycles
- None detected.

## Communities (75 total, 8 thin omitted)

### Community 0 - "Portal Auth E2E — Design"
Cohesion: 0.33
Nodes (5): Changes, Decisions, Goal, Out of scope, Portal Auth E2E — Design

### Community 1 - "invite-member-dialog.tsx"
Cohesion: 0.07
Nodes (48): metadata, LoginForm(), onSubmit(), Props, Button(), buttonVariants, Card(), CardContent() (+40 more)

### Community 2 - "package.json"
Cohesion: 0.10
Nodes (19): name, private, version, @base-ui/react, eslint, eslint-config-next, exceljs, @hello-pangea/dnd (+11 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "app-shell.tsx"
Cohesion: 0.07
Nodes (28): Props, Props, AppPageHeader(), AppShell(), getDesktopServerSnapshot(), getDesktopSnapshot(), subscribeDesktop(), AppSidebar() (+20 more)

### Community 5 - "data-table.tsx"
Cohesion: 0.08
Nodes (30): DataTable(), DataTableComponentProps, DataTableHeaderCell(), DataTableEmpty(), Props, DataTableError(), Props, getAriaSort() (+22 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.07
Nodes (20): metadata, metadata, Props, metadata, geistMono, geistSans, metadata, spaceGrotesk (+12 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 8 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @base-ui/react, class-variance-authority, cn, exceljs, gsap, @gsap/react, @hello-pangea/dnd (+14 more)

### Community 9 - "data-table-toolbar.tsx"
Cohesion: 0.06
Nodes (38): cycleSorting(), DataTableColumnHeader(), DataTableColumnHeaderProps, DataTableColumnVisibility(), DataTableColumnVisibilityProps, getColumnLabel(), DataTableExport(), DataTableExportProps (+30 more)

### Community 10 - "members/route.ts"
Cohesion: 0.24
Nodes (11): filterMembers(), filterSortPaginateMembers(), GET(), mapMember(), parseParams(), runtime, SEARCH_FIELDS, SORT_FIELDS (+3 more)

### Community 11 - "Shopify-style App Shell Design"
Cohesion: 0.11
Nodes (17): Architecture, Component responsibilities, Data flow, Decisions (locked), Dummy content (v1), Goal, Layout grid, Loading / error (+9 more)

### Community 12 - "Production DataTable Design"
Cohesion: 0.09
Nodes (22): Accessibility, Architecture, Behavior details, Boundaries, Component API, Decisions (locked), Export — `GET /api/users/export`, Folder layout (+14 more)

### Community 13 - "data-table-pagination.tsx"
Cohesion: 0.15
Nodes (9): DataTablePagination(), DataTablePaginationProps, DEFAULT_PAGE_SIZE_OPTIONS, getPaginationItems(), PaginationItem, SelectContent(), SelectItem(), SelectTrigger() (+1 more)

### Community 15 - "Slice 1 Task 6 Report: Login redirectTo + proxy area guards"
Cohesion: 0.17
Nodes (11): Concerns, Files, Slice 1 Task 6 Report: Login redirectTo + proxy area guards, Step 1: `readAccessClaims` + env note, Step 2: BFF + forms, Step 3: `proxy.ts` area checks, Step 4: Manual E2E, Step 5: Commit (+3 more)

### Community 19 - "users-table.tsx"
Cohesion: 0.07
Nodes (44): GET(), runtime, GET(), parseParams(), runtime, columnHelper, createdAtFormatter, statusBadgeClass() (+36 more)

### Community 24 - "Task 7 Report: Toolbar pieces (header, visibility, pagination, export, toolbar)"
Cohesion: 0.11
Nodes (18): Concerns / Notes, Files Created, Fix, Minor, Post-Review Fix (search debounce sync), Problem, Self-Review, Step 1: Column header (sort cycle + drag handle) (+10 more)

### Community 25 - "File structure"
Cohesion: 0.12
Nodes (15): Execution handoff, File structure, Global Constraints, Production DataTable Implementation Plan, Self-review, Task 10: Manual verification pass, Task 1: Dependencies, NuqsAdapter, shadcn primitives, Task 2: Users types, mock data, and query helpers (+7 more)

### Community 26 - "Task 10 Report: Manual verification pass"
Cohesion: 0.13
Nodes (14): 1. Columns dropdown crash, 2. pageSize change left an empty page, Build / lint, Concerns / Notes, Export API (`GET /api/users/export`), Files changed (this task), Fixes (commit `95b27b7`), List API (`GET /api/users`) (+6 more)

### Community 27 - "Task 6 Report: DataTable types, empty/error/skeleton, download + page helpers"
Cohesion: 0.15
Nodes (12): Concerns / Notes, Files Created, Post-Review Fix: `downloadBlob` (Task 6 review), Self-Review, Step 1: Shared features + props types, Step 2: Download + pagination helpers, Step 3: Empty / Error / Skeleton, Step 4: Commit (+4 more)

### Community 28 - "Task 8 Report: Main DataTable (TanStack v9 + DnD + resize)"
Cohesion: 0.15
Nodes (12): Concerns / Notes, Files Created, Review follow-up: flexRender function headers, Self-Review, Step 1: Implement DataTable, Step 2: Barrel export, Step 3: Typecheck, Step 4: Commit (+4 more)

### Community 29 - "Task 9 Report: Users columns + page wiring"
Cohesion: 0.15
Nodes (12): Concerns / Notes, Files Created / Modified, Self-Review, Step 1: Columns, Step 2: UsersTable, Step 3: Page, Step 4: Typecheck + smoke, Step 5: Commit (+4 more)

### Community 30 - "Task 1 Report: Dependencies, NuqsAdapter, shadcn primitives"
Cohesion: 0.17
Nodes (11): Files Changed, Ready for Task 2, Self-Review, Step 1: Install packages, Step 2: Add shadcn Checkbox and Skeleton, Step 3: Wrap providers with NuqsAdapter, Step 4: Commit, Steps Completed (+3 more)

### Community 31 - "Steps Completed"
Cohesion: 0.17
Nodes (11): Files Created, Self-Review, Step 1: Write types, Step 2: Write mock dataset, Step 3: Write query helpers, Step 4: Write and run selfcheck, Step 5: Commit, Steps Completed (+3 more)

### Community 32 - "File structure"
Cohesion: 0.18
Nodes (10): File structure, Global Constraints, Placeholder / consistency review, Shopify-style App Shell Implementation Plan, Spec coverage checklist, Task 1: Types, JSON fixtures, and active-nav helpers, Task 2: Icon map + `useNavigation` hook, Task 3: Nav item + sidebar (+2 more)

### Community 33 - "Task 3 Report: Mock API routes (list + export)"
Cohesion: 0.18
Nodes (10): Concerns / Notes, Files Created, Self-Review, Step 1: List route, Step 2: Export route, Step 3: Smoke-test routes, Step 4: Commit, Steps Completed (+2 more)

### Community 34 - "Task 4 Report: Client service + React Query hooks"
Cohesion: 0.18
Nodes (10): Concerns / Notes, Files Created, Self-Review, Step 1: Service, Step 2: Hooks, Step 3: Commit, Steps Completed, Summary (+2 more)

### Community 35 - "Task 5 Report: Zustand preferences store"
Cohesion: 0.18
Nodes (10): Concerns / Notes, Files Created, Self-Review, Step 1: Store, Step 2: Hook, Step 3: Commit, Steps Completed, Summary (+2 more)

### Community 36 - "Final DataTable review fixes"
Cohesion: 0.25
Nodes (7): Also, Final DataTable review fixes, Important, Merge-blocking minors, Residual, Summary, Verification

### Community 37 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 44 - "services/orgs.ts"
Cohesion: 0.26
Nodes (7): OrgSettingsForm(), useOrg(), usePatchOrg(), fetchCurrentOrg(), patchCurrentOrg(), CreateInviteSchemaType, PatchCurrentOrgSchemaType

### Community 56 - "proxy.ts"
Cohesion: 0.06
Nodes (55): LoginResponse, POST(), POST(), GET(), POST(), RefreshResponse, POST(), RegisterResponse (+47 more)

### Community 64 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, shadcn, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+2 more)

### Community 66 - "Slice 1 Task 5 Report: Portal BFF navigation + useNavigation"
Cohesion: 0.18
Nodes (10): Concerns, Files, Slice 1 Task 5 Report: Portal BFF navigation + useNavigation, Step 1: BFF route, Step 2: Service + hook, Step 3: Types + icons, Step 4: Commit, Steps Completed (+2 more)

### Community 67 - "auth-wrapper.tsx"
Cohesion: 0.29
Nodes (5): Props, AuthWrapper(), Props, gsap, @gsap/react

### Community 68 - "badge.tsx"
Cohesion: 0.24
Nodes (5): Badge(), badgeVariants, TabsList(), tabsListVariants, class-variance-authority

### Community 69 - "Slice 1 Task 7 Report: Stub pages for new nav hrefs"
Cohesion: 0.29
Nodes (6): Files Created, Slice 1 Task 7 Report: Stub pages for new nav hrefs, Step 1: Add minimal placeholder pages, Step 2: Commit, Steps Completed, Summary

### Community 70 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 71 - "members-table.tsx"
Cohesion: 0.24
Nodes (8): MembersTable(), searchParamsParsers, SORT_FIELDS, useMembersQuery(), nuqs, fetchMembers(), toQuery(), MembersListParams

### Community 72 - "types/orgs.ts"
Cohesion: 0.24
Nodes (9): columnHelper, membersColumns, statusBadgeClass(), AcceptInviteResponse, CreateInviteResponse, OrganizationCurrent, OrgMember, OrgMemberRole (+1 more)

### Community 73 - "@tanstack/react-query"
Cohesion: 0.32
Nodes (7): AcceptInviteForm(), onAcceptAsSession(), onSubmitNewUser(), useAcceptInvite(), @tanstack/react-query, acceptInvite(), AcceptInviteSchemaType

### Community 74 - "InviteMemberDialog"
Cohesion: 0.40
Nodes (5): InviteMemberDialog(), handleOpenChange(), onSubmit(), resetDialogState(), createInvite()

## Knowledge Gaps
- **354 isolated node(s):** `Props`, `UpstreamMember`, `OrgMemberRole`, `DataTablePaginationProps`, `PaginationItem` (+349 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 491 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `invite-member-dialog.tsx` to `package.json`, `auth-wrapper.tsx`, `app-shell.tsx`, `data-table.tsx`, `app/layout.tsx`, `members-table.tsx`, `data-table-toolbar.tsx`, `data-table-pagination.tsx`, `users-table.tsx`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `cn` connect `invite-member-dialog.tsx` to `package.json`, `app-shell.tsx`, `data-table.tsx`, `badge.tsx`, `app/layout.tsx`, `types/orgs.ts`, `data-table-toolbar.tsx`, `data-table-pagination.tsx`, `users-table.tsx`, `progress.tsx`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `Props`, `UpstreamMember`, `OrgMemberRole` to the rest of the system?**
  _354 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `invite-member-dialog.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0680517916290274 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `components.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._