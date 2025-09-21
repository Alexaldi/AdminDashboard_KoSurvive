"use client"

import React, { useState } from "react"
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
} from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/navigation"

import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField"
import { createBrowserSupabase } from "@/utils/supabase/client"

interface loginType {
  title?: string
  subtitle?: React.ReactNode
  subtext?: React.ReactNode
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const router = useRouter()
  const supabase = createBrowserSupabase()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)

    if (error) {
      // contoh error umum: Invalid login credentials, Email not confirmed, 429 rate limited
      setErr(error.message)
      return
    }

    if (data?.user) {
      // Sync profile ke DB
      const resp = await fetch("/api/sync-profile", { method: "POST" })
      const json = await resp.json()

      if (!resp.ok || !json.profile) {
        setErr("Gagal sync profile")
        return
      }

      // Validasi role admin
      if (json.profile.role !== "admin") {
        await supabase.auth.signOut() // logout paksa
        setErr("Akses hanya untuk admin")
        return
      }

      // Kalau admin → redirect ke dashboard admin
      router.push("/admin")
    }

    // login sukses → redirect (nanti bisa diarahkan ke /admin/dashboard)
    router.push("/")
  }

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <form onSubmit={onSubmit}>
        <Stack>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="email"
              mb="5px"
            >
              Email
            </Typography>
            <CustomTextField
              id="email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="admin@contoh.com"
              autoComplete="email"
            />
          </Box>

          <Box mt="25px">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
            >
              Password
            </Typography>
            <CustomTextField
              id="password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
            />
          </Box>

          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            my={2}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                }
                label="Remember this device"
              />
            </FormGroup>

            <Typography
              component={Link}
              href="/authentication/forgot-password"
              fontWeight="500"
              sx={{ textDecoration: "none", color: "primary.main" }}
            >
              Forgot Password?
            </Typography>
          </Stack>
        </Stack>

        {err && (
          <Typography color="error" mb={1}>
            {err}
          </Typography>
        )}

        <Box>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </Box>
      </form>

      {subtitle}
    </>
  )
}

export default AuthLogin
