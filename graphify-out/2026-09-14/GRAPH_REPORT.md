# Graph Report - affiliate-tool-portal  (2026-09-14)

## Corpus Check
- 121 files · ~213,173 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 500 nodes · 736 edges · 30 communities (18 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `95b27b7b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- (backoffice)/layout.tsx
- Task 7 Report: Toolbar pieces (header, visibility, pagination, export, toolbar)
- package.json
- components.json
- Task 8 Report: Main DataTable (TanStack v9 + DnD + resize)
- app/layout.tsx
- compilerOptions
- dependencies
- react
- File structure
- Shopify-style App Shell Design
- login-form.tsx
- shadcn
- users-table.tsx
- eslint.config.mjs
- postcss.config.mjs
- Production DataTable Design
- data-table.tsx
- data-table-pagination.tsx
- Task 6 Report: DataTable types, empty/error/skeleton, download + page helpers
- (auth)/layout.tsx
- tabs.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 24 edges
2. `cn` - 23 edges
3. `compilerOptions` - 16 edges
4. `Production DataTable Design` - 14 edges
5. `Button()` - 13 edges
6. `File structure` - 11 edges
7. `@tanstack/react-table` - 11 edges
8. `lucide-react` - 10 edges
9. `Shopify-style App Shell Design` - 9 edges
10. `Task 7 Report: Toolbar pieces (header, visibility, pagination, export, toolbar)` - 8 edges

## Surprising Connections (you probably didn't know these)
- `UsersTable()` --calls--> `useExportUsers()`  [EXTRACTED]
  components/backoffice/users/users-table.tsx → hooks/use-users.ts
- `UsersTable()` --calls--> `useUsersQuery()`  [EXTRACTED]
  components/backoffice/users/users-table.tsx → hooks/use-users.ts
- `GET()` --calls--> `filterUsers()`  [EXTRACTED]
  app/api/users/export/route.ts → lib/users/query.ts
- `GET()` --calls--> `sortUsers()`  [EXTRACTED]
  app/api/users/export/route.ts → lib/users/query.ts
- `GET()` --calls--> `usersToCsv()`  [EXTRACTED]
  app/api/users/export/route.ts → lib/users/query.ts

## Import Cycles
- None detected.

## Communities (30 total, 4 thin omitted)

### Community 1 - "Task 7 Report: Toolbar pieces (header, visibility, pagination, export, toolbar)"
Cohesion: 0.11
Nodes (18): Concerns / Notes, Files Created, Fix, Minor, Post-Review Fix (search debounce sync), Problem, Self-Review, Step 1: Column header (sort cycle + drag handle) (+10 more)

### Community 2 - "package.json"
Cohesion: 0.05
Nodes (42): devDependencies, eslint, eslint-config-next, shadcn, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+34 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 4 - "Task 8 Report: Main DataTable (TanStack v9 + DnD + resize)"
Cohesion: 0.15
Nodes (12): Concerns / Notes, Files Created, Review follow-up: flexRender function headers, Self-Review, Step 1: Implement DataTable, Step 2: Barrel export, Step 3: Typecheck, Step 4: Commit (+4 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.22
Nodes (6): geistMono, geistSans, metadata, spaceGrotesk, Props, Providers()

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 8 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @base-ui/react, class-variance-authority, cn, exceljs, gsap, @gsap/react, @hello-pangea/dnd (+14 more)

### Community 9 - "react"
Cohesion: 0.05
Nodes (31): Props, cycleSorting(), DataTableColumnHeader(), DataTableColumnHeaderProps, DataTableColumnVisibility(), DataTableColumnVisibilityProps, getColumnLabel(), DataTableExport() (+23 more)

### Community 10 - "File structure"
Cohesion: 0.12
Nodes (15): Execution handoff, File structure, Global Constraints, Production DataTable Implementation Plan, Self-review, Task 10: Manual verification pass, Task 1: Dependencies, NuqsAdapter, shadcn primitives, Task 2: Users types, mock data, and query helpers (+7 more)

### Community 11 - "Shopify-style App Shell Design"
Cohesion: 0.11
Nodes (17): Architecture, Component responsibilities, Data flow, Decisions (locked), Dummy content (v1), Goal, Layout grid, Loading / error (+9 more)

### Community 13 - "login-form.tsx"
Cohesion: 0.07
Nodes (20): metadata, LoginForm(), Card(), CardContent(), CardFooter(), CardHeader(), CardTitle(), Field() (+12 more)

### Community 15 - "users-table.tsx"
Cohesion: 0.07
Nodes (41): GET(), runtime, GET(), parseParams(), runtime, columnHelper, statusVariant(), UserRow (+33 more)

### Community 24 - "Production DataTable Design"
Cohesion: 0.09
Nodes (22): Accessibility, Architecture, Behavior details, Boundaries, Component API, Decisions (locked), Export — `GET /api/users/export`, Folder layout (+14 more)

### Community 25 - "data-table.tsx"
Cohesion: 0.09
Nodes (29): DataTable(), DataTableComponentProps, DataTableHeaderCell(), DataTableEmpty(), Props, DataTableError(), Props, getAriaSort() (+21 more)

### Community 27 - "data-table-pagination.tsx"
Cohesion: 0.15
Nodes (9): DataTablePagination(), DataTablePaginationProps, DEFAULT_PAGE_SIZE_OPTIONS, getPaginationItems(), PaginationItem, SelectContent(), SelectItem(), SelectTrigger() (+1 more)

### Community 29 - "Task 6 Report: DataTable types, empty/error/skeleton, download + page helpers"
Cohesion: 0.15
Nodes (12): Concerns / Notes, Files Created, Post-Review Fix: `downloadBlob` (Task 6 review), Self-Review, Step 1: Shared features + props types, Step 2: Download + pagination helpers, Step 3: Empty / Error / Skeleton, Step 4: Commit (+4 more)

### Community 30 - "(auth)/layout.tsx"
Cohesion: 0.40
Nodes (3): Props, AuthWrapper(), Props

### Community 34 - "tabs.tsx"
Cohesion: 0.24
Nodes (5): Badge(), badgeVariants, TabsList(), tabsListVariants, class-variance-authority

## Knowledge Gaps
- **207 isolated node(s):** `searchParamsParsers`, `DataTableColumnVisibilityProps`, `Props`, `UsersExportFormat`, `Props` (+202 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 298 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `(backoffice)/layout.tsx`, `avatar.tsx`, `package.json`, `app/layout.tsx`, `login-form.tsx`, `users-table.tsx`, `data-table.tsx`, `sheet.tsx`, `data-table-pagination.tsx`, `(auth)/layout.tsx`?**
  _High betweenness centrality (0.152) - this node is a cross-community bridge._
- **Why does `cn` connect `react` to `avatar.tsx`, `progress.tsx`, `tabs.tsx`, `package.json`, `app/layout.tsx`, `login-form.tsx`, `data-table.tsx`, `sheet.tsx`, `data-table-pagination.tsx`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **What connects `searchParamsParsers`, `DataTableColumnVisibilityProps`, `Props` to the rest of the system?**
  _207 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Task 7 Report: Toolbar pieces (header, visibility, pagination, export, toolbar)` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.048625792811839326 - nodes in this community are weakly interconnected._
- **Should `components.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._