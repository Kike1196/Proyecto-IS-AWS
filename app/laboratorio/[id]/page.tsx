"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, AlertTriangle, CheckCircle, XCircle, ArrowLeft, Package } from "lucide-react"
import Link from "next/link"
import SolicitudMaterial from "@/components/solicitud-material"

// Datos de materias
const materias = {
  1: { nombre: "Circuitos Eléctricos I", codigo: "ELE-101" },
  2: { nombre: "Electrónica Analógica", codigo: "ELE-201" },
  3: { nombre: "Electrónica Digital", codigo: "ELE-202" },
  4: { nombre: "Instrumentación Electrónica", codigo: "ELE-301" },
}

// Inventario de componentes por materia
const inventario = {
  1: [
    // Circuitos Eléctricos I
    {
      id: 1,
      nombre: "Resistencias 1kΩ",
      categoria: "Resistencias",
      disponibles: 45,
      total: 50,
      dañados: 3,
      enUso: 2,
      ubicacion: "Gaveta A1",
      descripcion: "Resistencias de carbón 1/4W ±5%",
    },
    {
      id: 2,
      nombre: "Capacitores 100µF",
      categoria: "Capacitores",
      disponibles: 12,
      total: 20,
      dañados: 5,
      enUso: 3,
      ubicacion: "Gaveta B2",
      descripcion: "Capacitores electrolíticos 25V",
    },
    {
      id: 3,
      nombre: "Multímetros Digitales",
      categoria: "Instrumentos",
      disponibles: 8,
      total: 12,
      dañados: 2,
      enUso: 2,
      ubicacion: "Estante C",
      descripcion: "Multímetros Fluke 117",
    },
  ],
  2: [
    // Electrónica Analógica
    {
      id: 4,
      nombre: "Amplificadores Op LM741",
      categoria: "Semiconductores",
      disponibles: 25,
      total: 30,
      dañados: 2,
      enUso: 3,
      ubicacion: "Gaveta D1",
      descripcion: "Amplificadores operacionales de propósito general",
    },
    {
      id: 5,
      nombre: "Transistores 2N2222",
      categoria: "Semiconductores",
      disponibles: 18,
      total: 25,
      dañados: 4,
      enUso: 3,
      ubicacion: "Gaveta D2",
      descripcion: "Transistores NPN de propósito general",
    },
    {
      id: 6,
      nombre: "Osciloscopios",
      categoria: "Instrumentos",
      disponibles: 4,
      total: 6,
      dañados: 1,
      enUso: 1,
      ubicacion: "Mesa Principal",
      descripcion: "Osciloscopios digitales 100MHz",
    },
  ],
}

export default function LaboratorioPage() {
  const params = useParams()
  const materiaId = Number.parseInt(params.id as string)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("todos")
  const [filtroEstado, setFiltroEstado] = useState("todos")

  const materia = materias[materiaId as keyof typeof materias]
  const componentes = inventario[materiaId as keyof typeof inventario] || []

  // Filtrar componentes
  const componentesFiltrados = componentes.filter((componente) => {
    const matchSearch =
      componente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      componente.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategoria = filtroCategoria === "todos" || componente.categoria === filtroCategoria

    let matchEstado = true
    if (filtroEstado === "disponible") {
      matchEstado = componente.disponibles > 0
    } else if (filtroEstado === "agotado") {
      matchEstado = componente.disponibles === 0
    } else if (filtroEstado === "dañado") {
      matchEstado = componente.dañados > 0
    }

    return matchSearch && matchCategoria && matchEstado
  })

  // Obtener categorías únicas
  const categorias = [...new Set(componentes.map((c) => c.categoria))]

  const getStatusColor = (disponibles: number, total: number, dañados: number) => {
    const porcentajeDisponible = (disponibles / total) * 100
    if (porcentajeDisponible >= 70) return "text-green-600"
    if (porcentajeDisponible >= 30) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusIcon = (disponibles: number, total: number) => {
    const porcentajeDisponible = (disponibles / total) * 100
    if (porcentajeDisponible >= 70) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (porcentajeDisponible >= 30) return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  const handleSolicitar = (solicitud: any) => {
    console.log("[v0] Nueva solicitud:", solicitud)
    // Aquí iría la lógica para enviar la solicitud al backend
    alert("Solicitud enviada correctamente")
  }

  if (!materia) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Materia no encontrada</h1>
          <Link href="/dashboard/estudiante">
            <Button>Volver al Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/estudiante">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">{materia.nombre}</h1>
                  <p className="text-sm text-muted-foreground">Código: {materia.codigo}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filtros y búsqueda */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar componentes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {/* Filtros por estado */}
              <div className="flex gap-1">
                <Button
                  variant={filtroEstado === "todos" ? "default" : "outline"}
                  onClick={() => setFiltroEstado("todos")}
                  size="sm"
                >
                  Todos
                </Button>
                <Button
                  variant={filtroEstado === "disponible" ? "default" : "outline"}
                  onClick={() => setFiltroEstado("disponible")}
                  size="sm"
                >
                  Disponible
                </Button>
                <Button
                  variant={filtroEstado === "agotado" ? "default" : "outline"}
                  onClick={() => setFiltroEstado("agotado")}
                  size="sm"
                >
                  Agotado
                </Button>
                <Button
                  variant={filtroEstado === "dañado" ? "default" : "outline"}
                  onClick={() => setFiltroEstado("dañado")}
                  size="sm"
                >
                  Con Daños
                </Button>
              </div>
              {categorias.map((categoria) => (
                <Button
                  key={categoria}
                  variant={filtroCategoria === categoria ? "default" : "outline"}
                  onClick={() => setFiltroCategoria(categoria)}
                  size="sm"
                >
                  {categoria}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Inventario */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {componentesFiltrados.map((componente) => (
            <Card key={componente.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(componente.disponibles, componente.total)}
                      {componente.nombre}
                    </CardTitle>
                    <CardDescription>{componente.categoria}</CardDescription>
                  </div>
                  <Badge variant="outline">{componente.ubicacion}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{componente.descripcion}</p>

                  {/* Estado del inventario */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Disponibles:</span>
                        <span
                          className={`font-semibold ${getStatusColor(componente.disponibles, componente.total, componente.dañados)}`}
                        >
                          {componente.disponibles}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">En uso:</span>
                        <span className="font-semibold text-blue-600">{componente.enUso}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-semibold">{componente.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dañados:</span>
                        <span className="font-semibold text-red-600">{componente.dañados}</span>
                      </div>
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Disponibilidad</span>
                      <span>{Math.round((componente.disponibles / componente.total) * 100)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          (componente.disponibles / componente.total) >= 0.7
                            ? "bg-green-500"
                            : componente.disponibles / componente.total >= 0.3
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${(componente.disponibles / componente.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Componente de solicitud */}
                  <SolicitudMaterial componente={componente} onSolicitar={handleSolicitar} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {componentesFiltrados.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-muted/50 p-6 rounded-lg max-w-md mx-auto">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron componentes</h3>
              <p className="text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

