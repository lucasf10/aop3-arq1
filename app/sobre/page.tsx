import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Database,
  Users,
  Target,
  MapPin,
  Fuel,
  Calendar,
  GraduationCap,
  Building2,
} from "lucide-react";
import { getBairros, getEstatisticas, getPostos } from "@/lib/queries";

export default async function SobrePage() {
  const [statsDb, bairros, postos] = await Promise.all([
    getEstatisticas(),
    getBairros(),
    getPostos(),
  ]);
  const stats = [
    { label: "Postos Cadastrados", value: statsDb.totalPostos, icon: Fuel },
    {
      label: "Tipos de Combustivel",
      value: statsDb.totalCombustiveis,
      icon: Database,
    },
    { label: "Bairros Monitorados", value: statsDb.totalBairros, icon: MapPin },
    {
      label: "Coletas Realizadas",
      value: statsDb.totalAmostras,
      icon: Calendar,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Sobre o Projeto
          </h1>
          <p className="text-muted-foreground">
            Conheca mais sobre o sistema de consulta de preços de combustiveis
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Objetivo
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4">
              <p>
                Este sistema foi desenvolvido para auxiliar os moradores de Vila
                Velha - ES a encontrarem os melhores preços de combustiveis na
                regiao, promovendo transparencia e economia no abastecimento de
                veiculos.
              </p>
              <p>
                Atraves de coletas periodicas de preços nos postos da regiao,
                oferecemos informacoes atualizadas que permitem ao consumidor
                fazer escolhas mais conscientes e economicas.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Publico-Alvo
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4">
              <p>
                O sistema e destinado a todos os motoristas e consumidores que
                buscam economia no abastecimento de seus veiculos, especialmente
                os moradores dos bairros Praia de Itaparica e Praia da Costa.
              </p>
              <p>
                A plataforma oferece ferramentas de consulta, comparacao e
                historico que facilitam a tomada de decisao na hora de escolher
                onde abastecer.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Projeto Academico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Instituicao</p>
                    <p className="text-muted-foreground">
                      Universidade Vila Velha (UVV)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Disciplina</p>
                    <p className="text-muted-foreground">
                      Arquitetura de Dados Relacionais I
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Aluno</p>
                    <p className="text-muted-foreground">
                      Lucas Fabio Ferreira Silva
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Periodo</p>
                    <p className="text-muted-foreground">2026/1</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Area de Cobertura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {bairros.map((bairro) => {
                const postosBairro = postos.filter(
                  (p) => p.bairro === bairro.nome,
                );
                return (
                  <div
                    key={bairro.id}
                    className="p-4 rounded-lg bg-muted/50 border border-border"
                  >
                    <h4 className="font-semibold text-foreground mb-3">
                      {bairro.nome}
                    </h4>
                    <ul className="space-y-2">
                      {postosBairro.map((posto) => (
                        <li
                          key={posto.id}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <Fuel className="w-4 h-4 text-primary" />
                          {posto.nome}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
