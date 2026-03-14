import { NextResponse } from "next/server";
import {
  mockContacts,
  mockCompanies,
  mockDeals,
  mockTickets,
  mockTasks,
  mockActivities,
  mockPipelineStages,
  getUserSelect,
  getContactSelect,
} from "@/lib/mock-data";

export async function GET() {
  try {
    const totalContacts = mockContacts.length;
    const totalCompanies = mockCompanies.length;
    const activeDeals = mockDeals.length;
    const totalRevenue = mockDeals.reduce((sum, d) => sum + (d.amount || 0), 0);

    const openTickets = mockTickets.filter((t) =>
      ["OPEN", "IN_PROGRESS", "WAITING"].includes(t.status)
    ).length;

    const totalTasks = mockTasks.length;
    const completedTasks = mockTasks.filter(
      (t) => t.status === "COMPLETED"
    ).length;

    // Recent activities
    const recentActivities = [...mockActivities]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10)
      .map((a) => ({
        ...a,
        user: getUserSelect(a.userId),
        contact: getContactSelect(a.contactId),
        deal: a.dealId
          ? (() => {
              const deal = mockDeals.find((d) => d.id === a.dealId);
              return deal ? { id: deal.id, name: deal.name } : null;
            })()
          : null,
        ticket: a.ticketId
          ? (() => {
              const ticket = mockTickets.find((t) => t.id === a.ticketId);
              return ticket
                ? { id: ticket.id, subject: ticket.subject }
                : null;
            })()
          : null,
      }));

    // Deals grouped by stage
    const stageGroups = new Map<
      string,
      { count: number; totalAmount: number }
    >();
    for (const deal of mockDeals) {
      const existing = stageGroups.get(deal.stageId) || {
        count: 0,
        totalAmount: 0,
      };
      existing.count += 1;
      existing.totalAmount += deal.amount || 0;
      stageGroups.set(deal.stageId, existing);
    }

    const dealsByStage = Array.from(stageGroups.entries())
      .map(([stageId, data]) => {
        const stage = mockPipelineStages.find((s) => s.id === stageId);
        return {
          stage: stage
            ? {
                id: stage.id,
                name: stage.name,
                color: stage.color,
                order: stage.order,
              }
            : { id: stageId, name: "不明", color: "#999", order: 0 },
          count: data.count,
          totalAmount: data.totalAmount,
        };
      })
      .sort((a, b) => a.stage.order - b.stage.order);

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
      recentActivities,
      dealsByStage,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "ダッシュボードデータの取得に失敗しました" },
      { status: 500 }
    );
  }
}
