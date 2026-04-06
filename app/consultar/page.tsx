"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import {
  useBairros,
  useCombustiveis,
  usePrecosRecentes,
} from "@/hooks/use-database";

export default function ConsultarPage() {
  const { recentes: precoMaisRecente, isLoading: loadingPrecos } =
    usePrecosRecentes();
  const { bairros, isLoading: loadingBairros } = useBairros();
  const { combustiveis, isLoading: loadingCombustiveis } = useCombustiveis();

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const columns = [
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
      key: "preco" as const,
      label: "Preço",
      sortable: true,
      className: "text-right",
      render: (value: unknown) => (
        <span className="font-semibold text-primary">
          {formatCurrency(Number(value))}
        </span>
      ),
    },
    {
      key: "data" as const,
      label: "Ultima Atualizacao",
      sortable: true,
      className: "text-right",
      render: (value: unknown) => (
        <span className="text-muted-foreground">
          {formatDate(String(value))}
        </span>
      ),
    },
  ];

  const isLoading = loadingPrecos || loadingBairros || loadingCombustiveis;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Consultar Preços
          </h1>
          <p className="text-muted-foreground">
            Consulte os preços mais recentes de combustiveis por posto e bairro
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Tabela de Preços Atuais
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">
                Carregando dados do banco...
              </p>
            ) : (
              <DataTable
                data={precoMaisRecente ?? []}
                columns={columns}
                searchPlaceholder="Buscar por posto ou combustivel..."
              />
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
