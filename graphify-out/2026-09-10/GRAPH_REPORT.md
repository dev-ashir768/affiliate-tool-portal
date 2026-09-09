# Graph Report - affiliate-tool-portal  (2026-09-09)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 281 nodes · 340 edges · 24 communities (10 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4f258673`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- login-form.tsx
- package.json
- components.json
- dialog.tsx
- react
- app/layout.tsx
- compilerOptions
- dependencies
- devDependencies
- login/page.tsx
- shadcn
- eslint.config.mjs
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `cn` - 19 edges
2. `react` - 19 edges
3. `compilerOptions` - 16 edges
4. `Button()` - 6 edges
5. `class-variance-authority` - 6 edges
6. `aliases` - 6 edges
7. `tailwind` - 6 edges
8. `scripts` - 5 edges
9. `lucide-react` - 5 edges
10. `QueryProvider()` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (24 total, 4 thin omitted)

### Community 0 - "cn"
Cohesion: 0.10
Nodes (15): Badge(), badgeVariants, Button(), buttonVariants, InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants (+7 more)

### Community 1 - "login-form.tsx"
Cohesion: 0.11
Nodes (15): Card(), CardContent(), CardFooter(), CardHeader(), CardTitle(), Field(), FieldError(), FieldGroup() (+7 more)

### Community 2 - "package.json"
Cohesion: 0.08
Nodes (24): name, private, scripts, build, dev, lint, start, version (+16 more)

### Community 3 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 5 - "react"
Cohesion: 0.11
Nodes (6): Props, Props, Props, AuthWrapper(), Props, react

### Community 6 - "app/layout.tsx"
Cohesion: 0.13
Nodes (13): geistMono, geistSans, metadata, spaceGrotesk, Props, Providers(), handleMutationError(), handleQueryError() (+5 more)

### Community 7 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 8 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, @base-ui/react, class-variance-authority, cn, @hello-pangea/dnd, @hookform/resolvers, lucide-react, next (+9 more)

### Community 12 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, shadcn, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+2 more)

### Community 13 - "login/page.tsx"
Cohesion: 0.25
Nodes (4): metadata, LoginForm(), nextConfig, next

## Knowledge Gaps
- **99 isolated node(s):** `Props`, `Props`, `Props`, `Props`, `Props` (+94 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 200 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `cn`, `login-form.tsx`, `package.json`, `dialog.tsx`, `app/layout.tsx`, `dropdown-menu.tsx`, `table.tsx`, `sheet.tsx`?**
  _High betweenness centrality (0.219) - this node is a cross-community bridge._
- **Why does `cn` connect `cn` to `login-form.tsx`, `package.json`, `dialog.tsx`, `react`, `app/layout.tsx`, `dropdown-menu.tsx`, `table.tsx`, `sheet.tsx`?**
  _High betweenness centrality (0.198) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **What connects `Props`, `Props`, `Props` to the rest of the system?**
  _99 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.10344827586206896 - nodes in this community are weakly interconnected._
- **Should `login-form.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10582010582010581 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._