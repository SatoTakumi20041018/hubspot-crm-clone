import { NextRequest, NextResponse } from "next/server";
import {
  mockDeals,
  mockDealContacts,
  mockContacts,
  getUserSelect,
  getCompanySelect,
  getStageById,
  getPipelineById,
  getContactSelect,
  includesCI,
} from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";
    const pipelineId = searchParams.get("pipelineId");
    const stageId = searchParams.get("stageId");
    const ownerId = searchParams.get("ownerId");

    const skip = (page - 1) * limit;

    let filtered = [...mockDeals];

    if (search) {
      filtered = filtered.filter((d) => includesCI(d.name, search));
    }

    if (pipelineId) {
      filtered = filtered.filter((d) => d.pipelineId === pipelineId);
    }

    if (stageId) {
      filtered = filtered.filter((d) => d.stageId === stageId);
    }

    if (ownerId) {
      filtered = filtered.filter((d) => d.ownerId === ownerId);
    }

    // Sort by createdAt desc
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    const deals = paginated.map((d) => {
      const stage = getStageById(d.stageId);
      const pipeline = getPipelineById(d.pipelineId);
      const dealContactLinks = mockDealContacts.filter(
        (dc) => dc.dealId === d.id
      );
      const contacts = dealContactLinks.map((dc) => ({
        contact: getContactSelect(dc.contactId),
      }));

      return {
        ...d,
        stage: stage
          ? {
              id: stage.id,
              name: stage.name,
              color: stage.color,
              probability: stage.probability,
            }
          : null,
        pipeline: pipeline
          ? { id: pipeline.id, name: pipeline.name }
          : null,
        owner: getUserSelect(d.ownerId),
        company: getCompanySelect(d.companyId),
        contacts,
      };
    });

    return NextResponse.json({
      deals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json(
      { error: "取引の取得に失敗しました" },
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
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const {
      name,
      amount,
      currency,
      closeDate,
      probability,
      stageId,
      pipelineId,
      ownerId,
      companyId,
      priority,
      contactIds,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: "取引名は必須です" },
        { status: 400 }
      );
    }

    if (!stageId || !pipelineId) {
      return NextResponse.json(
        { error: "パイプラインとステージは必須です" },
        { status: 400 }
      );
    }

    const newDeal = {
      id: `deal-${Date.now()}`,
      name,
      amount: amount !== undefined && amount !== null && amount !== '' ? parseFloat(String(amount)) : null,
      currency: currency || "JPY",
      closeDate: (() => {
        if (!closeDate) return null;
        try {
          const d = new Date(closeDate);
          if (isNaN(d.getTime())) return null;
          return d.toISOString();
        } catch {
          return null;
        }
      })(),
      probability: probability ? parseFloat(probability) : null,
      stageId,
      pipelineId,
      ownerId: ownerId || null,
      companyId: companyId || null,
      priority: (priority || "MEDIUM") as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDeals.push(newDeal);

    // Add deal-contact links
    if (contactIds?.length) {
      for (const contactId of contactIds) {
        mockDealContacts.push({ dealId: newDeal.id, contactId });
      }
    }

    const stage = getStageById(newDeal.stageId);
    const pipeline = getPipelineById(newDeal.pipelineId);
    const contacts = (contactIds || []).map((cid: string) => ({
      contact: getContactSelect(cid),
    }));

    const deal = {
      ...newDeal,
      stage: stage
        ? {
            id: stage.id,
            name: stage.name,
            color: stage.color,
            probability: stage.probability,
          }
        : null,
      pipeline: pipeline
        ? { id: pipeline.id, name: pipeline.name }
        : null,
      owner: getUserSelect(newDeal.ownerId),
      company: getCompanySelect(newDeal.companyId),
      contacts,
    };

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    console.error("Error creating deal:", error);
    return NextResponse.json(
      { error: "取引の作成に失敗しました" },
      { status: 500 }
    );
  }
}
