import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalContacts,
      totalCompanies,
      activeDeals,
      revenueAgg,
      openTickets,
      totalTasks,
      completedTasks,
      dealsByStageRaw,
      recentActivities,
    ] = await Promise.all([
      prisma.contact.count(),
      prisma.company.count(),
      prisma.deal.count(),
      prisma.deal.aggregate({ _sum: { amount: true } }),
      prisma.ticket.count({
        where: { status: { in: ["OPEN", "IN_PROGRESS", "WAITING"] } },
      }),
      prisma.task.count(),
      prisma.task.count({ where: { status: "COMPLETED" } }),
      prisma.deal.groupBy({
        by: ["stageId"],
        _count: { id: true },
        _sum: { amount: true },
      }),
      prisma.activity.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
          contact: { select: { id: true, firstName: true, lastName: true, email: true } },
          deal: { select: { id: true, name: true } },
          ticket: { select: { id: true, subject: true } },
        },
      }),
    ]);

    const totalRevenue = revenueAgg._sum.amount || 0;

    // Fetch stage info for dealsByStage
    const stageIds = dealsByStageRaw.map((g) => g.stageId);
    const stages = stageIds.length > 0
      ? await prisma.pipelineStage.findMany({
          where: { id: { in: stageIds } },
          select: { id: true, name: true, color: true, order: true },
        })
      : [];

    const stageMap = new Map(stages.map((s) => [s.id, s]));

    const dealsByStage = dealsByStageRaw
      .map((g) => {
        const stage = stageMap.get(g.stageId);
        return {
          stage: stage
            ? { id: stage.id, name: stage.name, color: stage.color, order: stage.order }
            : { id: g.stageId, name: "Unknown", color: "#999", order: 0 },
          count: g._count.id,
          totalAmount: g._sum.amount || 0,
        };
      })
      .sort((a, b) => a.stage.order - b.stage.order);

    const formattedActivities = recentActivities.map((a) => ({
      id: a.id,
      type: a.type,
      subject: a.subject,
      body: a.body,
      metadata: a.metadata,
      createdAt: a.createdAt.toISOString(),
      user: a.user || null,
      contact: a.contact || null,
      deal: a.deal || null,
      ticket: a.ticket || null,
    }));

    return NextResponse.json({
      stats: {
        totalContacts,
        totalCompanies,
        activeDeals,
        totalRevenue,
        openTickets,
        totalTasks,
        completedTasks,
        taskCompletionRate:
          totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0,
      },
      recentActivities: formattedActivities,
      dealsByStage,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
