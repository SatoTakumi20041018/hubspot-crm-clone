import { NextRequest, NextResponse } from "next/server";

const mockSocialPosts = [
  { id: "social-1", platform: "Twitter" as const, content: "CRM導入のメリットを解説！営業効率を劇的に改善する方法とは？ #CRM #営業DX", status: "PUBLISHED" as const, engagement: { likes: 45, shares: 12, comments: 8 }, date: "2026-03-14T10:00:00" },
  { id: "social-2", platform: "LinkedIn" as const, content: "【新機能リリース】AIを活用したリードスコアリング機能を追加しました。詳しくはブログをご覧ください。", status: "PUBLISHED" as const, engagement: { likes: 128, shares: 34, comments: 15 }, date: "2026-03-13T09:00:00" },
  { id: "social-3", platform: "Facebook" as const, content: "3月20日開催のDX推進セミナーの参加者を募集しています！無料でご参加いただけます。", status: "PUBLISHED" as const, engagement: { likes: 67, shares: 23, comments: 5 }, date: "2026-03-12T12:00:00" },
  { id: "social-4", platform: "Instagram" as const, content: "オフィスの日常をお届け！チームで新プロダクトのブレスト中です #スタートアップ #チームワーク", status: "PUBLISHED" as const, engagement: { likes: 234, shares: 0, comments: 18 }, date: "2026-03-11T15:00:00" },
  { id: "social-5", platform: "Twitter" as const, content: "年度末キャンペーン開催中！3月末までのお申込みで初月無料。詳しくはプロフィールのリンクから。", status: "SCHEDULED" as const, engagement: { likes: 0, shares: 0, comments: 0 }, date: "2026-03-18T10:00:00" },
  { id: "social-6", platform: "LinkedIn" as const, content: "顧客満足度調査の結果、NPS +52を達成しました！お客様の声を大切にこれからも改善を続けます。", status: "PUBLISHED" as const, engagement: { likes: 89, shares: 15, comments: 7 }, date: "2026-03-10T08:30:00" },
  { id: "social-7", platform: "Facebook" as const, content: "導入企業インタビュー：株式会社ABCソリューションズ様にCRM導入の効果をお聞きしました。", status: "DRAFT" as const, engagement: { likes: 0, shares: 0, comments: 0 }, date: null },
  { id: "social-8", platform: "Twitter" as const, content: "カスタマーサクセスチームが語る、顧客の成功を支える秘訣。新しいブログ記事を公開しました。", status: "PUBLISHED" as const, engagement: { likes: 56, shares: 19, comments: 3 }, date: "2026-03-08T11:00:00" },
  { id: "social-9", platform: "Instagram" as const, content: "新しいオフィスに移転しました！より良い環境でお客様に価値を届けていきます #新オフィス", status: "SCHEDULED" as const, engagement: { likes: 0, shares: 0, comments: 0 }, date: "2026-03-20T12:00:00" },
  { id: "social-10", platform: "LinkedIn" as const, content: "【採用情報】エンジニア・マーケター積極採用中！私たちと一緒にSaaSの未来を作りませんか？", status: "PUBLISHED" as const, engagement: { likes: 156, shares: 42, comments: 21 }, date: "2026-03-06T09:00:00" },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let filtered = [...mockSocialPosts];

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
    console.error("Error fetching social posts:", error);
    return NextResponse.json(
      { error: "ソーシャル投稿の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { platform, content } = body;

    if (!platform || !content) {
      return NextResponse.json(
        { error: "プラットフォームとコンテンツは必須です" },
        { status: 400 }
      );
    }

    const newItem = {
      id: `social-${Date.now()}`,
      platform,
      content,
      status: "DRAFT" as const,
      engagement: { likes: 0, shares: 0, comments: 0 },
      date: null,
    };

    mockSocialPosts.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating social post:", error);
    return NextResponse.json(
      { error: "ソーシャル投稿の作成に失敗しました" },
      { status: 500 }
    );
  }
}
