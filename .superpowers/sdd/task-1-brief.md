### Task 1: Dependencies, NuqsAdapter, shadcn primitives

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `providers/index.tsx`
- Create: `components/ui/checkbox.tsx` (via shadcn)
- Create: `components/ui/skeleton.tsx` (via shadcn)

**Interfaces:**
- Consumes: existing `Providers`
- Produces: `zustand`, `nuqs`, `exceljs` installed; `NuqsAdapter` wrapping app; Checkbox + Skeleton available

- [ ] **Step 1: Install packages**

```bash
npm install zustand nuqs exceljs
```

Expected: packages appear in `package.json` dependencies; install exits 0.

- [ ] **Step 2: Add shadcn Checkbox and Skeleton**

```bash
npx shadcn@latest add checkbox skeleton --yes
```

Expected: `components/ui/checkbox.tsx` and `components/ui/skeleton.tsx` exist.

- [ ] **Step 3: Wrap providers with NuqsAdapter**

```tsx
// providers/index.tsx
import { ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import QueryProvider from "./query-provider";

type Props = { children: ReactNode };

export const Providers = ({ children }: Props) => {
  return (
    <NuqsAdapter>
      <QueryProvider>{children}</QueryProvider>
    </NuqsAdapter>
  );
};
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json providers/index.tsx components/ui/checkbox.tsx components/ui/skeleton.tsx
git commit -m "chore: add zustand, nuqs, exceljs, and DataTable UI primitives"
```

---

