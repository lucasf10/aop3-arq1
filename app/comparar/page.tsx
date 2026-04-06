"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingDown, Calculator, Trophy } from "lucide-react";
import {
  useBairros,
  useCombustiveis,
  useMediaAmostras,
  useMinMaxPrecos,
  usePrecosRecentes,
} from "@/hooks/use-database";

export default function CompararPage() {
  const { minmax: menorMaiorPreco, isLoading: loadingMinmax } =
    useMinMaxPrecos();
  const { media: mediaQuantidade, isLoading: loadingMedia } =
    useMediaAmostras();
  const { recentes: precoMaisRecente, isLoading: loadingRecentes } =
    usePrecosRecentes();
  const { bairros, isLoading: loadingBairros } = useBairros();
  const { combustiveis, isLoading: loadingCombustiveis } = useCombustiveis();

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const cheapestByFuel = (combustiveis ?? []).map((tipo) => {
    const filteredPrices = (precoMaisRecente ?? []).filter(
      (p) => p.combustivel === tipo.nome,
    );
    const sorted = [...filteredPrices].sort(
      (a, b) => Number(a.preco) - Number(b.preco),
    );
    return {
      combustivel: tipo.nome,
      posto: sorted[0]?.posto || "-",
      bairro: sorted[0]?.bairro || "-",
      preco: Number(sorted[0]?.preco || 0),
    };
  });

  const mediaColumns = [
    { key: "posto" as const, label: "Posto", sortable: true },
    {
      key: "bairro" as const,
      label: "Bairro",
      sortable: true,
      filterable: true,
      filterOptions: (bairros ?? []).map((b) => b.nome),
    },
    {
      key: "combustivel" as const,
      label: "Combustivel",
      sortable: true,
      filterable: true,
      filterOptions: (combustiveis ?? []).map((t) => t.nome),
    },
    {
      key: "quantidade" as const,
      label: "Amostras",
      sortable: true,
      className: "text-center",
    },
    {
      key: "media" as const,
      label: "Preço Medio",
      sortable: true,
      className: "text-right",
      render: (value: unknown) => (
        <span className="font-semibold">{formatCurrency(Number(value))}</span>
      ),
    },
  ];

  const recentColumns = [
    { key: "combustivel" as const, label: "Combustivel", sortable: true },
    { key: "posto" as const, label: "Melhor Posto", sortable: true },
    { key: "bairro" as const, label: "Bairro", sortable: true },
    {
      key: "preco" as const,
      label: "Menor Preço",
      sortable: true,
      className: "text-right",
      render: (value: unknown) => (
        <span className="font-semibold text-primary">
          {formatCurrency(Number(value))}
        </span>
      ),
    },
  ];

  const minmaxColumns = [
    { key: "combustivel" as const, label: "Combustivel", sortable: true },
    {
      key: "menor_preco" as const,
      label: "Menor Preço",
      sortable: true,
      className: "text-right",
      render: (value: unknown) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(Number(value))}
        </span>
      ),
    },
    {
      key: "maior_preco" as const,
      label: "Maior Preço",
      sortable: true,
      className: "text-right",
      render: (value: unknown) => (
        <span className="font-semibold text-red-600">
          {formatCurrency(Number(value))}
        </span>
      ),
    },
  ];

  const isLoading =
    loadingMinmax ||
    loadingMedia ||
    loadingRecentes ||
    loadingBairros ||
    loadingCombustiveis;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Comparar Postos
          </h1>
          <p className="text-muted-foreground">
            Compare preços, medias e descubra os melhores postos para abastecer
          </p>
        </div>
        <Tabs defaultValue="melhores" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="melhores">Melhores Preços</TabsTrigger>
            <TabsTrigger value="medias">Medias</TabsTrigger>
            <TabsTrigger value="faixa">Faixa de Preços</TabsTrigger>
          </TabsList>
          <TabsContent value="melhores">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Melhor posto por combustivel
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-muted-foreground">
                    Carregando dados do banco...
                  </p>
                ) : (
                  <DataTable
                    data={cheapestByFuel}
                    columns={recentColumns}
                    searchPlaceholder="Buscar combustivel..."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="medias">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Media e quantidade de amostras
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-muted-foreground">
                    Carregando dados do banco...
                  </p>
                ) : (
                  <DataTable
                    data={mediaQuantidade ?? []}
                    columns={mediaColumns}
                    searchPlaceholder="Buscar por posto ou combustivel..."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="faixa">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-primary" />
                  Menor e maior preço por combustivel
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-muted-foreground">
                    Carregando dados do banco...
                  </p>
                ) : (
                  <DataTable
                    data={menorMaiorPreco ?? []}
                    columns={minmaxColumns}
                    searchPlaceholder="Buscar combustivel..."
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
