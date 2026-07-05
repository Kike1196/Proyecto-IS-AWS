import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <GraduationCap className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance">INSTITUTO TECNOLOGICO DE SALTILLO</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Laboratorio de Electrónica-Analogica
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Estudiantes */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">Estudiantes</CardTitle>
              <CardDescription className="text-muted-foreground">Accede a tu portal estudiantil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/login/estudiante" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/registro/estudiante" className="block">
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/5 bg-transparent"
                >
                  Registrarse
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Docentes */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-secondary/20">
            <CardHeader className="text-center pb-4">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle className="text-2xl text-secondary">Docentes</CardTitle>
              <CardDescription className="text-muted-foreground">Portal para profesores y educadores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/login/docente" className="block">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/registro/docente" className="block">
                <Button
                  variant="outline"
                  className="w-full border-secondary text-secondary hover:bg-secondary/5 bg-transparent"
                >
                  Registrarse
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Administradores */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-accent/40">
            <CardHeader className="text-center pb-4">
              <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/30 transition-colors">
                <Shield className="h-8 w-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl text-accent-foreground">Administradores</CardTitle>
              <CardDescription className="text-muted-foreground">Panel de administración del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login/administrador" className="block">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Iniciar Sesión</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-muted-foreground">
          <p>© 2025 Sistema Educativo. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}


