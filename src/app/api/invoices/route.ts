import { NextRequest, NextResponse } from "next/server";

const mockInvoices = [
  { id: "inv-1", number: "INV-2026-001", customer: "株式会社ABCソリューションズ", amount: 3500000, status: "PAID" as const, dueDate: "2026-02-28" },
  { id: "inv-2", number: "INV-2026-002", customer: "デジタルマーケティング株式会社", amount: 1200000, status: "PAID" as const, dueDate: "2026-03-10" },
  { id: "inv-3", number: "INV-2026-003", customer: "東京テクノロジー株式会社", amount: 8500000, status: "SENT" as const, dueDate: "2026-03-31" },
  { id: "inv-4", number: "INV-2026-004", customer: "グローバルトレード株式会社", amount: 960000, status: "PAID" as const, dueDate: "2026-03-15" },
  { id: "inv-5", number: "INV-2026-005", customer: "サンライズ商事株式会社", amount: 4200000, status: "OVERDUE" as const, dueDate: "2026-02-15" },
  { id: "inv-6", number: "INV-2026-006", customer: "株式会社イノベーションラボ", amount: 6800000, status: "SENT" as const, dueDate: "2026-04-15" },
  { id: "inv-7", number: "INV-2026-007", customer: "ミライ教育株式会社", amount: 450000, status: "DRAFT" as const, dueDate: null },
  { id: "inv-8", number: "INV-2026-008", customer: "株式会社クラウドネクスト", amount: 2800000, status: "SENT" as const, dueDate: "2026-04-01" },
  { id: "inv-9", number: "INV-2026-009", customer: "日本ロジスティクス株式会社", amount: 1560000, status: "PAID" as const, dueDate: "2026-03-05" },
  { id: "inv-10", number: "INV-2026-010", customer: "株式会社ヘルスケアプラス", amount: 3200000, status: "OVERDUE" as const, dueDate: "2026-02-20" },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let filtered = [...mockInvoices];

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
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "請求書の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, amount } = body;

    if (!customer) {
      return NextResponse.json(
        { error: "顧客名は必須です" },
        { status: 400 }
      );
    }

    const newItem = {
      id: `inv-${Date.now()}`,
      number: `INV-2026-${String(mockInvoices.length + 1).padStart(3, "0")}`,
      customer,
      amount: amount || 0,
      status: "DRAFT" as const,
      dueDate: null,
    };

    mockInvoices.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "請求書の作成に失敗しました" },
      { status: 500 }
    );
  }
}
