import { NextRequest, NextResponse } from "next/server";

const mockMeetings = [
  { id: "mtg-1", title: "CRMデモンストレーション", attendees: ["田中太郎", "佐藤花子", "山田一郎"], date: "2026-03-18", time: "10:00", duration: 60, type: "オンライン" as const, link: "https://meet.example.com/crm-demo" },
  { id: "mtg-2", title: "四半期レビューミーティング", attendees: ["高橋部長", "鈴木マネージャー"], date: "2026-03-20", time: "14:00", duration: 90, type: "対面" as const, link: null },
  { id: "mtg-3", title: "新規顧客ヒアリング", attendees: ["渡辺直人", "伊藤営業"], date: "2026-03-17", time: "11:00", duration: 45, type: "オンライン" as const, link: "https://meet.example.com/hearing" },
  { id: "mtg-4", title: "製品ロードマップ共有会", attendees: ["開発チーム", "プロダクトマネージャー", "営業チーム"], date: "2026-03-19", time: "15:00", duration: 60, type: "オンライン" as const, link: "https://meet.example.com/roadmap" },
  { id: "mtg-5", title: "契約条件交渉", attendees: ["佐藤健一", "法務部"], date: "2026-03-21", time: "13:00", duration: 60, type: "対面" as const, link: null },
  { id: "mtg-6", title: "オンボーディングセッション", attendees: ["中村翔太", "CSチーム"], date: "2026-03-22", time: "10:30", duration: 120, type: "オンライン" as const, link: "https://meet.example.com/onboarding" },
  { id: "mtg-7", title: "週次チームスタンドアップ", attendees: ["営業チーム全員"], date: "2026-03-17", time: "09:00", duration: 30, type: "オンライン" as const, link: "https://meet.example.com/standup" },
  { id: "mtg-8", title: "パートナーシップ提携打合せ", attendees: ["山本大輝", "外部パートナー"], date: "2026-03-25", time: "16:00", duration: 60, type: "対面" as const, link: null },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let filtered = [...mockMeetings];

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
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { error: "ミーティングの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, attendees, date, time, duration, type, link } = body;

    if (!title || !date || !time) {
      return NextResponse.json(
        { error: "タイトル・日付・時間は必須です" },
        { status: 400 }
      );
    }

    const newItem = {
      id: `mtg-${Date.now()}`,
      title,
      attendees: attendees || [],
      date,
      time,
      duration: duration || 60,
      type: type || "オンライン",
      link: link || null,
    };

    mockMeetings.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating meeting:", error);
    return NextResponse.json(
      { error: "ミーティングの作成に失敗しました" },
      { status: 500 }
    );
  }
}
