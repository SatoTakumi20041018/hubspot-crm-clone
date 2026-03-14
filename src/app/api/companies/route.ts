import { NextRequest, NextResponse } from "next/server";
import {
  mockCompanies,
  mockContacts,
  mockDeals,
  mockTickets,
  getUserSelect,
  includesCI,
} from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    let filtered = [...mockCompanies];

    if (search) {
      filtered = filtered.filter(
        (c) =>
          includesCI(c.name, search) ||
          includesCI(c.domain, search) ||
          includesCI(c.industry, search)
      );
    }

    // Sort by createdAt desc
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    const companies = paginated.map((c) => ({
      ...c,
      owner: getUserSelect(c.ownerId),
      _count: {
        contacts: mockContacts.filter((ct) => ct.companyId === c.id).length,
        deals: mockDeals.filter((d) => d.companyId === c.id).length,
        tickets: mockTickets.filter((t) => t.companyId === c.id).length,
      },
    }));

    return NextResponse.json({
      companies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "会社の取得に失敗しました" },
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
      domain,
      industry,
      phone,
      city,
      state,
      country,
      description,
      annualRevenue,
      employeeCount,
      ownerId,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: "会社名は必須です" },
        { status: 400 }
      );
    }

    const newCompany = {
      id: `company-${Date.now()}`,
      name,
      domain: domain || null,
      industry: industry || null,
      phone: phone || null,
      city: city || null,
      state: state || null,
      country: country || null,
      description: description || null,
      annualRevenue: annualRevenue ? parseFloat(annualRevenue) : null,
      employeeCount: employeeCount ? parseInt(employeeCount) : null,
      ownerId: ownerId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockCompanies.push(newCompany);

    const company = {
      ...newCompany,
      owner: getUserSelect(newCompany.ownerId),
      _count: {
        contacts: 0,
        deals: 0,
        tickets: 0,
      },
    };

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "会社の作成に失敗しました" },
      { status: 500 }
    );
  }
}
