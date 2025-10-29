import { NextResponse } from "next/server";
import { fetchEvidenceFromNews } from "@/lib/fetchEvidence";

export async function POST(req: Request) {
  try {
    const summaryData = await req.json();
    const evidence = await fetchEvidenceFromNews(summaryData);
    return NextResponse.json({ evidence });
  } catch (error: any) {
    console.error("Error in /api/fetch-evidence:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
