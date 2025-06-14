"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Calendar, TrendingDown, TrendingUp, Activity } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { motion } from "framer-motion"

const monthlyData = [
  { month: "Jan", efficiency: 89, downtime: 12, production: 450 },
  { month: "Fev", efficiency: 92, downtime: 8, production: 480 },
  { month: "Mar", efficiency: 87, downtime: 15, production: 420 },
  { month: "Abr", efficiency: 94, downtime: 6, production: 510 },
  { month: "Mai", efficiency: 91, downtime: 9, production: 495 },
  { month: "Jun", efficiency: 96, downtime: 4, production: 530 },
]

const machineDetails = {
  "corte-a1": {
    name: "Máquina de Corte A1",
    data: [
      { day: "1", efficiency: 94, cycles: 28 },
      { day: "5", efficiency: 92, cycles: 26 },
      { day: "10", efficiency: 96, cycles: 30 },
      { day: "15", efficiency: 89, cycles: 24 },
      { day: "20", efficiency: 98, cycles: 32 },
      { day: "25", efficiency: 91, cycles: 27 },
      { day: "30", efficiency: 95, cycles: 29 },
    ],
    observations: [
      "Excelente performance no dia 20, atingindo 98% de eficiência",
      "Queda de performance no dia 15, possivelmente devido à manutenção",
      "Média mensal de 93.6% de eficiência, acima do target de 90%",
    ],
  },
  "prensa-b2": {
    name: "Prensa Hidráulica B2",
    data: [
      { day: "1", efficiency: 87, cycles: 35 },
      { day: "5", efficiency: 89, cycles: 37 },
      { day: "10", efficiency: 85, cycles: 33 },
      { day: "15", efficiency: 91, cycles: 39 },
      { day: "20", efficiency: 88, cycles: 36 },
      { day: "25", efficiency: 93, cycles: 41 },
      { day: "30", efficiency: 90, cycles: 38 },
    ],
    observations: [
      "Tendência de melhoria ao longo do mês",
      "Melhor performance no dia 25 com 93% de eficiência",
      "Recomenda-se investigar configurações do dia 25 para replicar",
    ],
  },
}

export default function MonthlyAnalysisPage() {
  const [selectedMonth, setSelectedMonth] = useState("Jun")
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null)

  const currentMonthData = monthlyData.find((d) => d.month === selectedMonth)

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Análise Mensal</h1>
            <p className="text-muted-foreground">Análise detalhada de performance por período</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthlyData.map((month) => (
                <SelectItem key={month.month} value={month.month}>
                  {month.month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards de Resumo do Mês */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eficiência Média</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentMonthData?.efficiency}%</div>
              <p className="text-xs text-muted-foreground">+3% vs mês anterior</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo de Parada</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentMonthData?.downtime}h</div>
              <p className="text-xs text-muted-foreground">-2h vs mês anterior</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produção Total</CardTitle>
              <Activity className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentMonthData?.production}</div>
              <p className="text-xs text-muted-foreground">unidades produzidas</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Gráfico de Tendência Mensal */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Tendência de Performance
            </CardTitle>
            <CardDescription>Evolução da eficiência ao longo dos meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Drilldown por Máquina */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>Análise Detalhada por Máquina</CardTitle>
            <CardDescription>Clique em uma máquina para ver detalhes do período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              {Object.entries(machineDetails).map(([key, machine]) => (
                <Button
                  key={key}
                  variant={selectedMachine === key ? "default" : "outline"}
                  className="h-auto p-4 justify-start"
                  onClick={() => setSelectedMachine(selectedMachine === key ? null : key)}
                >
                  <div className="text-left">
                    <div className="font-medium">{machine.name}</div>
                    <div className="text-sm text-muted-foreground">Clique para ver detalhes</div>
                  </div>
                </Button>
              ))}
            </div>

            {selectedMachine && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">
                    {machineDetails[selectedMachine as keyof typeof machineDetails].name}
                  </h3>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Performance Diária</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={machineDetails[selectedMachine as keyof typeof machineDetails].data}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="day" className="text-xs fill-muted-foreground" />
                            <YAxis className="text-xs fill-muted-foreground" />
                            <Tooltip />
                            <Bar dataKey="efficiency" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Observações</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {machineDetails[selectedMachine as keyof typeof machineDetails].observations.map(
                            (obs, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                                <span>{obs}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
