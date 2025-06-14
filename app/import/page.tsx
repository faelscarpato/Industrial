"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Upload, FileText, CheckCircle, AlertCircle, Download, MapIcon as Mapping } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface CSVColumn {
  name: string
  type: "text" | "number" | "date"
  sample: string
}

interface MappingRule {
  csvColumn: string
  systemField: string
  required: boolean
}

const systemFields = [
  { key: "machine_name", label: "Nome da Máquina", required: true },
  { key: "cycle_time", label: "Tempo de Ciclo (min)", required: true },
  { key: "efficiency", label: "Eficiência (%)", required: false },
  { key: "recorded_at", label: "Data/Hora", required: true },
  { key: "observations", label: "Observações", required: false },
]

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<any[]>([])
  const [csvColumns, setCsvColumns] = useState<CSVColumn[]>([])
  const [mappingRules, setMappingRules] = useState<MappingRule[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [importResults, setImportResults] = useState<any>(null)
  const { toast } = useToast()

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const uploadedFile = event.target.files?.[0]
      if (!uploadedFile) return

      if (!uploadedFile.name.endsWith(".csv")) {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo CSV.",
          variant: "destructive",
        })
        return
      }

      setFile(uploadedFile)

      // Simular leitura do CSV
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const lines = text.split("\n")
        const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

        // Simular dados do CSV
        const mockData = [
          ["Máquina A1", "45", "94.5", "2024-06-15 10:30", "Performance excelente"],
          ["Prensa B2", "30", "87.2", "2024-06-15 11:00", "Operação normal"],
          ["Torno C3", "60", "91.8", "2024-06-15 11:30", "Manutenção preventiva"],
        ]

        const columns: CSVColumn[] = headers.map((header, index) => ({
          name: header,
          type: index === 1 || index === 2 ? "number" : index === 3 ? "date" : "text",
          sample: mockData[0]?.[index] || "",
        }))

        setCsvColumns(columns)
        setCsvData(mockData.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index]]))))

        // Inicializar regras de mapeamento
        const initialMapping: MappingRule[] = systemFields.map((field) => ({
          csvColumn: "",
          systemField: field.key,
          required: field.required,
        }))
        setMappingRules(initialMapping)

        toast({
          title: "Arquivo carregado",
          description: `${mockData.length} registros encontrados. Configure o mapeamento abaixo.`,
        })
      }
      reader.readAsText(uploadedFile)
    },
    [toast],
  )

  const updateMapping = (systemField: string, csvColumn: string) => {
    setMappingRules((prev) => prev.map((rule) => (rule.systemField === systemField ? { ...rule, csvColumn } : rule)))
  }

  const validateMapping = () => {
    const requiredFields = mappingRules.filter((rule) => rule.required)
    const unmappedRequired = requiredFields.filter((rule) => !rule.csvColumn)

    if (unmappedRequired.length > 0) {
      toast({
        title: "Mapeamento incompleto",
        description: "Todos os campos obrigatórios devem ser mapeados.",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleImport = async () => {
    if (!validateMapping()) return

    setIsProcessing(true)

    // Simular processamento
    setTimeout(() => {
      const results = {
        total: csvData.length,
        success: csvData.length - 1,
        errors: 1,
        warnings: 0,
        errorDetails: [{ row: 2, message: "Eficiência fora do range válido (0-100%)" }],
      }

      setImportResults(results)
      setIsProcessing(false)

      toast({
        title: "Importação concluída",
        description: `${results.success} registros importados com sucesso.`,
      })
    }, 3000)
  }

  const downloadTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Nome da Máquina,Tempo de Ciclo,Eficiência,Data/Hora,Observações\n" +
      "Máquina A1,45,94.5,2024-06-15 10:30,Performance excelente\n" +
      "Prensa B2,30,87.2,2024-06-15 11:00,Operação normal"

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "template_importacao.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Importação de Dados</h1>
            <p className="text-muted-foreground">Importe dados de performance via arquivo CSV</p>
          </div>
        </div>

        <Button onClick={downloadTemplate} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Baixar Template
        </Button>
      </div>

      {/* Upload de Arquivo */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload do Arquivo
            </CardTitle>
            <CardDescription>Selecione um arquivo CSV com os dados de performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Clique para enviar</span> ou arraste o arquivo
                    </p>
                    <p className="text-xs text-muted-foreground">CSV (MAX. 10MB)</p>
                  </div>
                  <Input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {file && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <Badge variant="outline">{(file.size / 1024).toFixed(1)} KB</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mapeamento de Colunas */}
      {csvColumns.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mapping className="h-5 w-5" />
                Mapeamento de Colunas
              </CardTitle>
              <CardDescription>Configure como as colunas do CSV correspondem aos campos do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemFields.map((field) => {
                  const mapping = mappingRules.find((rule) => rule.systemField === field.key)
                  return (
                    <div
                      key={field.key}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 border rounded-lg"
                    >
                      <div>
                        <Label className="font-medium">{field.label}</Label>
                        {field.required && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            Obrigatório
                          </Badge>
                        )}
                      </div>

                      <Select
                        value={mapping?.csvColumn || ""}
                        onValueChange={(value) => updateMapping(field.key, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma coluna" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Não mapear</SelectItem>
                          {csvColumns.map((column) => (
                            <SelectItem key={column.name} value={column.name}>
                              {column.name} ({column.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="text-sm text-muted-foreground">
                        {mapping?.csvColumn && (
                          <span>Exemplo: {csvColumns.find((c) => c.name === mapping.csvColumn)?.sample}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Preview dos Dados */}
      {csvData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle>Preview dos Dados</CardTitle>
              <CardDescription>Primeiros {Math.min(csvData.length, 5)} registros do arquivo</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {csvColumns.map((column) => (
                      <TableHead key={column.name}>{column.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.slice(0, 5).map((row, index) => (
                    <TableRow key={index}>
                      {csvColumns.map((column) => (
                        <TableCell key={column.name}>{row[column.name]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Botão de Importação */}
      {csvData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Pronto para importar</h3>
                  <p className="text-sm text-muted-foreground">{csvData.length} registros serão processados</p>
                </div>

                <Button onClick={handleImport} disabled={isProcessing} className="bg-indigo-600 hover:bg-indigo-700">
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Iniciar Importação
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Resultados da Importação */}
      {importResults && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                Resultados da Importação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4 mb-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{importResults.total}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">{importResults.success}</div>
                  <div className="text-sm text-emerald-600">Sucesso</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{importResults.errors}</div>
                  <div className="text-sm text-red-600">Erros</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">{importResults.warnings}</div>
                  <div className="text-sm text-amber-600">Avisos</div>
                </div>
              </div>

              {importResults.errorDetails.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Detalhes dos Erros
                  </h4>
                  {importResults.errorDetails.map((error: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded text-sm">
                      <Badge variant="destructive">Linha {error.row}</Badge>
                      <span>{error.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
