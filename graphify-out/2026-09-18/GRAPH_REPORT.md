# Graph Report - affiliate-tool-portal  (2026-09-18)

## Corpus Check
- 259 files · ~241,715 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1358 nodes · 2812 edges · 98 communities (66 shown, 14 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `193d71b4`
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
- use-creators.ts
- Slice 2 Task 3 Report: Team DataTable + invite dialog
- Shopify-style App Shell Design
- Production DataTable Design
- authenticatedApiFetch
- shadcn
- Slice 1 Task 6 Report: Login redirectTo + proxy area guards
- services/orgs.ts
- staff-columns.tsx
- cn
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
- app-topbar.tsx
- tabs.tsx
- services/platform.ts
- Tiksly Complete SaaS — Master Design (Portal)
- 2026-09-17-saas-slice-1-platform-nav.md
- @tanstack/react-query
- organizations-table.tsx
- 2026-09-17-saas-slice-2-merchant-team.md
- toQuery
- staff-table.tsx
- Slice 2 Task 1 Report: Authenticated BFF helper + org current GET/PATCH
- Slice 1 Task 5 Report: Portal BFF navigation + useNavigation
- CrawlerPageContent
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
- use-shops.ts
- platform-shops-table.tsx
- useAdminNavigation
- theme-toggle.tsx
- api.ts
- 2026-09-17-saas-slice-6-hardening.md
- devDependencies
- AddProxyDialog
- auth-wrapper.tsx
- scripts
- InviteStaffDialog

## God Nodes (most connected - your core abstractions)
1. `authenticatedApiFetch()` - 56 edges
2. `react` - 56 edges
3. `platformErrorResponse()` - 54 edges
4. `Button()` - 34 edges
5. `cn` - 34 edges
6. `ApiClientError` - 24 edges
7. `lucide-react` - 22 edges
8. `sonner` - 20 edges
9. `parseJson()` - 19 edges
10. `useMe()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `StaffRowActions()` --calls--> `usePatchPlatformStaff()`  [EXTRACTED]
  components/backoffice/staff/staff-row-actions.tsx → hooks/use-platform.ts
- `OrganizationDetail()` --calls--> `usePlatformOrganization()`  [EXTRACTED]
  components/backoffice/organizations/organization-detail.tsx → hooks/use-platform.ts
- `FinanceOverview()` --calls--> `useBillingOverview()`  [EXTRACTED]
  components/backoffice/finance/finance-overview.tsx → hooks/use-platform.ts
- `usePlatformCreators()` --calls--> `fetchPlatformCreators()`  [EXTRACTED]
  hooks/use-platform.ts → services/platform.ts
- `useCreatePlatformCreator()` --indirect_call--> `createPlatformCreator()`  [INFERRED]
  hooks/use-platform.ts → services/platform.ts

## Import Cycles
- None detected.

## Communities (98 total, 14 thin omitted)

### Community 0 - "Portal Auth E2E — Design"
Cohesion: 0.33
Nodes (5): Changes, Decisions, Goal, Out of scope, Portal Auth E2E — Design

### Community 1 - "react"
Cohesion: 0.05
Nodes (78): PageProps, BillingCancelPage(), BillingSuccessPage(), ResetPasswordForm(), ResetPasswordFormInner(), AuditLogPage(), AuditResponse, AuditRow (+70 more)

### Community 2 - "package.json"
Cohesion: 0.10
Nodes (20): name, private, version, @base-ui/react, eslint, eslint-config-next, exceljs, @hello-pangea/dnd (+12 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "app-shell.tsx"
Cohesion: 0.07
Nodes (29): Props, Props, AppPageHeader(), AppShell(), getDesktopServerSnapshot(), getDesktopSnapshot(), subscribeDesktop(), AppSidebar() (+21 more)

### Community 5 - "data-table.tsx"
Cohesion: 0.06
Nodes (39): DataTable(), DataTableComponentProps, DataTableHeaderCell(), DataTableEmpty(), Props, DataTableError(), Props, getAriaSort() (+31 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.05
Nodes (28): metadata, metadata, Props, metadata, metadata, geistMono, geistSans, metadata (+20 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 8 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, @base-ui/react, class-variance-authority, cn, exceljs, gsap, @gsap/react, @hello-pangea/dnd (+16 more)

### Community 9 - "use-creators.ts"
Cohesion: 0.08
Nodes (40): CampaignsPageContent(), CreatorsPageContent(), OutreachPageContent(), useAddCreatorToList(), useCampaigns(), useCreateCampaign(), useCreateCreator(), useCreateCreatorList() (+32 more)

### Community 10 - "Slice 2 Task 3 Report: Team DataTable + invite dialog"
Cohesion: 0.17
Nodes (11): Concerns, Files Touched, Slice 2 Task 3 Report: Team DataTable + invite dialog, Step 1: Invites BFF POST, Step 2: Columns + table, Step 3: Invite dialog, Step 4: Team page, Step 5: Commit (+3 more)

### Community 11 - "Shopify-style App Shell Design"
Cohesion: 0.11
Nodes (17): Architecture, Component responsibilities, Data flow, Decisions (locked), Dummy content (v1), Goal, Layout grid, Loading / error (+9 more)

### Community 12 - "Production DataTable Design"
Cohesion: 0.09
Nodes (22): Accessibility, Architecture, Behavior details, Boundaries, Component API, Decisions (locked), Export — `GET /api/users/export`, Folder layout (+14 more)

### Community 13 - "authenticatedApiFetch"
Cohesion: 0.07
Nodes (49): Ctx, PATCH(), GET(), POST(), Ctx, DELETE(), PATCH(), Ctx (+41 more)

### Community 15 - "Slice 1 Task 6 Report: Login redirectTo + proxy area guards"
Cohesion: 0.17
Nodes (11): Concerns, Files, Slice 1 Task 6 Report: Login redirectTo + proxy area guards, Step 1: `readAccessClaims` + env note, Step 2: BFF + forms, Step 3: `proxy.ts` area checks, Step 4: Manual E2E, Step 5: Commit (+3 more)

### Community 16 - "services/orgs.ts"
Cohesion: 0.06
Nodes (44): runtime, filterMembers(), filterSortPaginateMembers(), GET(), mapMember(), parseParams(), runtime, SEARCH_FIELDS (+36 more)

### Community 17 - "staff-columns.tsx"
Cohesion: 0.16
Nodes (16): columnHelper, createdAtFormatter, staffColumns, statusBadgeClass(), StaffRowActions(), cycleSorting(), DataTableColumnHeader(), DataTableColumnHeaderProps (+8 more)

### Community 18 - "cn"
Cohesion: 0.20
Nodes (10): DataTableExport(), DataTableToolbarProps, ICONS, NavIcon(), Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger() (+2 more)

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

### Community 41 - "app-topbar.tsx"
Cohesion: 0.24
Nodes (4): AppTopbar(), initialsFromName(), Avatar(), AvatarFallback()

### Community 56 - "services/platform.ts"
Cohesion: 0.17
Nodes (18): AdminNavItem, AdminNavResponse, AdminNavSection, BillingOverview, PlatformCrawlerRunResult, PlatformCrawlerStatus, PlatformCreatorListResponse, PlatformCreatorRow (+10 more)

### Community 60 - "@tanstack/react-query"
Cohesion: 0.19
Nodes (10): BillingPageContent(), formatStatus(), useCheckoutSession(), usePortalSession(), useBillingPlans(), @tanstack/react-query, createCheckoutSession(), createPortalSession() (+2 more)

### Community 61 - "organizations-table.tsx"
Cohesion: 0.22
Nodes (8): columnHelper, createdAtFormatter, organizationsColumns, OrganizationsTable(), searchParamsParsers, usePlatformOrganizations(), fetchPlatformOrganizations(), PlatformOrgSummary

### Community 63 - "toQuery"
Cohesion: 0.25
Nodes (6): ProxiesPageContent(), usePlatformCreators(), usePlatformProxies(), fetchPlatformCreators(), fetchPlatformProxies(), toQuery()

### Community 64 - "staff-table.tsx"
Cohesion: 0.28
Nodes (6): searchParamsParsers, SORT_FIELDS, StaffTable(), usePlatformStaff(), fetchPlatformStaff(), PlatformListParams

### Community 65 - "Slice 2 Task 1 Report: Authenticated BFF helper + org current GET/PATCH"
Cohesion: 0.18
Nodes (10): Concerns, Files Touched, Slice 2 Task 1 Report: Authenticated BFF helper + org current GET/PATCH, Step 1: `authenticatedApiFetch`, Step 2: Types + validations, Step 3: BFF route, Step 4: Commit, Steps Completed (+2 more)

### Community 66 - "Slice 1 Task 5 Report: Portal BFF navigation + useNavigation"
Cohesion: 0.18
Nodes (10): Concerns, Files, Slice 1 Task 5 Report: Portal BFF navigation + useNavigation, Step 1: BFF route, Step 2: Service + hook, Step 3: Types + icons, Step 4: Commit, Steps Completed (+2 more)

### Community 67 - "CrawlerPageContent"
Cohesion: 0.25
Nodes (5): CrawlerPageContent(), usePlatformCrawler(), useRunPlatformCrawlerDryCheck(), fetchPlatformCrawler(), runPlatformCrawlerDryCheck()

### Community 68 - "Slice 2 Task 2 Report: Members list BFF + client hooks"
Cohesion: 0.18
Nodes (10): Concerns, Files Touched, Slice 2 Task 2 Report: Members list BFF + client hooks, Step 1: Types, Step 2: BFF route, Step 3: Client services + hooks, Step 4: Commit, Steps Completed (+2 more)

### Community 69 - "Slice 1 Task 7 Report: Stub pages for new nav hrefs"
Cohesion: 0.29
Nodes (6): Files Created, Slice 1 Task 7 Report: Stub pages for new nav hrefs, Step 1: Add minimal placeholder pages, Step 2: Commit, Steps Completed, Summary

### Community 70 - "use-platform.ts"
Cohesion: 0.11
Nodes (25): AddItemForm(), NavItemRow(), ProxyRowActions(), useBillingOverview(), useCreateAdminNavItem(), useCreatePlatformCreator(), usePatchAdminNavItem(), usePatchPlatformCreator() (+17 more)

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
Cohesion: 0.14
Nodes (13): ROLES, DataTableColumnVisibility(), DataTableColumnVisibilityProps, getColumnLabel(), DataTableExportProps, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent() (+5 more)

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

### Community 87 - "use-shops.ts"
Cohesion: 0.08
Nodes (21): RouteContext, RouteContext, ConnectShopDialog(), ShopsPageContent(), useConnectShop(), useDisconnectShop(), useShops(), useVerifyShop() (+13 more)

### Community 88 - "platform-shops-table.tsx"
Cohesion: 0.22
Nodes (8): columnHelper, PlatformShopsTable(), searchParamsParsers, shopsColumns, usePlatformShops(), nuqs, fetchPlatformShops(), PlatformShopRow

### Community 89 - "useAdminNavigation"
Cohesion: 0.40
Nodes (3): NavigationAdminPage(), useAdminNavigation(), fetchAdminNavigation()

### Community 90 - "theme-toggle.tsx"
Cohesion: 0.48
Nodes (6): applyTheme(), getServerSnapshot(), getSnapshot(), subscribe(), ThemeToggle(), toggle()

### Community 91 - "api.ts"
Cohesion: 0.05
Nodes (56): LoginResponse, POST(), POST(), GET(), POST(), RefreshResponse, POST(), RegisterResponse (+48 more)

### Community 93 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, shadcn, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+2 more)

### Community 95 - "AddProxyDialog"
Cohesion: 0.50
Nodes (5): AddProxyDialog(), handleOpenChange(), onSubmit(), useCreatePlatformProxy(), createPlatformProxy()

### Community 97 - "auth-wrapper.tsx"
Cohesion: 0.29
Nodes (5): Props, AuthWrapper(), Props, gsap, @gsap/react

### Community 100 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, dev:turbo, lint, start, typecheck

### Community 107 - "InviteStaffDialog"
Cohesion: 0.50
Nodes (5): InviteStaffDialog(), handleOpenChange(), onSubmit(), useCreatePlatformStaff(), createPlatformStaff()

## Knowledge Gaps
- **464 isolated node(s):** `ICONS`, `PlatformListMeta`, `ProxyStatus`, `ProxyProtocol`, `AdminNavSection` (+459 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 648 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `staff-table.tsx`, `auth-wrapper.tsx`, `package.json`, `app-shell.tsx`, `data-table.tsx`, `app/layout.tsx`, `app-topbar.tsx`, `dropdown-menu.tsx`, `services/orgs.ts`, `cn`, `platform-shops-table.tsx`, `theme-toggle.tsx`, `organizations-table.tsx`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Why does `cn` connect `cn` to `react`, `package.json`, `app-shell.tsx`, `data-table.tsx`, `app/layout.tsx`, `app-topbar.tsx`, `tabs.tsx`, `dropdown-menu.tsx`, `staff-columns.tsx`, `platform-shops-table.tsx`, `progress.tsx`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `Button()` connect `react` to `app-shell.tsx`, `data-table.tsx`, `app-topbar.tsx`, `dropdown-menu.tsx`, `staff-columns.tsx`, `cn`, `theme-toggle.tsx`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `ICONS`, `PlatformListMeta`, `ProxyStatus` to the rest of the system?**
  _464 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.05129619415333701 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `components.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._