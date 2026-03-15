import { NextRequest, NextResponse } from "next/server";

const mockKnowledgeBase = [
  { id: "kb-1", title: "CRMの基本的な使い方ガイド", category: "はじめに", status: "PUBLISHED" as const, views: 4520, helpful: 89, createdAt: "2025-08-01" },
  { id: "kb-2", title: "コンタクト管理のベストプラクティス", category: "コンタクト", status: "PUBLISHED" as const, views: 3210, helpful: 76, createdAt: "2025-09-15" },
  { id: "kb-3", title: "パイプラインの設定方法", category: "セールス", status: "PUBLISHED" as const, views: 2890, helpful: 82, createdAt: "2025-10-01" },
  { id: "kb-4", title: "メールテンプレートの作成手順", category: "マーケティング", status: "PUBLISHED" as const, views: 1980, helpful: 71, createdAt: "2025-11-10" },
  { id: "kb-5", title: "ワークフロー自動化の設定", category: "自動化", status: "PUBLISHED" as const, views: 3650, helpful: 91, createdAt: "2025-12-01" },
  { id: "kb-6", title: "レポートダッシュボードのカスタマイズ", category: "レポート", status: "PUBLISHED" as const, views: 2340, helpful: 68, createdAt: "2026-01-05" },
  { id: "kb-7", title: "API連携ガイド（REST API）", category: "開発者", status: "PUBLISHED" as const, views: 5120, helpful: 94, createdAt: "2025-07-20" },
  { id: "kb-8", title: "チケット管理とSLA設定", category: "サポート", status: "DRAFT" as const, views: 0, helpful: 0, createdAt: "2026-03-10" },
  { id: "kb-9", title: "データインポート・エクスポート手順", category: "データ管理", status: "PUBLISHED" as const, views: 1560, helpful: 63, createdAt: "2026-02-01" },
  { id: "kb-10", title: "セキュリティとアクセス権限の設定", category: "管理者", status: "PUBLISHED" as const, views: 2780, helpful: 85, createdAt: "2025-11-25" },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let filtered = [...mockKnowledgeBase];

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
    console.error("Error fetching knowledge base articles:", error);
    return NextResponse.json(
      { error: "ナレッジベース記事の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category } = body;

    if (!title) {
      return NextResponse.json(
        { error: "タイトルは必須です" },
        { status: 400 }
      );
    }

    const newItem = {
      id: `kb-${Date.now()}`,
      title,
      category: category || "未分類",
      status: "DRAFT" as const,
      views: 0,
      helpful: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    mockKnowledgeBase.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating knowledge base article:", error);
    return NextResponse.json(
      { error: "ナレッジベース記事の作成に失敗しました" },
      { status: 500 }
    );
  }
}
