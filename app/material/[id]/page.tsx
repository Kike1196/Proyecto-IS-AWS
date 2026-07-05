"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { ArrowLeft, Package, AlertCircle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

// Material disponible para la materia
const materialDisponible = [
  {
    id: 1,
    nombre: "Resistencias 1/4W (Pack 10)",
    categoria: "Componentes Pasivos",
    disponible: 15,
    total: 20,
    descripcion: "Resistencias de carbón de 1/4W, valores mixtos",
    estado: "disponible",
    ubicacion: "Estante A-1",
  },
  {
    id: 2,
    nombre: "Capacitores Electrolíticos (Pack 5)",
    categoria: "Componentes Pasivos",
    disponible: 8,
    total: 12,
    descripcion: "Capacitores electrolíticos de 100µF a 1000µF",
    estado: "disponible",
    ubicacion: "Estante A-2",
  },
  {
    id: 3,
    nombre: "Protoboard 830 puntos",
    categoria: "Herramientas",
    disponible: 0,
    total: 10,
    descripcion: "Protoboard estándar de 830 puntos de conexión",
    estado: "agotado",
    ubicacion: "Estante B-1",
  },
  {
    id: 4,
    nombre: "Multímetro Digital",
    categoria: "Instrumentos",
    disponible: 3,
    total: 8,
    descripcion: "Multímetro digital básico con pantalla LCD",
    estado: "disponible",
    ubicacion: "Gabinete C-1",
  },
  {
    id: 5,
    nombre: "Cables Jumper (Pack 20)",
    categoria: "Herramientas",
    disponible: 2,
    total: 15,
    descripcion: "Cables jumper macho-macho de colores",
    estado: "dañado",
    ubicacion: "Estante B-2",
  },
]

export default function MaterialMateria({ params }: { params: { id: string } }) {
  const [solicitudActiva, setSolicitudActiva] = useState<number | null>(null)
  const [cantidadSolicitada, setCantidadSolicitada] = useState(1)
  const [observaciones, setObservaciones] = useState("")

  const handleSolicitarMaterial = (materialId: number) => {
    console.log("Solicitando material:", {
      materialId,
      cantidad: cantidadSolicitada,
      observaciones,
    })
    setSolicitudActiva(null)
    setCantidadSolicitada(1)
    setObservaciones("")
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "disponible":
        return "bg-green-100 text-green-800"
      case "agotado":
        return "bg-red-100 text-red-800"
      case "dañado":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "disponible":
        return <CheckCircle className="h-4 w-4" />
      case "agotado":
        return <AlertCircle className="h-4 w-4" />
      case "dañado":
        return <Clock className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/estudiante">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Material de Laboratorio</h1>
            <p className="text-muted-foreground">Circuitos Eléctricos I - ELE-101</p>
          </div>
        </div>

        {/* Información de préstamo */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Información de Préstamo</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• El material debe devolverse en un máximo de 7 días</li>
                  <li>• Cualquier daño debe reportarse inmediatamente</li>
                  <li>• Solo se permite un préstamo activo por estudiante</li>
                  <li>• El material dañado será responsabilidad del estudiante</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de material */}
        <div className="grid gap-6">
          {materialDisponible.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground text-lg">{item.nombre}</h3>
                        <Badge className={getEstadoColor(item.estado)}>
                          <div className="flex items-center gap-1">
                            {getEstadoIcon(item.estado)}
                            {item.estado}
                          </div>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{item.descripcion}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Categoría: {item.categoria}</span>
                        <span>Ubicación: {item.ubicacion}</span>
                        <span>
                          Disponibles: {item.disponible}/{item.total}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Barra de disponibilidad */}
                    <div className="text-right">
                      <div className="w-24 bg-muted rounded-full h-2 mb-1">
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
                      <p className="text-xs text-muted-foreground">
                        {Math.round((item.disponible / item.total) * 100)}% disponible
                      </p>
                    </div>

                    {/* Botón de solicitud */}
                    <Dialog
                      open={solicitudActiva === item.id}
                      onOpenChange={(open) => setSolicitudActiva(open ? item.id : null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          disabled={item.estado !== "disponible" || item.disponible === 0}
                          className="min-w-[120px]"
                        >
                          {item.estado === "disponible" && item.disponible > 0
                            ? "Solicitar Préstamo"
                            : item.estado === "agotado"
                              ? "Agotado"
                              : "No Disponible"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Solicitar Préstamo</DialogTitle>
                          <DialogDescription>
                            {item.nombre} - Disponibles: {item.disponible}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="cantidad">Cantidad a solicitar</Label>
                            <Input
                              id="cantidad"
                              type="number"
                              min="1"
                              max={item.disponible}
                              value={cantidadSolicitada}
                              onChange={(e) => setCantidadSolicitada(Number.parseInt(e.target.value) || 1)}
                            />
                            <p className="text-xs text-muted-foreground">Máximo disponible: {item.disponible}</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="observaciones">Observaciones (opcional)</Label>
                            <Input
                              id="observaciones"
                              value={observaciones}
                              onChange={(e) => setObservaciones(e.target.value)}
                              placeholder="Uso específico, proyecto, etc."
                            />
                          </div>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              <strong>Recordatorio:</strong> El material debe devolverse en máximo 7 días. Cualquier
                              daño será tu responsabilidad.
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setSolicitudActiva(null)}>
                            Cancelar
                          </Button>
                          <Button onClick={() => handleSolicitarMaterial(item.id)}>Confirmar Solicitud</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Información adicional */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>¿Necesitas ayuda?</CardTitle>
            <CardDescription>
              Si no encuentras el material que necesitas o tienes dudas sobre el préstamo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button variant="outline">Contactar Administrador</Button>
              <Button variant="outline">Ver Reglamento Completo</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

