"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Package, User, LogOut, Calendar, Plus, Users, Clock } from "lucide-react"

// Datos simulados del docente
const docenteData = {
  nombre: "Dr. María",
  apellidos: "López García",
  numeroTrabajador: "DOC-2024-001",
  especialidad: "Electrónica Analógica",
}

// Material disponible en laboratorio
const materialLaboratorio = [
  {
    id: 1,
    nombre: "Resistencias 1/4W",
    categoria: "Componentes Pasivos",
    disponible: 150,
    total: 200,
    estado: "disponible",
  },
  {
    id: 2,
    nombre: "Capacitores Electrolíticos",
    categoria: "Componentes Pasivos",
    disponible: 45,
    total: 80,
    estado: "disponible",
  },
  {
    id: 3,
    nombre: "Transistores 2N2222",
    categoria: "Semiconductores",
    disponible: 0,
    total: 30,
    estado: "agotado",
  },
  {
    id: 4,
    nombre: "Protoboards",
    categoria: "Herramientas",
    disponible: 8,
    total: 15,
    estado: "disponible",
  },
  {
    id: 5,
    nombre: "Multímetros Digitales",
    categoria: "Instrumentos",
    disponible: 2,
    total: 10,
    estado: "dañado",
  },
]

// Asesorías creadas por el docente
const misAsesorias = [
  {
    id: 1,
    titulo: "Análisis de Circuitos con SPICE",
    fecha: "2024-01-15",
    hora: "14:00-16:00",
    cupos: 8,
    inscritos: 5,
    estado: "programada",
  },
  {
    id: 2,
    titulo: "Diseño de Filtros Analógicos",
    fecha: "2024-01-22",
    hora: "10:00-12:00",
    cupos: 10,
    inscritos: 8,
    estado: "programada",
  },
]

export default function DashboardDocente() {
  const [isCreatingAsesoria, setIsCreatingAsesoria] = useState(false)
  const [nuevaAsesoria, setNuevaAsesoria] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    hora: "",
    cupos: "",
  })

  const handleCrearAsesoria = () => {
    // Aquí iría la lógica para crear la asesoría
    console.log("Creando asesoría:", nuevaAsesoria)
    setIsCreatingAsesoria(false)
    setNuevaAsesoria({
      titulo: "",
      descripcion: "",
      fecha: "",
      hora: "",
      cupos: "",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-secondary/10 p-2 rounded-full">
                <User className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {docenteData.nombre} {docenteData.apellidos}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {docenteData.numeroTrabajador} - {docenteData.especialidad}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Docente</Badge>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="material" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="material">Material Disponible</TabsTrigger>
            <TabsTrigger value="asesorias">Mis Asesorías</TabsTrigger>
          </TabsList>

          <TabsContent value="material" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Material de Laboratorio</h2>
              <p className="text-muted-foreground mb-6">Consulta el inventario actual del laboratorio de electrónica</p>
            </div>

            <div className="grid gap-4">
              {materialLaboratorio.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{item.nombre}</h3>
                          <p className="text-sm text-muted-foreground">{item.categoria}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {item.disponible}/{item.total} disponibles
                          </p>
                          <div className="w-24 bg-muted rounded-full h-2 mt-1">
                            <div
                              className={`h-2 rounded-full ${
                                item.estado === "disponible"
                                  ? "bg-green-500"
                                  : item.estado === "agotado"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                              }`}
                              style={{ width: `${(item.disponible / item.total) * 100}%` }}
                            />
                          </div>
                        </div>
                        <Badge
                          variant={
                            item.estado === "disponible"
                              ? "default"
                              : item.estado === "agotado"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {item.estado === "disponible"
                            ? "Disponible"
                            : item.estado === "agotado"
                              ? "Agotado"
                              : "Dañado"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="asesorias" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Mis Asesorías</h2>
                <p className="text-muted-foreground">Gestiona las asesorías que has programado</p>
              </div>
              <Dialog open={isCreatingAsesoria} onOpenChange={setIsCreatingAsesoria}>
                <DialogTrigger asChild>
                  <Button className="bg-secondary hover:bg-secondary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Asesoría
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Asesoría</DialogTitle>
                    <DialogDescription>Programa una nueva asesoría para tus estudiantes</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="titulo">Título</Label>
                      <Input
                        id="titulo"
                        value={nuevaAsesoria.titulo}
                        onChange={(e) => setNuevaAsesoria({ ...nuevaAsesoria, titulo: e.target.value })}
                        placeholder="Ej: Análisis de Circuitos"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={nuevaAsesoria.descripcion}
                        onChange={(e) => setNuevaAsesoria({ ...nuevaAsesoria, descripcion: e.target.value })}
                        placeholder="Describe el contenido de la asesoría"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fecha">Fecha</Label>
                        <Input
                          id="fecha"
                          type="date"
                          value={nuevaAsesoria.fecha}
                          onChange={(e) => setNuevaAsesoria({ ...nuevaAsesoria, fecha: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hora">Horario</Label>
                        <Input
                          id="hora"
                          value={nuevaAsesoria.hora}
                          onChange={(e) => setNuevaAsesoria({ ...nuevaAsesoria, hora: e.target.value })}
                          placeholder="14:00-16:00"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cupos">Cupos Disponibles</Label>
                      <Input
                        id="cupos"
                        type="number"
                        value={nuevaAsesoria.cupos}
                        onChange={(e) => setNuevaAsesoria({ ...nuevaAsesoria, cupos: e.target.value })}
                        placeholder="10"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatingAsesoria(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCrearAsesoria}>Crear Asesoría</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {misAsesorias.map((asesoria) => (
                <Card key={asesoria.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-secondary/10 p-2 rounded-lg">
                          <Calendar className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{asesoria.titulo}</CardTitle>
                          <CardDescription>
                            {asesoria.fecha} • {asesoria.hora}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="default">{asesoria.estado}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {asesoria.inscritos}/{asesoria.cupos} inscritos
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {asesoria.hora}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Ver Inscritos
                        </Button>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


