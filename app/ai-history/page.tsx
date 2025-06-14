"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Sparkles, Calendar, TrendingUp, RefreshCw, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface AIAnalysis {
  id: string
  title: string
  type: "monthly" | "performance" | "predictive"
  date: string
  score: number
  insights: string[]
  recommendations: string[]
  status: "completed" | "regenerating"
}

const mockAnalyses: AIAnalysis[] = [
  {
    id: "1",
    title: "Análise de Performance - Junho 2024",
    type: "performance",
    date: "2024-06-15",
    score: 87,
    insights: [
      "Máquina de Corte A1 apresenta performance 12% acima da média",
      "Prensa Hidráulica B2 teve queda de 5% na eficiência nas últimas 48h",
      "Padrão de manutenção preventiva está sendo seguido adequadamente",
    ],
    recommendations: [
      "Investigar causa da queda de performance na Prensa B2",
      "Considerar replicar configurações da Máquina A1 em outras unidades",
      "Agendar manutenção preventiva para Fresadora D4 em 2 semanas",
    ],
    status: "completed",
  },
  {
    id: "2",
    title: "Análise Preditiva - Manutenção",
    type: "predictive",
    date: "2024-06-10",
    score: 92,
    insights: [
      "Torno CNC C3 apresenta sinais de desgaste no sistema hidráulico",
      "Probabilidade de falha em 15 dias: 23%",
      "Histórico de manutenção indica necessidade de revisão",
    ],
    recommendations: [
      "Agendar manutenção preventiva para o Torno CNC C3",
      "Verificar níveis de fluido hidráulico semanalmente",
      "Considerar upgrade do sistema de monitoramento",
    ],
    status: "completed",
  },
  {
    id: "3",
    title: "Relatório Mensal - Maio 2024",
    type: "monthly",
    date: "2024-05-31",
    score: 89,
    insights: [
      "Eficiência geral do parque industrial: 91.2%",
      "Redução de 15% no tempo de parada vs abril",
      "Soldadora E5 voltou à operação com excelente performance",
    ],
    recommendations: [
      "Manter protocolo atual de manutenção preventiva",
      "Expandir monitoramento para máquinas auxiliares",
      "Implementar sistema de alertas automáticos",
    ],
    status: "completed",
  },
]

export default function AIHistoryPage() {
  const [analyses, setAnalyses] = useState<AIAnalysis[]>(mockAnalyses)
  const [selectedAnalysis, setSelectedAnalysis] = useState<AIAnalysis | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "monthly":
        return "Mensal"
      case "performance":
        return "Performance"
      case "predictive":
        return "Preditiva"
      default:
        return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "monthly":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
      case "performance":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
      case "predictive":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const handleRegenerate = async (analysisId: string) => {
    setAnalyses((prev) =>
      prev.map((analysis) =>
        analysis.id === analysisId ? { ...analysis, status: "regenerating" as const } : analysis,
      ),
    )

    toast({
      title: "Regenerando análise",
      description: "A IA está processando novamente os dados...",
    })

    // Simular regeneração
    setTimeout(() => {
      setAnalyses((prev) =>
        prev.map((analysis) =>
          analysis.id === analysisId
            ? { ...analysis, status: "completed" as const, score: Math.floor(Math.random() * 20) + 80 }
            : analysis,
        ),
      )

      toast({
        title: "Análise regenerada",
        description: "A análise foi atualizada com os dados mais recentes.",
      })
    }, 3000)
  }

  const handleViewDetails = (analysis: AIAnalysis) => {
    setSelectedAnalysis(analysis)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Histórico de Análises IA</h1>
            <p className="text-muted-foreground">Visualize e regenere análises anteriores do sistema inteligente</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-2xl animate-pulse">🦫</div>
          <div className="text-sm">
            <div className="font-medium">IA Assistant</div>
            <div className="text-muted-foreground">{analyses.length} análises</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {analyses.map((analysis, index) => (
          <motion.div
            key={analysis.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{analysis.title}</CardTitle>
                      <Badge className={getTypeColor(analysis.type)}>{getTypeLabel(analysis.type)}</Badge>
                    </div>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(analysis.date).toLocaleDateString("pt-BR")}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Score: {analysis.score}/100
                      </span>
                    </CardDescription>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(analysis)}
                      disabled={analysis.status === "regenerating"}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Ver Detalhes
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRegenerate(analysis.id)}
                      disabled={analysis.status === "regenerating"}
                    >
                      {analysis.status === "regenerating" ? (
                        <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <Sparkles className="mr-1 h-3 w-3" />
                      )}
                      {analysis.status === "regenerating" ? "Regenerando..." : "Regenerar"}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-indigo-500" />
                      Principais Insights
                    </h4>
                    <ul className="space-y-1">
                      {analysis.insights.slice(0, 2).map((insight, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="line-clamp-2">{insight}</span>
                        </li>
                      ))}
                      {analysis.insights.length > 2 && (
                        <li className="text-sm text-muted-foreground">
                          +{analysis.insights.length - 2} insights adicionais
                        </li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      Recomendações
                    </h4>
                    <ul className="space-y-1">
                      {analysis.recommendations.slice(0, 2).map((rec, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="line-clamp-2">{rec}</span>
                        </li>
                      ))}
                      {analysis.recommendations.length > 2 && (
                        <li className="text-sm text-muted-foreground">
                          +{analysis.recommendations.length - 2} recomendações adicionais
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Dialog para detalhes da análise */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedAnalysis && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="text-2xl">🦫</div>
                  {selectedAnalysis.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-4">
                  <Badge className={getTypeColor(selectedAnalysis.type)}>{getTypeLabel(selectedAnalysis.type)}</Badge>
                  <span>{new Date(selectedAnalysis.date).toLocaleDateString("pt-BR")}</span>
                  <span>Score: {selectedAnalysis.score}/100</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-indigo-500" />
                      Insights Completos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {selectedAnalysis.insights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      Recomendações Completas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {selectedAnalysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleRegenerate(selectedAnalysis.id)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    disabled={selectedAnalysis.status === "regenerating"}
                  >
                    {selectedAnalysis.status === "regenerating" ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    {selectedAnalysis.status === "regenerating" ? "Regenerando..." : "Regenerar Análise"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Fechar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
