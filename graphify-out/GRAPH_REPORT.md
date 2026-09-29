# Graph Report - affiliate-tool-portal  (2026-09-23)

## Corpus Check
- 347 files · ~267,145 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1726 nodes · 4061 edges · 131 communities (93 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 59 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `88aaa246`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Portal Auth E2E — Design
- billing-page-content.tsx
- package.json
- components.json
- app-shell.tsx
- shops-table.tsx
- app/layout.tsx
- compilerOptions
- dependencies
- outreach-page-content.tsx
- Slice 2 Task 3 Report: Team DataTable + invite dialog
- Shopify-style App Shell Design
- Production DataTable Design
- authenticatedApiFetch
- shadcn
- Slice 1 Task 6 Report: Login redirectTo + proxy area guards
- services/orgs.ts
- index.ts
- accept-invite-form.tsx
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
- stringSelectValue
- tabs.tsx
- session.ts
- Tiksly Complete SaaS — Master Design (Portal)
- 2026-09-17-saas-slice-1-platform-nav.md
- services/billing.ts
- organizations-table.tsx
- 2026-09-17-saas-slice-2-merchant-team.md
- data-table.tsx
- platform-bff.ts
- Slice 2 Task 1 Report: Authenticated BFF helper + org current GET/PATCH
- Slice 1 Task 5 Report: Portal BFF navigation + useNavigation
- plans-admin-page.tsx
- Slice 2 Task 2 Report: Members list BFF + client hooks
- Slice 1 Task 7 Report: Stub pages for new nav hrefs
- parseJson
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
- types/shops.ts
- platform-shops-table.tsx
- @tanstack/react-table
- react
- proxy.ts
- 2026-09-17-saas-slice-6-hardening.md
- devDependencies
- data-table-pagination.tsx
- use-commerce.ts
- api.ts
- auth-wrapper.tsx
- org-settings-form.tsx
- use-shops.ts
- scripts
- use-creators.ts
- @tanstack/react-query
- badge.tsx
- types/platform.ts
- types/navigation.ts
- shops-page-content.tsx
- authenticated-fetch.ts
- discover-columns.tsx
- use-platform.ts
- staff-columns.tsx
- StaffRowActions
- services/platform.ts
- app-topbar.tsx
- invites-page-content.tsx
- items/route.ts
- accept/route.ts
- CrawlerPageContent
- lucide-react
- theme-toggle.tsx
- InviteStaffDialog
- multi-shop-run/route.ts
- AddProxyDialog
- proxies-row-actions.tsx
- terms/[id]/route.ts
- platformErrorResponse
- DataTableToolbar
- IconRailFlyout
- review/route.ts
- fulfillments/refresh/route.ts
- products/route.ts

## God Nodes (most connected - your core abstractions)
1. `authenticatedApiFetch()` - 127 edges
2. `platformErrorResponse()` - 124 edges
3. `react` - 72 edges
4. `Button()` - 49 edges
5. `cn` - 36 edges
6. `stringSelectValue()` - 35 edges
7. `Skeleton()` - 31 edges
8. `sonner` - 31 edges
9. `ApiClientError` - 27 edges
10. `Input()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `platformErrorResponse()`  [EXTRACTED]
  app/api/platform/organizations/[id]/route.ts → lib/api/platform-bff.ts
- `PATCH()` --calls--> `platformErrorResponse()`  [EXTRACTED]
  app/api/platform/staff/[id]/route.ts → lib/api/platform-bff.ts
- `GET()` --calls--> `platformErrorResponse()`  [EXTRACTED]
  app/api/platform/billing/overview/route.ts → lib/api/platform-bff.ts
- `GET()` --calls--> `platformErrorResponse()`  [EXTRACTED]
  app/api/platform/crawler/route.ts → lib/api/platform-bff.ts
- `POST()` --calls--> `platformErrorResponse()`  [EXTRACTED]
  app/api/platform/crawler/run/route.ts → lib/api/platform-bff.ts

## Import Cycles
- None detected.

## Communities (131 total, 21 thin omitted)

### Community 0 - "Portal Auth E2E — Design"
Cohesion: 0.33
Nodes (5): Changes, Decisions, Goal, Out of scope, Portal Auth E2E — Design

### Community 1 - "billing-page-content.tsx"
Cohesion: 0.16
Nodes (17): PageProps, BillingCancelPage(), BillingSuccessPage(), FinanceOverview(), formatMoney(), OrganizationDetail(), formatPrice(), PlanCard() (+9 more)

### Community 2 - "package.json"
Cohesion: 0.09
Nodes (22): name, private, version, @base-ui/react, eslint, eslint-config-next, exceljs, @hello-pangea/dnd (+14 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "app-shell.tsx"
Cohesion: 0.11
Nodes (10): Props, Props, AppShell(), getDesktopServerSnapshot(), getDesktopSnapshot(), subscribeDesktop(), AppSidebar(), Sheet() (+2 more)

### Community 5 - "shops-table.tsx"
Cohesion: 0.24
Nodes (11): Props, formatStatus(), ShopsTable(), ShopsTableProps, statusBadgeClass(), Table(), TableBody(), TableCell() (+3 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.05
Nodes (28): metadata, metadata, Props, metadata, metadata, geistMono, geistSans, metadata (+20 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 8 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @base-ui/react, class-variance-authority, cn, exceljs, gsap, @gsap/react, @hello-pangea/dnd (+17 more)

### Community 9 - "outreach-page-content.tsx"
Cohesion: 0.13
Nodes (18): OutreachPageContent(), useBulkSendOutreach(), useCreateOutreachTemplate(), useOutreachEmailStatus(), useOutreachMessages(), useOutreachTemplates(), usePatchOutreachTemplate(), useSendOutreach() (+10 more)

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
Cohesion: 0.09
Nodes (23): GET(), POST(), GET(), POST(), Ctx, DELETE(), PATCH(), Ctx (+15 more)

### Community 15 - "Slice 1 Task 6 Report: Login redirectTo + proxy area guards"
Cohesion: 0.17
Nodes (11): Concerns, Files, Slice 1 Task 6 Report: Login redirectTo + proxy area guards, Step 1: `readAccessClaims` + env note, Step 2: BFF + forms, Step 3: `proxy.ts` area checks, Step 4: Manual E2E, Step 5: Commit (+3 more)

### Community 16 - "services/orgs.ts"
Cohesion: 0.06
Nodes (41): runtime, filterMembers(), filterSortPaginateMembers(), GET(), mapMember(), parseParams(), runtime, SEARCH_FIELDS (+33 more)

### Community 17 - "index.ts"
Cohesion: 0.17
Nodes (15): columnHelper, proxiesColumns, cycleSorting(), DataTableColumnHeader(), DataTableColumnHeaderProps, DataTableExportFormat, DataTableFeatures, DataTableProps (+7 more)

### Community 18 - "accept-invite-form.tsx"
Cohesion: 0.11
Nodes (24): ResetPasswordForm(), ResetPasswordFormInner(), Props, CardFooter(), Field(), FieldDescription(), FieldError(), FieldGroup() (+16 more)

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
Cohesion: 0.17
Nodes (15): ProxiesPageContent(), ConnectShopDialogProps, Dialog(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogTitle() (+7 more)

### Community 43 - "stringSelectValue"
Cohesion: 0.11
Nodes (14): ProductsPage(), AutomationsPageContent(), defaultEndAt(), NavigationAdminPage(), CampaignsPageContent(), defaultEndAt(), STATUS_OPTIONS, STATUSES (+6 more)

### Community 56 - "session.ts"
Cohesion: 0.19
Nodes (16): LoginResponse, POST(), POST(), POST(), RefreshResponse, POST(), RegisterResponse, apiFetch() (+8 more)

### Community 60 - "services/billing.ts"
Cohesion: 0.18
Nodes (10): BillingPageContent(), formatStatus(), OnboardingPageContent(), useCheckoutSession(), usePortalSession(), useBillingPlans(), createCheckoutSession(), createPortalSession() (+2 more)

### Community 61 - "organizations-table.tsx"
Cohesion: 0.25
Nodes (6): columnHelper, createdAtFormatter, organizationsColumns, OrganizationsTable(), searchParamsParsers, PlatformOrgSummary

### Community 63 - "data-table.tsx"
Cohesion: 0.18
Nodes (12): DataTable(), DataTableComponentProps, DataTableHeaderCell(), DataTableEmpty(), Props, DataTableError(), Props, getAriaSort() (+4 more)

### Community 64 - "platform-bff.ts"
Cohesion: 0.16
Nodes (10): POST(), POST(), GET(), GET(), PATCH(), Props, GET(), toQuery() (+2 more)

### Community 65 - "Slice 2 Task 1 Report: Authenticated BFF helper + org current GET/PATCH"
Cohesion: 0.18
Nodes (10): Concerns, Files Touched, Slice 2 Task 1 Report: Authenticated BFF helper + org current GET/PATCH, Step 1: `authenticatedApiFetch`, Step 2: Types + validations, Step 3: BFF route, Step 4: Commit, Steps Completed (+2 more)

### Community 66 - "Slice 1 Task 5 Report: Portal BFF navigation + useNavigation"
Cohesion: 0.18
Nodes (10): Concerns, Files, Slice 1 Task 5 Report: Portal BFF navigation + useNavigation, Step 1: BFF route, Step 2: Service + hook, Step 3: Types + icons, Step 4: Commit, Steps Completed (+2 more)

### Community 67 - "plans-admin-page.tsx"
Cohesion: 0.17
Nodes (12): metadata, formatMoney(), PlanEditor(), PlansAdminPage(), usePatchPlatformPlan(), usePlatformPlans(), fetchPlatformPlans(), patchPlatformPlan() (+4 more)

### Community 68 - "Slice 2 Task 2 Report: Members list BFF + client hooks"
Cohesion: 0.18
Nodes (10): Concerns, Files Touched, Slice 2 Task 2 Report: Members list BFF + client hooks, Step 1: Types, Step 2: BFF route, Step 3: Client services + hooks, Step 4: Commit, Steps Completed (+2 more)

### Community 69 - "Slice 1 Task 7 Report: Stub pages for new nav hrefs"
Cohesion: 0.29
Nodes (6): Files Created, Slice 1 Task 7 Report: Stub pages for new nav hrefs, Step 1: Add minimal placeholder pages, Step 2: Commit, Steps Completed, Summary

### Community 70 - "parseJson"
Cohesion: 0.18
Nodes (10): AddItemForm(), useCreateAdminNavItem(), useCreatePlatformCreator(), usePatchAdminNavItem(), usePlatformOrganization(), createAdminNavItem(), createPlatformCreator(), fetchPlatformOrganization() (+2 more)

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
Cohesion: 0.13
Nodes (19): ROLES, DataTableColumnVisibility(), DataTableColumnVisibilityProps, getColumnLabel(), DataTableExport(), DataTableExportProps, DataTableToolbarProps, DropdownMenu() (+11 more)

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

### Community 87 - "types/shops.ts"
Cohesion: 0.14
Nodes (8): RouteContext, RouteContext, Shop, ShopRegion, ShopsListResponse, ShopStatus, VerifyShopResponse, connectShopSchema

### Community 88 - "platform-shops-table.tsx"
Cohesion: 0.29
Nodes (5): columnHelper, PlatformShopsTable(), searchParamsParsers, shopsColumns, PlatformShopRow

### Community 89 - "@tanstack/react-table"
Cohesion: 0.31
Nodes (8): empty, useDataTablePreferences(), emptyPrefs(), PreferencesState, TablePreferences, useDataTablePreferencesStore, @tanstack/react-table, zustand

### Community 90 - "react"
Cohesion: 0.10
Nodes (36): STAGE_OPTIONS, STAGES, columnHelper, createNavigationAdminColumns(), NavigationAdminTableActions, NavItemDraft, Area, AREA_OPTIONS (+28 more)

### Community 91 - "proxy.ts"
Cohesion: 0.18
Nodes (21): defaultRedirectForClaims(), isSafeRelativePath(), readAccessClaims(), resolvePostAuthRedirect(), getApiBaseUrl(), classifyRoute(), GUEST_AUTH, isInvitePath() (+13 more)

### Community 93 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, shadcn, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+3 more)

### Community 94 - "data-table-pagination.tsx"
Cohesion: 0.31
Nodes (5): DataTablePagination(), DataTablePaginationProps, DEFAULT_PAGE_SIZE_OPTIONS, getPaginationItems(), PaginationItem

### Community 95 - "use-commerce.ts"
Cohesion: 0.09
Nodes (52): PlatformDiscoveryPageContent(), REGION_OPTIONS, TERM_REGION_OPTIONS, useAnalyticsOverview(), useCrawlTerms(), useCreateCrawlTerm(), useCreateOrder(), useCreatePlatformDiscovery() (+44 more)

### Community 96 - "api.ts"
Cohesion: 0.10
Nodes (10): bodySchema, bodySchema, ApiClientError, ApiErrorBody, ApiFetchOptions, zod, BillingPlansResponse, CheckoutSessionResponse (+2 more)

### Community 97 - "auth-wrapper.tsx"
Cohesion: 0.29
Nodes (5): Props, AuthWrapper(), Props, gsap, @gsap/react

### Community 98 - "org-settings-form.tsx"
Cohesion: 0.24
Nodes (8): OrgSettingsForm(), useMe(), useOrg(), usePatchOrg(), fetchMe(), fetchCurrentOrg(), patchCurrentOrg(), PatchCurrentOrgSchemaType

### Community 99 - "use-shops.ts"
Cohesion: 0.12
Nodes (18): CallbackInner(), ConnectShopDialog(), ShopsPageContent(), useConnectShop(), useDisconnectShop(), useStartTikTokOAuth(), useTikTokOAuthStatus(), useVerifyShop() (+10 more)

### Community 100 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, dev:turbo, lint, start, typecheck

### Community 101 - "use-creators.ts"
Cohesion: 0.11
Nodes (32): columnHelper, createCreatorsColumns(), CreatorsTableActions, formatGmv(), listsToOptions(), CreatorsPageContent(), STAGE_OPTIONS, STAGES (+24 more)

### Community 102 - "@tanstack/react-query"
Cohesion: 0.07
Nodes (35): MessagesPageContent(), SamplesPageContent(), useAutomationRuns(), useCreateAutomationRun(), useConversationMessages(), useConversations(), useMarkConversationsRead(), useOpenConversation() (+27 more)

### Community 103 - "badge.tsx"
Cohesion: 0.18
Nodes (8): columnHelper, createPlatformCreatorsColumns(), PlatformCreatorsTableActions, PlatformCreatorsPageContent(), columnHelper, createSamplesColumns(), Badge(), badgeVariants

### Community 104 - "types/platform.ts"
Cohesion: 0.07
Nodes (28): GET(), GET(), POST(), GET(), POST(), GET(), RouteContext, GET() (+20 more)

### Community 105 - "types/navigation.ts"
Cohesion: 0.23
Nodes (12): AppPageHeader(), useNavigation(), areaLabel(), findActiveNavItem(), flattenNavItems(), isNavItemActive(), nested, sections (+4 more)

### Community 106 - "shops-page-content.tsx"
Cohesion: 0.16
Nodes (10): metadata, AnalyticsPageContent(), formatMoney(), AuditLogPage(), AuditResponse, AuditRow, createdAtFormatter, fetchAudit() (+2 more)

### Community 107 - "authenticated-fetch.ts"
Cohesion: 0.08
Nodes (13): Ctx, PATCH(), POST(), POST(), Ctx, PATCH(), POST(), PATCH() (+5 more)

### Community 108 - "discover-columns.tsx"
Cohesion: 0.13
Nodes (17): analyticsTopCreatorsColumns, columnHelper, formatCreatorGmv(), formatMoney(), columnHelper, formatGmv(), platformDiscoveryColumns, columnHelper (+9 more)

### Community 109 - "use-platform.ts"
Cohesion: 0.17
Nodes (16): useAdminNavigation(), useBillingOverview(), usePatchPlatformCreator(), usePatchPlatformStaff(), fetchAdminNavigation(), fetchBillingOverview(), patchPlatformCreator(), patchPlatformStaff() (+8 more)

### Community 110 - "staff-columns.tsx"
Cohesion: 0.17
Nodes (11): columnHelper, createdAtFormatter, staffColumns, statusBadgeClass(), searchParamsParsers, SORT_FIELDS, StaffTable(), DataTableSkeleton() (+3 more)

### Community 112 - "services/platform.ts"
Cohesion: 0.18
Nodes (14): usePlatformCreators(), usePlatformOrganizations(), usePlatformProxies(), usePlatformShops(), fetchPlatformCreators(), fetchPlatformOrganizations(), fetchPlatformProxies(), fetchPlatformShops() (+6 more)

### Community 113 - "app-topbar.tsx"
Cohesion: 0.21
Nodes (5): AppTopbar(), initialsFromName(), Avatar(), AvatarFallback(), NavBrand

### Community 114 - "invites-page-content.tsx"
Cohesion: 0.17
Nodes (13): defaultEndAt(), InvitesPageContent(), useCreatorLists(), useCreators(), useAffiliateInvites(), useCreateAffiliateInvite(), createAffiliateInvite(), fetchAffiliateInvites() (+5 more)

### Community 116 - "accept/route.ts"
Cohesion: 0.17
Nodes (11): GET(), GET(), POST(), RouteContext, runtime, getAccessToken(), MeMembership, MeResponse (+3 more)

### Community 117 - "CrawlerPageContent"
Cohesion: 0.25
Nodes (5): CrawlerPageContent(), usePlatformCrawler(), useRunPlatformCrawlerDryCheck(), fetchPlatformCrawler(), runPlatformCrawlerDryCheck()

### Community 118 - "lucide-react"
Cohesion: 0.24
Nodes (5): ICONS, NavIcon(), SidebarNavItem(), lucide-react, NavItem

### Community 119 - "theme-toggle.tsx"
Cohesion: 0.48
Nodes (6): applyTheme(), getServerSnapshot(), getSnapshot(), subscribe(), ThemeToggle(), toggle()

### Community 120 - "InviteStaffDialog"
Cohesion: 0.50
Nodes (5): InviteStaffDialog(), handleOpenChange(), onSubmit(), useCreatePlatformStaff(), createPlatformStaff()

### Community 122 - "AddProxyDialog"
Cohesion: 0.50
Nodes (5): AddProxyDialog(), handleOpenChange(), onSubmit(), useCreatePlatformProxy(), createPlatformProxy()

### Community 123 - "proxies-row-actions.tsx"
Cohesion: 0.40
Nodes (4): ProxyRowActions(), usePatchPlatformProxy(), patchPlatformProxy(), PlatformProxy

### Community 125 - "platformErrorResponse"
Cohesion: 0.10
Nodes (20): GET(), POST(), Ctx, GET(), POST(), GET(), POST(), POST() (+12 more)

### Community 126 - "DataTableToolbar"
Cohesion: 0.67
Nodes (3): DataTableToolbar(), closeSearch(), handleSearchKeyDown()

### Community 127 - "IconRailFlyout"
Cohesion: 0.83
Nodes (4): IconRailFlyout(), clearCloseTimer(), hide(), show()

## Knowledge Gaps
- **511 isolated node(s):** `metadata`, `metadata`, `RegisterResponse`, `Props`, `PlanCardProps` (+506 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 736 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `billing-page-content.tsx`, `package.json`, `app-shell.tsx`, `shops-table.tsx`, `app/layout.tsx`, `outreach-page-content.tsx`, `services/orgs.ts`, `accept-invite-form.tsx`, `proxies-page-content.tsx`, `stringSelectValue`, `organizations-table.tsx`, `data-table.tsx`, `plans-admin-page.tsx`, `data-table-toolbar.tsx`, `platform-shops-table.tsx`, `@tanstack/react-table`, `use-commerce.ts`, `auth-wrapper.tsx`, `org-settings-form.tsx`, `use-shops.ts`, `use-creators.ts`, `shops-page-content.tsx`, `staff-columns.tsx`, `app-topbar.tsx`, `invites-page-content.tsx`, `lucide-react`, `theme-toggle.tsx`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Why does `authenticatedApiFetch()` connect `authenticatedApiFetch` to `api.ts`, `platform-bff.ts`, `products/route.ts`, `fulfillments/refresh/route.ts`, `review/route.ts`, `types/platform.ts`, `authenticated-fetch.ts`, `services/orgs.ts`, `items/route.ts`, `accept/route.ts`, `types/shops.ts`, `session.ts`, `multi-shop-run/route.ts`, `terms/[id]/route.ts`, `platformErrorResponse`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `@tanstack/react-query` connect `@tanstack/react-query` to `billing-page-content.tsx`, `org-settings-form.tsx`, `use-shops.ts`, `package.json`, `use-creators.ts`, `app/layout.tsx`, `proxies-page-content.tsx`, `shops-page-content.tsx`, `types/navigation.ts`, `use-platform.ts`, `services/orgs.ts`, `app-topbar.tsx`, `invites-page-content.tsx`, `services/billing.ts`, `use-commerce.ts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `metadata`, `metadata`, `RegisterResponse` to the rest of the system?**
  _511 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `components.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `app-shell.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._