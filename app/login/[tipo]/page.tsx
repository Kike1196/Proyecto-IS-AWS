"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, GraduationCap, Users, Shield } from "lucide-react"
import Link from "next/link"

const tiposUsuario = {
  estudiante: {
    title: "Iniciar Sesión - Estudiante",
    subtitle: "Accede a tu portal estudiantil",
    icon: GraduationCap,
    color: "primary",
    registerLink: "/registro/estudiante",
  },
  docente: {
    title: "Iniciar Sesión - Docente",
    subtitle: "Accede a tu portal de profesor",
    icon: Users,
    color: "secondary",
    registerLink: "/registro/docente",
  },
  administrador: {
    title: "Iniciar Sesión - Administrador",
    subtitle: "Accede al panel de administración",
    icon: Shield,
    color: "accent",
    registerLink: null,
  },
}

export default function LoginPage() {
  const params = useParams()
  const router = useRouter()
  const tipo = params.tipo as string

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const userType = tiposUsuario[tipo as keyof typeof tiposUsuario]

  if (!userType) {
    return <div>Tipo de usuario no válido</div>
  }

  const Icon = userType.icon

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validación básica
    if (!formData.email || !formData.password) {
      setError("Por favor, completa todos los campos")
      setIsLoading(false)
      return
    }

    if (!formData.email.includes("@")) {
      setError("Por favor, ingresa un correo electrónico válido")
      setIsLoading(false)
      return
    }

    try {
      // Simulación de login - aquí iría la lógica real de autenticación
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirigir según el tipo de usuario
      switch (tipo) {
        case "estudiante":
          router.push("/dashboard/estudiante")
          break
        case "docente":
          router.push("/dashboard/docente")
          break
        case "administrador":
          router.push("/dashboard/administrador")
          break
      }
    } catch (err) {
      setError("Error al iniciar sesión. Verifica tus credenciales.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError("")
  }

  return (
    <AuthLayout title={userType.title} subtitle={userType.subtitle}>
      <Card className="border-2">
        <CardHeader className="text-center pb-6">
          <div
            className={`bg-${userType.color}/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            <Icon className={`h-8 w-8 text-${userType.color}`} />
          </div>
          <CardTitle className="text-xl">Bienvenido</CardTitle>
          <CardDescription>Ingresa tus credenciales institucionales</CardDescription>
        </CardHeader>

        <CardContent>
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
                  name="email"
                  type="email"
                  placeholder="usuario@institucion.edu.mx"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className={`w-full bg-${userType.color} hover:bg-${userType.color}/90`}
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            <div className="text-center space-y-2">
              <Link
                href="/recuperar-password"
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>

              {userType.registerLink && (
                <div className="text-sm text-muted-foreground">
                  ¿No tienes cuenta?{" "}
                  <Link href={userType.registerLink} className={`text-${userType.color} hover:underline font-medium`}>
                    Regístrate aquí
                  </Link>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}

