"use client";

import { useState } from "react";
import Link from "next/link";
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

const companies = [
  {
    id: "1",
    name: "田中商事株式会社",
    domain: "tanaka-corp.jp",
    industry: "小売・EC",
    contactsCount: 5,
    dealsCount: 2,
    annualRevenue: 250000000,
    city: "東京都",
    owner: "佐藤 匠",
    createdAt: "2025-10-01",
  },
  {
    id: "2",
    name: "鈴木テクノロジー",
    domain: "suzuki-tech.co.jp",
    industry: "IT・ソフトウェア",
    contactsCount: 8,
    dealsCount: 3,
    annualRevenue: 500000000,
    city: "大阪府",
    owner: "佐藤 匠",
    createdAt: "2025-09-15",
  },
  {
    id: "3",
    name: "ABC株式会社",
    domain: "abc-corp.jp",
    industry: "コンサルティング",
    contactsCount: 3,
    dealsCount: 1,
    annualRevenue: 180000000,
    city: "東京都",
    owner: "佐藤 匠",
    createdAt: "2025-11-20",
  },
  {
    id: "4",
    name: "デジタルソリューションズ",
    domain: "digital-sol.jp",
    industry: "IT・ソフトウェア",
    contactsCount: 12,
    dealsCount: 4,
    annualRevenue: 800000000,
    city: "東京都",
    owner: "田村 愛",
    createdAt: "2025-08-10",
  },
  {
    id: "5",
    name: "東京マーケティング",
    domain: "tokyo-mktg.jp",
    industry: "マーケティング",
    contactsCount: 4,
    dealsCount: 2,
    annualRevenue: 120000000,
    city: "東京都",
    owner: "佐藤 匠",
    createdAt: "2025-12-05",
  },
  {
    id: "6",
    name: "イノベーション株式会社",
    domain: "innovation.jp",
    industry: "IT・ソフトウェア",
    contactsCount: 6,
    dealsCount: 1,
    annualRevenue: 350000000,
    city: "福岡県",
    owner: "田村 愛",
    createdAt: "2025-07-20",
  },
  {
    id: "7",
    name: "グローバルシステム",
    domain: "global-sys.jp",
    industry: "IT・ソフトウェア",
    contactsCount: 15,
    dealsCount: 5,
    annualRevenue: 1200000000,
    city: "東京都",
    owner: "佐藤 匠",
    createdAt: "2025-06-15",
  },
  {
    id: "8",
    name: "さくらデザイン",
    domain: "sakura-design.jp",
    industry: "マーケティング",
    contactsCount: 2,
    dealsCount: 1,
    annualRevenue: 50000000,
    city: "京都府",
    owner: "田村 愛",
    createdAt: "2026-01-10",
  },
  {
    id: "9",
    name: "フューチャーテック",
    domain: "future-tech.co.jp",
    industry: "IT・ソフトウェア",
    contactsCount: 7,
    dealsCount: 3,
    annualRevenue: 600000000,
    city: "名古屋市",
    owner: "佐藤 匠",
    createdAt: "2025-11-01",
  },
  {
    id: "10",
    name: "サンライズメディア",
    domain: "sunrise-media.jp",
    industry: "メディア",
    contactsCount: 3,
    dealsCount: 0,
    annualRevenue: 90000000,
    city: "東京都",
    owner: "田村 愛",
    createdAt: "2026-02-01",
  },
  {
    id: "11",
    name: "太陽コーポレーション",
    domain: "taiyo-corp.jp",
    industry: "製造業",
    contactsCount: 9,
    dealsCount: 2,
    annualRevenue: 2000000000,
    city: "愛知県",
    owner: "佐藤 匠",
    createdAt: "2025-05-20",
  },
  {
    id: "12",
    name: "ハーモニー株式会社",
    domain: "harmony-inc.jp",
    industry: "コンサルティング",
    contactsCount: 4,
    dealsCount: 2,
    annualRevenue: 150000000,
    city: "大阪府",
    owner: "佐藤 匠",
    createdAt: "2025-12-20",
  },
];

const formatRevenue = (amount: number) => {
  if (amount >= 100000000) {
    return `¥${(amount / 100000000).toFixed(1)}億`;
  }
  if (amount >= 10000) {
    return `¥${(amount / 10000).toLocaleString()}万`;
  }
  return `¥${amount.toLocaleString()}`;
};

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("すべて");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filtered = companies.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.domain.toLowerCase().includes(search.toLowerCase());
    const matchIndustry =
      selectedIndustry === "すべて" || c.industry === selectedIndustry;
    return matchSearch && matchIndustry;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">会社</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length}件の会社
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            エクスポート
          </Button>
          <Button size="sm">
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
                  setCurrentPage(1);
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
                  setCurrentPage(1);
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
              {paginated.map((company) => (
                <tr
                  key={company.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
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
                        {company.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Globe className="h-3.5 w-3.5 text-gray-400" />
                      {company.domain}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge>{company.industry}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {company.contactsCount}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {company.dealsCount}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {formatRevenue(company.annualRevenue)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{company.city}</td>
                  <td className="px-4 py-3">
                    <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">
            {filtered.length}件中 {(currentPage - 1) * perPage + 1}-
            {Math.min(currentPage * perPage, filtered.length)}件を表示
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === currentPage ? "primary" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
