"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Users,
  Building2,
  Handshake,
  AlertTriangle,
  Clock,
  Download,
  MoreHorizontal,
  Eye,
  RefreshCw,
} from "lucide-react";

const importHistory = [
  { id: 1, fileName: "contacts_2026Q1.csv", type: "コンタクト", records: 1250, success: 1230, errors: 20, date: "2026-03-10 14:30", status: "completed" as const, user: "佐藤 匠" },
  { id: 2, fileName: "companies_march.xlsx", type: "会社", records: 340, success: 338, errors: 2, date: "2026-03-08 10:15", status: "completed" as const, user: "佐藤 匠" },
  { id: 3, fileName: "deals_pipeline.csv", type: "取引", records: 89, success: 89, errors: 0, date: "2026-03-05 16:45", status: "completed" as const, user: "田村 愛" },
  { id: 4, fileName: "leads_webinar.csv", type: "コンタクト", records: 560, success: 0, errors: 0, date: "2026-03-14 09:00", status: "processing" as const, user: "佐藤 匠" },
  { id: 5, fileName: "partners_list.xlsx", type: "会社", records: 45, success: 42, errors: 3, date: "2026-03-01 11:30", status: "completed" as const, user: "田村 愛" },
];

const columnMappings = [
  { source: "名前", target: "氏名 (firstname + lastname)", status: "mapped" as const },
  { source: "メールアドレス", target: "Eメール (email)", status: "mapped" as const },
  { source: "会社名", target: "会社名 (company)", status: "mapped" as const },
  { source: "電話番号", target: "電話番号 (phone)", status: "mapped" as const },
  { source: "部署", target: "部署 (department)", status: "mapped" as const },
  { source: "役職", target: "役職 (jobtitle)", status: "mapped" as const },
  { source: "メモ", target: "未マッピング", status: "unmapped" as const },
  { source: "紹介元", target: "リードソース (hs_lead_source)", status: "suggested" as const },
];

const previewData = [
  { name: "佐藤 太郎", email: "sato@example.jp", company: "サンプル株式会社", phone: "03-1111-2222", department: "営業部", title: "部長" },
  { name: "田中 花子", email: "tanaka@sample.co.jp", company: "テスト商事", phone: "06-3333-4444", department: "マーケティング部", title: "マネージャー" },
  { name: "鈴木 一郎", email: "suzuki@demo.jp", company: "デモ株式会社", phone: "03-5555-6666", department: "IT部", title: "課長" },
  { name: "高橋 美咲", email: "takahashi@trial.jp", company: "トライアル工業", phone: "045-7777-8888", department: "経営企画", title: "主任" },
  { name: "渡辺 健太", email: "watanabe@test.co.jp", company: "テストシステムズ", phone: "03-9999-0000", department: "開発部", title: "リーダー" },
];

const steps = [
  { id: 1, label: "オブジェクト選択" },
  { id: 2, label: "ファイルアップロード" },
  { id: 3, label: "カラムマッピング" },
  { id: 4, label: "プレビュー" },
  { id: 5, label: "インポート実行" },
];

export default function ImportPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedObject, setSelectedObject] = useState("contacts");

  return (
    <div className="space-y-6">
      <PageHeader
        title="クイックインポート"
        description="CSV/Excelファイルからデータを簡単にインポート"
        breadcrumbs={[
          { label: "ホーム", href: "/" },
          { label: "CRM" },
          { label: "インポート" },
        ]}
      />

      {/* 5-Step Wizard */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                      step.id === currentStep
                        ? "bg-[#ff4800] text-white"
                        : step.id < currentStep
                        ? "bg-[#00823a] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.id < currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${
                    step.id === currentStep ? "text-[#ff4800]" : "text-gray-500"
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`mx-3 h-0.5 w-16 ${
                    step.id < currentStep ? "bg-[#00823a]" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>インポート先のオブジェクトを選択</CardTitle>
            <CardDescription>データをインポートするCRMオブジェクトを選択してください</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                { id: "contacts", name: "コンタクト", icon: Users, description: "顧客や見込み客の連絡先情報" },
                { id: "companies", name: "会社", icon: Building2, description: "企業・組織の情報" },
                { id: "deals", name: "取引", icon: Handshake, description: "商談・案件の情報" },
              ].map((obj) => {
                const Icon = obj.icon;
                return (
                  <button
                    key={obj.id}
                    onClick={() => setSelectedObject(obj.id)}
                    className={`rounded-xl border-2 p-5 text-left transition-all ${
                      selectedObject === obj.id
                        ? "border-[#ff4800] bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon className={`h-8 w-8 ${selectedObject === obj.id ? "text-[#ff4800]" : "text-gray-400"}`} />
                    <p className="mt-2 font-medium text-gray-900">{obj.name}</p>
                    <p className="mt-0.5 text-sm text-gray-500">{obj.description}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>ファイルをアップロード</CardTitle>
            <CardDescription>CSV または Excel ファイルをドラッグ&ドロップ、またはクリックして選択</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center transition-colors hover:border-[#ff4800] hover:bg-orange-50">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-lg font-medium text-gray-700">ファイルをここにドロップ</p>
              <p className="mt-1 text-sm text-gray-500">CSV, XLSX 形式に対応（最大10MB）</p>
              <Button variant="outline" className="mt-4">
                <FileSpreadsheet className="h-4 w-4 mr-1" />
                ファイルを選択
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>カラムマッピング</CardTitle>
            <CardDescription>ファイルの列とHubSpotのプロパティを対応付けてください</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">ファイルの列</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500"></th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">HubSpotプロパティ</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {columnMappings.map((mapping, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-900">{mapping.source}</td>
                      <td className="px-4 py-3 text-center">
                        <ArrowRight className="mx-auto h-4 w-4 text-gray-400" />
                      </td>
                      <td className="px-4 py-3">
                        <select className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm">
                          <option>{mapping.target}</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={
                          mapping.status === "mapped" ? "success" :
                          mapping.status === "suggested" ? "info" : "warning"
                        }>
                          {mapping.status === "mapped" ? "マッピング済み" :
                           mapping.status === "suggested" ? "AI提案" : "未マッピング"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>データプレビュー</CardTitle>
            <CardDescription>インポートされるデータの最初の5件を確認してください</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">名前</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">メール</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">会社</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">電話番号</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">部署</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">役職</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                      <td className="px-4 py-3 text-gray-600">{row.email}</td>
                      <td className="px-4 py-3 text-gray-600">{row.company}</td>
                      <td className="px-4 py-3 text-gray-600">{row.phone}</td>
                      <td className="px-4 py-3 text-gray-600">{row.department}</td>
                      <td className="px-4 py-3 text-gray-600">{row.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 rounded-lg bg-blue-50 p-3">
              <p className="text-sm text-blue-700">
                <CheckCircle className="mr-1 inline h-4 w-4" />
                560件のレコードが検出されました。重複チェック: 12件の重複候補があります。
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#b9cdbe] p-3">
                <CheckCircle className="h-8 w-8 text-[#00823a]" />
              </div>
              <div>
                <CardTitle>インポート準備完了</CardTitle>
                <CardDescription>設定を確認してインポートを実行してください</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-gray-50 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">オブジェクト</span>
                <span className="font-medium text-gray-900">コンタクト</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">ファイル</span>
                <span className="font-medium text-gray-900">leads_webinar.csv</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">レコード数</span>
                <span className="font-medium text-gray-900">560件</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">マッピング済み列</span>
                <span className="font-medium text-gray-900">7 / 8</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          戻る
        </Button>
        {currentStep < 5 ? (
          <Button onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}>
            次へ
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button>
            <Upload className="h-4 w-4 mr-1" />
            インポートを実行
          </Button>
        )}
      </div>

      {/* Import History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>インポート履歴</CardTitle>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              更新
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">ファイル名</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">タイプ</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">レコード</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">成功</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">エラー</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">日時</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">実行者</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                </tr>
              </thead>
              <tbody>
                {importHistory.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{item.fileName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.type}</td>
                    <td className="px-4 py-3 text-right text-gray-900">{item.records.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-[#00823a] font-medium">{item.success.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      {item.errors > 0 ? (
                        <span className="text-[#d9002b] font-medium">{item.errors}</span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.date}</td>
                    <td className="px-4 py-3 text-gray-600">{item.user}</td>
                    <td className="px-4 py-3">
                      <Badge variant={item.status === "completed" ? "success" : "warning"}>
                        {item.status === "completed" ? "完了" : "処理中"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
