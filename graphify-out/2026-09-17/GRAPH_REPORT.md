# Graph Report - affiliate-tool-portal  (2026-09-17)

## Corpus Check
- 229 files · ~234,107 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1229 nodes · 2346 edges · 90 communities (58 shown, 13 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `575e6281`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Portal Auth E2E — Design
- react
- package.json
- components.json
- app-shell.tsx
- data-table.tsx
- app/layout.tsx
- compilerOptions
- dependencies
- cn
- Slice 2 Task 3 Report: Team DataTable + invite dialog
- Shopify-style App Shell Design
- Production DataTable Design
- button.tsx
- shadcn
- Slice 1 Task 6 Report: Login redirectTo + proxy area guards
- services/orgs.ts
- devDependencies
- auth-wrapper.tsx
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
- tabs.tsx
- api.ts
- Tiksly Complete SaaS — Master Design (Portal)
- 2026-09-17-saas-slice-1-platform-nav.md
- billing-page-content.tsx
- scripts
- 2026-09-17-saas-slice-2-merchant-team.md
- use-shops.ts
- app-topbar.tsx
- Slice 2 Task 1 Report: Authenticated BFF helper + org current GET/PATCH
- Slice 1 Task 5 Report: Portal BFF navigation + useNavigation
- platform-shops-table.tsx
- Slice 2 Task 2 Report: Members list BFF + client hooks
- Slice 1 Task 7 Report: Stub pages for new nav hrefs
- use-platform.ts
- 2026-09-17-saas-slice-3-merchant-billing.md
- Slice 2 Task 4 Report: Accept invite page + BFF
- Slice 2 Task 2 — Members list BFF + client hooks
- Slice 2 Task 5 Report: Org settings form
- Slice 2 Task 3 — Team page DataTable + invite dialog
- Slice 2 Task 4 — Accept invite page
- dropdown-menu.tsx
- Slice 2 Task 5 — Org settings form on `/settings`
- 2026-09-17-saas-slice-4-merchant-shops.md
- Slice 2 Task 1 Spec Review: Org current BFF
- Slice 2 Task 2 Spec Review: Members BFF + hooks
- Slice 2 Task 3 Spec Review: Team page + invites
- Slice 2 Task 4 Spec Review: Accept invite
- Slice 2 Task 5 Spec Review: Org settings form
- slice2-task-1-brief.md
- 2026-09-17-saas-slice-5-backoffice.md
- theme-toggle.tsx
- 2026-09-17-saas-slice-6-hardening.md

## God Nodes (most connected - your core abstractions)
1. `react` - 48 edges
2. `cn` - 34 edges
3. `Button()` - 26 edges
4. `ApiClientError` - 24 edges
5. `authenticatedApiFetch()` - 21 edges
6. `lucide-react` - 19 edges
7. `platformErrorResponse()` - 18 edges
8. `@tanstack/react-table` - 17 edges
9. `useMe()` - 16 edges
10. `apiFetch()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `BillingCancelPage()` --calls--> `buttonVariants`  [EXTRACTED]
  app/(dashboard)/billing/cancel/page.tsx → components/ui/button.tsx
- `BillingSuccessPage()` --calls--> `buttonVariants`  [EXTRACTED]
  app/(dashboard)/billing/success/page.tsx → components/ui/button.tsx
- `POST()` --calls--> `setSessionCookies()`  [EXTRACTED]
  app/api/auth/login/route.ts → lib/auth/session.ts
- `GET()` --calls--> `getAccessToken()`  [EXTRACTED]
  app/api/auth/me/route.ts → lib/auth/session.ts
- `POST()` --calls--> `setSessionCookies()`  [EXTRACTED]
  app/api/auth/register/route.ts → lib/auth/session.ts

## Import Cycles
- None detected.

## Communities (90 total, 13 thin omitted)

### Community 0 - "Portal Auth E2E — Design"
Cohesion: 0.33
Nodes (5): Changes, Decisions, Goal, Out of scope, Portal Auth E2E — Design

### Community 1 - "react"
Cohesion: 0.05
Nodes (54): metadata, LoginForm(), onSubmit(), ResetPasswordForm(), ResetPasswordFormInner(), Props, OrgSettingsForm(), ConnectShopDialogProps (+46 more)

### Community 2 - "package.json"
Cohesion: 0.11
Nodes (18): name, private, version, @base-ui/react, eslint, eslint-config-next, @hello-pangea/dnd, @hookform/resolvers (+10 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "app-shell.tsx"
Cohesion: 0.07
Nodes (28): Props, Props, AppPageHeader(), AppShell(), getDesktopServerSnapshot(), getDesktopSnapshot(), subscribeDesktop(), AppSidebar() (+20 more)

### Community 5 - "data-table.tsx"
Cohesion: 0.07
Nodes (35): PlatformShopsTable(), DataTable(), DataTableComponentProps, DataTableHeaderCell(), DataTableEmpty(), Props, DataTableError(), Props (+27 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.06
Nodes (20): metadata, metadata, Props, metadata, geistMono, geistSans, metadata, spaceGrotesk (+12 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 8 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @base-ui/react, class-variance-authority, cn, exceljs, gsap, @gsap/react, @hello-pangea/dnd (+14 more)

### Community 9 - "cn"
Cohesion: 0.22
Nodes (10): DataTableToolbarProps, ICONS, NavIcon(), SidebarNavItem(), Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger() (+2 more)

### Community 10 - "Slice 2 Task 3 Report: Team DataTable + invite dialog"
Cohesion: 0.17
Nodes (11): Concerns, Files Touched, Slice 2 Task 3 Report: Team DataTable + invite dialog, Step 1: Invites BFF POST, Step 2: Columns + table, Step 3: Invite dialog, Step 4: Team page, Step 5: Commit (+3 more)

### Community 11 - "Shopify-style App Shell Design"
Cohesion: 0.11
Nodes (17): Architecture, Component responsibilities, Data flow, Decisions (locked), Dummy content (v1), Goal, Layout grid, Loading / error (+9 more)

### Community 12 - "Production DataTable Design"
Cohesion: 0.09
Nodes (22): Accessibility, Architecture, Behavior details, Boundaries, Component API, Decisions (locked), Export — `GET /api/users/export`, Folder layout (+14 more)

### Community 13 - "button.tsx"
Cohesion: 0.25
Nodes (6): DataTablePagination(), DataTablePaginationProps, DEFAULT_PAGE_SIZE_OPTIONS, getPaginationItems(), PaginationItem, Button()

### Community 15 - "Slice 1 Task 6 Report: Login redirectTo + proxy area guards"
Cohesion: 0.17
Nodes (11): Concerns, Files, Slice 1 Task 6 Report: Login redirectTo + proxy area guards, Step 1: `readAccessClaims` + env note, Step 2: BFF + forms, Step 3: `proxy.ts` area checks, Step 4: Manual E2E, Step 5: Commit (+3 more)

### Community 16 - "services/orgs.ts"
Cohesion: 0.06
Nodes (42): runtime, filterMembers(), filterSortPaginateMembers(), GET(), mapMember(), parseParams(), runtime, SEARCH_FIELDS (+34 more)

### Community 17 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, shadcn, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+2 more)

### Community 18 - "auth-wrapper.tsx"
Cohesion: 0.29
Nodes (5): Props, AuthWrapper(), Props, gsap, @gsap/react

### Community 19 - "users-table.tsx"
Cohesion: 0.08
Nodes (41): GET(), runtime, GET(), parseParams(), runtime, searchParamsParsers, UsersTable(), downloadBlob() (+33 more)

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

### Community 44 - "tabs.tsx"
Cohesion: 0.33
Nodes (3): TabsList(), tabsListVariants, class-variance-authority

### Community 56 - "api.ts"
Cohesion: 0.06
Nodes (50): LoginResponse, POST(), POST(), GET(), POST(), RefreshResponse, POST(), RegisterResponse (+42 more)

### Community 60 - "billing-page-content.tsx"
Cohesion: 0.09
Nodes (31): PageProps, BillingCancelPage(), BillingSuccessPage(), FinanceOverview(), formatMoney(), OrganizationDetail(), BillingPageContent(), formatStatus() (+23 more)

### Community 61 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 63 - "use-shops.ts"
Cohesion: 0.08
Nodes (23): RouteContext, RouteContext, ConnectShopDialog(), handleOpenChange(), onSubmit(), ShopsPageContent(), useConnectShop(), useDisconnectShop() (+15 more)

### Community 64 - "app-topbar.tsx"
Cohesion: 0.24
Nodes (4): AppTopbar(), initialsFromName(), Avatar(), AvatarFallback()

### Community 65 - "Slice 2 Task 1 Report: Authenticated BFF helper + org current GET/PATCH"
Cohesion: 0.18
Nodes (10): Concerns, Files Touched, Slice 2 Task 1 Report: Authenticated BFF helper + org current GET/PATCH, Step 1: `authenticatedApiFetch`, Step 2: Types + validations, Step 3: BFF route, Step 4: Commit, Steps Completed (+2 more)

### Community 66 - "Slice 1 Task 5 Report: Portal BFF navigation + useNavigation"
Cohesion: 0.18
Nodes (10): Concerns, Files, Slice 1 Task 5 Report: Portal BFF navigation + useNavigation, Step 1: BFF route, Step 2: Service + hook, Step 3: Types + icons, Step 4: Commit, Steps Completed (+2 more)

### Community 67 - "platform-shops-table.tsx"
Cohesion: 0.14
Nodes (23): columnHelper, searchParamsParsers, shopsColumns, columnHelper, createdAtFormatter, staffColumns, statusBadgeClass(), columnHelper (+15 more)

### Community 68 - "Slice 2 Task 2 Report: Members list BFF + client hooks"
Cohesion: 0.18
Nodes (10): Concerns, Files Touched, Slice 2 Task 2 Report: Members list BFF + client hooks, Step 1: Types, Step 2: BFF route, Step 3: Client services + hooks, Step 4: Commit, Steps Completed (+2 more)

### Community 69 - "Slice 1 Task 7 Report: Stub pages for new nav hrefs"
Cohesion: 0.29
Nodes (6): Files Created, Slice 1 Task 7 Report: Stub pages for new nav hrefs, Step 1: Add minimal placeholder pages, Step 2: Commit, Steps Completed, Summary

### Community 70 - "use-platform.ts"
Cohesion: 0.05
Nodes (66): GET(), GET(), GET(), RouteContext, GET(), GET(), GET(), ApiStaff (+58 more)

### Community 72 - "Slice 2 Task 4 Report: Accept invite page + BFF"
Cohesion: 0.18
Nodes (10): Concerns, Files Touched, Slice 2 Task 4 Report: Accept invite page + BFF, Step 1: Contract check, Step 2: BFF + types/validation/service/hook, Step 3: UI, Step 4: Commit, Steps Completed (+2 more)

### Community 73 - "Slice 2 Task 2 — Members list BFF + client hooks"
Cohesion: 0.20
Nodes (9): BFF GET, Client, Commit, Files, Goal, Report, Slice 2 Task 2 — Members list BFF + client hooks, Types (+1 more)

### Community 74 - "Slice 2 Task 5 Report: Org settings form"
Cohesion: 0.20
Nodes (9): Concerns, Files Touched, Slice 2 Task 5 Report: Org settings form, Step 1: Org settings form, Step 2: Settings page, Step 3: Commit, Steps Completed, Summary (+1 more)

### Community 75 - "Slice 2 Task 3 — Team page DataTable + invite dialog"
Cohesion: 0.22
Nodes (8): Commit, Files, Goal, Invite BFF POST, Report, Slice 2 Task 3 — Team page DataTable + invite dialog, UI, Workspace

### Community 76 - "Slice 2 Task 4 — Accept invite page"
Cohesion: 0.22
Nodes (8): BFF POST, Commit, Files, Goal, Report, Slice 2 Task 4 — Accept invite page, UI, Workspace

### Community 77 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (12): DataTableColumnVisibility(), DataTableColumnVisibilityProps, getColumnLabel(), DataTableExport(), DataTableExportProps, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent() (+4 more)

### Community 78 - "Slice 2 Task 5 — Org settings form on `/settings`"
Cohesion: 0.25
Nodes (7): Commit, Files, Goal, Report, Slice 2 Task 5 — Org settings form on `/settings`, UI, Workspace

### Community 80 - "Slice 2 Task 1 Spec Review: Org current BFF"
Cohesion: 0.40
Nodes (4): Checklist, Error handling vs `app/api/auth/me/route.ts`, Notes (non-blocking), Slice 2 Task 1 Spec Review: Org current BFF

### Community 81 - "Slice 2 Task 2 Spec Review: Members BFF + hooks"
Cohesion: 0.50
Nodes (3): Checklist, Notes (non-blocking), Slice 2 Task 2 Spec Review: Members BFF + hooks

### Community 82 - "Slice 2 Task 3 Spec Review: Team page + invites"
Cohesion: 0.50
Nodes (3): Checklist, Notes (non-blocking), Slice 2 Task 3 Spec Review: Team page + invites

### Community 83 - "Slice 2 Task 4 Spec Review: Accept invite"
Cohesion: 0.50
Nodes (3): Checklist, Notes (non-blocking), Slice 2 Task 4 Spec Review: Accept invite

### Community 84 - "Slice 2 Task 5 Spec Review: Org settings form"
Cohesion: 0.50
Nodes (3): Checklist, Notes (non-blocking), Slice 2 Task 5 Spec Review: Org settings form

### Community 89 - "theme-toggle.tsx"
Cohesion: 0.48
Nodes (6): applyTheme(), getServerSnapshot(), getSnapshot(), subscribe(), ThemeToggle(), toggle()

## Knowledge Gaps
- **461 isolated node(s):** `npx`, `metadata`, `metadata`, `Props`, `Props` (+456 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 628 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `app-topbar.tsx`, `package.json`, `platform-shops-table.tsx`, `app-shell.tsx`, `data-table.tsx`, `use-platform.ts`, `app/layout.tsx`, `cn`, `dropdown-menu.tsx`, `services/orgs.ts`, `auth-wrapper.tsx`, `users-table.tsx`, `theme-toggle.tsx`, `billing-page-content.tsx`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `cn` connect `cn` to `app-topbar.tsx`, `react`, `package.json`, `platform-shops-table.tsx`, `app-shell.tsx`, `data-table.tsx`, `app/layout.tsx`, `tabs.tsx`, `button.tsx`, `dropdown-menu.tsx`, `progress.tsx`, `billing-page-content.tsx`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `@tanstack/react-query` connect `billing-page-content.tsx` to `app-topbar.tsx`, `react`, `package.json`, `app-shell.tsx`, `use-platform.ts`, `app/layout.tsx`, `services/orgs.ts`, `users-table.tsx`, `use-shops.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `npx`, `metadata`, `metadata` to the rest of the system?**
  _461 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.05267326732673267 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `components.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._