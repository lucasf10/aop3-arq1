import { NextResponse } from "next/server";
import { getCombustiveis } from "@/lib/queries";

export async function GET() {
  return NextResponse.json(await getCombustiveis());
}
