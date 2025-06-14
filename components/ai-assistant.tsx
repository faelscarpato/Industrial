"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AIAssistantProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AIAssistant({ open, onOpenChange }: AIAssistantProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)

  const startAnalysis = async () => {
    setIsAnalyzing(true)

    // Simular análise da IA
    setTimeout(() => {
      setAnalysis({
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
        score: 87,
      })
      setIsAnalyzing(false)
    }, 3000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="text-2xl animate-bounce">🦫</div>
            Assistente IA - Análise Inteligente
          </DialogTitle>
          <DialogDescription>
            Análise avançada de performance com insights e recomendações personalizadas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!analysis && !isAnalyzing && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
              <div className="text-6xl mb-4 animate-pulse">🦫</div>
              <h3 className="text-lg font-semibold mb-2">Olá! Sou seu assistente IA</h3>
              <p className="text-muted-foreground mb-6">
                Posso analisar a performance das suas máquinas e fornecer insights valiosos
              </p>
              <Button onClick={startAnalysis} className="bg-indigo-600 hover:bg-indigo-700">
                <Sparkles className="mr-2 h-4 w-4" />
                Iniciar Análise Inteligente
              </Button>
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <div className="text-6xl mb-4 animate-spin">🦫</div>
              <h3 className="text-lg font-semibold mb-2">Analisando dados...</h3>
              <p className="text-muted-foreground">Processando informações de performance e identificando padrões</p>
              <div className="mt-4 w-full bg-muted rounded-full h-2">
                <motion.div
                  className="bg-indigo-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                />
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">🦫</div>
                    <div>
                      <h3 className="font-semibold">Análise Concluída</h3>
                      <p className="text-sm text-muted-foreground">Score de Performance: {analysis.score}/100</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Excelente
                  </Badge>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-indigo-500" />
                      Insights Identificados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.insights.map((insight: string, index: number) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-2"
                        >
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{insight}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Recomendações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec: string, index: number) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-start gap-2"
                        >
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button onClick={() => setAnalysis(null)} variant="outline" className="flex-1">
                    Nova Análise
                  </Button>
                  <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">Salvar Relatório</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
