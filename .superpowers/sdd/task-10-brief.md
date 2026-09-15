### Task 10: Manual verification pass

**Files:** none (QA only); fix bugs if found then commit fixes.

- [ ] **Step 1: Run checklist from spec**

1. `/backoffice/users` loads with skeleton then rows.
2. Page / pageSize change â†’ network request; â€œShowing Xâ€“Y of Zâ€; Prev/Next bounds.
3. Sort cycles none â†’ asc â†’ desc â†’ none; URL params update.
4. Search debounced; page resets to 1; empty copy + clear works.
5. Column hide/show, reorder, resize survive refresh (localStorage `datatable-preferences`).
6. Refresh refetches; spinner; no double-fire.
7. Export CSV + Excel download with current search/sort.
8. Simulate error (temporary throw in `fetchUsers`) â†’ error UI + Try Again.
9. Narrow viewport â†’ horizontal scroll; toolbar wraps.

- [ ] **Step 2: Commit any fixes**

```bash
git add -A
git commit -m "fix: address DataTable QA findings"
```

(Skip empty commit if nothing to fix.)

---

## Self-review

**1. Spec coverage**
- Controlled DataTable + RQ + services + mock API â†’ Tasks 3â€“4, 8â€“9
- URL state (`nuqs`) â†’ Tasks 1, 9
- Zustand prefs â†’ Task 5
- Server pagination/sort/search â†’ Tasks 2â€“3, 8â€“9
- Column visibility/order/sizing + DnD + resize â†’ Tasks 7â€“8
- Export CSV/XLSX via mock API â†’ Tasks 3â€“4, 7, 9
- Toolbar / pagination / skeleton / empty / error / a11y â†’ Tasks 6â€“8
- Users demo page â†’ Task 9
- Manual QA â†’ Task 10

**2. Placeholder scan:** No TBD/TODO left; v9 type arity note is an explicit â€œfix against compilerâ€ instruction, not an open requirement.

**3. Type consistency:** `UsersListParams` / `UsersListResponse` / `tableId="backoffice-users"` / `dataTableFeatures` / `DataTableExportFormat` names align across tasks.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-09-14-data-table.md`. Two execution options:

**1. Subagent-Driven (recommended)** â€” dispatch a fresh subagent per task, review between tasks, fast iteration  

**2. Inline Execution** â€” execute tasks in this session using executing-plans, batch execution with checkpoints  

Which approach?
