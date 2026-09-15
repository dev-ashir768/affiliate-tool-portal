# Graph Report - affiliate-tool-portal  (2026-09-15)

## Corpus Check
- 123 files · ~215,222 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 710 nodes · 1064 edges · 56 communities (28 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3aadc8b2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- package.json
- components.json
- app-shell.tsx
- data-table.tsx
- app/layout.tsx
- compilerOptions
- dependencies
- dropdown-menu.tsx
- Shopify-style App Shell Design
- Production DataTable Design
- data-table-pagination.tsx
- shadcn
- nav-item.tsx
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

## God Nodes (most connected - your core abstractions)
1. `react` - 28 edges
2. `cn` - 27 edges
3. `Button()` - 17 edges
4. `compilerOptions` - 16 edges
5. `lucide-react` - 15 edges
6. `Production DataTable Design` - 14 edges
7. `Task 10 Report: Manual verification pass` - 12 edges
8. `@tanstack/react-table` - 11 edges
9. `File structure` - 11 edges
10. `Shopify-style App Shell Design` - 9 edges

## Surprising Connections (you probably didn't know these)
- `IconRailFlyout()` --calls--> `isNavItemActive()`  [EXTRACTED]
  components/layout/nav-item.tsx → lib/navigation.ts
- `GET()` --calls--> `filterUsers()`  [EXTRACTED]
  app/api/users/export/route.ts → lib/users/query.ts
- `GET()` --calls--> `sortUsers()`  [EXTRACTED]
  app/api/users/export/route.ts → lib/users/query.ts
- `GET()` --calls--> `usersToCsv()`  [EXTRACTED]
  app/api/users/export/route.ts → lib/users/query.ts
- `GET()` --calls--> `filterSortPaginateUsers()`  [EXTRACTED]
  app/api/users/route.ts → lib/users/query.ts

## Import Cycles
- None detected.

## Communities (56 total, 5 thin omitted)

### Community 1 - "react"
Cohesion: 0.08
Nodes (35): Card(), CardContent(), CardFooter(), CardHeader(), CardTitle(), Field(), FieldDescription(), FieldError() (+27 more)

### Community 2 - "package.json"
Cohesion: 0.05
Nodes (38): Props, AuthWrapper(), Props, devDependencies, eslint, eslint-config-next, shadcn, tailwindcss (+30 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "app-shell.tsx"
Cohesion: 0.08
Nodes (25): Props, Props, AppPageHeader(), AppShell(), getDesktopServerSnapshot(), getDesktopSnapshot(), subscribeDesktop(), AppSidebar() (+17 more)

### Community 5 - "data-table.tsx"
Cohesion: 0.08
Nodes (35): columnHelper, createdAtFormatter, statusVariant(), usersColumns, cycleSorting(), DataTableColumnHeader(), DataTableColumnHeaderProps, DataTable() (+27 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.06
Nodes (20): metadata, metadata, metadata, geistMono, geistSans, metadata, spaceGrotesk, ForgotPasswordForm() (+12 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 8 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @base-ui/react, class-variance-authority, cn, exceljs, gsap, @gsap/react, @hello-pangea/dnd (+14 more)

### Community 9 - "dropdown-menu.tsx"
Cohesion: 0.07
Nodes (24): DataTableColumnVisibility(), DataTableColumnVisibilityProps, getColumnLabel(), DataTableEmpty(), Props, DataTableError(), Props, DataTableExport() (+16 more)

### Community 11 - "Shopify-style App Shell Design"
Cohesion: 0.11
Nodes (17): Architecture, Component responsibilities, Data flow, Decisions (locked), Dummy content (v1), Goal, Layout grid, Loading / error (+9 more)

### Community 12 - "Production DataTable Design"
Cohesion: 0.09
Nodes (22): Accessibility, Architecture, Behavior details, Boundaries, Component API, Decisions (locked), Export — `GET /api/users/export`, Folder layout (+14 more)

### Community 13 - "data-table-pagination.tsx"
Cohesion: 0.15
Nodes (9): DataTablePagination(), DataTablePaginationProps, DEFAULT_PAGE_SIZE_OPTIONS, getPaginationItems(), PaginationItem, SelectContent(), SelectItem(), SelectTrigger() (+1 more)

### Community 15 - "nav-item.tsx"
Cohesion: 0.13
Nodes (19): ICONS, NavIcon(), IconRailFlyout(), clearCloseTimer(), hide(), show(), applyTheme(), getServerSnapshot() (+11 more)

### Community 19 - "users-table.tsx"
Cohesion: 0.07
Nodes (42): GET(), runtime, GET(), parseParams(), runtime, searchParamsParsers, UsersTable(), downloadBlob() (+34 more)

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

## Knowledge Gaps
- **300 isolated node(s):** `npx`, `metadata`, `Props`, `metadata`, `metadata` (+295 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 421 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `dialog.tsx`, `package.json`, `app-shell.tsx`, `data-table.tsx`, `app/layout.tsx`, `dropdown-menu.tsx`, `data-table-pagination.tsx`, `nav-item.tsx`, `users-table.tsx`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `cn` connect `react` to `dialog.tsx`, `package.json`, `app-shell.tsx`, `data-table.tsx`, `app/layout.tsx`, `dropdown-menu.tsx`, `progress.tsx`, `data-table-pagination.tsx`, `nav-item.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `npx`, `metadata`, `Props` to the rest of the system?**
  _300 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.07740112994350283 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.04994192799070848 - nodes in this community are weakly interconnected._
- **Should `components.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._