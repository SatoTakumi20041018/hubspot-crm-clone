import { NextResponse } from "next/server";
import {
  mockPipelines,
  mockPipelineStages,
  mockDeals,
} from "@/lib/mock-data";

export async function GET() {
  try {
    const pipelines = mockPipelines
      .sort((a, b) => a.order - b.order)
      .map((p) => {
        const stages = mockPipelineStages
          .filter((s) => s.pipelineId === p.id)
          .sort((a, b) => a.order - b.order)
          .map((s) => ({
            ...s,
            _count: {
              deals: mockDeals.filter((d) => d.stageId === s.id).length,
            },
          }));

        return {
          ...p,
          stages,
          _count: {
            deals: mockDeals.filter((d) => d.pipelineId === p.id).length,
          },
        };
      });

    return NextResponse.json({ pipelines });
  } catch (error) {
    console.error("Error fetching pipelines:", error);
    return NextResponse.json(
      { error: "パイプラインの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, stages } = body;

    if (!name) {
      return NextResponse.json(
        { error: "パイプライン名は必須です" },
        { status: 400 }
      );
    }

    if (!stages || !Array.isArray(stages) || stages.length === 0) {
      return NextResponse.json(
        { error: "少なくとも1つのステージが必要です" },
        { status: 400 }
      );
    }

    // Get max order for new pipeline
    const maxOrder = mockPipelines.reduce(
      (max, p) => Math.max(max, p.order),
      -1
    );

    const newPipeline = {
      id: `pipeline-${Date.now()}`,
      name,
      isDefault: false,
      order: maxOrder + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockPipelines.push(newPipeline);

    const newStages = stages.map(
      (
        stage: { name: string; probability?: number; color?: string },
        index: number
      ) => {
        const s = {
          id: `stage-${Date.now()}-${index}`,
          name: stage.name,
          probability: stage.probability ?? 0,
          color: stage.color ?? "#3B82F6",
          order: index,
          pipelineId: newPipeline.id,
        };
        mockPipelineStages.push(s);
        return {
          ...s,
          _count: { deals: 0 },
        };
      }
    );

    const pipeline = {
      ...newPipeline,
      stages: newStages,
      _count: { deals: 0 },
    };

    return NextResponse.json(pipeline, { status: 201 });
  } catch (error) {
    console.error("Error creating pipeline:", error);
    return NextResponse.json(
      { error: "パイプラインの作成に失敗しました" },
      { status: 500 }
    );
  }
}
