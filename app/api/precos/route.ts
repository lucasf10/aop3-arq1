import { NextResponse } from "next/server";
import { getHistoricoPreco } from "@/lib/queries";

export async function GET() {
  return NextResponse.json(await getHistoricoPreco());
}
