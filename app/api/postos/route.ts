import { NextResponse } from "next/server";
import { getPostos } from "@/lib/queries";

export async function GET() {
  return NextResponse.json(await getPostos());
}
