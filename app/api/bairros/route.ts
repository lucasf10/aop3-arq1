import { NextResponse } from "next/server";
import { getBairros } from "@/lib/queries";

export async function GET() {
  return NextResponse.json(await getBairros());
}
