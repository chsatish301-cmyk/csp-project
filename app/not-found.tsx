import Link from "next/link"
import { ShieldAlert, ArrowLeft, Home, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-center">
      <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-6">
        <ShieldAlert className="size-10" />
      </div>
      <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        404 — Page Not Found
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
        Looking for Campus Care?
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
        The page or resource you requested could not be found or has been moved to a new route.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button nativeButton={false} render={<Link href="/" />}>
          <Home className="mr-2 size-4" />
          Home
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/portal" />}>
          <LayoutDashboard className="mr-2 size-4" />
          Portal Dashboard
        </Button>
        <Button variant="ghost" nativeButton={false} render={<Link href="/login" />}>
          <ArrowLeft className="mr-2 size-4" />
          Sign In
        </Button>
      </div>
    </div>
  )
}
