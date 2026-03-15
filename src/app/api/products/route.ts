import { NextRequest, NextResponse } from "next/server";

const mockProducts = [
  { id: "prod-1", name: "CRM Starter プラン", sku: "CRM-STR-001", price: 9800, description: "小規模チーム向けの基本CRMパッケージ", status: "ACTIVE" as const, createdAt: "2025-06-01" },
  { id: "prod-2", name: "CRM Professional プラン", sku: "CRM-PRO-001", price: 29800, description: "中規模企業向けの高機能CRMパッケージ", status: "ACTIVE" as const, createdAt: "2025-06-01" },
  { id: "prod-3", name: "CRM Enterprise プラン", sku: "CRM-ENT-001", price: 98000, description: "大企業向けのフルカスタマイズCRM", status: "ACTIVE" as const, createdAt: "2025-06-01" },
  { id: "prod-4", name: "マーケティングハブ", sku: "MKT-HUB-001", price: 45000, description: "メールマーケティング・LP・フォーム一体型ツール", status: "ACTIVE" as const, createdAt: "2025-08-15" },
  { id: "prod-5", name: "セールスハブ", sku: "SLS-HUB-001", price: 35000, description: "営業支援ツール（パイプライン・見積・予測）", status: "ACTIVE" as const, createdAt: "2025-08-15" },
  { id: "prod-6", name: "サービスハブ", sku: "SVC-HUB-001", price: 25000, description: "カスタマーサポート・チケット管理ツール", status: "ACTIVE" as const, createdAt: "2025-09-01" },
  { id: "prod-7", name: "API連携アドオン", sku: "API-ADD-001", price: 15000, description: "外部サービスとのAPI連携機能拡張", status: "ACTIVE" as const, createdAt: "2025-10-01" },
  { id: "prod-8", name: "データ移行サービス", sku: "DMS-SVC-001", price: 200000, description: "既存システムからのデータ移行支援（一括）", status: "ACTIVE" as const, createdAt: "2025-07-01" },
  { id: "prod-9", name: "カスタムレポートパック", sku: "RPT-CUS-001", price: 12000, description: "カスタムダッシュボード・レポート作成機能", status: "INACTIVE" as const, createdAt: "2025-11-01" },
  { id: "prod-10", name: "トレーニングプログラム", sku: "TRN-PRG-001", price: 150000, description: "チーム向けオンボーディング研修（3日間）", status: "ACTIVE" as const, createdAt: "2025-12-01" },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let filtered = [...mockProducts];

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
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "製品の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, sku, price, description } = body;

    if (!name || !sku) {
      return NextResponse.json(
        { error: "製品名とSKUは必須です" },
        { status: 400 }
      );
    }

    const newItem = {
      id: `prod-${Date.now()}`,
      name,
      sku,
      price: price || 0,
      description: description || "",
      status: "ACTIVE" as const,
      createdAt: new Date().toISOString().split("T")[0],
    };

    mockProducts.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "製品の作成に失敗しました" },
      { status: 500 }
    );
  }
}
