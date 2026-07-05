"use client";

import { useState } from "react";
import { SEED_USERS, type Role, type User } from "@/features/admin/lib/users";

let idSeq = 100;

export default function AdminUsersPage() {
  // Learning project: state client-side (mock). Nối API thật ở giai đoạn sau.
  const [users, setUsers] = useState<User[]>(SEED_USERS);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Viewer");

  // Mô phỏng RBAC: chỉ Admin mới thao tác được (NFR-07/08).
  const currentRole: Role = "Admin";
  const canManage = currentRole === "Admin";

  function addUser(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setUsers((u) => [
      ...u,
      { id: `u${++idSeq}`, name: name.trim(), email: email.trim(), role, active: true },
    ]);
    setName("");
    setEmail("");
    setRole("Viewer");
  }

  function toggleRole(id: string) {
    setUsers((u) =>
      u.map((x) =>
        x.id === id ? { ...x, role: x.role === "Admin" ? "Viewer" : "Admin" } : x,
      ),
    );
  }

  function toggleActive(id: string) {
    setUsers((u) =>
      u.map((x) => (x.id === id ? { ...x, active: !x.active } : x)),
    );
  }

  function remove(id: string) {
    setUsers((u) => u.filter((x) => x.id !== id));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-h1 font-bold text-text">Quản lý người dùng</h1>
          <p className="mt-1 text-slate-600">
            Tạo tài khoản và phân quyền Viewer / Admin (FR-06).
          </p>
        </div>
        <span className="badge bg-primary/10 text-primary">
          Bạn đang là: {currentRole}
        </span>
      </div>

      {!canManage && (
        <div className="card mt-6 border-error/30 bg-red-50 text-error">
          Bạn không có quyền truy cập chức năng quản trị.
        </div>
      )}

      {canManage && (
        <>
          {/* Form thêm người dùng */}
          <form
            onSubmit={addUser}
            className="card mt-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end"
          >
            <label className="text-sm">
              <span className="mb-1 block font-medium text-text">Họ tên</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
                placeholder="Nguyễn Văn A"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-text">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
                placeholder="a@onward.dev"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-text">Vai trò</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="rounded-md border border-slate-200 px-3 py-2 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
              >
                <option value="Viewer">Viewer</option>
                <option value="Admin">Admin</option>
              </select>
            </label>
            <button type="submit" className="btn-primary">
              Thêm
            </button>
          </form>

          {/* Gợi ý cuộn ngang trên mobile (fix #5) */}
          <p className="mt-6 text-caption text-text-muted lg:hidden">
            ← Vuốt ngang bảng để xem đầy đủ thao tác →
          </p>

          {/* Bảng người dùng */}
          <div className="card mt-2 overflow-x-auto p-0 lg:mt-6">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-text-muted">
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Người dùng</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Vai trò</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3">
                      <div className="font-medium text-text">{u.name}</div>
                      <div className="text-caption text-text-muted">{u.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge ${
                          u.role === "Admin"
                            ? "bg-primary/10 text-primary"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge ${
                          u.active
                            ? "bg-emerald-100 text-success"
                            : "bg-red-100 text-error"
                        }`}
                      >
                        {u.active ? "Hoạt động" : "Khóa"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleRole(u.id)}
                          className="rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                        >
                          Đổi quyền
                        </button>
                        <button
                          onClick={() => toggleActive(u.id)}
                          className="rounded px-2 py-1 text-xs font-medium text-warning hover:bg-amber-50"
                        >
                          {u.active ? "Khóa" : "Mở"}
                        </button>
                        <button
                          onClick={() => remove(u.id)}
                          className="rounded px-2 py-1 text-xs font-medium text-error hover:bg-red-50"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
