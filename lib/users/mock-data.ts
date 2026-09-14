import type { User, UserRole, UserStatus } from "@/types/users";

const roles: UserRole[] = ["admin", "manager", "viewer"];
const statuses: UserStatus[] = ["active", "invited", "disabled"];
const shops = ["Acme Co", "Globex", "Initech", "Umbrella", "Stark Industries"];

function pad(n: number) {
  return String(n).padStart(3, "0");
}

export const MOCK_USERS: User[] = Array.from({ length: 100 }, (_, i) => {
  const n = i + 1;
  return {
    id: `usr_${pad(n)}`,
    name: `User ${pad(n)}`,
    email: `user${n}@example.com`,
    role: roles[i % roles.length]!,
    status: statuses[i % statuses.length]!,
    shop: shops[i % shops.length]!,
    createdAt: new Date(Date.UTC(2024, i % 12, (i % 28) + 1)).toISOString(),
  };
});
