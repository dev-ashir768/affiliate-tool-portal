import assert from "node:assert/strict";
import { resolvePostAuthRedirect } from "./access-token";

// Staff: cannot follow merchant next
assert.equal(
  resolvePostAuthRedirect({
    next: "/home",
    platformRole: "OPS",
  }),
  "/backoffice/users",
);
assert.equal(
  resolvePostAuthRedirect({
    next: "/backoffice/finance",
    platformRole: "OPS",
  }),
  "/backoffice/finance",
);

// Merchant: cannot follow backoffice next
assert.equal(
  resolvePostAuthRedirect({
    next: "/backoffice/users",
    platformRole: null,
  }),
  "/home",
);
assert.equal(
  resolvePostAuthRedirect({
    next: "/billing",
    redirectTo: "/onboarding",
    platformRole: null,
  }),
  "/billing",
);

console.log("access-token.selfcheck: ok");
