"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Settings, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface Machine {
  id: string
  name: string
  standardCycle: number
  observations: string
  status: "active" | "inactive" | "maintenance"
  createdAt: string
}

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    standardCycle: "",
    observations: "",
    status: "active" as const,
  })
  const { toast } = useToast()

  useEffect(() => {
    // Simular carregamento de dados
    const mockMachines: Machine[] = [
      {
        id: "1",
        name: "Máquina de Corte A1",
        standardCycle: 45,
        observations: "Máquina principal de corte, alta precisão",
        status: "active",
        createdAt: "2024-01-15",
      },
      {
        id: "2",
        name: "Prensa Hidráulica B2",
        standardCycle: 30,
        observations: "Prensa para conformação de peças",
        status: "active",
        createdAt: "2024-01-10",
      },
      {
        id: "3",
        name: "Torno CNC C3",
        standardCycle: 60,
        observations: "Torno de alta precisão para usinagem",
        status: "maintenance",
        createdAt: "2024-01-05",
      },
    ]
    setMachines(mockMachines)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingMachine) {
      // Editar máquina existente
      setMachines((prev) =>
        prev.map((machine) =>
          machine.id === editingMachine.id
            ? {
                ...machine,
                name: formData.name,
                standardCycle: Number.parseInt(formData.standardCycle),
                observations: formData.observations,
                status: formData.status,
              }
            : machine,
        ),
      )
      toast({
        title: "Máquina atualizada",
        description: "As informações da máquina foram atualizadas com sucesso.",
      })
    } else {
      // Criar nova máquina
      const newMachine: Machine = {
        id: Date.now().toString(),
        name: formData.name,
        standardCycle: Number.parseInt(formData.standardCycle),
        observations: formData.observations,
        status: formData.status,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setMachines((prev) => [...prev, newMachine])
      toast({
        title: "Máquina cadastrada",
        description: "Nova máquina foi adicionada ao sistema.",
      })
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      standardCycle: "",
      observations: "",
      status: "active",
    })
    setEditingMachine(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (machine: Machine) => {
    setEditingMachine(machine)
    setFormData({
      name: machine.name,
      standardCycle: machine.standardCycle.toString(),
      observations: machine.observations,
      status: machine.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setMachines((prev) => prev.filter((machine) => machine.id !== id))
    toast({
      title: "Máquina removida",
      description: "A máquina foi removida do sistema.",
      variant: "destructive",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "maintenance":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "inactive":
        return <Clock className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativa"
      case "maintenance":
        return "Manutenção"
      case "inactive":
        return "Inativa"
      default:
        return status
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Máquinas</h1>
            <p className="text-muted-foreground">Cadastre e gerencie suas máquinas industriais</p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" />
              Nova Máquina
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingMachine ? "Editar Máquina" : "Nova Máquina"}</DialogTitle>
              <DialogDescription>
                {editingMachine ? "Atualize as informações da máquina" : "Adicione uma nova máquina ao sistema"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Máquina</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Máquina de Corte A1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="standardCycle">Ciclo Padrão (minutos)</Label>
                <Input
                  id="standardCycle"
                  type="number"
                  value={formData.standardCycle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, standardCycle: e.target.value }))}
                  placeholder="45"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive" | "maintenance") =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                    <SelectItem value="inactive">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => setFormData((prev) => ({ ...prev, observations: e.target.value }))}
                  placeholder="Descrição, especificações técnicas, etc."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  {editingMachine ? "Atualizar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Máquinas Cadastradas
            </CardTitle>
            <CardDescription>{machines.length} máquinas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Ciclo Padrão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.map((machine, index) => (
                  <motion.tr
                    key={machine.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{machine.name}</div>
                        {machine.observations && (
                          <div className="text-sm text-muted-foreground truncate max-w-xs">{machine.observations}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{machine.standardCycle} min</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {getStatusIcon(machine.status)}
                        {getStatusLabel(machine.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(machine.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(machine)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(machine.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
