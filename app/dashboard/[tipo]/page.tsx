"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, Shield, BookOpen, Calendar, Settings, LogOut, Bell, User } from "lucide-react"

const dashboardConfig = {
  estudiante: {
    title: "Portal del Estudiante",
    subtitle: "Bienvenido a tu espacio académico",
    icon: GraduationCap,
    color: "primary",
    cards: [
      { title: "Mis Materias", description: "Ver horarios y calificaciones", icon: BookOpen },
      { title: "Calendario", description: "Eventos y fechas importantes", icon: Calendar },
      { title: "Perfil", description: "Actualizar información personal", icon: User },
      { title: "Notificaciones", description: "Mensajes y avisos", icon: Bell },
    ],
  },
  docente: {
    title: "Portal del Docente",
    subtitle: "Gestiona tus clases y estudiantes",
    icon: Users,
    color: "secondary",
    cards: [
      { title: "Mis Clases", description: "Gestionar grupos y materias", icon: BookOpen },
      { title: "Calificaciones", description: "Capturar y revisar notas", icon: Calendar },
      { title: "Perfil", description: "Actualizar información personal", icon: User },
      { title: "Reportes", description: "Generar reportes académicos", icon: Bell },
    ],
  },
  administrador: {
    title: "Panel de Administración",
    subtitle: "Gestiona el sistema educativo",
    icon: Shield,
    color: "accent",
    cards: [
      { title: "Usuarios", description: "Gestionar estudiantes y docentes", icon: Users },
      { title: "Reportes", description: "Estadísticas del sistema", icon: Calendar },
      { title: "Configuración", description: "Ajustes del sistema", icon: Settings },
      { title: "Respaldos", description: "Gestión de datos", icon: Bell },
    ],
  },
}

export default function DashboardPage() {
  const params = useParams()
  const tipo = params.tipo as string

  const config = dashboardConfig[tipo as keyof typeof dashboardConfig]

  if (!config) {
    return <div>Tipo de usuario no válido</div>
  }

  const Icon = config.icon

  const handleLogout = () => {
    // Aquí iría la lógica de logout
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`bg-${config.color}/10 p-3 rounded-full`}>
                <Icon className={`h-8 w-8 text-${config.color}`} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{config.title}</h1>
                <p className="text-muted-foreground">{config.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-card to-accent/10 border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`bg-${config.color}/20 p-4 rounded-full`}>
                  <Icon className={`h-12 w-12 text-${config.color}`} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">¡Bienvenido de vuelta!</h2>
                  <p className="text-muted-foreground text-lg">
                    Aquí tienes acceso a todas las herramientas que necesitas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.cards.map((card, index) => {
              const CardIcon = card.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20"
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`bg-${config.color}/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-${config.color}/20 transition-colors`}
                    >
                      <CardIcon className={`h-8 w-8 text-${config.color}`} />
                    </div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    <CardDescription className="text-sm">{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className={`w-full bg-${config.color} hover:bg-${config.color}/90`} size="sm">
                      Acceder
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4">Actividad Reciente</h3>
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-8 w-8 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-medium text-foreground mb-2">No hay actividad reciente</h4>
                <p className="text-muted-foreground">Cuando tengas actividad en tu cuenta, aparecerá aquí.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

