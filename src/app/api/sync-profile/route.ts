// src/app/api/sync-profile/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createServerSupabase } from "@/utils/supabase/server"

export async function POST() {
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = data.user

    const profile = await prisma.userProfile.upsert({
      where: { supabaseId: user.id },
      update: {
        displayName: user.user_metadata?.full_name ?? null,
      },
      create: {
        supabaseId: user.id,
        displayName: user.user_metadata?.full_name ?? null,
        role: "user",
      },
    })

    return NextResponse.json({ ok: true, profile })
  } catch (e: any) {
    console.error("sync-profile error:", e)
    return NextResponse.json(
      { error: String(e?.message ?? e) },
      { status: 500 }
    )
  }
}

