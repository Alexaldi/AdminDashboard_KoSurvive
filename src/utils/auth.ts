import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { createServerSupabase } from "@/utils/supabase/server"

export async function requireAdmin() {
  const supabase = await createServerSupabase()
  const { data, error } = await supabase.auth.getUser()
  const user = data?.user

  if (error || !user) {
    redirect("/authentication/login")
  }

  const profile = await prisma.userProfile.findUnique({
    where: { supabaseId: user.id },
  })

  if (!profile || profile.role !== "admin") {
    redirect("/authentication/login")
  }

  return profile
}

