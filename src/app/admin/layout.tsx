// src/app/admin/layout.tsx
import { requireAdmin } from "@/utils/auth"
import AdminLayoutClient from "./AdminLayoutClient"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 🚨 Proteksi admin di server
  await requireAdmin()

  // Kalau lolos, baru render layout client
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}

