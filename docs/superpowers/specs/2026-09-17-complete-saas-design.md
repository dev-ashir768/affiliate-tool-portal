# Tiksly Complete SaaS — Master Design (Portal)

Canonical full spec lives in the APIs repo:

`../affiliate-tool-apis/docs/superpowers/specs/2026-09-17-complete-saas-design.md`

(from monorepo root: `affiliate-tool-apis/docs/superpowers/specs/2026-09-17-complete-saas-design.md`)

## Summary (locked)

| Topic | Decision |
|-------|----------|
| Backoffice | Platform staff: SUPERADMIN, FINANCE, OPS (`PlatformMembership`) |
| Dashboard | Paying subscribers (org OWNER/ADMIN/MEMBER) |
| Menus | Postgres NavSection/NavItem + `GET /navigation/:area` |
| Login | One `/login` → staff to backoffice, else `/home` |
| Team | Dashboard `/team` — **not** backoffice users |
| Build | Slices 1→6 after this design is approved |

Please review the **canonical** file in `affiliate-tool-apis` before implementation planning.
