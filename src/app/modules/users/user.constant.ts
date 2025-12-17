export const USER_ROLE = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MAINTAINER: "MAINTAINER",
  OWNER: "OWNER",
  USER: "USER",
  WORKER: "WORKER",
  EMPLOYEE: "EMPLOYEE",
} as const;


export const searchText = ["email", "mobile"];

export const  filterableFields = ["email", "mobile", "sort", "page", "limit", "searchTerm", "role", "sortBy", "sortOrder"];