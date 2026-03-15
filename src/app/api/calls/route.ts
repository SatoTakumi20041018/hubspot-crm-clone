import { NextRequest, NextResponse } from "next/server";

const mockCalls = [
  { id: "call-1", contact: "田中太郎", direction: "outbound" as const, duration: 1245, outcome: "接続済み", notes: "CRM導入について詳細を説明。来週デモを設定", date: "2026-03-14T10:30:00" },
  { id: "call-2", contact: "鈴木花子", direction: "inbound" as const, duration: 480, outcome: "接続済み", notes: "料金プランの問い合わせ。見積書を送付予定", date: "2026-03-14T14:00:00" },
  { id: "call-3", contact: "佐藤健一", direction: "outbound" as const, duration: 0, outcome: "不在", notes: "留守電にメッセージを残した", date: "2026-03-13T11:00:00" },
  { id: "call-4", contact: "高橋美咲", direction: "outbound" as const, duration: 1860, outcome: "接続済み", notes: "契約更新について協議。条件を調整中", date: "2026-03-13T15:30:00" },
  { id: "call-5", contact: "渡辺直人", direction: "inbound" as const, duration: 360, outcome: "接続済み", notes: "技術的な質問。エンジニアチームにエスカレーション", date: "2026-03-12T09:15:00" },
  { id: "call-6", contact: "伊藤由美", direction: "outbound" as const, duration: 720, outcome: "接続済み", notes: "新機能の紹介。興味あり、フォローアップ予定", date: "2026-03-12T13:45:00" },
  { id: "call-7", contact: "山本大輝", direction: "outbound" as const, duration: 0, outcome: "話中", notes: "後日再度連絡する", date: "2026-03-11T10:00:00" },
  { id: "call-8", contact: "中村翔太", direction: "inbound" as const, duration: 900, outcome: "接続済み", notes: "サポートの件で問い合わせ。チケット作成済み", date: "2026-03-11T16:20:00" },
  { id: "call-9", contact: "小林恵", direction: "outbound" as const, duration: 540, outcome: "接続済み", notes: "初回ヒアリング完了。ニーズを把握", date: "2026-03-10T11:30:00" },
  { id: "call-10", contact: "加藤裕子", direction: "inbound" as const, duration: 1500, outcome: "接続済み", notes: "デモの感想をヒアリング。前向きに検討中", date: "2026-03-10T14:00:00" },
  { id: "call-11", contact: "松本誠", direction: "outbound" as const, duration: 0, outcome: "不在", notes: "メールでフォローアップ送信済み", date: "2026-03-09T09:45:00" },
  { id: "call-12", contact: "井上真理子", direction: "outbound" as const, duration: 2100, outcome: "接続済み", notes: "導入後のサポート体制について詳しく説明", date: "2026-03-09T13:00:00" },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let filtered = [...mockCalls];

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
    console.error("Error fetching calls:", error);
    return NextResponse.json(
      { error: "通話記録の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contact, direction, duration, outcome, notes } = body;

    if (!contact) {
      return NextResponse.json(
        { error: "コンタクト名は必須です" },
        { status: 400 }
      );
    }

    const newItem = {
      id: `call-${Date.now()}`,
      contact,
      direction: direction || "outbound",
      duration: duration || 0,
      outcome: outcome || "接続済み",
      notes: notes || "",
      date: new Date().toISOString(),
    };

    mockCalls.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating call:", error);
    return NextResponse.json(
      { error: "通話記録の作成に失敗しました" },
      { status: 500 }
    );
  }
}
