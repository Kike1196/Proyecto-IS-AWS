"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, BookOpen } from "lucide-react"
import Link from "next/link"
import MateriaSelector from "@/components/materia-selector"

// Datos de materias disponibles
const materiasDisponibles = [
  {
    id: 1,
    nombre: "Circuitos Eléctricos I",
    codigo: "ELE-101",
    profesor: "Dr. María López",
    horario: "Lunes 8:00-10:00",
    disponible: true,
    descripcion: "Fundamentos de análisis de circuitos eléctricos, leyes de Kirchhoff, análisis nodal y de mallas.",
    cupo: 25,
    inscritos: 18,
    laboratorio: "Lab. Electrónica A",
    prerequisitos: ["Matemáticas III", "Física II"],
  },
  {
    id: 2,
    nombre: "Electrónica Analógica",
    codigo: "ELE-201",
    profesor: "Ing. Carlos Ruiz",
    horario: "Miércoles 10:00-12:00",
    disponible: true,
    descripcion: "Diseño y análisis de circuitos analógicos, amplificadores operacionales, filtros activos.",
    cupo: 20,
    inscritos: 15,
    laboratorio: "Lab. Electrónica B",
    prerequisitos: ["Circuitos Eléctricos I"],
  },
  {
    id: 3,
    nombre: "Electrónica Digital",
    codigo: "ELE-202",
    profesor: "Dr. Ana Martínez",
    horario: "Viernes 14:00-16:00",
    disponible: false,
    descripcion: "Sistemas digitales, álgebra booleana, circuitos combinacionales y secuenciales.",
    cupo: 22,
    inscritos: 22,
    laboratorio: "Lab. Electrónica C",
    prerequisitos: ["Matemáticas Discretas"],
  },
  {
    id: 4,
    nombre: "Instrumentación Electrónica",
    codigo: "ELE-301",
    profesor: "Ing. Roberto Silva",
    horario: "Martes 16:00-18:00",
    disponible: true,
    descripcion: "Medición y control de variables físicas, sensores, acondicionamiento de señales.",
    cupo: 18,
    inscritos: 12,
    laboratorio: "Lab. Instrumentación",
    prerequisitos: ["Electrónica Analógica", "Señales y Sistemas"],
  },
  {
    id: 5,
    nombre: "Microcontroladores",
    codigo: "ELE-302",
    profesor: "Dr. Luis Hernández",
    horario: "Jueves 8:00-10:00",
    disponible: true,
    descripcion: "Programación de microcontroladores, interfaces, sistemas embebidos.",
    cupo: 20,
    inscritos: 16,
    laboratorio: "Lab. Microcontroladores",
    prerequisitos: ["Electrónica Digital", "Programación I"],
  },
]

export default function SeleccionMateriasPage() {
  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState<number[]>([])
  const [guardando, setGuardando] = useState(false)

  const handleSelectMateria = (materiaId: number) => {
    setMateriasSeleccionadas((prev) => {
      if (prev.includes(materiaId)) {
        return prev.filter((id) => id !== materiaId)
      } else {
        return [...prev, materiaId]
      }
    })
  }

  const handleGuardarSeleccion = async () => {
    setGuardando(true)
    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setGuardando(false)
    // Aquí iría la lógica para guardar en la base de datos
    alert(`Materias seleccionadas guardadas: ${materiasSeleccionadas.length}`)
  }

  const materiasSeleccionadasData = materiasDisponibles.filter((m) => materiasSeleccionadas.includes(m.id))

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
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Selección de Materias</h1>
                  <p className="text-sm text-muted-foreground">Laboratorio de Electrónica</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{materiasSeleccionadas.length} seleccionadas</Badge>
              <Button onClick={handleGuardarSeleccion} disabled={materiasSeleccionadas.length === 0 || guardando}>
                <Save className="h-4 w-4 mr-2" />
                {guardando ? "Guardando..." : "Guardar Selección"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Selector de materias */}
          <div className="lg:col-span-2">
            <MateriaSelector
              materias={materiasDisponibles}
              onSelectMateria={handleSelectMateria}
              materiasSeleccionadas={materiasSeleccionadas}
            />
          </div>

          {/* Resumen de selección */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen de Selección</CardTitle>
                <CardDescription>Materias seleccionadas para este semestre</CardDescription>
              </CardHeader>
              <CardContent>
                {materiasSeleccionadas.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No has seleccionado ninguna materia aún</p>
                ) : (
                  <div className="space-y-3">
                    {materiasSeleccionadasData.map((materia) => (
                      <div key={materia.id} className="p-3 bg-muted/50 rounded-lg">
                        <h4 className="font-medium text-sm">{materia.nombre}</h4>
                        <p className="text-xs text-muted-foreground">{materia.codigo}</p>
                        <p className="text-xs text-muted-foreground">{materia.horario}</p>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-border">
                      <p className="text-sm font-medium">Total: {materiasSeleccionadas.length} materias</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información importante */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información Importante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium">Límite de materias:</h4>
                  <p className="text-muted-foreground">Máximo 4 materias por semestre</p>
                </div>
                <div>
                  <h4 className="font-medium">Prerequisitos:</h4>
                  <p className="text-muted-foreground">Verifica que cumples con los prerequisitos</p>
                </div>
                <div>
                  <h4 className="font-medium">Fechas importantes:</h4>
                  <p className="text-muted-foreground">Inscripciones hasta el 15 de enero</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


