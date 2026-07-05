"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, GraduationCap, User, Mail, Phone, BookOpen } from "lucide-react"
import Link from "next/link"

const carreras = [
  "Ingeniería en Sistemas Computacionales",
  "Ingeniería Industrial",
  "Ingeniería Mecánica",
  "Ingeniería Eléctrica",
  "Ingeniería Civil",
  "Licenciatura en Administración",
  "Licenciatura en Contaduría",
  "Arquitectura",
]

const semestres = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

export default function RegistroEstudiantePage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    numeroControl: "",
    carrera: "",
    semestre: "",
    correo: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    aceptaTerminos: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
    if (!formData.apellidos.trim()) newErrors.apellidos = "Los apellidos son requeridos"
    if (!formData.numeroControl.trim()) newErrors.numeroControl = "El número de control es requerido"
    if (!formData.carrera) newErrors.carrera = "La carrera es requerida"
    if (!formData.semestre) newErrors.semestre = "El semestre es requerido"
    if (!formData.correo.trim()) newErrors.correo = "El correo es requerido"
    else if (!formData.correo.includes("@")) newErrors.correo = "Ingresa un correo válido"
    if (!formData.password) newErrors.password = "La contraseña es requerida"
    else if (formData.password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden"
    if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es requerido"
    if (!formData.aceptaTerminos) newErrors.aceptaTerminos = "Debes aceptar los términos y condiciones"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simulación de registro - aquí iría la lógica real
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirigir al login después del registro exitoso
      router.push("/login/estudiante?registered=true")
    } catch (err) {
      setErrors({ general: "Error al registrar. Intenta nuevamente." })
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <AuthLayout title="Registro de Estudiante" subtitle="Crea tu cuenta para acceder al portal estudiantil">
      <Card className="border-2">
        <CardHeader className="text-center pb-6">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Registro de Estudiante</CardTitle>
          <CardDescription>Completa todos los campos para crear tu cuenta</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <Alert variant="destructive">
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre(s) *</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    placeholder="Juan Carlos"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={errors.nombre ? "border-destructive" : ""}
                  />
                  {errors.nombre && <p className="text-sm text-destructive">{errors.nombre}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos *</Label>
                  <Input
                    id="apellidos"
                    name="apellidos"
                    placeholder="García López"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    className={errors.apellidos ? "border-destructive" : ""}
                  />
                  {errors.apellidos && <p className="text-sm text-destructive">{errors.apellidos}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Número de Teléfono *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    placeholder="55 1234 5678"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.telefono ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.telefono && <p className="text-sm text-destructive">{errors.telefono}</p>}
              </div>
            </div>

            {/* Información Académica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Información Académica
              </h3>

              <div className="space-y-2">
                <Label htmlFor="numeroControl">Número de Control Escolar *</Label>
                <Input
                  id="numeroControl"
                  name="numeroControl"
                  placeholder="20240001"
                  value={formData.numeroControl}
                  onChange={handleInputChange}
                  className={errors.numeroControl ? "border-destructive" : ""}
                />
                {errors.numeroControl && <p className="text-sm text-destructive">{errors.numeroControl}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="carrera">Carrera *</Label>
                <Select value={formData.carrera} onValueChange={(value) => handleSelectChange("carrera", value)}>
                  <SelectTrigger className={errors.carrera ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecciona tu carrera" />
                  </SelectTrigger>
                  <SelectContent>
                    {carreras.map((carrera) => (
                      <SelectItem key={carrera} value={carrera}>
                        {carrera}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.carrera && <p className="text-sm text-destructive">{errors.carrera}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="semestre">Semestre *</Label>
                <Select value={formData.semestre} onValueChange={(value) => handleSelectChange("semestre", value)}>
                  <SelectTrigger className={errors.semestre ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecciona tu semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    {semestres.map((semestre) => (
                      <SelectItem key={semestre} value={semestre}>
                        {semestre}° Semestre
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.semestre && <p className="text-sm text-destructive">{errors.semestre}</p>}
              </div>
            </div>

            {/* Información de Cuenta */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Información de Cuenta
              </h3>

              <div className="space-y-2">
                <Label htmlFor="correo">Correo Institucional *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="correo"
                    name="correo"
                    type="email"
                    placeholder="estudiante@institucion.edu.mx"
                    value={formData.correo}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.correo ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.correo && <p className="text-sm text-destructive">{errors.correo}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
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
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Términos y Condiciones */}
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="aceptaTerminos"
                  checked={formData.aceptaTerminos}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => ({ ...prev, aceptaTerminos: checked as boolean }))
                    if (errors.aceptaTerminos) {
                      setErrors((prev) => ({ ...prev, aceptaTerminos: "" }))
                    }
                  }}
                  className={errors.aceptaTerminos ? "border-destructive" : ""}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="aceptaTerminos"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Acepto los{" "}
                    <Link href="/terminos" className="text-primary hover:underline">
                      términos y condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link href="/privacidad" className="text-primary hover:underline">
                      política de privacidad
                    </Link>
                  </label>
                </div>
              </div>
              {errors.aceptaTerminos && <p className="text-sm text-destructive">{errors.aceptaTerminos}</p>}
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Crear Cuenta"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login/estudiante" className="text-primary hover:underline font-medium">
                Inicia sesión aquí
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}


