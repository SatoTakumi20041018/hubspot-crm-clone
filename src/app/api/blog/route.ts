import { NextRequest, NextResponse } from "next/server";

const mockBlogPosts = [
  { id: "blog-1", title: "CRM導入で売上30%アップ！成功事例5選", author: "田中マーケ", status: "PUBLISHED" as const, date: "2026-03-10", views: 4520, seoScore: 92 },
  { id: "blog-2", title: "2026年のマーケティングトレンド予測", author: "鈴木花子", status: "PUBLISHED" as const, date: "2026-03-05", views: 8900, seoScore: 88 },
  { id: "blog-3", title: "営業DX完全ガイド：ステップバイステップ", author: "佐藤健一", status: "PUBLISHED" as const, date: "2026-02-28", views: 6200, seoScore: 95 },
  { id: "blog-4", title: "リードナーチャリングの基本と実践テクニック", author: "田中マーケ", status: "PUBLISHED" as const, date: "2026-02-20", views: 3800, seoScore: 85 },
  { id: "blog-5", title: "カスタマーサクセスとは？KPIと改善方法", author: "高橋美咲", status: "PUBLISHED" as const, date: "2026-02-15", views: 5100, seoScore: 91 },
  { id: "blog-6", title: "メールマーケティングで開封率を2倍にする方法", author: "鈴木花子", status: "DRAFT" as const, date: null, views: 0, seoScore: 78 },
  { id: "blog-7", title: "SaaSビジネスのチャーン率を下げる7つの施策", author: "渡辺直人", status: "PUBLISHED" as const, date: "2026-01-25", views: 7300, seoScore: 93 },
  { id: "blog-8", title: "ABMアカウントベースドマーケティング入門", author: "佐藤健一", status: "REVIEW" as const, date: null, views: 0, seoScore: 82 },
  { id: "blog-9", title: "データドリブン営業の実現に向けて", author: "伊藤由美", status: "PUBLISHED" as const, date: "2026-01-10", views: 2900, seoScore: 87 },
  { id: "blog-10", title: "HubSpot vs Salesforce：徹底比較2026", author: "田中マーケ", status: "DRAFT" as const, date: null, views: 0, seoScore: 74 },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let filtered = [...mockBlogPosts];

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
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "ブログ記事の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, author } = body;

    if (!title || !author) {
      return NextResponse.json(
        { error: "タイトルと著者は必須です" },
        { status: 400 }
      );
    }

    const newItem = {
      id: `blog-${Date.now()}`,
      title,
      author,
      status: "DRAFT" as const,
      date: null,
      views: 0,
      seoScore: 0,
    };

    mockBlogPosts.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "ブログ記事の作成に失敗しました" },
      { status: 500 }
    );
  }
}
