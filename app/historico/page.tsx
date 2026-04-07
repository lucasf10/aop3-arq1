"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, TrendingUp, TrendingDown, Search } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  useBairros,
  useColetas,
  useCombustiveis,
  usePostos,
} from "@/hooks/use-database";
import { DataTable } from "@/components/data-table";

const COLORS = ["#22c55e", "#f97316", "#3b82f6", "#a855f7"];
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function HistoricoPage() {
  const [postoId, setPostoId] = useState<string>("all");
  const [combustivelId, setCombustivelId] = useState<string>("1");
  const [chartType, setChartType] = useState<string>("line");
  const { postos } = usePostos();
  const { combustiveis } = useCombustiveis();
  const { bairros } = useBairros();
  const { coletas, isLoading: loadingColetas } = useColetas();
  const { data, isLoading } = useSWR(
    `/api/historico?postoId=${postoId}&combustivelId=${combustivelId}&includeAll=true`,
    fetcher,
  );

  const history = data?.history ?? [];
  const allFuelsComparison = data?.allFuelsComparison ?? [];
  const combustivelNome =
    combustiveis?.find((t) => t.id === Number(combustivelId))?.nome || "";
  const postoNome =
    postoId === "all"
      ? "Todos os Postos (Media)"
      : postos?.find((p) => p.id === Number(postoId))?.nome || "";

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}`;
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr.replace(" ", "T"));
    return date.toLocaleString("pt-BR");
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const stats = useMemo(() => {
    if (!history.length)
      return { minPrice: 0, maxPrice: 0, avgPrice: 0, variation: 0, trend: 0 };
    const prices = history.map((d: any) => Number(d.preco));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice =
      prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
    const variation = maxPrice - minPrice;
    const trend = prices[prices.length - 1] - prices[0];
    return { minPrice, maxPrice, avgPrice, variation, trend };
  }, [history]);

  const coletaColumns = [
    {
      key: "combustivel" as const,
      label: "Combustivel",
      sortable: true,
      filterable: true,
      filterOptions: (combustiveis ?? []).map((c) => c.nome),
    },
    {
      key: "posto" as const,
      label: "Posto",
      sortable: true,
      filterable: true,
      filterOptions: (postos ?? []).map((p) => p.nome),
    },
    {
      key: "bairro" as const,
      label: "Bairro",
      sortable: true,
      filterable: true,
      filterOptions: (bairros ?? []).map((b) => b.nome),
    },
    {
      key: "data_coleta" as const,
      label: "Data/Hora da Coleta",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-muted-foreground">
          {formatDateTime(String(value))}
        </span>
      ),
    },
    {
      key: "preco" as const,
      label: "Valor",
      sortable: true,
      className: "text-right",
      render: (value: unknown) => (
        <span className="font-semibold text-primary">
          {formatCurrency(Number(value))}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Historico de Preços
          </h1>
          <p className="text-muted-foreground">
            Acompanhe a evolucao dos preços ao longo do tempo
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="w-5 h-5 text-primary" />
              Filtros do grafico
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm mb-2">Posto</p>
              <Select value={postoId} onValueChange={setPostoId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os postos</SelectItem>
                  {(postos ?? []).map((posto) => (
                    <SelectItem key={posto.id} value={String(posto.id)}>
                      {posto.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm mb-2">Combustivel</p>
              <Select value={combustivelId} onValueChange={setCombustivelId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(combustiveis ?? []).map((tipo) => (
                    <SelectItem key={tipo.id} value={String(tipo.id)}>
                      {tipo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm mb-2">Tipo de grafico</p>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Linha</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Menor preço</p>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.minPrice)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Maior preço</p>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.maxPrice)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Preço medio</p>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.avgPrice)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Variacao</p>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.variation)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Tendencia</p>
              <p
                className={`text-2xl font-bold flex items-center gap-2 ${stats.trend >= 0 ? "text-red-600" : "text-green-600"}`}
              >
                {stats.trend >= 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                {formatCurrency(Math.abs(stats.trend))}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {combustivelNome} - {postoNome}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">
                Carregando dados do banco...
              </p>
            ) : (
              <div className="h-[420px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "line" ? (
                    <LineChart
                      data={history}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                      />
                      <XAxis
                        dataKey="data"
                        tickFormatter={formatDate}
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                      />
                      <YAxis
                        domain={["dataMin - 0.1", "dataMax + 0.1"]}
                        tickFormatter={(value) =>
                          `R$ ${Number(value).toFixed(2)}`
                        }
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        width={70}
                      />
                      <Tooltip
                        labelFormatter={formatDate}
                        formatter={(value: number) => [
                          formatCurrency(Number(value)),
                          combustivelNome,
                        ]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="preco"
                        name={`${combustivelNome} - ${postoNome}`}
                        stroke={COLORS[Math.max(0, Number(combustivelId) - 1)]}
                        strokeWidth={2}
                      />
                    </LineChart>
                  ) : (
                    <AreaChart
                      data={history}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                      />
                      <XAxis
                        dataKey="data"
                        tickFormatter={formatDate}
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                      />
                      <YAxis
                        domain={["dataMin - 0.1", "dataMax + 0.1"]}
                        tickFormatter={(value) =>
                          `R$ ${Number(value).toFixed(2)}`
                        }
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        width={70}
                      />
                      <Tooltip
                        labelFormatter={formatDate}
                        formatter={(value: number) => [
                          formatCurrency(Number(value)),
                          combustivelNome,
                        ]}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="preco"
                        name={`${combustivelNome} - ${postoNome}`}
                        stroke={COLORS[Math.max(0, Number(combustivelId) - 1)]}
                        fill={COLORS[Math.max(0, Number(combustivelId) - 1)]}
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Comparativo de todos os combustiveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">
                Carregando dados do banco...
              </p>
            ) : (
              <div className="h-[420px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={allFuelsComparison}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis dataKey="data" tickFormatter={formatDate} />
                    <YAxis
                      tickFormatter={(value) =>
                        `R$ ${Number(value).toFixed(2)}`
                      }
                      width={70}
                    />
                    <Tooltip
                      labelFormatter={formatDate}
                      formatter={(value: number) =>
                        formatCurrency(Number(value))
                      }
                    />
                    <Legend />
                    {(combustiveis ?? []).map((tipo, index) => (
                      <Line
                        key={tipo.id}
                        type="monotone"
                        dataKey={tipo.nome}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={2}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="w-5 h-5 text-primary" />
              Historico de Coletas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingColetas ? (
              <p className="text-muted-foreground">
                Carregando dados do banco...
              </p>
            ) : (
              <DataTable
                data={coletas ?? []}
                columns={coletaColumns}
                searchPlaceholder="Buscar por posto, bairro ou combustivel..."
                hasPagination
                pageSize={10}
              />
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
