export type UserRole = "admin" | "manager" | "viewer";
export type UserStatus = "active" | "invited" | "disabled";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  shop: string;
  createdAt: string;
};

export type UsersListParams = {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: keyof User;
  sortOrder?: "asc" | "desc";
};

export type UsersListResponse = {
  data: User[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
};

export type UsersExportFormat = "csv" | "xlsx";

export type UsersExportParams = {
  format: UsersExportFormat;
  search?: string;
  sortBy?: keyof User;
  sortOrder?: "asc" | "desc";
};
