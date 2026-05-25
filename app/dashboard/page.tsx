"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

interface Project { id: number; title: string; description: string; status: string; progress: number; team: number; members: string }
interface Member { userId: number; name: string; email: string; role: string; position: string; birthdate: string; phone: string; projectId: string; isActive: boolean }
interface Task { id: number; description: string; projectId: string; status: string; priority: string; userId: string; dateline: string }

const initialProjects: Project[] = [
  { id: 1, title: "E-commerce Platform", description: "Plataforma con Next.js", status: "En progreso", progress: 65, team: 5, members: "María, Juan" },
  { id: 2, title: "Mobile App", description: "App con React Native", status: "En revisión", progress: 90, team: 3, members: "Ana, Carlos" },
  { id: 3, title: "Dashboard Analytics", description: "Panel de análisis", status: "Planificado", progress: 20, team: 4, members: "Laura" },
  { id: 4, title: "API Gateway", description: "Microservicios con Node.js", status: "En progreso", progress: 45, team: 6, members: "Juan, Carlos" },
  { id: 5, title: "Design System", description: "Librería de componentes", status: "Completado", progress: 100, team: 2, members: "María" },
  { id: 6, title: "Marketing Website", description: "Sitio web institucional", status: "En progreso", progress: 75, team: 3, members: "Laura, Ana" },
]
const initialMembers: Member[] = [
  { userId: 1, name: "María García", email: "maria@example.com", role: "Frontend Developer", position: "Senior", birthdate: "1995-03-15", phone: "999111222", projectId: "1", isActive: true },
  { userId: 2, name: "Juan Pérez", email: "juan@example.com", role: "Backend Developer", position: "Mid", birthdate: "1993-07-20", phone: "999333444", projectId: "2", isActive: true },
  { userId: 3, name: "Ana López", email: "ana@example.com", role: "UI/UX Designer", position: "Senior", birthdate: "1997-01-10", phone: "999555666", projectId: "1", isActive: false },
  { userId: 4, name: "Carlos Ruiz", email: "carlos@example.com", role: "DevOps Engineer", position: "Senior", birthdate: "1990-11-05", phone: "999777888", projectId: "3", isActive: true },
  { userId: 5, name: "Laura Martínez", email: "laura@example.com", role: "Project Manager", position: "Lead", birthdate: "1988-06-25", phone: "999999000", projectId: "2", isActive: true },
]
const initialTasks: Task[] = [
  { id: 1, description: "Implementar autenticación", projectId: "1", status: "En progreso", priority: "Alta", userId: "1", dateline: "2025-11-15" },
  { id: 2, description: "Diseñar pantalla de perfil", projectId: "2", status: "Pendiente", priority: "Media", userId: "3", dateline: "2025-11-20" },
  { id: 3, description: "Configurar CI/CD", projectId: "4", status: "Completado", priority: "Alta", userId: "4", dateline: "2025-11-10" },
  { id: 4, description: "Optimizar queries SQL", projectId: "1", status: "En progreso", priority: "Urgente", userId: "2", dateline: "2025-11-12" },
  { id: 5, description: "Documentar API endpoints", projectId: "4", status: "Pendiente", priority: "Baja", userId: "5", dateline: "2025-11-25" },
  { id: 6, description: "Crear tests unitarios", projectId: "2", status: "Pendiente", priority: "Media", userId: "2", dateline: "2025-11-30" },
  { id: 7, description: "Revisar diseño mobile", projectId: "3", status: "En progreso", priority: "Alta", userId: "3", dateline: "2025-12-01" },
]

function Spinner() {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="w-8 h-8 border-4 border-[#915ECF] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function StatCard({ title, value, subtitle, icon }: { title: string; value: string | number; subtitle?: string; icon: string }) {
  return (
    <Card className="border-0 shadow-sm bg-white rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold text-[#4D267E]">{title}</CardTitle>
        <span className="text-xl bg-[#f3eeff] p-2 rounded-xl">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-[#4D267E]">{value}</div>
        {subtitle && <p className="text-xs text-[#915ECF] mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const [taskPage, setTaskPage] = useState(1)
  const tasksPerPage = 4
  const totalTaskPages = Math.ceil(tasks.length / tasksPerPage)
  const paginatedTasks = tasks.slice((taskPage - 1) * tasksPerPage, taskPage * tasksPerPage)

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [projectForm, setProjectForm] = useState({ title: "", description: "", status: "En progreso", progress: 0, members: "" })
  const [projectOpen, setProjectOpen] = useState(false)
  const [detailProject, setDetailProject] = useState<Project | null>(null)

  const simular = (cb: () => void) => {
    setLoading(true)
    setTimeout(() => { cb(); setLoading(false) }, 1000)
  }

  // ✅ showAlert diferencia éxito y error
  const showAlert = (msg: string) => { setAlert(msg); setTimeout(() => setAlert(""), 3000) }

  const addProject = () => {
    if (!projectForm.title) { showAlert("⚠️ El nombre del proyecto es obligatorio"); return }
    simular(() => {
      setProjects(prev => [...prev, { ...projectForm, id: Date.now(), team: 0, progress: Number(projectForm.progress) }])
      setProjectForm({ title: "", description: "", status: "En progreso", progress: 0, members: "" })
      setProjectOpen(false)
      showAlert("✅ Proyecto creado correctamente")
    })
  }

  // ✅ deleteProject con confirmación
  const deleteProject = (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return
    simular(() => {
      setProjects(prev => prev.filter(p => p.id !== id))
      showAlert("✅ Proyecto eliminado correctamente")
    })
  }

  const [memberForm, setMemberForm] = useState<Omit<Member, "userId">>({ name: "", email: "", role: "", position: "", birthdate: "", phone: "", projectId: "", isActive: true })
  const [memberOpen, setMemberOpen] = useState(false)
  const [editMember, setEditMember] = useState<Member | null>(null)

  const addMember = () => {
    if (!memberForm.name || !memberForm.email) { showAlert("⚠️ Nombre y email son obligatorios"); return }
    simular(() => {
      if (editMember) {
        setMembers(prev => prev.map(m => m.userId === editMember.userId ? { ...memberForm, userId: editMember.userId } : m))
        setEditMember(null)
        showAlert("✅ Miembro actualizado correctamente")
      } else {
        setMembers(prev => [...prev, { ...memberForm, userId: Date.now() }])
        showAlert("✅ Miembro creado correctamente")
      }
      setMemberForm({ name: "", email: "", role: "", position: "", birthdate: "", phone: "", projectId: "", isActive: true })
      setMemberOpen(false)
    })
  }

  // ✅ deleteMember con confirmación
  const deleteMember = (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este miembro?")) return
    simular(() => {
      setMembers(prev => prev.filter(m => m.userId !== id))
      showAlert("✅ Miembro eliminado correctamente")
    })
  }

  const openEditMember = (m: Member) => {
    setEditMember(m)
    setMemberForm({ name: m.name, email: m.email, role: m.role, position: m.position, birthdate: m.birthdate, phone: m.phone, projectId: m.projectId, isActive: m.isActive })
    setMemberOpen(true)
  }

  const [taskForm, setTaskForm] = useState<Omit<Task, "id">>({ description: "", projectId: "", status: "Pendiente", priority: "Media", userId: "", dateline: "" })
  const [taskOpen, setTaskOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)

  const addTask = () => {
    if (!taskForm.description) { showAlert("⚠️ La descripción es obligatoria"); return }
    simular(() => {
      if (editTask) {
        setTasks(prev => prev.map(t => t.id === editTask.id ? { ...taskForm, id: editTask.id } : t))
        setEditTask(null)
        showAlert("✅ Tarea actualizada correctamente")
      } else {
        setTasks(prev => [...prev, { ...taskForm, id: Date.now() }])
        showAlert("✅ Tarea creada correctamente")
      }
      setTaskForm({ description: "", projectId: "", status: "Pendiente", priority: "Media", userId: "", dateline: "" })
      setTaskOpen(false)
    })
  }

  // ✅ deleteTask con confirmación
  const deleteTask = (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta tarea?")) return
    simular(() => {
      setTasks(prev => prev.filter(t => t.id !== id))
      showAlert("✅ Tarea eliminada correctamente")
    })
  }

  const openEditTask = (t: Task) => {
    setEditTask(t)
    setTaskForm({ description: t.description, projectId: t.projectId, status: t.status, priority: t.priority, userId: t.userId, dateline: t.dateline })
    setTaskOpen(true)
  }

  const [config, setConfig] = useState({ orgName: "Mi Empresa", adminEmail: "admin@empresa.com", language: "es", notifications: "true", theme: "light" })
  const [configSaved, setConfigSaved] = useState(false)
  const saveConfig = () => simular(() => { setConfigSaved(true); setTimeout(() => setConfigSaved(false), 3000) })

  const totalProjects = projects.length
  const completedTasks = tasks.filter(t => t.status === "Completado").length
  const activeMembers = members.filter(m => m.isActive).length

  const statusColor: Record<string, string> = {
    "En progreso": "bg-[#915ECF] text-white",
    "Completado": "bg-[#4D267E] text-white",
    "Planificado": "bg-[#C1A5E4] text-[#4D267E]",
    "En revisión": "bg-purple-200 text-[#4D267E]",
  }
  const priorityColor: Record<string, string> = {
    "Urgente": "bg-red-500 text-white",
    "Alta": "bg-[#4D267E] text-white",
    "Media": "bg-[#915ECF] text-white",
    "Baja": "bg-[#C1A5E4] text-[#4D267E]",
  }

  const navItems = [
    { key: "overview", label: "Resumen" },
    { key: "projects", label: "Proyectos" },
    { key: "team", label: "Equipo" },
    { key: "tasks", label: "Tareas" },
    { key: "settings", label: "Configuración" },
  ]

  return (
    <div className="min-h-screen bg-[#f7f3ff]">

      {/* ── NAVBAR ── */}
      <nav className="bg-[#4D267E] shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow">
              <span className="text-[#4D267E] font-black text-lg">P</span>
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-wide">Planifity📋Hub</span>
              <p className="text-[#C1A5E4] text-xs leading-none">Panel de control</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === item.key
                    ? "bg-white text-[#4D267E] shadow font-bold"
                    : "text-[#C1A5E4] hover:text-white hover:bg-[#915ECF]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-white text-sm font-semibold">Maye Ticona</p>
              <p className="text-[#C1A5E4] text-xs">Administrador</p>
            </div>
            <Avatar>
              <AvatarFallback className="bg-[#915ECF] text-white font-bold">MT</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>

      {/* ── CONTENIDO ── */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#4D267E]">
              {navItems.find(n => n.key === activeTab)?.label}
            </h1>
            <p className="text-[#915ECF] text-sm mt-0.5">
              {new Date().toLocaleDateString("es-PE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        {/* ✅ Alert dinámico: verde para éxito, rojo para error */}
        {alert && (
          <Alert className={`mb-4 rounded-xl border ${alert.startsWith("✅") ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}`}>
            <AlertDescription className={`font-medium ${alert.startsWith("✅") ? "text-green-700" : "text-red-700"}`}>
              {alert}
            </AlertDescription>
          </Alert>
        )}

        {loading && <Spinner />}

        <Tabs value={activeTab} onValueChange={setActiveTab}>

          {/* ── RESUMEN ── */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Proyectos" value={totalProjects} subtitle="Proyectos registrados" icon="📁" />
              <StatCard title="Tareas Completadas" value={completedTasks} subtitle={`De ${tasks.length} totales`} icon="✅" />
              <StatCard title="Miembros Activos" value={activeMembers} subtitle="En el equipo" icon="👥" />
              <StatCard title="Total Tareas" value={tasks.length} subtitle="En todos los proyectos" icon="📋" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-[#4D267E]">Actividad Reciente</CardTitle>
                  <CardDescription>Últimos miembros del equipo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {members.slice(0, 4).map((m, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-[#f3eeff] rounded-xl">
                        <Avatar><AvatarFallback className="bg-[#C1A5E4] text-[#4D267E] font-bold">{m.name[0]}</AvatarFallback></Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#4D267E]">{m.name}</p>
                          <p className="text-xs text-[#915ECF]">{m.role}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${m.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {m.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-[#4D267E]">Calendario</CardTitle>
                  <CardDescription>Fecha: {date?.toLocaleDateString("es-PE")}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-xl" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── PROYECTOS ── */}
          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-[#915ECF] text-sm">{projects.length} proyectos registrados</p>
              <Dialog open={projectOpen} onOpenChange={setProjectOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#4D267E] hover:bg-[#915ECF] text-white rounded-xl">+ Nuevo Proyecto</Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-[#4D267E]">Crear Proyecto</DialogTitle>
                    <DialogDescription>Completa los campos del proyecto</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3 py-2">
                    <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Nombre *</Label>
                      <Input value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="Nombre del proyecto" className="rounded-xl" />
                    </div>
                    <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Descripción</Label>
                      <Input value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} placeholder="Descripción breve" className="rounded-xl" />
                    </div>
                    <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Miembros del equipo</Label>
                      <Input value={projectForm.members} onChange={e => setProjectForm({ ...projectForm, members: e.target.value })} placeholder="Ej: María, Juan" className="rounded-xl" />
                    </div>
                    <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Estado</Label>
                      <Select value={projectForm.status} onValueChange={v => setProjectForm({ ...projectForm, status: v })}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="En progreso">En progreso</SelectItem>
                          <SelectItem value="Planificado">Planificado</SelectItem>
                          <SelectItem value="En revisión">En revisión</SelectItem>
                          <SelectItem value="Completado">Completado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Progreso (%)</Label>
                      <Input type="number" min={0} max={100} value={projectForm.progress} onChange={e => setProjectForm({ ...projectForm, progress: Number(e.target.value) })} className="rounded-xl" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="rounded-xl" onClick={() => setProjectOpen(false)}>Cancelar</Button>
                    <Button className="bg-[#4D267E] hover:bg-[#915ECF] text-white rounded-xl" onClick={addProject}>Crear</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="border-0 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base text-[#4D267E]">{project.title}</CardTitle>
                        <CardDescription className="text-xs">{project.description}</CardDescription>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColor[project.status] || "bg-gray-100"}`}>{project.status}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-[#915ECF] mb-3">👥 {project.members}</p>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1 text-[#4D267E]">
                        <span>Progreso</span><span className="font-bold">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-[#C1A5E4]/30 h-2 rounded-full">
                        <div className="h-full bg-gradient-to-r from-[#4D267E] to-[#915ECF] rounded-full transition-all" style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="border-[#915ECF] text-[#4D267E] text-xs rounded-lg" onClick={() => setDetailProject(project)}>Ver detalles</Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-2xl">
                          <DialogHeader><DialogTitle className="text-[#4D267E]">{detailProject?.title}</DialogTitle></DialogHeader>
                          <div className="space-y-3 text-sm">
                            <div className="p-3 bg-[#f3eeff] rounded-xl"><strong className="text-[#4D267E]">Descripción:</strong> {detailProject?.description}</div>
                            <div className="p-3 bg-[#f3eeff] rounded-xl"><strong className="text-[#4D267E]">Estado:</strong> {detailProject?.status}</div>
                            <div className="p-3 bg-[#f3eeff] rounded-xl"><strong className="text-[#4D267E]">Progreso:</strong> {detailProject?.progress}%</div>
                            <div className="p-3 bg-[#f3eeff] rounded-xl"><strong className="text-[#4D267E]">Miembros:</strong> {detailProject?.members}</div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg" onClick={() => deleteProject(project.id)}>Eliminar</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── EQUIPO ── */}
          <TabsContent value="team" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-[#915ECF] text-sm">{members.length} miembros registrados</p>
              <Dialog open={memberOpen} onOpenChange={(o) => { setMemberOpen(o); if (!o) { setEditMember(null); setMemberForm({ name: "", email: "", role: "", position: "", birthdate: "", phone: "", projectId: "", isActive: true }) } }}>
                <DialogTrigger asChild>
                  <Button className="bg-[#4D267E] hover:bg-[#915ECF] text-white rounded-xl">+ Nuevo Miembro</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg rounded-2xl">
                  <DialogHeader><DialogTitle className="text-[#4D267E]">{editMember ? "Editar Miembro" : "Nuevo Miembro"}</DialogTitle></DialogHeader>
                  <div className="grid grid-cols-2 gap-3 py-2">
                    <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Nombre *</Label><Input className="rounded-xl" value={memberForm.name} onChange={e => setMemberForm({ ...memberForm, name: e.target.value })} /></div>
                    <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Email *</Label><Input className="rounded-xl" value={memberForm.email} onChange={e => setMemberForm({ ...memberForm, email: e.target.value })} /></div>
                    <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Rol</Label><Input className="rounded-xl" value={memberForm.role} onChange={e => setMemberForm({ ...memberForm, role: e.target.value })} /></div>
                    <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Posición</Label>
                      <Select value={memberForm.position} onValueChange={v => setMemberForm({ ...memberForm, position: v })}>
                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Selecciona" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Junior">Junior</SelectItem>
                          <SelectItem value="Mid">Mid</SelectItem>
                          <SelectItem value="Senior">Senior</SelectItem>
                          <SelectItem value="Lead">Lead</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Teléfono</Label><Input className="rounded-xl" value={memberForm.phone} onChange={e => setMemberForm({ ...memberForm, phone: e.target.value })} /></div>
                    <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Fecha Nacimiento</Label><Input type="date" className="rounded-xl" value={memberForm.birthdate} onChange={e => setMemberForm({ ...memberForm, birthdate: e.target.value })} /></div>
                    <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Proyecto ID</Label><Input className="rounded-xl" value={memberForm.projectId} onChange={e => setMemberForm({ ...memberForm, projectId: e.target.value })} /></div>
                    <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Estado</Label>
                      <Select value={memberForm.isActive ? "true" : "false"} onValueChange={v => setMemberForm({ ...memberForm, isActive: v === "true" })}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Activo</SelectItem>
                          <SelectItem value="false">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="rounded-xl" onClick={() => setMemberOpen(false)}>Cancelar</Button>
                    <Button className="bg-[#4D267E] hover:bg-[#915ECF] text-white rounded-xl" onClick={addMember}>{editMember ? "Guardar" : "Crear"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {members.map((m) => (
                    <div key={m.userId} className="flex items-center justify-between p-4 bg-[#f3eeff] rounded-xl">
                      <div className="flex items-center gap-3">
                        <Avatar><AvatarFallback className="bg-[#915ECF] text-white font-bold">{m.name[0]}</AvatarFallback></Avatar>
                        <div>
                          <p className="text-sm font-semibold text-[#4D267E]">{m.name}</p>
                          <p className="text-xs text-[#915ECF]">{m.role} · {m.position}</p>
                          <p className="text-xs text-gray-400">{m.email} · {m.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${m.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{m.isActive ? "Activo" : "Inactivo"}</span>
                        <Button size="sm" variant="outline" className="border-[#915ECF] text-[#4D267E] text-xs rounded-lg" onClick={() => openEditMember(m)}>Editar</Button>
                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg" onClick={() => deleteMember(m.userId)}>Eliminar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── TAREAS ── */}
          <TabsContent value="tasks" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-[#915ECF] text-sm">{tasks.length} tareas registradas</p>
              <Dialog open={taskOpen} onOpenChange={(o) => { setTaskOpen(o); if (!o) { setEditTask(null); setTaskForm({ description: "", projectId: "", status: "Pendiente", priority: "Media", userId: "", dateline: "" }) } }}>
                <DialogTrigger asChild>
                  <Button className="bg-[#4D267E] hover:bg-[#915ECF] text-white rounded-xl">+ Nueva Tarea</Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl">
                  <DialogHeader><DialogTitle className="text-[#4D267E]">{editTask ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle></DialogHeader>
                  <div className="grid gap-3 py-2">
                    <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Descripción *</Label><Input className="rounded-xl" value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} /></div>
                    <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Proyecto ID</Label><Input className="rounded-xl" value={taskForm.projectId} onChange={e => setTaskForm({ ...taskForm, projectId: e.target.value })} /></div>
                    <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Usuario ID</Label><Input className="rounded-xl" value={taskForm.userId} onChange={e => setTaskForm({ ...taskForm, userId: e.target.value })} /></div>
                    <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Estado</Label>
                      <Select value={taskForm.status} onValueChange={v => setTaskForm({ ...taskForm, status: v })}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pendiente">Pendiente</SelectItem>
                          <SelectItem value="En progreso">En progreso</SelectItem>
                          <SelectItem value="Completado">Completado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Prioridad</Label>
                      <Select value={taskForm.priority} onValueChange={v => setTaskForm({ ...taskForm, priority: v })}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Baja">Baja</SelectItem>
                          <SelectItem value="Media">Media</SelectItem>
                          <SelectItem value="Alta">Alta</SelectItem>
                          <SelectItem value="Urgente">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Fecha límite</Label><Input type="date" className="rounded-xl" value={taskForm.dateline} onChange={e => setTaskForm({ ...taskForm, dateline: e.target.value })} /></div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="rounded-xl" onClick={() => setTaskOpen(false)}>Cancelar</Button>
                    <Button className="bg-[#4D267E] hover:bg-[#915ECF] text-white rounded-xl" onClick={addTask}>{editTask ? "Guardar" : "Crear"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {paginatedTasks.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-4 bg-[#f3eeff] rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-[#4D267E]">{t.description}</p>
                        <p className="text-xs text-[#915ECF] mt-0.5">Proyecto: {t.projectId} · Usuario: {t.userId} · Fecha: {t.dateline}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColor[t.status] || "bg-gray-100"}`}>{t.status}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${priorityColor[t.priority] || "bg-gray-100"}`}>{t.priority}</span>
                        <Button size="sm" variant="outline" className="border-[#915ECF] text-[#4D267E] text-xs rounded-lg" onClick={() => openEditTask(t)}>Editar</Button>
                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg" onClick={() => deleteTask(t.id)}>Eliminar</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem><PaginationPrevious onClick={() => setTaskPage(p => Math.max(1, p - 1))} className="cursor-pointer text-[#4D267E]" /></PaginationItem>
                    {Array.from({ length: totalTaskPages }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink isActive={taskPage === i + 1} onClick={() => setTaskPage(i + 1)} className={`cursor-pointer ${taskPage === i + 1 ? "bg-[#4D267E] text-white" : "text-[#4D267E]"}`}>{i + 1}</PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem><PaginationNext onClick={() => setTaskPage(p => Math.min(totalTaskPages, p + 1))} className="cursor-pointer text-[#4D267E]" /></PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── CONFIGURACIÓN ── */}
          <TabsContent value="settings">
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#4D267E]">Configuración del Sistema</CardTitle>
                <CardDescription>Administra las preferencias de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                {configSaved && (
                  <Alert className="mb-4 border-green-300 bg-green-50 rounded-xl">
                    <AlertDescription className="text-green-700 font-medium">✅ Configuración guardada correctamente</AlertDescription>
                  </Alert>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Nombre de la organización</Label><Input className="rounded-xl" value={config.orgName} onChange={e => setConfig({ ...config, orgName: e.target.value })} /></div>
                  <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Email del administrador</Label><Input className="rounded-xl" value={config.adminEmail} onChange={e => setConfig({ ...config, adminEmail: e.target.value })} /></div>
                  <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Idioma</Label>
                    <Select value={config.language} onValueChange={v => setConfig({ ...config, language: v })}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">Inglés</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Notificaciones</Label>
                    <Select value={config.notifications} onValueChange={v => setConfig({ ...config, notifications: v })}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Activadas</SelectItem>
                        <SelectItem value="false">Desactivadas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1"><Label className="text-[#4D267E] font-semibold">Tema</Label>
                    <Select value={config.theme} onValueChange={v => setConfig({ ...config, theme: v })}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Oscuro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="mt-6 bg-[#4D267E] hover:bg-[#915ECF] text-white rounded-xl px-8" onClick={saveConfig}>
                  Guardar configuración
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}