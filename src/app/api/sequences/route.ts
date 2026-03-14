import { NextRequest, NextResponse } from "next/server";
import { mockSequences } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const active = searchParams.get("active");
    const ownerId = searchParams.get("ownerId");

    let filtered = [...mockSequences];

    if (search) {
      filtered = filtered.filter((seq) =>
        seq.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (active !== null && active !== undefined) {
      filtered = filtered.filter(
        (seq) => seq.active === (active === "true")
      );
    }

    if (ownerId) {
      filtered = filtered.filter((seq) => seq.ownerId === ownerId);
    }

    return NextResponse.json({
      sequences: filtered,
      total: filtered.length,
      stats: {
        totalEnrolled: filtered.reduce((s, seq) => s + seq.enrolled, 0),
        avgReplyRate:
          filtered.length > 0
            ? (
                filtered.reduce((s, seq) => s + seq.replyRate, 0) /
                filtered.length
              ).toFixed(1)
            : 0,
        avgMeetingRate:
          filtered.length > 0
            ? (
                filtered.reduce((s, seq) => s + seq.meetingRate, 0) /
                filtered.length
              ).toFixed(1)
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
      ownerName: null as string | null,
    };

    mockSequences.push(newSequence);

    return NextResponse.json(newSequence, { status: 201 });
  } catch (error) {
    console.error("Error creating sequence:", error);
    return NextResponse.json(
      { error: "シーケンスの作成に失敗しました" },
      { status: 500 }
    );
  }
}
