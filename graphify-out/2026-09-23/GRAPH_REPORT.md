# Graph Report - affiliate-tool-portal  (2026-09-18)

## Corpus Check
- 263 files · ~242,508 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1371 nodes · 2857 edges · 100 communities (66 shown, 16 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `193d71b4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Portal Auth E2E — Design
- shops-page-content.tsx
- package.json
- components.json
- app-shell.tsx
- cn
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
- field.tsx
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
- proxies-page-content.tsx
- tabs.tsx
- react
- Tiksly Complete SaaS — Master Design (Portal)
- 2026-09-17-saas-slice-1-platform-nav.md
- services/billing.ts
- organizations-table.tsx
- 2026-09-17-saas-slice-2-merchant-team.md
- data-table.tsx
- badge.tsx
- Slice 2 Task 1 Report: Authenticated BFF helper + org current GET/PATCH
- Slice 1 Task 5 Report: Portal BFF navigation + useNavigation
- next
- Slice 2 Task 2 Report: Members list BFF + client hooks
- Slice 1 Task 7 Report: Stub pages for new nav hrefs
- use-platform.ts
- 2026-09-17-saas-slice-3-merchant-billing.md
- Slice 2 Task 4 Report: Accept invite page + BFF
- Slice 2 Task 2 — Members list BFF + client hooks
- Slice 2 Task 5 Report: Org settings form
- Slice 2 Task 3 — Team page DataTable + invite dialog
- Slice 2 Task 4 — Accept invite page
- data-table-toolbar.tsx
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
- use-data-table-preferences.ts
- audit-log-page.tsx
- api.ts
- 2026-09-17-saas-slice-6-hardening.md
- devDependencies
- pagination.ts
- login/page.tsx
- signup/page.tsx
- auth-wrapper.tsx
- [id]/page.tsx
- scripts

## God Nodes (most connected - your core abstractions)
1. `authenticatedApiFetch()` - 60 edges
2. `platformErrorResponse()` - 59 edges
3. `react` - 57 edges
4. `Button()` - 35 edges
5. `cn` - 34 edges
6. `ApiClientError` - 24 edges
7. `lucide-react` - 22 edges
8. `sonner` - 21 edges
9. `parseJson()` - 19 edges
10. `Input()` - 18 edges

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

## Communities (100 total, 16 thin omitted)

### Community 0 - "Portal Auth E2E — Design"
Cohesion: 0.33
Nodes (5): Changes, Decisions, Goal, Out of scope, Portal Auth E2E — Design

### Community 1 - "shops-page-content.tsx"
Cohesion: 0.12
Nodes (22): BillingCancelPage(), BillingSuccessPage(), FinanceOverview(), formatMoney(), OrganizationDetail(), HomeOverview(), OrgSettingsForm(), ShopsPageContent() (+14 more)

### Community 2 - "package.json"
Cohesion: 0.10
Nodes (20): name, private, version, @base-ui/react, eslint, eslint-config-next, exceljs, @hello-pangea/dnd (+12 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "app-shell.tsx"
Cohesion: 0.07
Nodes (29): Props, Props, AppPageHeader(), AppShell(), getDesktopServerSnapshot(), getDesktopSnapshot(), subscribeDesktop(), AppSidebar() (+21 more)

### Community 5 - "cn"
Cohesion: 0.23
Nodes (12): Props, formatStatus(), ShopsTable(), ShopsTableProps, statusBadgeClass(), Table(), TableBody(), TableCell() (+4 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.12
Nodes (17): geistMono, geistSans, metadata, spaceGrotesk, brandToastVars(), getServerTheme(), getTheme(), subscribe() (+9 more)

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
Cohesion: 0.05
Nodes (73): Ctx, PATCH(), GET(), POST(), Ctx, DELETE(), PATCH(), Ctx (+65 more)

### Community 15 - "Slice 1 Task 6 Report: Login redirectTo + proxy area guards"
Cohesion: 0.17
Nodes (11): Concerns, Files, Slice 1 Task 6 Report: Login redirectTo + proxy area guards, Step 1: `readAccessClaims` + env note, Step 2: BFF + forms, Step 3: `proxy.ts` area checks, Step 4: Manual E2E, Step 5: Commit (+3 more)

### Community 16 - "services/orgs.ts"
Cohesion: 0.06
Nodes (39): runtime, filterMembers(), filterSortPaginateMembers(), GET(), mapMember(), parseParams(), runtime, SEARCH_FIELDS (+31 more)

### Community 17 - "staff-columns.tsx"
Cohesion: 0.21
Nodes (12): columnHelper, createdAtFormatter, staffColumns, statusBadgeClass(), cycleSorting(), DataTableColumnHeader(), DataTableColumnHeaderProps, DataTablePaginationProps (+4 more)

### Community 18 - "field.tsx"
Cohesion: 0.10
Nodes (19): ResetPasswordForm(), ResetPasswordFormInner(), formatPrice(), PlanCard(), PlanCardProps, CardFooter(), Field(), FieldDescription() (+11 more)

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

### Community 41 - "proxies-page-content.tsx"
Cohesion: 0.20
Nodes (16): ConnectShopDialogProps, Dialog(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogTitle(), DialogTrigger() (+8 more)

### Community 56 - "react"
Cohesion: 0.16
Nodes (17): Area, STATUSES, STAGES, Props, Button(), InputGroup(), InputGroupAddon(), inputGroupAddonVariants (+9 more)

### Community 60 - "services/billing.ts"
Cohesion: 0.12
Nodes (14): BillingPageContent(), formatStatus(), useCheckoutSession(), usePortalSession(), useBillingPlans(), createCheckoutSession(), createPortalSession(), fetchBillingPlans() (+6 more)

### Community 61 - "organizations-table.tsx"
Cohesion: 0.15
Nodes (10): columnHelper, createdAtFormatter, organizationsColumns, OrganizationsTable(), searchParamsParsers, searchParamsParsers, SORT_FIELDS, StaffTable() (+2 more)

### Community 63 - "data-table.tsx"
Cohesion: 0.18
Nodes (12): DataTable(), DataTableComponentProps, DataTableHeaderCell(), DataTableEmpty(), Props, DataTableError(), Props, getAriaSort() (+4 more)

### Community 64 - "badge.tsx"
Cohesion: 0.20
Nodes (9): columnHelper, membersColumns, statusBadgeClass(), MembersTable(), searchParamsParsers, SORT_FIELDS, Badge(), badgeVariants (+1 more)

### Community 65 - "Slice 2 Task 1 Report: Authenticated BFF helper + org current GET/PATCH"
Cohesion: 0.18
Nodes (10): Concerns, Files Touched, Slice 2 Task 1 Report: Authenticated BFF helper + org current GET/PATCH, Step 1: `authenticatedApiFetch`, Step 2: Types + validations, Step 3: BFF route, Step 4: Commit, Steps Completed (+2 more)

### Community 66 - "Slice 1 Task 5 Report: Portal BFF navigation + useNavigation"
Cohesion: 0.18
Nodes (10): Concerns, Files, Slice 1 Task 5 Report: Portal BFF navigation + useNavigation, Step 1: BFF route, Step 2: Service + hook, Step 3: Types + icons, Step 4: Commit, Steps Completed (+2 more)

### Community 67 - "next"
Cohesion: 0.17
Nodes (6): metadata, metadata, Props, ForgotPasswordForm(), nextConfig, next

### Community 68 - "Slice 2 Task 2 Report: Members list BFF + client hooks"
Cohesion: 0.18
Nodes (10): Concerns, Files Touched, Slice 2 Task 2 Report: Members list BFF + client hooks, Step 1: Types, Step 2: BFF route, Step 3: Client services + hooks, Step 4: Commit, Steps Completed (+2 more)

### Community 69 - "Slice 1 Task 7 Report: Stub pages for new nav hrefs"
Cohesion: 0.29
Nodes (6): Files Created, Slice 1 Task 7 Report: Stub pages for new nav hrefs, Step 1: Add minimal placeholder pages, Step 2: Commit, Steps Completed, Summary

### Community 70 - "use-platform.ts"
Cohesion: 0.05
Nodes (59): CrawlerPageContent(), PlatformCreatorsPageContent(), STAGES, AddItemForm(), NavigationAdminPage(), NavItemRow(), AddProxyDialog(), handleOpenChange() (+51 more)

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

### Community 77 - "data-table-toolbar.tsx"
Cohesion: 0.06
Nodes (37): ROLES, StaffRowActions(), DataTableColumnVisibility(), DataTableColumnVisibilityProps, getColumnLabel(), DataTableExport(), DataTableExportProps, DataTableToolbar() (+29 more)

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
Cohesion: 0.09
Nodes (19): RouteContext, RouteContext, ConnectShopDialog(), useConnectShop(), useDisconnectShop(), useVerifyShop(), connectShop(), disconnectShop() (+11 more)

### Community 88 - "platform-shops-table.tsx"
Cohesion: 0.33
Nodes (4): columnHelper, PlatformShopsTable(), searchParamsParsers, shopsColumns

### Community 89 - "use-data-table-preferences.ts"
Cohesion: 0.33
Nodes (7): empty, useDataTablePreferences(), emptyPrefs(), PreferencesState, TablePreferences, useDataTablePreferencesStore, zustand

### Community 90 - "audit-log-page.tsx"
Cohesion: 0.32
Nodes (5): AuditLogPage(), AuditResponse, AuditRow, createdAtFormatter, fetchAudit()

### Community 91 - "api.ts"
Cohesion: 0.06
Nodes (51): LoginResponse, POST(), POST(), GET(), POST(), RefreshResponse, POST(), RegisterResponse (+43 more)

### Community 93 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, shadcn, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+2 more)

### Community 94 - "pagination.ts"
Cohesion: 0.40
Nodes (3): DataTablePagination(), getPaginationItems(), PaginationItem

### Community 95 - "login/page.tsx"
Cohesion: 0.40
Nodes (3): metadata, LoginForm(), onSubmit()

### Community 97 - "auth-wrapper.tsx"
Cohesion: 0.29
Nodes (5): Props, AuthWrapper(), Props, gsap, @gsap/react

### Community 100 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, dev:turbo, lint, start, typecheck

## Knowledge Gaps
- **466 isolated node(s):** `npx`, `metadata`, `metadata`, `Props`, `Props` (+461 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 653 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `badge.tsx`, `auth-wrapper.tsx`, `shops-page-content.tsx`, `package.json`, `app-shell.tsx`, `cn`, `use-platform.ts`, `app/layout.tsx`, `proxies-page-content.tsx`, `use-creators.ts`, `data-table-toolbar.tsx`, `field.tsx`, `data-table.tsx`, `platform-shops-table.tsx`, `use-data-table-preferences.ts`, `audit-log-page.tsx`, `organizations-table.tsx`, `login/page.tsx`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `cn` connect `cn` to `badge.tsx`, `shops-page-content.tsx`, `package.json`, `app-shell.tsx`, `app/layout.tsx`, `proxies-page-content.tsx`, `tabs.tsx`, `data-table-toolbar.tsx`, `staff-columns.tsx`, `field.tsx`, `platform-shops-table.tsx`, `progress.tsx`, `react`, `data-table.tsx`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `authenticatedApiFetch()` connect `authenticatedApiFetch` to `services/orgs.ts`, `api.ts`, `services/billing.ts`, `use-shops.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `npx`, `metadata`, `metadata` to the rest of the system?**
  _466 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `shops-page-content.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `components.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._