"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Activity, AlertTriangle, CheckCircle, Clock, TrendingUp, Zap } from "lucide-react"
import { PerformanceChart } from "@/components/charts/performance-chart"
import { EfficiencyChart } from "@/components/charts/efficiency-chart"
import { AIAssistant } from "@/components/ai-assistant"
import { motion } from "framer-motion"

interface Machine {
  id: string
  name: string
  status: "active" | "inactive" | "maintenance"
  efficiency: number
  lastUpdate: string
}

interface DashboardStats {
  totalMachines: number
  activeMachines: number
  averageEfficiency: number
  alertsCount: number
}

export default function Dashboard() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalMachines: 0,
    activeMachines: 0,
    averageEfficiency: 0,
    alertsCount: 0,
  })
  const [showAI, setShowAI] = useState(false)

  useEffect(() => {
    // Simular dados das máquinas
    const mockMachines: Machine[] = [
      { id: "1", name: "Máquina de Corte A1", status: "active", efficiency: 94.5, lastUpdate: "2 min atrás" },
      { id: "2", name: "Prensa Hidráulica B2", status: "active", efficiency: 87.2, lastUpdate: "5 min atrás" },
      { id: "3", name: "Torno CNC C3", status: "maintenance", efficiency: 0, lastUpdate: "2h atrás" },
      { id: "4", name: "Fresadora D4", status: "active", efficiency: 91.8, lastUpdate: "1 min atrás" },
      { id: "5", name: "Soldadora E5", status: "inactive", efficiency: 0, lastUpdate: "1d atrás" },
    ]

    setMachines(mockMachines)

    const activeMachines = mockMachines.filter((m) => m.status === "active")
    const avgEfficiency = activeMachines.reduce((acc, m) => acc + m.efficiency, 0) / activeMachines.length

    setStats({
      totalMachines: mockMachines.length,
      activeMachines: activeMachines.length,
      averageEfficiency: avgEfficiency,
      alertsCount: mockMachines.filter((m) => m.status === "maintenance").length,
    })
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500"
      case "maintenance":
        return "bg-amber-500"
      case "inactive":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "maintenance":
        return <AlertTriangle className="h-4 w-4" />
      case "inactive":
        return <Clock className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral da performance das máquinas industriais</p>
          </div>
        </div>
        <Button onClick={() => setShowAI(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Zap className="mr-2 h-4 w-4" />
          Análise IA
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Máquinas</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMachines}</div>
              <p className="text-xs text-muted-foreground">+2 desde o mês passado</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Máquinas Ativas</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeMachines}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.activeMachines / stats.totalMachines) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eficiência Média</CardTitle>
              <TrendingUp className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageEfficiency.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">+2.1% desde ontem</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.alertsCount}</div>
              <p className="text-xs text-muted-foreground">Requer atenção</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>Performance por Máquina</CardTitle>
              <CardDescription>Eficiência das máquinas ativas nos últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceChart />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Status</CardTitle>
              <CardDescription>Status atual de todas as máquinas</CardDescription>
            </CardHeader>
            <CardContent>
              <EfficiencyChart />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Lista de Máquinas */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card>
          <CardHeader>
            <CardTitle>Status das Máquinas</CardTitle>
            <CardDescription>Monitoramento em tempo real de todas as máquinas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {machines.map((machine, index) => (
                <motion.div
                  key={machine.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(machine.status)}`} />
                    <div>
                      <h4 className="font-medium">{machine.name}</h4>
                      <p className="text-sm text-muted-foreground">Última atualização: {machine.lastUpdate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {machine.status === "active" && (
                      <div className="text-right">
                        <p className="font-medium">{machine.efficiency}%</p>
                        <p className="text-sm text-muted-foreground">Eficiência</p>
                      </div>
                    )}
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getStatusIcon(machine.status)}
                      {machine.status === "active"
                        ? "Ativa"
                        : machine.status === "maintenance"
                          ? "Manutenção"
                          : "Inativa"}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AIAssistant open={showAI} onOpenChange={setShowAI} />
    </div>
  )
}
