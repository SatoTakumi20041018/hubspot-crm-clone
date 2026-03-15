import { NextRequest, NextResponse } from "next/server";

const mockDocuments: Array<{
  id: string;
  name: string;
  type: string;
  views: number;
  lastViewed: string | null;
  sharedWith: string[];
  createdAt: string;
}> = [
  { id: "doc-1", name: "CRMソリューション提案書", type: "PPT", views: 45, lastViewed: "2026-03-14T09:30:00", sharedWith: ["田中太郎", "鈴木花子"], createdAt: "2026-02-15" },
  { id: "doc-2", name: "料金表 2026年度版", type: "PDF", views: 128, lastViewed: "2026-03-13T16:00:00", sharedWith: ["全営業チーム"], createdAt: "2026-01-10" },
  { id: "doc-3", name: "導入事例集（製造業向け）", type: "PDF", views: 67, lastViewed: "2026-03-12T11:00:00", sharedWith: ["佐藤健一", "渡辺直人"], createdAt: "2025-12-01" },
  { id: "doc-4", name: "サービス契約書テンプレート", type: "DOC", views: 34, lastViewed: "2026-03-10T14:30:00", sharedWith: ["法務部", "営業部"], createdAt: "2025-11-20" },
  { id: "doc-5", name: "競合比較資料", type: "PPT", views: 89, lastViewed: "2026-03-14T13:15:00", sharedWith: ["営業マネージャー"], createdAt: "2026-03-01" },
  { id: "doc-6", name: "ROI試算シミュレーション", type: "PDF", views: 23, lastViewed: "2026-03-08T10:00:00", sharedWith: ["高橋美咲"], createdAt: "2026-02-28" },
  { id: "doc-7", name: "年間サポートプラン説明資料", type: "PPT", views: 56, lastViewed: "2026-03-11T15:45:00", sharedWith: ["CSチーム", "伊藤由美"], createdAt: "2026-01-25" },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let filtered = [...mockDocuments];

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
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "ドキュメントの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, type } = body;

    if (!name) {
      return NextResponse.json(
        { error: "ドキュメント名は必須です" },
        { status: 400 }
      );
    }

    const newItem = {
      id: `doc-${Date.now()}`,
      name,
      type: type || "PDF",
      views: 0,
      lastViewed: null,
      sharedWith: [],
      createdAt: new Date().toISOString().split("T")[0],
    };

    mockDocuments.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "ドキュメントの作成に失敗しました" },
      { status: 500 }
    );
  }
}
