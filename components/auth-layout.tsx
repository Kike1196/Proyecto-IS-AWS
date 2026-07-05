import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  backHref?: string
}

export function AuthLayout({ children, title, subtitle, backHref = "/" }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href={backHref}>
            <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Regresar
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-foreground">Sistema Educativo</span>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">{title}</h1>
            <p className="text-muted-foreground text-pretty">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}


