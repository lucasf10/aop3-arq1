import { Fuel, Github, MapPin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                <Fuel className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Preço Combustivel</h3>
                <p className="text-xs text-muted-foreground">
                  Compare e economize
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Sistema de consulta de preços de combustiveis para ajudar a
              encontrar os melhores preços na regiao de Vila Velha - ES.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Navegacao</h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Inicio
              </Link>
              <Link
                href="/consultar"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Consultar Preços
              </Link>
              <Link
                href="/comparar"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Comparar Postos
              </Link>
              <Link
                href="/historico"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Historico de Preços
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">
              Sobre o Projeto
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Vila Velha - ES, Brasil</span>
              </div>
              <div className="flex items-start gap-2">
                <Github className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Projeto Academico - UVV</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            Projeto de Arquitetura de Dados Relacionais I - Lucas Fabio Ferreira
            Silva
          </p>
          <p className="mt-1">Universidade Vila Velha (UVV) - 2026</p>
        </div>
      </div>
    </footer>
  );
}
