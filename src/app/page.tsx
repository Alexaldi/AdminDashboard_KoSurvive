// src/app/page.tsx
import { redirect } from "next/navigation"
import { requireAdmin } from "@/utils/auth"

export default async function RootPage() {
  // wajib login + admin
  await requireAdmin()

  // kalau lolos → masuk ke dashboard layout
  redirect("/admin")
  return null // return null biar tetap component valid
}

