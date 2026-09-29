# Graph Report - affiliate-tool-portal  (2026-09-23)

## Corpus Check
- 341 files · ~265,246 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1696 nodes · 3954 edges · 130 communities (97 shown, 17 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 59 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1bb0d2fb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Portal Auth E2E — Design
- button.tsx
- package.json
- components.json
- app-shell.tsx
- shops-table.tsx
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
- current/members/route.ts
- index.ts
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
- campaigns-page-content.tsx
- tabs.tsx
- input-group.tsx
- cn
- Tiksly Complete SaaS — Master Design (Portal)
- 2026-09-17-saas-slice-1-platform-nav.md
- services/billing.ts
- organizations-table.tsx
- 2026-09-17-saas-slice-2-merchant-team.md
- data-table.tsx
- members-columns.tsx
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
- types/shops.ts
- platform-shops-table.tsx
- use-data-table-preferences.ts
- react
- proxy.ts
- 2026-09-17-saas-slice-6-hardening.md
- devDependencies
- stringSelectValue
- use-commerce.ts
- api.ts
- auth-wrapper.tsx
- accept-invite-form.tsx
- use-shops.ts
- scripts
- creators-page-content.tsx
- MessagesPageContent
- samples-page-content.tsx
- types/platform.ts
- types/navigation.ts
- navigation-admin-page.tsx
- authenticated-fetch.ts
- discover-columns.tsx
- platform.validations.ts
- staff-columns.tsx
- dropdown-menu.tsx
- PlatformCreatorsPageContent
- app-topbar.tsx
- use-invites.ts
- zod
- use-automations.ts
- CrawlerPageContent
- HomeOverview
- theme-toggle.tsx
- InviteMemberDialog
- sonner.tsx
- AddProxyDialog
- proxies-row-actions.tsx
- [listId]/members/route.ts
- [id]/messages/route.ts
- DataTableToolbar
- IconRailFlyout
- platform/creators/[id]/route.ts
- fulfillments/refresh/route.ts

## God Nodes (most connected - your core abstractions)
1. `authenticatedApiFetch()` - 124 edges
2. `platformErrorResponse()` - 120 edges
3. `react` - 69 edges
4. `Button()` - 48 edges
5. `cn` - 36 edges
6. `stringSelectValue()` - 35 edges
7. `sonner` - 29 edges
8. `Skeleton()` - 28 edges
9. `ApiClientError` - 27 edges
10. `Input()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `useCreateCreator()` --indirect_call--> `createCreator()`  [INFERRED]
  hooks/use-creators.ts → services/creators.ts
- `useDeleteCreator()` --indirect_call--> `deleteCreator()`  [INFERRED]
  hooks/use-creators.ts → services/creators.ts
- `useCreateCreatorList()` --indirect_call--> `createCreatorList()`  [INFERRED]
  hooks/use-creators.ts → services/creators.ts
- `useCreateCampaign()` --indirect_call--> `createCampaign()`  [INFERRED]
  hooks/use-creators.ts → services/creators.ts
- `GET()` --calls--> `platformErrorResponse()`  [EXTRACTED]
  app/api/platform/organizations/[id]/route.ts → lib/api/platform-bff.ts

## Import Cycles
- None detected.

## Communities (130 total, 17 thin omitted)

### Community 0 - "Portal Auth E2E — Design"
Cohesion: 0.33
Nodes (5): Changes, Decisions, Goal, Out of scope, Portal Auth E2E — Design

### Community 1 - "button.tsx"
Cohesion: 0.15
Nodes (23): PageProps, BillingCancelPage(), BillingSuccessPage(), AuditLogPage(), AuditResponse, AuditRow, createdAtFormatter, fetchAudit() (+15 more)

### Community 2 - "package.json"
Cohesion: 0.09
Nodes (22): name, private, version, @base-ui/react, eslint, eslint-config-next, exceljs, @hello-pangea/dnd (+14 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "app-shell.tsx"
Cohesion: 0.12
Nodes (10): Props, Props, AppShell(), getDesktopServerSnapshot(), getDesktopSnapshot(), subscribeDesktop(), Sheet(), SheetContent() (+2 more)

### Community 5 - "shops-table.tsx"
Cohesion: 0.22
Nodes (12): Props, formatStatus(), ShopsTable(), ShopsTableProps, statusBadgeClass(), Table(), TableBody(), TableCell() (+4 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.15
Nodes (12): geistMono, geistSans, metadata, spaceGrotesk, Props, Providers(), handleMutationError(), handleQueryError() (+4 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 8 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @base-ui/react, class-variance-authority, cn, exceljs, gsap, @gsap/react, @hello-pangea/dnd (+17 more)

### Community 9 - "use-creators.ts"
Cohesion: 0.10
Nodes (32): OutreachPageContent(), useBulkSendOutreach(), useCreateOutreachTemplate(), useOutreachEmailStatus(), useOutreachMessages(), useOutreachTemplates(), usePatchOutreachTemplate(), useSendOutreach() (+24 more)

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
Cohesion: 0.06
Nodes (56): GET(), POST(), GET(), POST(), Ctx, DELETE(), PATCH(), GET() (+48 more)

### Community 15 - "Slice 1 Task 6 Report: Login redirectTo + proxy area guards"
Cohesion: 0.17
Nodes (11): Concerns, Files, Slice 1 Task 6 Report: Login redirectTo + proxy area guards, Step 1: `readAccessClaims` + env note, Step 2: BFF + forms, Step 3: `proxy.ts` area checks, Step 4: Manual E2E, Step 5: Commit (+3 more)

### Community 16 - "current/members/route.ts"
Cohesion: 0.10
Nodes (19): runtime, filterMembers(), filterSortPaginateMembers(), GET(), mapMember(), parseParams(), runtime, SEARCH_FIELDS (+11 more)

### Community 17 - "index.ts"
Cohesion: 0.17
Nodes (16): columnHelper, formatGmv(), platformDiscoveryColumns, columnHelper, proxiesColumns, cycleSorting(), DataTableColumnHeader(), DataTableColumnHeaderProps (+8 more)

### Community 18 - "field.tsx"
Cohesion: 0.11
Nodes (16): ResetPasswordForm(), ResetPasswordFormInner(), CardFooter(), Field(), FieldDescription(), fieldVariants, Label(), Separator() (+8 more)

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
Nodes (18): ProxiesPageContent(), ConnectShopDialogProps, Dialog(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogTitle() (+10 more)

### Community 43 - "campaigns-page-content.tsx"
Cohesion: 0.09
Nodes (16): ProductsPage(), AutomationsPageContent(), defaultEndAt(), CampaignsPageContent(), defaultEndAt(), STATUS_OPTIONS, STATUSES, defaultEndAt() (+8 more)

### Community 56 - "input-group.tsx"
Cohesion: 0.22
Nodes (9): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), PasswordInput(), Textarea() (+1 more)

### Community 60 - "services/billing.ts"
Cohesion: 0.18
Nodes (10): BillingPageContent(), formatStatus(), useCheckoutSession(), usePortalSession(), useBillingPlans(), createCheckoutSession(), createPortalSession(), fetchBillingPlans() (+2 more)

### Community 61 - "organizations-table.tsx"
Cohesion: 0.25
Nodes (6): columnHelper, createdAtFormatter, organizationsColumns, OrganizationsTable(), searchParamsParsers, PlatformOrgSummary

### Community 63 - "data-table.tsx"
Cohesion: 0.18
Nodes (12): DataTable(), DataTableComponentProps, DataTableHeaderCell(), DataTableEmpty(), Props, DataTableError(), Props, getAriaSort() (+4 more)

### Community 64 - "members-columns.tsx"
Cohesion: 0.23
Nodes (8): columnHelper, membersColumns, statusBadgeClass(), MembersTable(), searchParamsParsers, SORT_FIELDS, useMembersQuery(), nuqs

### Community 65 - "Slice 2 Task 1 Report: Authenticated BFF helper + org current GET/PATCH"
Cohesion: 0.18
Nodes (10): Concerns, Files Touched, Slice 2 Task 1 Report: Authenticated BFF helper + org current GET/PATCH, Step 1: `authenticatedApiFetch`, Step 2: Types + validations, Step 3: BFF route, Step 4: Commit, Steps Completed (+2 more)

### Community 66 - "Slice 1 Task 5 Report: Portal BFF navigation + useNavigation"
Cohesion: 0.18
Nodes (10): Concerns, Files, Slice 1 Task 5 Report: Portal BFF navigation + useNavigation, Step 1: BFF route, Step 2: Service + hook, Step 3: Types + icons, Step 4: Commit, Steps Completed (+2 more)

### Community 67 - "next"
Cohesion: 0.12
Nodes (8): metadata, metadata, Props, metadata, ForgotPasswordForm(), SignupForm(), nextConfig, next

### Community 68 - "Slice 2 Task 2 Report: Members list BFF + client hooks"
Cohesion: 0.18
Nodes (10): Concerns, Files Touched, Slice 2 Task 2 Report: Members list BFF + client hooks, Step 1: Types, Step 2: BFF route, Step 3: Client services + hooks, Step 4: Commit, Steps Completed (+2 more)

### Community 69 - "Slice 1 Task 7 Report: Stub pages for new nav hrefs"
Cohesion: 0.29
Nodes (6): Files Created, Slice 1 Task 7 Report: Stub pages for new nav hrefs, Step 1: Add minimal placeholder pages, Step 2: Commit, Steps Completed, Summary

### Community 70 - "use-platform.ts"
Cohesion: 0.15
Nodes (22): AddItemForm(), useAdminNavigation(), useBillingOverview(), useCreateAdminNavItem(), useCreatePlatformCreator(), useCreatePlatformStaff(), usePatchAdminNavItem(), usePatchPlatformCreator() (+14 more)

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
Cohesion: 0.18
Nodes (17): DataTableColumnVisibility(), DataTableColumnVisibilityProps, getColumnLabel(), DataTableExport(), DataTableExportProps, DataTableToolbarProps, ICONS, NavIcon() (+9 more)

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
Cohesion: 0.13
Nodes (7): RouteContext, RouteContext, bodySchema, Shop, ShopRegion, ShopsListResponse, VerifyShopResponse

### Community 88 - "platform-shops-table.tsx"
Cohesion: 0.33
Nodes (4): columnHelper, PlatformShopsTable(), searchParamsParsers, shopsColumns

### Community 89 - "use-data-table-preferences.ts"
Cohesion: 0.33
Nodes (7): empty, useDataTablePreferences(), emptyPrefs(), PreferencesState, TablePreferences, useDataTablePreferencesStore, zustand

### Community 90 - "react"
Cohesion: 0.23
Nodes (12): GMV_BAND_OPTIONS, REGION_OPTIONS, SORT_OPTIONS, Badge(), badgeVariants, Input(), SelectOption, Skeleton() (+4 more)

### Community 91 - "proxy.ts"
Cohesion: 0.09
Nodes (36): POST(), POST(), POST(), RefreshResponse, POST(), metadata, LoginForm(), onSubmit() (+28 more)

### Community 93 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, shadcn, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+3 more)

### Community 94 - "stringSelectValue"
Cohesion: 0.15
Nodes (16): columnHelper, createPlatformCreatorsColumns(), PlatformCreatorsTableActions, STAGE_OPTIONS, STAGES, DataTablePagination(), DataTablePaginationProps, DEFAULT_PAGE_SIZE_OPTIONS (+8 more)

### Community 95 - "use-commerce.ts"
Cohesion: 0.08
Nodes (55): PlatformDiscoveryPageContent(), REGION_OPTIONS, TERM_REGION_OPTIONS, DiscoverPageContent(), useAnalyticsOverview(), useCrawlTerms(), useCreateCrawlTerm(), useCreateOrder() (+47 more)

### Community 96 - "api.ts"
Cohesion: 0.09
Nodes (21): LoginResponse, GET(), RegisterResponse, GET(), POST(), RouteContext, runtime, ApiClientError (+13 more)

### Community 97 - "auth-wrapper.tsx"
Cohesion: 0.29
Nodes (5): Props, AuthWrapper(), Props, gsap, @gsap/react

### Community 98 - "accept-invite-form.tsx"
Cohesion: 0.13
Nodes (22): AcceptInviteForm(), onAcceptAsSession(), onSubmitNewUser(), Props, OrgSettingsForm(), useAcceptInvite(), useMe(), useOrg() (+14 more)

### Community 99 - "use-shops.ts"
Cohesion: 0.14
Nodes (18): CallbackInner(), ShopsPageContent(), useConnectShop(), useDisconnectShop(), useStartTikTokOAuth(), useTikTokOAuthStatus(), useVerifyShop(), completeTikTokShopOAuth() (+10 more)

### Community 100 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, dev:turbo, lint, start, typecheck

### Community 101 - "creators-page-content.tsx"
Cohesion: 0.13
Nodes (16): columnHelper, createCreatorsColumns(), CreatorsTableActions, formatGmv(), listsToOptions(), CreatorsPageContent(), STAGE_OPTIONS, STAGES (+8 more)

### Community 102 - "MessagesPageContent"
Cohesion: 0.18
Nodes (14): MessagesPageContent(), useConversationMessages(), useConversations(), useMarkConversationsRead(), useOpenConversation(), useSendImMessage(), fetchConversationMessages(), fetchConversations() (+6 more)

### Community 103 - "samples-page-content.tsx"
Cohesion: 0.21
Nodes (15): createSamplesColumns(), SamplesPageContent(), STATUS_OPTIONS, useCreateManualSample(), useRefreshSampleFulfillment(), useReviewSample(), useSamples(), useSyncSamples() (+7 more)

### Community 104 - "types/platform.ts"
Cohesion: 0.16
Nodes (20): AdminNavResponse, AdminNavSection, BillingOverview, PlatformCrawlerRunResult, PlatformCrawlerStatus, PlatformCreatorListResponse, PlatformCreatorRow, PlatformListMeta (+12 more)

### Community 105 - "types/navigation.ts"
Cohesion: 0.20
Nodes (14): AppPageHeader(), AppSidebar(), SidebarNavItem(), areaLabel(), findActiveNavItem(), flattenNavItems(), isNavItemActive(), nested (+6 more)

### Community 106 - "navigation-admin-page.tsx"
Cohesion: 0.14
Nodes (13): AnalyticsPageContent(), formatMoney(), columnHelper, createNavigationAdminColumns(), NavigationAdminTableActions, NavItemDraft, Area, AREA_OPTIONS (+5 more)

### Community 107 - "authenticated-fetch.ts"
Cohesion: 0.11
Nodes (10): Ctx, POST(), Ctx, PATCH(), GET(), RouteContext, PATCH(), Props (+2 more)

### Community 108 - "discover-columns.tsx"
Cohesion: 0.15
Nodes (15): analyticsTopCreatorsColumns, columnHelper, formatCreatorGmv(), formatMoney(), columnHelper, createDiscoverColumns(), DiscoverTableActions, formatGmv() (+7 more)

### Community 109 - "platform.validations.ts"
Cohesion: 0.15
Nodes (14): ApiStaff, PATCH(), RouteContext, ApiStaff, flatten(), GET(), POST(), CreateProxySchemaType (+6 more)

### Community 110 - "staff-columns.tsx"
Cohesion: 0.15
Nodes (13): InviteStaffDialog(), handleOpenChange(), onSubmit(), columnHelper, createdAtFormatter, staffColumns, statusBadgeClass(), searchParamsParsers (+5 more)

### Community 111 - "dropdown-menu.tsx"
Cohesion: 0.14
Nodes (6): ROLES, StaffRowActions(), DropdownMenuCheckboxItem(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuSeparator()

### Community 112 - "PlatformCreatorsPageContent"
Cohesion: 0.18
Nodes (9): PlatformCreatorsPageContent(), usePlatformCreators(), usePlatformOrganizations(), usePlatformShops(), fetchPlatformCreators(), fetchPlatformOrganizations(), fetchPlatformShops(), fetchPlatformStaff() (+1 more)

### Community 113 - "app-topbar.tsx"
Cohesion: 0.21
Nodes (5): AppTopbar(), initialsFromName(), Avatar(), AvatarFallback(), NavBrand

### Community 114 - "use-invites.ts"
Cohesion: 0.32
Nodes (9): useAffiliateInvites(), useCreateAffiliateInvite(), createAffiliateInvite(), fetchAffiliateInvites(), fetchInviteProducts(), parseJson(), AffiliateInvite, AffiliateInviteRecipient (+1 more)

### Community 115 - "zod"
Cohesion: 0.18
Nodes (7): PATCH(), patchSchema, Props, createSchema, POST(), bodySchema, zod

### Community 116 - "use-automations.ts"
Cohesion: 0.36
Nodes (7): useAutomationRuns(), useCreateAutomationRun(), createAutomationRun(), fetchAutomationRuns(), parseJson(), AutomationRun, AutomationRunStep

### Community 117 - "CrawlerPageContent"
Cohesion: 0.25
Nodes (5): CrawlerPageContent(), usePlatformCrawler(), useRunPlatformCrawlerDryCheck(), fetchPlatformCrawler(), runPlatformCrawlerDryCheck()

### Community 118 - "HomeOverview"
Cohesion: 0.21
Nodes (3): cents(), HomeOverview(), ConnectShopDialog()

### Community 119 - "theme-toggle.tsx"
Cohesion: 0.48
Nodes (6): applyTheme(), getServerSnapshot(), getSnapshot(), subscribe(), ThemeToggle(), toggle()

### Community 120 - "InviteMemberDialog"
Cohesion: 0.40
Nodes (5): InviteMemberDialog(), handleOpenChange(), onSubmit(), resetDialogState(), createInvite()

### Community 121 - "sonner.tsx"
Cohesion: 0.60
Nodes (5): brandToastVars(), getServerTheme(), getTheme(), subscribe(), Toaster()

### Community 122 - "AddProxyDialog"
Cohesion: 0.50
Nodes (5): AddProxyDialog(), handleOpenChange(), onSubmit(), useCreatePlatformProxy(), createPlatformProxy()

### Community 123 - "proxies-row-actions.tsx"
Cohesion: 0.50
Nodes (3): ProxyRowActions(), usePatchPlatformProxy(), patchPlatformProxy()

### Community 124 - "[listId]/members/route.ts"
Cohesion: 0.50
Nodes (3): Ctx, GET(), POST()

### Community 125 - "[id]/messages/route.ts"
Cohesion: 0.50
Nodes (3): Ctx, GET(), POST()

### Community 126 - "DataTableToolbar"
Cohesion: 0.67
Nodes (3): DataTableToolbar(), closeSearch(), handleSearchKeyDown()

### Community 127 - "IconRailFlyout"
Cohesion: 0.83
Nodes (4): IconRailFlyout(), clearCloseTimer(), hide(), show()

## Knowledge Gaps
- **507 isolated node(s):** `Ctx`, `Ctx`, `Ctx`, `Ctx`, `Ctx` (+502 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 727 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `button.tsx`, `package.json`, `app-shell.tsx`, `shops-table.tsx`, `app/layout.tsx`, `field.tsx`, `proxies-page-content.tsx`, `campaigns-page-content.tsx`, `input-group.tsx`, `organizations-table.tsx`, `data-table.tsx`, `members-columns.tsx`, `data-table-toolbar.tsx`, `platform-shops-table.tsx`, `use-data-table-preferences.ts`, `proxy.ts`, `stringSelectValue`, `use-commerce.ts`, `auth-wrapper.tsx`, `accept-invite-form.tsx`, `use-shops.ts`, `creators-page-content.tsx`, `samples-page-content.tsx`, `navigation-admin-page.tsx`, `staff-columns.tsx`, `dropdown-menu.tsx`, `app-topbar.tsx`, `theme-toggle.tsx`, `sonner.tsx`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Why does `@tanstack/react-query` connect `accept-invite-form.tsx` to `button.tsx`, `package.json`, `use-shops.ts`, `MessagesPageContent`, `use-platform.ts`, `samples-page-content.tsx`, `proxies-page-content.tsx`, `use-creators.ts`, `types/navigation.ts`, `app/layout.tsx`, `app-topbar.tsx`, `use-invites.ts`, `use-automations.ts`, `services/billing.ts`, `use-commerce.ts`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `authenticatedApiFetch()` connect `authenticatedApiFetch` to `api.ts`, `platform/creators/[id]/route.ts`, `fulfillments/refresh/route.ts`, `authenticated-fetch.ts`, `platform.validations.ts`, `current/members/route.ts`, `zod`, `types/shops.ts`, `[listId]/members/route.ts`, `[id]/messages/route.ts`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **What connects `Ctx`, `Ctx`, `Ctx` to the rest of the system?**
  _507 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `components.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `app-shell.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11594202898550725 - nodes in this community are weakly interconnected._