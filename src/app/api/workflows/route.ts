import { NextRequest, NextResponse } from "next/server";
import { mockWorkflows } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const active = searchParams.get("active");
    const search = searchParams.get("search");

    let filtered = [...mockWorkflows];

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

    mockWorkflows.push(newWorkflow);

    return NextResponse.json(newWorkflow, { status: 201 });
  } catch (error) {
    console.error("Error creating workflow:", error);
    return NextResponse.json(
      { error: "ワークフローの作成に失敗しました" },
      { status: 500 }
    );
  }
}
