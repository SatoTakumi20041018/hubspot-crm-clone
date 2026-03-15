import { NextRequest, NextResponse } from "next/server";

const mockForms = [
  { id: "form-1", name: "お問い合わせフォーム", type: "embedded" as const, submissions: 342, views: 4520, cvr: 7.6, fields: ["名前", "メール", "電話番号", "お問い合わせ内容"], createdAt: "2025-12-01" },
  { id: "form-2", name: "資料請求フォーム", type: "popup" as const, submissions: 189, views: 2830, cvr: 6.7, fields: ["氏名", "会社名", "メール", "役職"], createdAt: "2026-01-10" },
  { id: "form-3", name: "無料トライアル申込", type: "embedded" as const, submissions: 523, views: 8900, cvr: 5.9, fields: ["名前", "メール", "会社名", "従業員数"], createdAt: "2025-11-15" },
  { id: "form-4", name: "ニュースレター登録", type: "banner" as const, submissions: 1205, views: 15600, cvr: 7.7, fields: ["メールアドレス"], createdAt: "2025-10-01" },
  { id: "form-5", name: "セミナー参加申込", type: "embedded" as const, submissions: 87, views: 1340, cvr: 6.5, fields: ["氏名", "メール", "会社名", "参加日程"], createdAt: "2026-02-20" },
  { id: "form-6", name: "採用エントリー", type: "embedded" as const, submissions: 64, views: 920, cvr: 7.0, fields: ["氏名", "メール", "電話番号", "志望動機", "履歴書"], createdAt: "2026-01-25" },
  { id: "form-7", name: "サイト離脱防止ポップアップ", type: "popup" as const, submissions: 456, views: 12000, cvr: 3.8, fields: ["メールアドレス"], createdAt: "2025-09-15" },
  { id: "form-8", name: "顧客満足度アンケート", type: "embedded" as const, submissions: 298, views: 1650, cvr: 18.1, fields: ["満足度", "改善点", "NPS", "メール"], createdAt: "2026-03-01" },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let filtered = [...mockForms];

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
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { error: "フォームの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, type, fields } = body;

    if (!name) {
      return NextResponse.json(
        { error: "フォーム名は必須です" },
        { status: 400 }
      );
    }

    const newItem = {
      id: `form-${Date.now()}`,
      name,
      type: type || "embedded",
      submissions: 0,
      views: 0,
      cvr: 0,
      fields: fields || [],
      createdAt: new Date().toISOString().split("T")[0],
    };

    mockForms.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json(
      { error: "フォームの作成に失敗しました" },
      { status: 500 }
    );
  }
}
