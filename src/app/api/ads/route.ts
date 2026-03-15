import { NextRequest, NextResponse } from "next/server";

const mockAdCampaigns = [
  { id: "ad-1", name: "CRM無料トライアル獲得キャンペーン", platform: "Google Ads" as const, budget: 500000, spent: 423000, clicks: 8450, conversions: 312, roi: 2.8 },
  { id: "ad-2", name: "リターゲティング：サイト訪問者", platform: "Google Ads" as const, budget: 200000, spent: 187000, clicks: 3200, conversions: 89, roi: 1.9 },
  { id: "ad-3", name: "BtoBリード獲得（LinkedIn）", platform: "LinkedIn Ads" as const, budget: 300000, spent: 265000, clicks: 1890, conversions: 145, roi: 3.2 },
  { id: "ad-4", name: "ブランド認知拡大キャンペーン", platform: "Facebook Ads" as const, budget: 150000, spent: 148000, clicks: 12500, conversions: 67, roi: 0.8 },
  { id: "ad-5", name: "セミナー集客広告", platform: "Facebook Ads" as const, budget: 80000, spent: 52000, clicks: 2100, conversions: 87, roi: 4.1 },
  { id: "ad-6", name: "競合キーワードSEM", platform: "Google Ads" as const, budget: 400000, spent: 378000, clicks: 5600, conversions: 198, roi: 2.4 },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let filtered = [...mockAdCampaigns];

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
    console.error("Error fetching ad campaigns:", error);
    return NextResponse.json(
      { error: "広告キャンペーンの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, platform, budget } = body;

    if (!name || !platform) {
      return NextResponse.json(
        { error: "キャンペーン名とプラットフォームは必須です" },
        { status: 400 }
      );
    }

    const newItem = {
      id: `ad-${Date.now()}`,
      name,
      platform,
      budget: budget || 0,
      spent: 0,
      clicks: 0,
      conversions: 0,
      roi: 0,
    };

    mockAdCampaigns.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating ad campaign:", error);
    return NextResponse.json(
      { error: "広告キャンペーンの作成に失敗しました" },
      { status: 500 }
    );
  }
}
