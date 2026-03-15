"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  Download,
  MoreHorizontal,
  Building2,
  Globe,
} from "lucide-react";

const industries = [
  "すべて",
  "IT・ソフトウェア",
  "製造業",
  "小売・EC",
  "コンサルティング",
  "マーケティング",
  "不動産",
  "金融",
  "メディア",
];

interface Company {
  id: string;
  properties: {
    name?: string;
    domain?: string;
    industry?: string;
    numberofemployees?: string;
    annualrevenue?: string;
    city?: string;
    hubspot_owner_id?: string;
    num_associated_contacts?: string;
    num_associated_deals?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CompaniesResponse {
  results: Company[];
  total?: number;
  paging?: {
    next?: {
      after: string;
    };
  };
}

const formatRevenue = (amount: number) => {
  if (amount >= 100000000) {
    return `¥${(amount / 100000000).toFixed(1)}億`;
  }
  if (amount >= 10000) {
    return `¥${(amount / 10000).toLocaleString()}万`;
  }
  return `¥${amount.toLocaleString()}`;
};

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
      </div>
      <Card>
        <div className="p-4">
          <div className="h-9 w-72 bg-gray-200 rounded animate-pulse" />
        </div>
      </Card>
      <Card>
        <div className="p-4 space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function CompaniesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("すべて");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [afterCursor, setAfterCursor] = useState<string | undefined>(undefined);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [total, setTotal] = useState(0);

  const fetchCompanies = useCallback(async (cursor?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (cursor) params.set("after", cursor);
      if (search) params.set("search", search);
      if (selectedIndustry !== "すべて") params.set("industry", selectedIndustry);

      const res = await fetch(`/api/companies?${params.toString()}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: CompaniesResponse = await res.json();
      setCompanies(data.results || []);
      setAfterCursor(data.paging?.next?.after);
      setTotal(data.total ?? data.results?.length ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [search, selectedIndustry]);

  useEffect(() => {
    setPrevCursors([]);
    fetchCompanies();
  }, [fetchCompanies]);

  const handleNextPage = () => {
    if (afterCursor) {
      setPrevCursors((prev) => [...prev, ""]);
      fetchCompanies(afterCursor);
    }
  };

  const handlePrevPage = () => {
    const newPrev = [...prevCursors];
    newPrev.pop();
    setPrevCursors(newPrev);
    fetchCompanies();
  };

  if (loading && companies.length === 0) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">会社</h1>
        </div>
        <Card>
          <div className="p-8 text-center">
            <p className="text-red-600 font-medium mb-2">エラーが発生しました</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <Button size="sm" onClick={() => fetchCompanies()}>
              再試行
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">会社</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total}件の会社
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => alert("エクスポート機能は準備中です")}>
            <Download className="h-4 w-4 mr-1" />
            エクスポート
          </Button>
          <Button size="sm" onClick={() => alert("会社作成モーダルは準備中です")}>
            <Plus className="h-4 w-4 mr-1" />
            会社を作成
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-72">
              <Input
                variant="search"
                placeholder="会社名、ドメインで検索..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                value={selectedIndustry}
                onChange={(e) => {
                  setSelectedIndustry(e.target.value);
                }}
              >
                {industries.map((s) => (
                  <option key={s} value={s}>
                    業界: {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    会社名
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  ドメイン
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  業界
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  コンタクト数
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  取引数
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700">
                    年間売上
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  都市
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="px-4 py-3" colSpan={9}>
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                    会社が見つかりません
                  </td>
                </tr>
              ) : (
                companies.map((company) => {
                  const revenue = company.properties.annualrevenue
                    ? Number(company.properties.annualrevenue)
                    : 0;
                  return (
                    <tr
                      key={company.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/companies/${company.id}`)}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/companies/${company.id}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-blue-100 text-blue-600">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <span className="font-medium text-gray-900 group-hover:text-[#ff4800]">
                            {company.properties.name || "名前なし"}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        {company.properties.domain ? (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Globe className="h-3.5 w-3.5 text-gray-400" />
                            {company.properties.domain}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {company.properties.industry ? (
                          <Badge>{company.properties.industry}</Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {company.properties.num_associated_contacts || 0}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {company.properties.num_associated_deals || 0}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {revenue > 0 ? formatRevenue(revenue) : "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {company.properties.city || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">
            {total}件の会社
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={prevCursors.length === 0}
              onClick={handlePrevPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!afterCursor}
              onClick={handleNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
