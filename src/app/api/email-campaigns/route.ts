import { NextRequest, NextResponse } from "next/server";

const mockEmailCampaigns = [
  { id: "ec-1", name: "新製品ローンチキャンペーン", subject: "【新発売】革新的なCRMソリューションのご案内", status: "SENT" as const, openRate: 42.5, clickRate: 12.3, sentCount: 5200, sentDate: "2026-03-01" },
  { id: "ec-2", name: "月次ニュースレター 3月号", subject: "3月のアップデート情報をお届けします", status: "SENT" as const, openRate: 38.1, clickRate: 8.7, sentCount: 12400, sentDate: "2026-03-05" },
  { id: "ec-3", name: "セミナー招待メール", subject: "【無料】DX推進セミナーへのご招待", status: "SCHEDULED" as const, openRate: 0, clickRate: 0, sentCount: 0, sentDate: "2026-03-20" },
  { id: "ec-4", name: "リードナーチャリング Step1", subject: "資料ダウンロードありがとうございます", status: "SENT" as const, openRate: 55.2, clickRate: 22.1, sentCount: 890, sentDate: "2026-02-15" },
  { id: "ec-5", name: "年度末キャンペーン", subject: "【期間限定】年度末特別プランのご案内", status: "DRAFT" as const, openRate: 0, clickRate: 0, sentCount: 0, sentDate: null },
  { id: "ec-6", name: "顧客満足度アンケート", subject: "ご利用状況についてお聞かせください", status: "SENT" as const, openRate: 31.8, clickRate: 15.4, sentCount: 3200, sentDate: "2026-02-28" },
  { id: "ec-7", name: "ウェルカムメール", subject: "ようこそ！ご登録ありがとうございます", status: "SENT" as const, openRate: 68.3, clickRate: 35.2, sentCount: 1560, sentDate: "2026-03-10" },
  { id: "ec-8", name: "製品アップデート通知", subject: "新機能リリースのお知らせ v3.2", status: "SCHEDULED" as const, openRate: 0, clickRate: 0, sentCount: 0, sentDate: "2026-03-25" },
  { id: "ec-9", name: "休眠顧客復帰キャンペーン", subject: "お久しぶりです！特別オファーをご用意しました", status: "DRAFT" as const, openRate: 0, clickRate: 0, sentCount: 0, sentDate: null },
  { id: "ec-10", name: "イベントフォローアップ", subject: "展示会でのご来場ありがとうございました", status: "SENT" as const, openRate: 45.7, clickRate: 18.9, sentCount: 420, sentDate: "2026-03-08" },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let filtered = [...mockEmailCampaigns];

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
    console.error("Error fetching email campaigns:", error);
    return NextResponse.json(
      { error: "メールキャンペーンの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, subject, status } = body;

    if (!name || !subject) {
      return NextResponse.json(
        { error: "キャンペーン名と件名は必須です" },
        { status: 400 }
      );
    }

    const newItem = {
      id: `ec-${Date.now()}`,
      name,
      subject,
      status: status || "DRAFT",
      openRate: 0,
      clickRate: 0,
      sentCount: 0,
      sentDate: null,
    };

    mockEmailCampaigns.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating email campaign:", error);
    return NextResponse.json(
      { error: "メールキャンペーンの作成に失敗しました" },
      { status: 500 }
    );
  }
}
