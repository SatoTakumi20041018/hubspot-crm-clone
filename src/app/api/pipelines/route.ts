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
            _count: { select: { deals: true } },
          },
        },
        _count: { select: { deals: true } },
      },
    });

    const formattedPipelines = pipelines.map((p) => ({
      id: p.id,
      label: p.name,
      displayOrder: p.order,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      archived: false,
      // Keep expanded for frontend
      name: p.name,
      isDefault: p.isDefault,
      order: p.order,
      stages: p.stages.map((s) => ({
        id: s.id,
        label: s.name,
        displayOrder: s.order,
        metadata: { probability: s.probability },
        // Keep expanded for frontend
        name: s.name,
        probability: s.probability,
        color: s.color,
        order: s.order,
        pipelineId: s.pipelineId,
        _count: s._count,
      })),
      _count: p._count,
    }));

    return NextResponse.json({
      results: formattedPipelines,
      // Also keep old format for backward compat
      pipelines: formattedPipelines,
    });
  } catch (error) {
    console.error("Error fetching pipelines:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch pipelines" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { status: "error", message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { name, stages } = body;

    if (!name) {
      return NextResponse.json(
        { status: "error", message: "Pipeline name is required" },
        { status: 400 }
      );
    }

    if (!stages || !Array.isArray(stages) || stages.length === 0) {
      return NextResponse.json(
        { status: "error", message: "At least one stage is required" },
        { status: 400 }
      );
    }

    // Get max order for placement
    const maxOrderPipeline = await prisma.pipeline.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const nextOrder = (maxOrderPipeline?.order ?? -1) + 1;

    const pipeline = await prisma.pipeline.create({
      data: {
        name,
        isDefault: false,
        order: nextOrder,
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
            _count: { select: { deals: true } },
          },
        },
        _count: { select: { deals: true } },
      },
    });

    return NextResponse.json(
      {
        id: pipeline.id,
        label: pipeline.name,
        displayOrder: pipeline.order,
        createdAt: pipeline.createdAt.toISOString(),
        updatedAt: pipeline.updatedAt.toISOString(),
        archived: false,
        name: pipeline.name,
        isDefault: pipeline.isDefault,
        order: pipeline.order,
        stages: pipeline.stages.map((s) => ({
          id: s.id,
          label: s.name,
          displayOrder: s.order,
          metadata: { probability: s.probability },
          name: s.name,
          probability: s.probability,
          color: s.color,
          order: s.order,
          pipelineId: s.pipelineId,
          _count: s._count,
        })),
        _count: pipeline._count,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating pipeline:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to create pipeline" },
      { status: 500 }
    );
  }
}
