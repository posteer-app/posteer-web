"use client"

import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { useFormStatus } from "react-dom"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import { magicLinkLogin, googleLogin, facebookLogin } from "./actions"

export default function LoginPage() {
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const [isFacebookLoading, setIsFacebookLoading] = React.useState<boolean>(false)

  async function onGoogleSignIn() {
    setIsGoogleLoading(true)
    googleLogin()
  }

  async function onFacebookSignIn() {
    setIsFacebookLoading(true)
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <form action={magicLinkLogin}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <a
                  href="#"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <span className="sr-only">Posteer</span>
                </a>
                <h1 className="text-2xl font-bold">Welcome to Posteer</h1>
              </div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    name="email"
                    id="email"
                    type="email"
                    placeholder="me@example.com"
                    required
                    disabled={isGoogleLoading || isFacebookLoading}
                  />
                </div>
                <MagicLinkButton />
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2 text-xs">
                  or continue with
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={onGoogleSignIn}
                  disabled={isGoogleLoading || isFacebookLoading}
                >
                  {isGoogleLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  Google
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={onFacebookSignIn}
                  disabled={isGoogleLoading || isFacebookLoading}
                >
                  {isFacebookLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  Facebook
                </Button>
              </div>
            </div>
          </form>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            If you proceed, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            .
          </div>
        </div>
      </div>
    </div>
  )
}

function MagicLinkButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="w-full"
      disabled={pending}
    >
      {pending && (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
      Send Magic Link
    </Button>
  )
}
