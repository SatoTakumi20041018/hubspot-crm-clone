import { NextRequest, NextResponse } from "next/server";

const mockPayments = [
  { id: "pay-1", date: "2026-03-14", amount: 3500000, customer: "株式会社ABCソリューションズ", method: "銀行振込" as const, status: "完了" as const },
  { id: "pay-2", date: "2026-03-13", amount: 1200000, customer: "デジタルマーケティング株式会社", method: "クレジットカード" as const, status: "完了" as const },
  { id: "pay-3", date: "2026-03-12", amount: 960000, customer: "グローバルトレード株式会社", method: "銀行振込" as const, status: "完了" as const },
  { id: "pay-4", date: "2026-03-11", amount: 1560000, customer: "日本ロジスティクス株式会社", method: "銀行振込" as const, status: "完了" as const },
  { id: "pay-5", date: "2026-03-10", amount: 450000, customer: "ミライ教育株式会社", method: "クレジットカード" as const, status: "処理中" as const },
  { id: "pay-6", date: "2026-03-09", amount: 2800000, customer: "株式会社クラウドネクスト", method: "銀行振込" as const, status: "完了" as const },
  { id: "pay-7", date: "2026-03-08", amount: 98000, customer: "株式会社スタートアップハブ", method: "クレジットカード" as const, status: "完了" as const },
  { id: "pay-8", date: "2026-03-07", amount: 29800, customer: "フリーランス 山田太郎", method: "クレジットカード" as const, status: "完了" as const },
  { id: "pay-9", date: "2026-03-06", amount: 6800000, customer: "株式会社イノベーションラボ", method: "銀行振込" as const, status: "失敗" as const },
  { id: "pay-10", date: "2026-03-05", amount: 45000, customer: "合同会社テックブリッジ", method: "クレジットカード" as const, status: "完了" as const },
  { id: "pay-11", date: "2026-03-04", amount: 200000, customer: "株式会社メディアフォース", method: "銀行振込" as const, status: "完了" as const },
  { id: "pay-12", date: "2026-03-03", amount: 35000, customer: "NPO法人デジタル推進協会", method: "クレジットカード" as const, status: "完了" as const },
  { id: "pay-13", date: "2026-03-02", amount: 4200000, customer: "サンライズ商事株式会社", method: "銀行振込" as const, status: "返金済み" as const },
  { id: "pay-14", date: "2026-03-01", amount: 150000, customer: "株式会社エデュケーションプラス", method: "銀行振込" as const, status: "完了" as const },
  { id: "pay-15", date: "2026-02-28", amount: 9800, customer: "個人事業主 佐藤美咲", method: "クレジットカード" as const, status: "完了" as const },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let filtered = [...mockPayments];

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
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "支払い情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, customer, method } = body;

    if (!customer || !amount) {
      return NextResponse.json(
        { error: "顧客名と金額は必須です" },
        { status: 400 }
      );
    }

    const newItem = {
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      amount,
      customer,
      method: method || "銀行振込",
      status: "処理中" as const,
    };

    mockPayments.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "支払い情報の作成に失敗しました" },
      { status: 500 }
    );
  }
}
