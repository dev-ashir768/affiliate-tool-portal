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

const formulaUser = {
  id: "=1+1",
  name: "+cmd",
  email: "user@example.com",
  role: "admin" as const,
  status: "active" as const,
  shop: "@SUM(A1)",
  createdAt: "\t2024-01-01",
};
const formulaCsv = usersToCsv([formulaUser]);
assert(formulaCsv.includes("'=1+1"), "csv formula id");
assert(formulaCsv.includes("'+cmd"), "csv formula name");
assert(formulaCsv.includes("'@SUM(A1)"), "csv formula shop");
assert(formulaCsv.includes("'\t2024-01-01"), "csv formula tab");

const crUser = {
  ...formulaUser,
  name: "-1+1",
  shop: "Acme\rCo",
};
const crCsv = usersToCsv([crUser]);
assert(crCsv.includes("'-1+1"), "csv formula hyphen");
assert(crCsv.includes('"Acme\rCo"'), "csv quotes carriage return");

const crPrefixUser = { ...formulaUser, name: "\rHYDRATE" };
const crPrefixCsv = usersToCsv([crPrefixUser]);
assert(crPrefixCsv.includes('"\'\rHYDRATE"'), "csv formula cr prefix quoted");

console.log("lib/users/query.selfcheck: ok");
