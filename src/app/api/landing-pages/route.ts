import { NextRequest, NextResponse } from "next/server";

const mockLandingPages = [
  { id: "lp-1", title: "CRMソリューション紹介", slug: "crm-solution", status: "PUBLISHED" as const, views: 12500, conversions: 430, cvr: 3.4, createdAt: "2025-11-01" },
  { id: "lp-2", title: "無料トライアルLP", slug: "free-trial", status: "PUBLISHED" as const, views: 8900, conversions: 523, cvr: 5.9, createdAt: "2025-12-15" },
  { id: "lp-3", title: "DXセミナー申込ページ", slug: "dx-seminar", status: "PUBLISHED" as const, views: 3400, conversions: 87, cvr: 2.6, createdAt: "2026-02-10" },
  { id: "lp-4", title: "導入事例集ダウンロード", slug: "case-studies", status: "PUBLISHED" as const, views: 6200, conversions: 312, cvr: 5.0, createdAt: "2026-01-20" },
  { id: "lp-5", title: "新製品ティザーページ", slug: "new-product-teaser", status: "DRAFT" as const, views: 0, conversions: 0, cvr: 0, createdAt: "2026-03-10" },
  { id: "lp-6", title: "年度末特別キャンペーン", slug: "year-end-campaign", status: "PUBLISHED" as const, views: 4800, conversions: 215, cvr: 4.5, createdAt: "2026-02-25" },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let filtered = [...mockLandingPages];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const results = filtered.slice(offset, offset + limit);

    return NextResponse.json({ results, total });
  } catch (error) {
    console.error("Error fetching landing pages:", error);
    return NextResponse.json(
      { error: "ランディングページの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "タイトルとスラッグは必須です" },
        { status: 400 }
      );
    }

    const newItem = {
      id: `lp-${Date.now()}`,
      title,
      slug,
      status: "DRAFT" as const,
      views: 0,
      conversions: 0,
      cvr: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    mockLandingPages.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating landing page:", error);
    return NextResponse.json(
      { error: "ランディングページの作成に失敗しました" },
      { status: 500 }
    );
  }
}
