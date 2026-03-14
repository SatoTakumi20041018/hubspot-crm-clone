import { NextRequest, NextResponse } from "next/server";
import {
  mockContacts,
  getUserSelect,
  getCompanySelect,
  includesCI,
  mockDeals,
  mockDealContacts,
  mockTickets,
  mockTasks,
  mockActivities,
} from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const lifecycleStage = searchParams.get("lifecycleStage");
    const leadStatus = searchParams.get("leadStatus");
    const ownerId = searchParams.get("ownerId");

    const skip = (page - 1) * limit;

    let filtered = [...mockContacts];

    if (search) {
      filtered = filtered.filter(
        (c) =>
          includesCI(c.firstName, search) ||
          includesCI(c.lastName, search) ||
          includesCI(c.email, search) ||
          includesCI(c.phone, search)
      );
    }

    if (lifecycleStage) {
      filtered = filtered.filter((c) => c.lifecycleStage === lifecycleStage);
    }

    if (leadStatus) {
      filtered = filtered.filter((c) => c.leadStatus === leadStatus);
    }

    if (ownerId) {
      filtered = filtered.filter((c) => c.ownerId === ownerId);
    }

    // Sort by createdAt desc
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    const contacts = paginated.map((c) => ({
      ...c,
      company: getCompanySelect(c.companyId),
      owner: getUserSelect(c.ownerId),
      _count: {
        deals: mockDealContacts.filter((dc) => dc.contactId === c.id).length,
        tickets: mockTickets.filter((t) => t.contactId === c.id).length,
        tasks: mockTasks.filter((t) => t.contactId === c.id).length,
        activities: mockActivities.filter((a) => a.contactId === c.id).length,
      },
    }));

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "コンタクトの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      jobTitle,
      lifecycleStage,
      leadStatus,
      source,
      ownerId,
      companyId,
    } = body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "姓と名は必須です" },
        { status: 400 }
      );
    }

    if (email) {
      const existing = mockContacts.find((c) => c.email === email);
      if (existing) {
        return NextResponse.json(
          { error: "このメールアドレスのコンタクトは既に存在します" },
          { status: 409 }
        );
      }
    }

    const newContact = {
      id: `contact-${Date.now()}`,
      firstName,
      lastName,
      email: email || null,
      phone: phone || null,
      jobTitle: jobTitle || null,
      avatar: null,
      lifecycleStage: lifecycleStage || ("SUBSCRIBER" as const),
      leadStatus: leadStatus || null,
      source: source || null,
      ownerId: ownerId || null,
      companyId: companyId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockContacts.push(newContact);

    const contact = {
      ...newContact,
      company: getCompanySelect(newContact.companyId),
      owner: getUserSelect(newContact.ownerId),
      _count: {
        deals: 0,
        tickets: 0,
        tasks: 0,
        activities: 0,
      },
    };

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "コンタクトの作成に失敗しました" },
      { status: 500 }
    );
  }
}
