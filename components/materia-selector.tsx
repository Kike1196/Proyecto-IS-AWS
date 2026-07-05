"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookOpen, Clock, User, MapPin, CheckCircle } from "lucide-react"

interface Materia {
  id: number
  nombre: string
  codigo: string
  profesor: string
  horario: string
  disponible: boolean
  descripcion: string
  cupo: number
  inscritos: number
  laboratorio: string
  prerequisitos?: string[]
}

interface MateriaSelectorProps {
  materias: Materia[]
  onSelectMateria: (materiaId: number) => void
  materiasSeleccionadas: number[]
}

export default function MateriaSelector({ materias, onSelectMateria, materiasSeleccionadas }: MateriaSelectorProps) {
  const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null)

  const isSelected = (materiaId: number) => materiasSeleccionadas.includes(materiaId)
  const canSelect = (materia: Materia | null) => {
  return !!materia && materia.disponible && materia.inscritos < materia.cupo
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Selección de Materias</h2>
        <p className="text-muted-foreground">
          Selecciona las materias del laboratorio de electrónica para este semestre
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {materias.map((materia) => (
          <Card
            key={materia.id}
            className={`transition-all duration-300 hover:shadow-lg ${
              isSelected(materia.id) ? "ring-2 ring-primary border-primary bg-primary/5" : ""
            } ${!canSelect(materia) ? "opacity-60" : "cursor-pointer"}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {materia.nombre}
                      {isSelected(materia.id) && <CheckCircle className="h-4 w-4 text-primary" />}
                    </CardTitle>
                    <CardDescription>{materia.codigo}</CardDescription>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge variant={canSelect(materia) ? "default" : "secondary"}>
                    {canSelect(materia) ? "Disponible" : "No Disponible"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {materia.inscritos}/{materia.cupo}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{materia.descripcion}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{materia.profesor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{materia.horario}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{materia.laboratorio}</span>
                  </div>
                </div>

                {materia.prerequisitos && materia.prerequisitos.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Prerequisitos:</p>
                    <div className="flex flex-wrap gap-1">
                      {materia.prerequisitos.map((prereq, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => setSelectedMateria(materia)}
                      >
                        Ver Detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{selectedMateria?.nombre}</DialogTitle>
                        <DialogDescription>
                          {selectedMateria?.codigo} - {selectedMateria?.profesor}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm">{selectedMateria?.descripcion}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Horario:</p>
                            <p className="text-muted-foreground">{selectedMateria?.horario}</p>
                          </div>
                          <div>
                            <p className="font-medium">Laboratorio:</p>
                            <p className="text-muted-foreground">{selectedMateria?.laboratorio}</p>
                          </div>
                          <div>
                            <p className="font-medium">Cupo:</p>
                            <p className="text-muted-foreground">
                              {selectedMateria?.inscritos}/{selectedMateria?.cupo} estudiantes
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Estado:</p>
                            <p className={`text-sm ${canSelect(selectedMateria) ? "text-green-600" : "text-red-600"}`}>
                              {canSelect(selectedMateria) ? "Disponible" : "No disponible"}
                            </p>
                          </div>
                        </div>
                        {selectedMateria?.prerequisitos && selectedMateria.prerequisitos.length > 0 && (
                          <div>
                            <p className="font-medium mb-2">Prerequisitos:</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedMateria.prerequisitos.map((prereq, index) => (
                                <Badge key={index} variant="outline">
                                  {prereq}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="sm"
                    className="flex-1"
                    disabled={!canSelect(materia)}
                    onClick={() => onSelectMateria(materia.id)}
                    variant={isSelected(materia.id) ? "secondary" : "default"}
                  >
                    {isSelected(materia.id) ? "Seleccionada" : "Seleccionar"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


