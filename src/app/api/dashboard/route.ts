import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalContacts,
      totalCompanies,
      activeDeals,
      totalDealAmount,
      openTickets,
      totalTasks,
      completedTasks,
      recentActivities,
      dealsByStage,
    ] = await Promise.all([
      // Total contacts
      prisma.contact.count(),

      // Total companies
      prisma.company.count(),

      // Active deals (not in closed stages - approximate by counting all)
      prisma.deal.count(),

      // Total deal revenue
      prisma.deal.aggregate({
        _sum: { amount: true },
      }),

      // Open tickets
      prisma.ticket.count({
        where: {
          status: { in: ["OPEN", "IN_PROGRESS", "WAITING"] },
        },
      }),

      // Total tasks
      prisma.task.count(),

      // Completed tasks
      prisma.task.count({
        where: { status: "COMPLETED" },
      }),

      // Recent activities
      prisma.activity.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true } },
          contact: { select: { id: true, firstName: true, lastName: true } },
          deal: { select: { id: true, name: true } },
          ticket: { select: { id: true, subject: true } },
        },
      }),

      // Deals grouped by stage
      prisma.deal.groupBy({
        by: ["stageId"],
        _count: { id: true },
        _sum: { amount: true },
      }),
    ]);

    // Get stage info for deals by stage
    const stageIds = dealsByStage.map((d: { stageId: string }) => d.stageId);
    const stages = await prisma.pipelineStage.findMany({
      where: { id: { in: stageIds } },
      select: { id: true, name: true, color: true, order: true },
    });

    const stageMap = new Map(stages.map((s: { id: string; name: string; color: string; order: number }) => [s.id, s]));
    const dealsByStageWithInfo = dealsByStage
      .map((d: { stageId: string; _count: { id: number }; _sum: { amount: number | null } }) => ({
        stage: stageMap.get(d.stageId) || { id: d.stageId, name: "不明", color: "#999", order: 0 },
        count: d._count.id,
        totalAmount: d._sum.amount || 0,
      }))
      .sort((a: { stage: { order: number } }, b: { stage: { order: number } }) => a.stage.order - b.stage.order);

    return NextResponse.json({
      stats: {
        totalContacts,
        totalCompanies,
        activeDeals,
        totalRevenue: totalDealAmount._sum.amount || 0,
        openTickets,
        totalTasks,
        completedTasks,
        taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
      recentActivities,
      dealsByStage: dealsByStageWithInfo,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "ダッシュボードデータの取得に失敗しました" },
      { status: 500 }
    );
  }
}
