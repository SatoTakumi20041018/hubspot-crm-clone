import { NextRequest, NextResponse } from "next/server";

const mockSubscriptions: Array<{
  id: string;
  customer: string;
  plan: string;
  mrr: number;
  startDate: string;
  nextBilling: string | null;
  status: string;
}> = [
  { id: "sub-1", customer: "株式会社ABCソリューションズ", plan: "Enterprise", mrr: 98000, startDate: "2025-04-01", nextBilling: "2026-04-01", status: "ACTIVE" },
  { id: "sub-2", customer: "デジタルマーケティング株式会社", plan: "Professional", mrr: 29800, startDate: "2025-07-15", nextBilling: "2026-04-15", status: "ACTIVE" },
  { id: "sub-3", customer: "東京テクノロジー株式会社", plan: "Enterprise", mrr: 98000, startDate: "2025-10-01", nextBilling: "2026-04-01", status: "ACTIVE" },
  { id: "sub-4", customer: "グローバルトレード株式会社", plan: "Professional", mrr: 29800, startDate: "2025-06-01", nextBilling: "2026-04-01", status: "ACTIVE" },
  { id: "sub-5", customer: "株式会社スタートアップハブ", plan: "Starter", mrr: 9800, startDate: "2026-01-10", nextBilling: "2026-04-10", status: "ACTIVE" },
  { id: "sub-6", customer: "サンライズ商事株式会社", plan: "Professional", mrr: 29800, startDate: "2025-09-01", nextBilling: "2026-03-01", status: "CANCELLED" },
  { id: "sub-7", customer: "合同会社テックブリッジ", plan: "Starter", mrr: 9800, startDate: "2026-02-01", nextBilling: "2026-05-01", status: "TRIAL" },
  { id: "sub-8", customer: "株式会社イノベーションラボ", plan: "Enterprise", mrr: 98000, startDate: "2025-03-01", nextBilling: "2026-03-31", status: "PAST_DUE" },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let filtered = [...mockSubscriptions];

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
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "サブスクリプションの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, plan, mrr } = body;

    if (!customer || !plan) {
      return NextResponse.json(
        { error: "顧客名とプランは必須です" },
        { status: 400 }
      );
    }

    const newItem = {
      id: `sub-${Date.now()}`,
      customer,
      plan,
      mrr: mrr || 0,
      startDate: new Date().toISOString().split("T")[0],
      nextBilling: null,
      status: "TRIAL" as const,
    };

    mockSubscriptions.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "サブスクリプションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
