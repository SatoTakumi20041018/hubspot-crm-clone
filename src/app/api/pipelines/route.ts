import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pipelines = await prisma.pipeline.findMany({
      orderBy: { order: "asc" },
      include: {
        stages: {
          orderBy: { order: "asc" },
          include: {
            _count: {
              select: { deals: true },
            },
          },
        },
        _count: {
          select: { deals: true },
        },
      },
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
    const maxOrder = await prisma.pipeline.aggregate({
      _max: { order: true },
    });

    const pipeline = await prisma.pipeline.create({
      data: {
        name,
        order: (maxOrder._max.order ?? -1) + 1,
        stages: {
          create: stages.map(
            (
              stage: { name: string; probability?: number; color?: string },
              index: number
            ) => ({
              name: stage.name,
              probability: stage.probability ?? 0,
              color: stage.color ?? "#3B82F6",
              order: index,
            })
          ),
        },
      },
      include: {
        stages: {
          orderBy: { order: "asc" },
          include: {
            _count: {
              select: { deals: true },
            },
          },
        },
        _count: {
          select: { deals: true },
        },
      },
    });

    return NextResponse.json(pipeline, { status: 201 });
  } catch (error) {
    console.error("Error creating pipeline:", error);
    return NextResponse.json(
      { error: "パイプラインの作成に失敗しました" },
      { status: 500 }
    );
  }
}
