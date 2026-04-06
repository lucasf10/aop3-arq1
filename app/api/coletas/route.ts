import { NextResponse } from "next/server";
import { getColetas } from "@/lib/queries";

export async function GET() {
  const data = await getColetas();
  return NextResponse.json(data);
}
