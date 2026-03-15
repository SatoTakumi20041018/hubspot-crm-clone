import { NextRequest, NextResponse } from "next/server";

const mockQuotes = [
  { id: "qt-1", number: "QT-2026-001", dealName: "ABCソリューションズ CRM導入", amount: 3500000, status: "SIGNED" as const, expiryDate: "2026-04-01", contact: "田中太郎" },
  { id: "qt-2", number: "QT-2026-002", dealName: "デジタルマーケティング支援パッケージ", amount: 1200000, status: "PENDING" as const, expiryDate: "2026-03-31", contact: "鈴木花子" },
  { id: "qt-3", number: "QT-2026-003", dealName: "クラウド移行プロジェクト", amount: 8500000, status: "DRAFT" as const, expiryDate: null, contact: "佐藤健一" },
  { id: "qt-4", number: "QT-2026-004", dealName: "年間サポート契約更新", amount: 960000, status: "SIGNED" as const, expiryDate: "2026-03-15", contact: "高橋美咲" },
  { id: "qt-5", number: "QT-2026-005", dealName: "ECサイト構築", amount: 4200000, status: "DECLINED" as const, expiryDate: "2026-02-28", contact: "渡辺直人" },
  { id: "qt-6", number: "QT-2026-006", dealName: "データ分析基盤構築", amount: 6800000, status: "PENDING" as const, expiryDate: "2026-04-15", contact: "伊藤由美" },
  { id: "qt-7", number: "QT-2026-007", dealName: "社内研修プログラム", amount: 450000, status: "SIGNED" as const, expiryDate: "2026-03-20", contact: "山本大輝" },
  { id: "qt-8", number: "QT-2026-008", dealName: "AIチャットボット導入", amount: 2800000, status: "DRAFT" as const, expiryDate: null, contact: "中村翔太" },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let filtered = [...mockQuotes];

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
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "見積書の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dealName, amount, contact } = body;

    if (!dealName || !contact) {
      return NextResponse.json(
        { error: "取引名と担当者は必須です" },
        { status: 400 }
      );
    }

    const newItem = {
      id: `qt-${Date.now()}`,
      number: `QT-2026-${String(mockQuotes.length + 1).padStart(3, "0")}`,
      dealName,
      amount: amount || 0,
      status: "DRAFT" as const,
      expiryDate: null,
      contact,
    };

    mockQuotes.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "見積書の作成に失敗しました" },
      { status: 500 }
    );
  }
}
