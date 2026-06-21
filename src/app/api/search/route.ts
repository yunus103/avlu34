import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { globalSearchQuery } from "@/sanity/lib/queries";
import { getValidLocale } from "@/lib/i18n/config";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryTerm = searchParams.get("q") || "";
    const localeParam = searchParams.get("locale") || "tr";
    const locale = getValidLocale(localeParam);

    if (!queryTerm.trim()) {
      return NextResponse.json({
        stores: [],
        dining: [],
        campaigns: [],
        events: [],
        storeCategories: [],
        foodCategories: [],
        pages: {}
      });
    }

    // Format query term for GROQ match operator
    const searchQuery = `*${queryTerm}*`;

    const results = await client.fetch(
      globalSearchQuery,
      { searchQuery, locale },
      { next: { revalidate: 60 } }
    );

    return NextResponse.json(results);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Global search API error:", error.message);
    return NextResponse.json(
      { message: "Error searching", error: error.message },
      { status: 500 }
    );
  }
}
