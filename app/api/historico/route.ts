import { NextRequest, NextResponse } from "next/server";
import {
  getComparativoTodosCombustiveis,
  getHistoricoAgrupadoCombustivel,
  getHistoricoPreco,
} from "@/lib/queries";

export async function GET(req: NextRequest) {
  const postoId = req.nextUrl.searchParams.get("postoId");
  const combustivelId = req.nextUrl.searchParams.get("combustivelId");
  const includeAll = req.nextUrl.searchParams.get("includeAll") === "true";

  const history = combustivelId
    ? postoId && postoId !== "all"
      ? await getHistoricoPreco(Number(postoId), Number(combustivelId))
      : await getHistoricoAgrupadoCombustivel(Number(combustivelId))
    : [];

  const normalized = history.map((item: any) => ({
    data: item.data,
    preco: Number(item.preco),
  }));
  const allFuelsRaw = includeAll
    ? await getComparativoTodosCombustiveis(
        postoId && postoId !== "all" ? Number(postoId) : undefined,
      )
    : [];
  const byDate = new Map<string, Record<string, string | number>>();
  for (const row of allFuelsRaw as any[]) {
    const current = byDate.get(row.data) ?? { data: row.data };
    current[row.combustivel] = Number(row.preco);
    byDate.set(row.data, current);
  }

  return NextResponse.json({
    history: normalized,
    allFuelsComparison: Array.from(byDate.values()),
  });
}
