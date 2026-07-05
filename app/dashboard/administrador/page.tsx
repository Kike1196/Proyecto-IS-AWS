"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation" //lo agregue yo
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Package,
  LogOut,
  Calendar,
  Plus,
  FileText,
  UserX,
  Settings,
  BarChart3,
  AlertTriangle,
  UserPlus,
  UserCheck,
} from "lucide-react"

// Datos simulados del administrador
const adminData = {
  nombre: "Ing. Roberto",
  apellidos: "Silva Mendoza",
  numeroTrabajador: "ADM-2024-001",
  cargo: "Administrador del Sistema",
}

// Usuarios registrados
const usuarios = [
  {
    id: 1,
    nombre: "Juan Carlos Pérez",
    tipo: "estudiante",
    email: "juan.perez@instituto.edu.mx",
    numeroControl: "20240001",
    estado: "activo",
    fechaRegistro: "2024-01-10",
  },
  {
    id: 2,
    nombre: "Dr. María López",
    tipo: "docente",
    email: "maria.lopez@instituto.edu.mx",
    numeroTrabajador: "DOC-001",
    estado: "activo",
    fechaRegistro: "2024-01-05",
  },
  {
    id: 3,
    nombre: "Ana Martínez García",
    tipo: "estudiante",
    email: "ana.martinez@instituto.edu.mx",
    numeroControl: "20240002",
    estado: "inactivo",
    fechaRegistro: "2024-01-08",
  },
]

// Material del laboratorio
const materialInventario = [
  {
    id: 1,
    nombre: "Resistencias 1/4W",
    categoria: "Componentes Pasivos",
    disponible: 150,
    dañado: 25,
    total: 200
  },
  {
    id: 2,
    nombre: "Capacitores Electrolíticos",
    categoria: "Componentes Pasivos",
    disponible: 45,
    dañado: 15,
    total: 80
  },
  {
    id: 3,
    nombre: "Transistores 2N2222",
    categoria: "Semiconductores",
    disponible: 0,
    dañado: 5,
    total: 30
  },
  {
    id: 4,
    nombre: "Multímetros Digitales",
    categoria: "Instrumentos",
    disponible: 2,
    dañado: 8,
    total: 10
  },
]

// Solicitudes de préstamo pendientes
const solicitudesPendientes = [
  {
    id: 1,
    estudiante: "Juan Carlos Pérez",
    numeroControl: "20240001",
    material: "Resistencias 1/4W",
    cantidad: 10,
    fechaSolicitud: "2024-01-15",
    hora: "10:00 AM",
    motivo: "Práctica de circuitos básicos",
    estado: "pendiente",
  },
  {
    id: 2,
    estudiante: "Ana Martínez García",
    numeroControl: "20240002",
    material: "Multímetros Digitales",
    cantidad: 1,
    fechaSolicitud: "2024-01-14",
    hora: "02:00 PM",
    motivo: "Medición de voltajes en proyecto final",
    estado: "pendiente",
  },
  {
    id: 3,
    estudiante: "Carlos López Ruiz",
    numeroControl: "20240003",
    material: "Capacitores Electrolíticos",
    cantidad: 5,
    fechaSolicitud: "2024-01-13",
    hora: "11:30 AM",
    motivo: "Filtros para fuente de alimentación",
    estado: "pendiente",
  },
]

export default function DashboardAdministrador() {
  const [isCreatingMaterial, setIsCreatingMaterial] = useState(false)
  const [isCreatingAsesoria, setIsCreatingAsesoria] = useState(false)
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false)
  const [nuevoAdmin, setNuevoAdmin] = useState({
    nombre: "",
    apellidos: "",
    numeroTrabajador: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
  })
  const [nuevoMaterial, setNuevoMaterial] = useState({
    nombre: "",
    categoria: "",
    cantidad: ""
  })
  const [nuevaAsesoria, setNuevaAsesoria] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    hora: "",
    cupos: "",
  })

  const handleCrearMaterial = () => {
    console.log("Creando material:", nuevoMaterial)
    setIsCreatingMaterial(false)
    setNuevoMaterial({ nombre: "", categoria: "", cantidad: "" })
  }

  const handleCrearAsesoria = () => {
    console.log("Creando asesoría:", nuevaAsesoria)
    setIsCreatingAsesoria(false)
    setNuevaAsesoria({ titulo: "", descripcion: "", fecha: "", hora: "", cupos: "" })
  }

  const handleCrearAdmin = () => {
    if (nuevoAdmin.password !== nuevoAdmin.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }
    console.log("Creando administrador:", nuevoAdmin)
    setIsCreatingAdmin(false)
    setNuevoAdmin({
      nombre: "",
      apellidos: "",
      numeroTrabajador: "",
      email: "",
      password: "",
      confirmPassword: "",
      telefono: "",
    })
  }

  const handleDesactivarUsuario = (userId: number) => {
    console.log("Desactivando usuario:", userId)
  }

  const handleActivarUsuario = (userId: number) => {
    console.log("Activando usuario:", userId)
  }

  const handleAprobarSolicitud = (solicitudId: number, accion: "aprobar" | "rechazar") => {
    console.log(`${accion === "aprobar" ? "Aprobando" : "Rechazando"} solicitud:`, solicitudId)
    // Aqui se implementaría la logica para actualizar el estado de la solicitud
  }

    // Para cerrar sesion 
  const router = useRouter()
  const handleLogout = () => {
    router.push("/")
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-accent/20 p-2 rounded-full">
                <Settings className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {adminData.nombre} {adminData.apellidos}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {adminData.numeroTrabajador} - {adminData.cargo}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Administrador</Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
               <LogOut className="h-4 w-4 mr-2" />
                 Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="usuarios" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="solicitudes">Solicitudes</TabsTrigger>
            <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
            <TabsTrigger value="inventario">Inventario</TabsTrigger>
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
            <TabsTrigger value="asesorias">Asesorías</TabsTrigger>
          </TabsList>

          <TabsContent value="solicitudes" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Solicitudes de Préstamo</h2>
              <p className="text-muted-foreground mb-6">
                Revisa y aprueba las solicitudes de préstamo de material de laboratorio
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Solicitudes Pendientes</CardTitle>
                <CardDescription>{solicitudesPendientes.length} solicitudes esperando aprobación</CardDescription>
              </CardHeader>
              <CardContent>
                {solicitudesPendientes.length > 0 ? (
                  <div className="space-y-4">
                    {solicitudesPendientes.map((solicitud) => (
                      <Card key={solicitud.id} className="border-l-4 border-l-yellow-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-4">
                                <div>
                                  <h4 className="font-semibold text-foreground">{solicitud.estudiante}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    No. Control: {solicitud.numeroControl}
                                  </p>
                                </div>
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  Pendiente
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Material solicitado:</p>
                                  <p className="font-medium">{solicitud.material}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Cantidad:</p>
                                  <p className="font-medium">{solicitud.cantidad} unidades</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Fecha de solicitud:</p>
                                  <p className="font-medium">{solicitud.fechaSolicitud}</p>
                                </div>
                                <div>
  <p className="text-muted-foreground">Hora:</p>
  <p className="font-medium">{solicitud.hora}</p>
</div>
                                <div>
                                  <p className="text-muted-foreground">Motivo:</p>
                                  <p className="font-medium">{solicitud.motivo}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleAprobarSolicitud(solicitud.id, "aprobar")}
                              >
                                Aprobar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                                onClick={() => handleAprobarSolicitud(solicitud.id, "rechazar")}
                              >
                                Rechazar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-muted/50 p-6 rounded-lg max-w-md mx-auto">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No hay solicitudes pendientes</h3>
                      <p className="text-muted-foreground">Todas las solicitudes han sido procesadas</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usuarios" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Gestión de Usuarios</h2>
                <p className="text-muted-foreground mb-6">Administra los usuarios registrados en el sistema</p>
              </div>
              <Dialog open={isCreatingAdmin} onOpenChange={setIsCreatingAdmin}>
                <DialogTrigger asChild>
                  <Button className="bg-accent hover:bg-accent/90">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Crear Administrador
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Administrador</DialogTitle>
                    <DialogDescription>Registra un nuevo administrador en el sistema</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-nombre">Nombre</Label>
                        <Input
                          id="admin-nombre"
                          value={nuevoAdmin.nombre}
                          onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, nombre: e.target.value })}
                          placeholder="Nombre"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-apellidos">Apellidos</Label>
                        <Input
                          id="admin-apellidos"
                          value={nuevoAdmin.apellidos}
                          onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, apellidos: e.target.value })}
                          placeholder="Apellidos"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-numero">Número de Trabajador</Label>
                      <Input
                        id="admin-numero"
                        value={nuevoAdmin.numeroTrabajador}
                        onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, numeroTrabajador: e.target.value })}
                        placeholder="ADM-2024-002"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Correo Institucional</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        value={nuevoAdmin.email}
                        onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, email: e.target.value })}
                        placeholder="admin@instituto.edu.mx"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-telefono">Número de Teléfono</Label>
                      <Input
                        id="admin-telefono"
                        value={nuevoAdmin.telefono}
                        onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, telefono: e.target.value })}
                        placeholder="555-123-4567"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-password">Contraseña</Label>
                        <Input
                          id="admin-password"
                          type="password"
                          value={nuevoAdmin.password}
                          onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, password: e.target.value })}
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-confirm">Confirmar Contraseña</Label>
                        <Input
                          id="admin-confirm"
                          type="password"
                          value={nuevoAdmin.confirmPassword}
                          onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, confirmPassword: e.target.value })}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatingAdmin(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCrearAdmin}>Crear Administrador</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usuarios Registrados</CardTitle>
                <CardDescription>Lista de todos los usuarios del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Identificador</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.nombre}</TableCell>
                        <TableCell>
                          <Badge variant={usuario.tipo === "docente" ? "secondary" : "default"}>{usuario.tipo}</Badge>
                        </TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>
                          {usuario.tipo === "estudiante" ? usuario.numeroControl : usuario.numeroTrabajador}
                        </TableCell>
                        <TableCell>
                          <Badge variant={usuario.estado === "activo" ? "default" : "destructive"}>
                            {usuario.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {usuario.estado === "activo" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDesactivarUsuario(usuario.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Desactivar
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleActivarUsuario(usuario.id)}
                                className="text-green-600 border-green-200 hover:bg-green-50"
                              >
                                <UserCheck className="h-4 w-4 mr-2" />
                                Activar
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventario" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Inventario de Material</h2>
                <p className="text-muted-foreground">Gestiona el inventario del laboratorio de electrónica</p>
              </div>
              <Dialog open={isCreatingMaterial} onOpenChange={setIsCreatingMaterial}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Material
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo Material</DialogTitle>
                    <DialogDescription>Registra nuevo material en el inventario del laboratorio</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre del Material</Label>
                      <Input
                        id="nombre"
                        value={nuevoMaterial.nombre}
                        onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, nombre: e.target.value })}
                        placeholder="Ej: Resistencias 1/2W"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoría</Label>
                      <Select onValueChange={(value) => setNuevoMaterial({ ...nuevoMaterial, categoria: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="componentes-pasivos">Componentes Pasivos</SelectItem>
                          <SelectItem value="semiconductores">Semiconductores</SelectItem>
                          <SelectItem value="instrumentos">Instrumentos</SelectItem>
                          <SelectItem value="herramientas">Herramientas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                      <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cantidad">Cantidad</Label>
                        <Input
                          id="cantidad"
                          type="number"
                          step="1"
                          min="0"
                          value={nuevoMaterial.cantidad}
                          onChange={(e) => {
                            // Solo acepta enteros positivos
                            const value = e.target.value.replace(/\D/g, "")
                            setNuevoMaterial({ ...nuevoMaterial, cantidad: value })
                          }}
                          placeholder="100"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatingMaterial(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCrearMaterial}>Agregar Material</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {materialInventario.map((item) => (
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
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm font-medium text-green-600">{item.disponible} Disponibles</p>
                          <p className="text-xs text-muted-foreground">de {item.total} total</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-red-600">{item.dañado} Dañados</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          {item.dañado > 0 && (
                            <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Reparar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reportes" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Reportes del Sistema</h2>
              <p className="text-muted-foreground mb-6">
                Genera reportes de material disponible, dañado y estadísticas de uso
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Reporte de Material Disponible</CardTitle>
                      <CardDescription>Inventario actual disponible para préstamo</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground">
                      Total de componentes disponibles: <span className="font-semibold text-green-600">197</span>
                    </p>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generar Reporte PDF
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Reporte de Material Dañado</CardTitle>
                      <CardDescription>Material que requiere reparación o reemplazo</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground">
                      Total de componentes dañados: <span className="font-semibold text-red-600">53</span>
                    </p>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generar Reporte PDF
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="asesorias" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Gestión de Asesorías</h2>
                <p className="text-muted-foreground">Crea y administra asesorías para estudiantes</p>
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
                    <DialogDescription>Programa una nueva asesoría para los estudiantes</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="titulo">Título</Label>
                      <Input
                        id="titulo"
                        value={nuevaAsesoria.titulo}
                        onChange={(e) => setNuevaAsesoria({ ...nuevaAsesoria, titulo: e.target.value })}
                        placeholder="Ej: Introducción a Arduino"
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
                        placeholder="15"
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

            <div className="text-center py-12">
              <div className="bg-muted/50 p-6 rounded-lg max-w-md mx-auto">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No hay asesorías programadas</h3>
                <p className="text-muted-foreground">Crea una nueva asesoría usando el botón "Nueva Asesoría"</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


