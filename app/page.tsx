import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  TrendingDown,
  BarChart3,
  Clock,
  MapPin,
  Fuel,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { getEstatisticas, getMenorMaiorPreco } from "@/lib/queries";

export default async function HomePage() {
  const [menorMaiorPreco, stats] = await Promise.all([
    getMenorMaiorPreco(),
    getEstatisticas(),
  ]);
  const totalColetas = stats.totalAmostras;

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const features = [
    {
      icon: Search,
      title: "Consultar Preços",
      description:
        "Busque preços por posto, bairro ou tipo de combustivel com filtros avancados.",
      href: "/consultar",
    },
    {
      icon: TrendingDown,
      title: "Comparar Postos",
      description:
        "Compare preços entre diferentes postos e encontre o melhor custo-beneficio.",
      href: "/comparar",
    },
    {
      icon: BarChart3,
      title: "Historico",
      description:
        "Visualize a evolucao dos preços ao longo do tempo com graficos interativos.",
      href: "/historico",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <MapPin className="w-4 h-4" />
                Vila Velha - ES
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                Encontre os Melhores Preços de Combustivel
              </h1>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                Compare preços de gasolina, etanol e diesel nos postos de Praia
                de Itaparica e Praia da Costa. Economize no abastecimento com
                informacoes atualizadas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/consultar">
                    <Search className="w-4 h-4" />
                    Consultar Preços
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <Link href="/comparar">
                    Comparar Agora
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 border-y border-border bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <Fuel className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalPostos}</p>
                      <p className="text-sm text-muted-foreground">
                        Postos Monitorados
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalBairros}</p>
                      <p className="text-sm text-muted-foreground">
                        Bairros Cobertos
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalColetas}</p>
                      <p className="text-sm text-muted-foreground">
                        Coletas Realizadas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <TrendingDown className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {stats.totalCombustiveis}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tipos de Combustivel
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Ferramentas Disponiveis
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore todas as funcionalidades do sistema para encontrar as
                melhores opcoes de abastecimento.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.href}
                  className="group hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {feature.description}
                    </p>
                    <Button
                      asChild
                      variant="ghost"
                      className="p-0 h-auto font-medium group-hover:gap-2 transition-all"
                    >
                      <Link href={feature.href}>
                        Acessar
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/20 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Faixa de Preços por Combustivel
              </h2>
              <p className="text-muted-foreground">
                Acompanhe os menores e maiores preços encontrados em nossa base.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {menorMaiorPreco.map((item) => (
                <Card key={item.combustivel}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {item.combustivel}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Menor preço
                      </span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(Number(item.menor_preco))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Maior preço
                      </span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(Number(item.maior_preco))}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
