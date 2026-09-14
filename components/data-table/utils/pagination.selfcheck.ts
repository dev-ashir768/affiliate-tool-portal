import { getPaginationItems } from "./pagination";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

assert(
  JSON.stringify(getPaginationItems(1, 13)) ===
    JSON.stringify([1, 2, "ellipsis", 13]),
  "page 1",
);
assert(
  JSON.stringify(getPaginationItems(7, 13)) ===
    JSON.stringify([1, "ellipsis", 6, 7, 8, "ellipsis", 13]),
  "middle",
);
console.log("pagination.selfcheck: ok");
