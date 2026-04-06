import { NextRequest, NextResponse } from "next/server";
import {
  getEstatisticas,
  getHistoricoPreco,
  getMediaQuantidade,
  getMenorMaiorPreco,
  getPrecosRecentes,
} from "@/lib/queries";

export async function GET(req: NextRequest) {
  const tipo = req.nextUrl.searchParams.get("tipo");
  if (tipo === "minmax") return NextResponse.json(await getMenorMaiorPreco());
  if (tipo === "media") return NextResponse.json(await getMediaQuantidade());
  if (tipo === "recentes") return NextResponse.json(await getPrecosRecentes());
  if (tipo === "historico") return NextResponse.json(await getHistoricoPreco());
  if (tipo === "estatisticas")
    return NextResponse.json(await getEstatisticas());

  return NextResponse.json({
    minmax: await getMenorMaiorPreco(),
    media: await getMediaQuantidade(),
    recentes: await getPrecosRecentes(),
    historico: await getHistoricoPreco(),
    estatisticas: await getEstatisticas(),
  });
}
