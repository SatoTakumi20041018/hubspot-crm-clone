import { NextRequest, NextResponse } from "next/server";

// Mock workflow data
const workflows = [
  {
    id: "wf1",
    name: "新規リード自動フォローアップ",
    type: "contact",
    active: true,
    lastModified: "2026-03-12T10:30:00Z",
    enrolledCount: 342,
    trigger: "フォーム送信時",
    actions: ["ウェルカムメール送信", "3日後フォローアップメール", "担当者に通知", "タスク作成"],
    createdAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "wf2",
    name: "取引ステージ変更通知",
    type: "deal",
    active: true,
    lastModified: "2026-03-10T14:00:00Z",
    enrolledCount: 156,
    trigger: "取引ステージ変更時",
    actions: ["マネージャーに通知", "Slack通知", "アクティビティ記録"],
    createdAt: "2025-11-15T00:00:00Z",
  },
  {
    id: "wf3",
    name: "チケットSLAエスカレーション",
    type: "ticket",
    active: true,
    lastModified: "2026-03-08T09:00:00Z",
    enrolledCount: 89,
    trigger: "SLA期限超過時",
    actions: ["優先度を上げる", "マネージャーに通知", "担当者再アサイン"],
    createdAt: "2025-12-01T00:00:00Z",
  },
  {
    id: "wf4",
    name: "顧客満足度調査自動送信",
    type: "contact",
    active: true,
    lastModified: "2026-03-05T16:00:00Z",
    enrolledCount: 1245,
    trigger: "チケット解決後3日",
    actions: ["CSATアンケート送信", "スコア記録", "低スコア時にアラート"],
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "wf5",
    name: "新規会社登録時の自動処理",
    type: "company",
    active: false,
    lastModified: "2026-02-28T11:00:00Z",
    enrolledCount: 0,
    trigger: "新規会社作成時",
    actions: ["業界分類の自動設定", "担当者アサイン", "ウェルカムメール送信"],
    createdAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "wf6",
    name: "失注フォローアップ",
    type: "deal",
    active: true,
    lastModified: "2026-03-01T08:00:00Z",
    enrolledCount: 67,
    trigger: "取引が失注に変更時",
    actions: ["失注理由ヒアリングメール", "30日後再アプローチメール", "担当者タスク作成"],
    createdAt: "2025-09-01T00:00:00Z",
  },
  {
    id: "wf7",
    name: "MQLからSQLへの自動昇格",
    type: "contact",
    active: true,
    lastModified: "2026-03-11T13:00:00Z",
    enrolledCount: 523,
    trigger: "リードスコア50点以上",
    actions: ["ライフサイクル変更", "営業チームに通知", "ミーティングリンク送信"],
    createdAt: "2025-08-15T00:00:00Z",
  },
  {
    id: "wf8",
    name: "契約更新リマインダー",
    type: "deal",
    active: false,
    lastModified: "2026-02-20T10:00:00Z",
    enrolledCount: 0,
    trigger: "契約終了90日前",
    actions: ["担当者に通知", "更新提案メール", "タスク作成", "マネージャーCC"],
    createdAt: "2025-11-01T00:00:00Z",
  },
  {
    id: "wf9",
    name: "チケット自動分類",
    type: "ticket",
    active: true,
    lastModified: "2026-03-13T15:00:00Z",
    enrolledCount: 412,
    trigger: "新規チケット作成時",
    actions: ["カテゴリ自動判定", "優先度設定", "適切な担当者にアサイン"],
    createdAt: "2026-01-20T00:00:00Z",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const active = searchParams.get("active");
    const search = searchParams.get("search");

    let filtered = [...workflows];

    if (type) {
      filtered = filtered.filter((wf) => wf.type === type);
    }

    if (active !== null && active !== undefined) {
      filtered = filtered.filter((wf) => wf.active === (active === "true"));
    }

    if (search) {
      filtered = filtered.filter((wf) =>
        wf.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      workflows: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return NextResponse.json(
      { error: "ワークフローの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, type, trigger, actions } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: "ワークフロー名とタイプは必須です" },
        { status: 400 }
      );
    }

    const validTypes = ["contact", "deal", "ticket", "company"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "無効なワークフロータイプです" },
        { status: 400 }
      );
    }

    const newWorkflow = {
      id: `wf-${Date.now()}`,
      name,
      type,
      active: false,
      lastModified: new Date().toISOString(),
      enrolledCount: 0,
      trigger: trigger || "",
      actions: actions || [],
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newWorkflow, { status: 201 });
  } catch (error) {
    console.error("Error creating workflow:", error);
    return NextResponse.json(
      { error: "ワークフローの作成に失敗しました" },
      { status: 500 }
    );
  }
}
