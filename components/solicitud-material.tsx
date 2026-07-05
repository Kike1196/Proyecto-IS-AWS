"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Clock, CheckCircle, AlertTriangle, XCircle } from "lucide-react"

interface SolicitudMaterial {
  id: number
  componenteId: number
  componenteNombre: string
  cantidad: number
  fechaSolicitud: string
  fechaDevolucion?: string
  estado: "pendiente" | "aprobada" | "en_uso" | "devuelta" | "rechazada"
  observaciones?: string
  estudiante: string
  materia: string
}

interface SolicitudMaterialProps {
  componente: {
    id: number
    nombre: string
    disponibles: number
    categoria: string
    ubicacion: string
  }
  onSolicitar: (solicitud: Omit<SolicitudMaterial, "id" | "fechaSolicitud" | "estudiante" | "materia">) => void
}

// Datos simulados de solicitudes
const solicitudesEjemplo: SolicitudMaterial[] = [
  {
    id: 1,
    componenteId: 1,
    componenteNombre: "Resistencias 1kΩ",
    cantidad: 5,
    fechaSolicitud: "2024-01-15",
    fechaDevolucion: "2024-01-22",
    estado: "en_uso",
    observaciones: "Para práctica de circuitos básicos",
    estudiante: "Juan Pérez",
    materia: "Circuitos Eléctricos I",
  },
  {
    id: 2,
    componenteId: 3,
    componenteNombre: "Multímetros Digitales",
    cantidad: 1,
    fechaSolicitud: "2024-01-16",
    estado: "pendiente",
    observaciones: "Necesario para mediciones de laboratorio",
    estudiante: "Juan Pérez",
    materia: "Circuitos Eléctricos I",
  },
]

export default function SolicitudMaterial({ componente, onSolicitar }: SolicitudMaterialProps) {
  const [cantidad, setCantidad] = useState(1)
  const [tipoSolicitud, setTipoSolicitud] = useState<"practica" | "proyecto" | "investigacion">("practica")
  const [observaciones, setObservaciones] = useState("")
  const [fechaDevolucion, setFechaDevolucion] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [mostrarSolicitudes, setMostrarSolicitudes] = useState(false)

  const handleSolicitar = async () => {
    setEnviando(true)

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSolicitar({
      componenteId: componente.id,
      componenteNombre: componente.nombre,
      cantidad,
      fechaDevolucion,
      estado: "pendiente",
      observaciones,
    })

    setEnviando(false)
    setCantidad(1)
    setObservaciones("")
    setFechaDevolucion("")
  }

  const getEstadoColor = (estado: SolicitudMaterial["estado"]) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "aprobada":
        return "bg-green-100 text-green-800"
      case "en_uso":
        return "bg-blue-100 text-blue-800"
      case "devuelta":
        return "bg-gray-100 text-gray-800"
      case "rechazada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEstadoIcon = (estado: SolicitudMaterial["estado"]) => {
    switch (estado) {
      case "pendiente":
        return <Clock className="h-4 w-4" />
      case "aprobada":
        return <CheckCircle className="h-4 w-4" />
      case "en_uso":
        return <Package className="h-4 w-4" />
      case "devuelta":
        return <CheckCircle className="h-4 w-4" />
      case "rechazada":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Botón principal de solicitud */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full" disabled={componente.disponibles === 0}>
            {componente.disponibles > 0 ? "Solicitar Material" : "No Disponible"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar Material</DialogTitle>
            <DialogDescription>
              {componente.nombre} - {componente.disponibles} disponibles
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                max={componente.disponibles}
                value={cantidad}
                onChange={(e) => setCantidad(Number.parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de solicitud</Label>
              <Select value={tipoSolicitud} onValueChange={(value: any) => setTipoSolicitud(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="practica">Práctica de laboratorio</SelectItem>
                  <SelectItem value="proyecto">Proyecto final</SelectItem>
                  <SelectItem value="investigacion">Investigación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha de devolución estimada</Label>
              <Input
                id="fecha"
                type="date"
                value={fechaDevolucion}
                onChange={(e) => setFechaDevolucion(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                placeholder="Describe el uso que le darás al material..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={3}
              />
            </div>

            <Button onClick={handleSolicitar} className="w-full" disabled={enviando || !fechaDevolucion}>
              {enviando ? "Enviando..." : "Enviar Solicitud"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Botón para ver solicitudes */}
      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => setMostrarSolicitudes(!mostrarSolicitudes)}
      >
        {mostrarSolicitudes ? "Ocultar" : "Ver"} Mis Solicitudes
      </Button>

      {/* Lista de solicitudes */}
      {mostrarSolicitudes && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Mis Solicitudes Activas</h4>
          {solicitudesEjemplo.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tienes solicitudes activas</p>
          ) : (
            <div className="space-y-2">
              {solicitudesEjemplo.map((solicitud) => (
                <Card key={solicitud.id} className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-sm">{solicitud.componenteNombre}</h5>
                        <Badge className={`text-xs ${getEstadoColor(solicitud.estado)}`}>
                          {getEstadoIcon(solicitud.estado)}
                          <span className="ml-1 capitalize">{solicitud.estado.replace("_", " ")}</span>
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Cantidad: {solicitud.cantidad} | Solicitado: {solicitud.fechaSolicitud}
                      </p>
                      {solicitud.fechaDevolucion && (
                        <p className="text-xs text-muted-foreground">Devolución: {solicitud.fechaDevolucion}</p>
                      )}
                      {solicitud.observaciones && (
                        <p className="text-xs text-muted-foreground italic">"{solicitud.observaciones}"</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}


