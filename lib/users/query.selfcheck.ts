import { MOCK_USERS } from "./mock-data";
import { filterSortPaginateUsers, usersToCsv } from "./query";

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const page1 = filterSortPaginateUsers(MOCK_USERS, { page: 1, pageSize: 20 });
assert(page1.data.length === 20, "page size 20");
assert(page1.meta.total === 100, "total 100");

const searched = filterSortPaginateUsers(MOCK_USERS, {
  page: 1,
  pageSize: 20,
  search: "user1@",
});
assert(searched.meta.total >= 1, "search finds rows");

const sorted = filterSortPaginateUsers(MOCK_USERS, {
  page: 1,
  pageSize: 5,
  sortBy: "name",
  sortOrder: "desc",
});
assert(sorted.data[0]!.name >= sorted.data[1]!.name, "desc sort");

const csv = usersToCsv(page1.data);
assert(csv.startsWith("id,name,email"), "csv header");

console.log("lib/users/query.selfcheck: ok");
