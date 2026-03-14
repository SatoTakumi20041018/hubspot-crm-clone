import { NextRequest, NextResponse } from "next/server";

// Mock sequence data
const sequences = [
  {
    id: "seq1",
    name: "新規リードアプローチ",
    steps: [
      { type: "email", label: "自己紹介メール", delay: 0 },
      { type: "wait", label: "3日待機", delay: 3 },
      { type: "email", label: "事例紹介メール", delay: 0 },
      { type: "wait", label: "2日待機", delay: 2 },
      { type: "task", label: "電話フォロー", delay: 0 },
      { type: "email", label: "最終フォローアップ", delay: 0 },
    ],
    stepsCount: 6,
    enrolled: 234,
    replyRate: 18.5,
    meetingRate: 8.2,
    active: true,
    createdAt: "2026-01-15T00:00:00Z",
    ownerId: "user1",
    ownerName: "佐藤 匠",
  },
  {
    id: "seq2",
    name: "展示会リードフォロー",
    steps: [
      { type: "email", label: "お礼メール", delay: 0 },
      { type: "wait", label: "1日待機", delay: 1 },
      { type: "email", label: "資料送付", delay: 0 },
      { type: "wait", label: "3日待機", delay: 3 },
      { type: "call", label: "フォローコール", delay: 0 },
      { type: "email", label: "ミーティング提案", delay: 0 },
    ],
    stepsCount: 6,
    enrolled: 156,
    replyRate: 24.3,
    meetingRate: 12.1,
    active: true,
    createdAt: "2026-02-01T00:00:00Z",
    ownerId: "user1",
    ownerName: "佐藤 匠",
  },
  {
    id: "seq3",
    name: "休眠顧客復活",
    steps: [
      { type: "email", label: "近況伺い", delay: 0 },
      { type: "wait", label: "5日待機", delay: 5 },
      { type: "email", label: "新機能案内", delay: 0 },
      { type: "wait", label: "3日待機", delay: 3 },
      { type: "task", label: "個別フォロー検討", delay: 0 },
    ],
    stepsCount: 5,
    enrolled: 89,
    replyRate: 12.4,
    meetingRate: 4.5,
    active: true,
    createdAt: "2026-02-10T00:00:00Z",
    ownerId: "user2",
    ownerName: "田村 愛",
  },
  {
    id: "seq4",
    name: "デモ後フォローアップ",
    steps: [
      { type: "email", label: "デモお礼＋資料", delay: 0 },
      { type: "wait", label: "2日待機", delay: 2 },
      { type: "email", label: "Q&Aフォロー", delay: 0 },
      { type: "wait", label: "3日待機", delay: 3 },
      { type: "call", label: "意思決定確認コール", delay: 0 },
      { type: "email", label: "見積提案", delay: 0 },
      { type: "wait", label: "5日待機", delay: 5 },
      { type: "email", label: "最終確認", delay: 0 },
    ],
    stepsCount: 8,
    enrolled: 78,
    replyRate: 32.1,
    meetingRate: 18.6,
    active: true,
    createdAt: "2026-01-20T00:00:00Z",
    ownerId: "user1",
    ownerName: "佐藤 匠",
  },
  {
    id: "seq5",
    name: "ウェビナー参加者フォロー",
    steps: [
      { type: "email", label: "録画・資料共有", delay: 0 },
      { type: "wait", label: "2日待機", delay: 2 },
      { type: "email", label: "関連コンテンツ", delay: 0 },
      { type: "task", label: "スコア確認・アプローチ判断", delay: 0 },
    ],
    stepsCount: 4,
    enrolled: 312,
    replyRate: 15.8,
    meetingRate: 6.3,
    active: false,
    createdAt: "2026-02-15T00:00:00Z",
    ownerId: "user2",
    ownerName: "田村 愛",
  },
  {
    id: "seq6",
    name: "アップセル提案",
    steps: [
      { type: "email", label: "利用状況レビュー", delay: 0 },
      { type: "wait", label: "3日待機", delay: 3 },
      { type: "email", label: "上位プラン紹介", delay: 0 },
      { type: "wait", label: "4日待機", delay: 4 },
      { type: "call", label: "個別ヒアリング", delay: 0 },
      { type: "email", label: "カスタム提案書", delay: 0 },
    ],
    stepsCount: 6,
    enrolled: 45,
    replyRate: 22.2,
    meetingRate: 15.6,
    active: true,
    createdAt: "2026-03-01T00:00:00Z",
    ownerId: "user1",
    ownerName: "佐藤 匠",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const active = searchParams.get("active");
    const ownerId = searchParams.get("ownerId");

    let filtered = [...sequences];

    if (search) {
      filtered = filtered.filter((seq) =>
        seq.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (active !== null && active !== undefined) {
      filtered = filtered.filter((seq) => seq.active === (active === "true"));
    }

    if (ownerId) {
      filtered = filtered.filter((seq) => seq.ownerId === ownerId);
    }

    return NextResponse.json({
      sequences: filtered,
      total: filtered.length,
      stats: {
        totalEnrolled: filtered.reduce((s, seq) => s + seq.enrolled, 0),
        avgReplyRate: filtered.length > 0
          ? (filtered.reduce((s, seq) => s + seq.replyRate, 0) / filtered.length).toFixed(1)
          : 0,
        avgMeetingRate: filtered.length > 0
          ? (filtered.reduce((s, seq) => s + seq.meetingRate, 0) / filtered.length).toFixed(1)
          : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching sequences:", error);
    return NextResponse.json(
      { error: "シーケンスの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, steps, ownerId } = body;

    if (!name) {
      return NextResponse.json(
        { error: "シーケンス名は必須です" },
        { status: 400 }
      );
    }

    if (!steps || !Array.isArray(steps) || steps.length === 0) {
      return NextResponse.json(
        { error: "少なくとも1つのステップが必要です" },
        { status: 400 }
      );
    }

    const validStepTypes = ["email", "wait", "task", "call"];
    for (const step of steps) {
      if (!validStepTypes.includes(step.type)) {
        return NextResponse.json(
          { error: `無効なステップタイプ: ${step.type}` },
          { status: 400 }
        );
      }
    }

    const newSequence = {
      id: `seq-${Date.now()}`,
      name,
      steps,
      stepsCount: steps.length,
      enrolled: 0,
      replyRate: 0,
      meetingRate: 0,
      active: false,
      createdAt: new Date().toISOString(),
      ownerId: ownerId || null,
      ownerName: null,
    };

    return NextResponse.json(newSequence, { status: 201 });
  } catch (error) {
    console.error("Error creating sequence:", error);
    return NextResponse.json(
      { error: "シーケンスの作成に失敗しました" },
      { status: 500 }
    );
  }
}
