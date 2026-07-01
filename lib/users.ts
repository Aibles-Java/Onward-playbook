/**
 * Dữ liệu người dùng mẫu cho UC_ManageUsers (FR-06).
 * Learning project: quản lý trạng thái phía client (mock), chưa nối backend/auth thật.
 */
export type Role = "Admin" | "Viewer";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
};

export const SEED_USERS: User[] = [
  {
    id: "u1",
    name: "Nguyễn Huyền",
    email: "huyen@onward.dev",
    role: "Admin",
    active: true,
  },
  {
    id: "u2",
    name: "Trần Minh",
    email: "minh@onward.dev",
    role: "Viewer",
    active: true,
  },
  {
    id: "u3",
    name: "Lê An",
    email: "an@onward.dev",
    role: "Viewer",
    active: true,
  },
  {
    id: "u4",
    name: "Phạm Content",
    email: "writer@onward.dev",
    role: "Viewer",
    active: false,
  },
];
