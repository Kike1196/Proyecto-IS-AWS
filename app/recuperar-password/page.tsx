"use client"

import type React from "react"

import { useState } from "react"
import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Por favor, ingresa tu correo electrónico")
      return
    }

    if (!email.includes("@")) {
      setError("Por favor, ingresa un correo electrónico válido")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulación de envío de correo
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setMessage("Se ha enviado un enlace de recuperación a tu correo electrónico.")
    } catch (err) {
      setError("Error al enviar el correo. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Recuperar Contraseña" subtitle="Te ayudamos a recuperar el acceso a tu cuenta">
      <Card className="border-2">
        <CardHeader className="text-center pb-6">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Recuperar Contraseña</CardTitle>
          <CardDescription>Ingresa tu correo institucional para recibir instrucciones</CardDescription>
        </CardHeader>

        <CardContent>
          {message ? (
            <div className="text-center space-y-4">
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Revisa tu bandeja de entrada y sigue las instrucciones del correo.
                </p>
                <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
                  <ArrowLeft className="h-4 w-4" />
                  Volver al inicio
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo Institucional</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@institucion.edu.mx"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError("")
                    }}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar Instrucciones"}
              </Button>

              <div className="text-center space-y-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver al inicio
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  )
}


