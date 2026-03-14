import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ===================== CLEAR ALL DATA =====================
  console.log("Clearing existing data...");
  await prisma.emailCampaignStats.deleteMany();
  await prisma.emailCampaign.deleteMany();
  await prisma.emailTemplate.deleteMany();
  await prisma.form.deleteMany();
  await prisma.landingPage.deleteMany();
  await prisma.knowledgeBaseArticle.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.note.deleteMany();
  await prisma.task.deleteMany();
  await prisma.dealContact.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.pipelineStage.deleteMany();
  await prisma.pipeline.deleteMany();
  await prisma.ticketStage.deleteMany();
  await prisma.ticketPipeline.deleteMany();
  await prisma.contactProperty.deleteMany();
  await prisma.companyProperty.deleteMany();
  await prisma.dealProperty.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.company.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
  console.log("All data cleared.");

  // ===================== USERS =====================
  console.log("Creating users...");
  const hashedPassword =
    "$2a$12$LJ3UlWPe3t.1kZj/hzaXKuJWKkE8o9N5Y7fB3t8a0zL9eKcZ3C8a6";

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "佐藤匠",
        email: "sato@example.com",
        hashedPassword,
        role: "ADMIN",
      },
    }),
    prisma.user.create({
      data: {
        name: "田中美咲",
        email: "tanaka@example.com",
        hashedPassword,
        role: "MANAGER",
      },
    }),
    prisma.user.create({
      data: {
        name: "鈴木大輔",
        email: "suzuki@example.com",
        hashedPassword,
        role: "MEMBER",
      },
    }),
    prisma.user.create({
      data: {
        name: "山田花子",
        email: "yamada@example.com",
        hashedPassword,
        role: "MEMBER",
      },
    }),
    prisma.user.create({
      data: {
        name: "伊藤健太",
        email: "ito@example.com",
        hashedPassword,
        role: "MEMBER",
      },
    }),
  ]);

  const [sato, tanaka, suzuki, yamada, ito] = users;
  const allUserIds = users.map((u) => u.id);

  function randomUser() {
    return allUserIds[Math.floor(Math.random() * allUserIds.length)];
  }

  // ===================== PIPELINE =====================
  console.log("Creating pipeline...");
  const pipeline = await prisma.pipeline.create({
    data: {
      name: "デフォルトパイプライン",
      isDefault: true,
      order: 0,
    },
  });

  const stageData = [
    { name: "初回商談", probability: 20, order: 0, color: "#3B82F6" },
    { name: "提案中", probability: 40, order: 1, color: "#8B5CF6" },
    { name: "見積提出", probability: 60, order: 2, color: "#F59E0B" },
    { name: "交渉中", probability: 80, order: 3, color: "#F97316" },
    { name: "契約締結", probability: 100, order: 4, color: "#10B981" },
    { name: "失注", probability: 0, order: 5, color: "#EF4444" },
  ];

  const stages = await Promise.all(
    stageData.map((s) =>
      prisma.pipelineStage.create({
        data: {
          name: s.name,
          probability: s.probability,
          order: s.order,
          color: s.color,
          pipelineId: pipeline.id,
        },
      })
    )
  );

  // ===================== TICKET PIPELINE =====================
  console.log("Creating ticket pipeline...");
  const ticketPipeline = await prisma.ticketPipeline.create({
    data: {
      name: "サポートパイプライン",
      isDefault: true,
    },
  });

  const ticketStageData = [
    { name: "新規", order: 0, color: "#3B82F6" },
    { name: "対応中", order: 1, color: "#F59E0B" },
    { name: "確認待ち", order: 2, color: "#8B5CF6" },
    { name: "解決済み", order: 3, color: "#10B981" },
  ];

  const ticketStages = await Promise.all(
    ticketStageData.map((s) =>
      prisma.ticketStage.create({
        data: {
          name: s.name,
          order: s.order,
          color: s.color,
          pipelineId: ticketPipeline.id,
        },
      })
    )
  );

  // ===================== COMPANIES =====================
  console.log("Creating companies...");
  const companyData = [
    {
      name: "株式会社テクノロジー",
      domain: "technology-inc.co.jp",
      industry: "IT・通信",
      phone: "03-1234-5678",
      city: "東京都",
      country: "日本",
      annualRevenue: 500000000,
      employeeCount: 250,
    },
    {
      name: "サクラソフトウェア株式会社",
      domain: "sakura-software.co.jp",
      industry: "ソフトウェア",
      phone: "03-2345-6789",
      city: "東京都",
      country: "日本",
      annualRevenue: 300000000,
      employeeCount: 120,
    },
    {
      name: "富士マーケティング",
      domain: "fuji-marketing.co.jp",
      industry: "マーケティング",
      phone: "045-345-6789",
      city: "横浜市",
      country: "日本",
      annualRevenue: 150000000,
      employeeCount: 80,
    },
    {
      name: "大和建設株式会社",
      domain: "yamato-construction.co.jp",
      industry: "建設",
      phone: "06-1234-5678",
      city: "大阪市",
      country: "日本",
      annualRevenue: 2000000000,
      employeeCount: 500,
    },
    {
      name: "ニューワールドメディア",
      domain: "newworld-media.co.jp",
      industry: "メディア",
      phone: "03-3456-7890",
      city: "東京都",
      country: "日本",
      annualRevenue: 200000000,
      employeeCount: 60,
    },
    {
      name: "東京ファイナンス",
      domain: "tokyo-finance.co.jp",
      industry: "金融",
      phone: "03-4567-8901",
      city: "東京都",
      country: "日本",
      annualRevenue: 1000000000,
      employeeCount: 350,
    },
    {
      name: "北海道フーズ",
      domain: "hokkaido-foods.co.jp",
      industry: "食品",
      phone: "011-234-5678",
      city: "札幌市",
      country: "日本",
      annualRevenue: 800000000,
      employeeCount: 200,
    },
    {
      name: "関西エレクトロニクス",
      domain: "kansai-electronics.co.jp",
      industry: "電子機器",
      phone: "06-2345-6789",
      city: "大阪市",
      country: "日本",
      annualRevenue: 600000000,
      employeeCount: 180,
    },
    {
      name: "グローバルロジスティクス",
      domain: "global-logistics.co.jp",
      industry: "物流",
      phone: "045-456-7890",
      city: "横浜市",
      country: "日本",
      annualRevenue: 1500000000,
      employeeCount: 400,
    },
    {
      name: "ネクストイノベーション",
      domain: "next-innovation.co.jp",
      industry: "コンサルティング",
      phone: "03-5678-9012",
      city: "東京都",
      country: "日本",
      annualRevenue: 100000000,
      employeeCount: 30,
    },
    {
      name: "ヒューマンリソース",
      domain: "human-resource.co.jp",
      industry: "人材",
      phone: "03-6789-0123",
      city: "東京都",
      country: "日本",
      annualRevenue: 250000000,
      employeeCount: 90,
    },
    {
      name: "クリエイティブデザイン",
      domain: "creative-design.co.jp",
      industry: "デザイン",
      phone: "03-7890-1234",
      city: "東京都",
      country: "日本",
      annualRevenue: 80000000,
      employeeCount: 25,
    },
  ];

  const companies = await Promise.all(
    companyData.map((c) =>
      prisma.company.create({
        data: {
          ...c,
          ownerId: randomUser(),
        },
      })
    )
  );

  // ===================== CONTACTS =====================
  console.log("Creating contacts...");
  const lifecycleStages = [
    "SUBSCRIBER",
    "LEAD",
    "MQL",
    "SQL",
    "OPPORTUNITY",
    "CUSTOMER",
  ] as const;
  const leadStatuses = [
    "NEW",
    "OPEN",
    "IN_PROGRESS",
    "OPEN_DEAL",
    "CONNECTED",
    "ATTEMPTED_TO_CONTACT",
  ] as const;
  const sources = [
    "ウェブサイト",
    "展示会",
    "紹介",
    "広告",
    "SNS",
    "セミナー",
    "電話営業",
  ];

  const contactData = [
    {
      firstName: "太郎",
      lastName: "山本",
      email: "yamamoto@technology-inc.co.jp",
      phone: "090-1234-5678",
      jobTitle: "取締役CTO",
    },
    {
      firstName: "恵",
      lastName: "佐々木",
      email: "sasaki@sakura-software.co.jp",
      phone: "090-2345-6789",
      jobTitle: "プロジェクトマネージャー",
    },
    {
      firstName: "健二",
      lastName: "田中",
      email: "k.tanaka@fuji-marketing.co.jp",
      phone: "090-3456-7890",
      jobTitle: "マーケティング部長",
    },
    {
      firstName: "優子",
      lastName: "中村",
      email: "nakamura@yamato-construction.co.jp",
      phone: "090-4567-8901",
      jobTitle: "総務部長",
    },
    {
      firstName: "翔太",
      lastName: "小林",
      email: "kobayashi@newworld-media.co.jp",
      phone: "090-5678-9012",
      jobTitle: "編集長",
    },
    {
      firstName: "美穂",
      lastName: "加藤",
      email: "kato@tokyo-finance.co.jp",
      phone: "090-6789-0123",
      jobTitle: "システム部マネージャー",
    },
    {
      firstName: "亮",
      lastName: "渡辺",
      email: "watanabe@hokkaido-foods.co.jp",
      phone: "090-7890-1234",
      jobTitle: "情報システム部長",
    },
    {
      firstName: "さくら",
      lastName: "松本",
      email: "matsumoto@kansai-electronics.co.jp",
      phone: "090-8901-2345",
      jobTitle: "購買部マネージャー",
    },
    {
      firstName: "大樹",
      lastName: "井上",
      email: "inoue@global-logistics.co.jp",
      phone: "090-9012-3456",
      jobTitle: "物流企画部長",
    },
    {
      firstName: "瑠璃",
      lastName: "木村",
      email: "kimura@next-innovation.co.jp",
      phone: "080-1234-5678",
      jobTitle: "代表取締役",
    },
    {
      firstName: "翔",
      lastName: "吉田",
      email: "yoshida@human-resource.co.jp",
      phone: "080-2345-6789",
      jobTitle: "営業部長",
    },
    {
      firstName: "明美",
      lastName: "高橋",
      email: "takahashi@creative-design.co.jp",
      phone: "080-3456-7890",
      jobTitle: "クリエイティブディレクター",
    },
    {
      firstName: "伸一",
      lastName: "林",
      email: "hayashi@technology-inc.co.jp",
      phone: "080-4567-8901",
      jobTitle: "開発リーダー",
    },
    {
      firstName: "由紀",
      lastName: "斎藤",
      email: "saito@sakura-software.co.jp",
      phone: "080-5678-9012",
      jobTitle: "QAマネージャー",
    },
    {
      firstName: "浩二",
      lastName: "山口",
      email: "yamaguchi@yamato-construction.co.jp",
      phone: "080-6789-0123",
      jobTitle: "現場監督",
    },
    {
      firstName: "海斗",
      lastName: "小野",
      email: "ono@tokyo-finance.co.jp",
      phone: "080-7890-1234",
      jobTitle: "アナリスト",
    },
    {
      firstName: "結衣",
      lastName: "前田",
      email: "maeda@hokkaido-foods.co.jp",
      phone: "080-8901-2345",
      jobTitle: "商品企画部",
    },
    {
      firstName: "拓也",
      lastName: "藤田",
      email: "fujita@kansai-electronics.co.jp",
      phone: "080-9012-3456",
      jobTitle: "品質管理部長",
    },
    {
      firstName: "翔",
      lastName: "長谷川",
      email: "hasegawa@global-logistics.co.jp",
      phone: "070-1234-5678",
      jobTitle: "海外事業部マネージャー",
    },
    {
      firstName: "彩花",
      lastName: "三浦",
      email: "miura@creative-design.co.jp",
      phone: "070-2345-6789",
      jobTitle: "UIデザイナー",
    },
  ];

  const contacts = await Promise.all(
    contactData.map((c, i) =>
      prisma.contact.create({
        data: {
          ...c,
          lifecycleStage:
            lifecycleStages[Math.floor(Math.random() * lifecycleStages.length)],
          leadStatus:
            leadStatuses[Math.floor(Math.random() * leadStatuses.length)],
          source: sources[Math.floor(Math.random() * sources.length)],
          ownerId: randomUser(),
          companyId: companies[i % companies.length].id,
        },
      })
    )
  );

  // ===================== DEALS =====================
  console.log("Creating deals...");
  const dealData = [
    {
      name: "クラウド基盤構築プロジェクト",
      amount: 15000000,
      stageIdx: 2,
      companyIdx: 0,
    },
    {
      name: "CRMシステム導入",
      amount: 8000000,
      stageIdx: 1,
      companyIdx: 1,
    },
    {
      name: "デジタルマーケティング支援",
      amount: 3000000,
      stageIdx: 0,
      companyIdx: 2,
    },
    {
      name: "ECサイトリニューアル",
      amount: 12000000,
      stageIdx: 3,
      companyIdx: 4,
    },
    {
      name: "基幹システム刷新",
      amount: 50000000,
      stageIdx: 1,
      companyIdx: 3,
    },
    {
      name: "セキュリティ監査",
      amount: 2000000,
      stageIdx: 4,
      companyIdx: 5,
    },
    {
      name: "データ分析基盤構築",
      amount: 20000000,
      stageIdx: 2,
      companyIdx: 6,
    },
    {
      name: "IoTシステム開発",
      amount: 35000000,
      stageIdx: 0,
      companyIdx: 7,
    },
    {
      name: "物流管理システム",
      amount: 18000000,
      stageIdx: 3,
      companyIdx: 8,
    },
    {
      name: "AI導入コンサルティング",
      amount: 5000000,
      stageIdx: 1,
      companyIdx: 9,
    },
    {
      name: "採用管理システム",
      amount: 4000000,
      stageIdx: 4,
      companyIdx: 10,
    },
    {
      name: "ブランディングサイト制作",
      amount: 3500000,
      stageIdx: 2,
      companyIdx: 11,
    },
    {
      name: "社内ポータル構築",
      amount: 7000000,
      stageIdx: 5,
      companyIdx: 0,
    },
    {
      name: "モバイルアプリ開発",
      amount: 25000000,
      stageIdx: 0,
      companyIdx: 1,
    },
    {
      name: "業務自動化ツール導入",
      amount: 500000,
      stageIdx: 3,
      companyIdx: 5,
    },
  ];

  const deals = await Promise.all(
    dealData.map((d) => {
      const stage = stages[d.stageIdx];
      const closeDateOffset =
        d.stageIdx === 4
          ? -Math.floor(Math.random() * 30)
          : d.stageIdx === 5
            ? -Math.floor(Math.random() * 60)
            : Math.floor(Math.random() * 90) + 10;
      return prisma.deal.create({
        data: {
          name: d.name,
          amount: d.amount,
          currency: "JPY",
          closeDate: new Date(
            Date.now() + closeDateOffset * 24 * 60 * 60 * 1000
          ),
          probability: stage.probability,
          stageId: stage.id,
          pipelineId: pipeline.id,
          ownerId: randomUser(),
          companyId: companies[d.companyIdx].id,
          priority:
            d.amount >= 20000000
              ? "HIGH"
              : d.amount >= 5000000
                ? "MEDIUM"
                : "LOW",
        },
      });
    })
  );

  // ===================== DEAL CONTACTS =====================
  console.log("Creating deal-contact associations...");
  const dealContactPairs: { dealId: string; contactId: string }[] = [];
  deals.forEach((deal, i) => {
    // Link primary contact (same company index)
    const primaryContactIdx = dealData[i].companyIdx % contacts.length;
    dealContactPairs.push({
      dealId: deal.id,
      contactId: contacts[primaryContactIdx].id,
    });
    // Some deals get a second contact
    if (i % 3 === 0) {
      const secondaryIdx = (primaryContactIdx + 1) % contacts.length;
      dealContactPairs.push({
        dealId: deal.id,
        contactId: contacts[secondaryIdx].id,
      });
    }
  });

  await prisma.dealContact.createMany({
    data: dealContactPairs,
  });

  // ===================== TICKETS =====================
  console.log("Creating tickets...");
  const ticketData = [
    {
      subject: "ログインできない",
      description:
        "パスワードリセット後もログインが失敗する。エラーコード: AUTH_FAILED_003",
      status: "OPEN" as const,
      priority: "HIGH" as const,
      category: "認証",
      stageIdx: 0,
    },
    {
      subject: "メール送信エラー",
      description:
        "一括メール送信時にタイムアウトエラーが発生する。100件以上で再現。",
      status: "IN_PROGRESS" as const,
      priority: "URGENT" as const,
      category: "メール",
      stageIdx: 1,
    },
    {
      subject: "データ同期の遅延",
      description:
        "外部APIとのデータ同期が30分以上遅延している。通常は5分以内。",
      status: "IN_PROGRESS" as const,
      priority: "HIGH" as const,
      category: "同期",
      stageIdx: 1,
    },
    {
      subject: "レポート出力が空になる",
      description:
        "月次レポートをPDF出力すると空のファイルが生成される。Excel出力は正常。",
      status: "WAITING" as const,
      priority: "MEDIUM" as const,
      category: "レポート",
      stageIdx: 2,
    },
    {
      subject: "ダッシュボードの表示崩れ",
      description:
        "Chrome最新版でダッシュボードのグラフが正しく表示されない。Firefox/Safariは正常。",
      status: "OPEN" as const,
      priority: "LOW" as const,
      category: "UI",
      stageIdx: 0,
    },
    {
      subject: "APIレートリミット超過",
      description:
        "外部連携APIのレートリミットに頻繁に到達する。利用量の見直しが必要。",
      status: "CLOSED" as const,
      priority: "MEDIUM" as const,
      category: "API",
      stageIdx: 3,
    },
    {
      subject: "ファイルアップロード失敗",
      description:
        "10MB以上のファイルアップロードが途中で失敗する。タイムアウト設定の問題か。",
      status: "IN_PROGRESS" as const,
      priority: "HIGH" as const,
      category: "ストレージ",
      stageIdx: 1,
    },
    {
      subject: "通知が届かない",
      description:
        "メール通知とアプリ内通知が一部のユーザーに届いていない。設定は有効になっている。",
      status: "OPEN" as const,
      priority: "MEDIUM" as const,
      category: "通知",
      stageIdx: 0,
    },
    {
      subject: "検索結果が不正確",
      description:
        "顧客名で検索しても該当するレコードが表示されないケースがある。インデックスの問題か。",
      status: "WAITING" as const,
      priority: "LOW" as const,
      category: "検索",
      stageIdx: 2,
    },
    {
      subject: "権限設定の不具合",
      description:
        "一般ユーザーが管理者メニューにアクセスできてしまう。ロールベースアクセス制御の確認が必要。",
      status: "CLOSED" as const,
      priority: "URGENT" as const,
      category: "セキュリティ",
      stageIdx: 3,
    },
    {
      subject: "CSV インポートエラー",
      description:
        "特定のCSVフォーマットでインポート時にエンコーディングエラーが発生する。UTF-8 BOM付きで再現。",
      status: "IN_PROGRESS" as const,
      priority: "MEDIUM" as const,
      category: "データ",
      stageIdx: 1,
    },
    {
      subject: "モバイル表示の最適化要望",
      description:
        "スマートフォンでの表示が最適化されておらず、操作しづらいというフィードバック多数。",
      status: "OPEN" as const,
      priority: "LOW" as const,
      category: "UI",
      stageIdx: 0,
    },
  ];

  const tickets = await Promise.all(
    ticketData.map((t, i) =>
      prisma.ticket.create({
        data: {
          subject: t.subject,
          description: t.description,
          status: t.status,
          priority: t.priority,
          category: t.category,
          ownerId: randomUser(),
          contactId: contacts[i % contacts.length].id,
          companyId: companies[i % companies.length].id,
          pipelineId: ticketPipeline.id,
          stageId: ticketStages[t.stageIdx].id,
          slaDeadline: new Date(
            Date.now() +
              (t.priority === "URGENT"
                ? 1
                : t.priority === "HIGH"
                  ? 3
                  : t.priority === "MEDIUM"
                    ? 7
                    : 14) *
                24 *
                60 *
                60 *
                1000
          ),
          closedAt:
            t.status === "CLOSED"
              ? new Date(
                  Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
                )
              : null,
        },
      })
    )
  );

  // ===================== TASKS =====================
  console.log("Creating tasks...");
  const taskData: Array<{
    title: string;
    description: string;
    type: "TODO" | "CALL" | "EMAIL" | "MEETING" | "FOLLOW_UP";
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "DEFERRED";
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDaysOffset: number;
  }> = [
    {
      title: "山本様への提案資料作成",
      description: "クラウド基盤構築の提案書を作成する",
      type: "TODO",
      status: "IN_PROGRESS",
      priority: "HIGH",
      dueDaysOffset: 3,
    },
    {
      title: "佐々木様フォローアップコール",
      description: "CRM導入の進捗確認と追加要件のヒアリング",
      type: "CALL",
      status: "NOT_STARTED",
      priority: "MEDIUM",
      dueDaysOffset: 1,
    },
    {
      title: "田中様へお見積もりメール送付",
      description: "デジタルマーケティング支援の見積もりを送付する",
      type: "EMAIL",
      status: "COMPLETED",
      priority: "HIGH",
      dueDaysOffset: -2,
    },
    {
      title: "中村様との打ち合わせ",
      description: "基幹システム刷新の要件定義ミーティング",
      type: "MEETING",
      status: "NOT_STARTED",
      priority: "HIGH",
      dueDaysOffset: 5,
    },
    {
      title: "小林様案件フォローアップ",
      description: "ECサイトリニューアルの契約条件再確認",
      type: "FOLLOW_UP",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      dueDaysOffset: 2,
    },
    {
      title: "加藤様へセキュリティ監査報告書送付",
      description: "完了したセキュリティ監査の報告書を送付する",
      type: "EMAIL",
      status: "COMPLETED",
      priority: "MEDIUM",
      dueDaysOffset: -5,
    },
    {
      title: "渡辺様とのデータ分析基盤要件ヒアリング",
      description: "北海道フーズのデータ分析要件をヒアリング",
      type: "CALL",
      status: "NOT_STARTED",
      priority: "HIGH",
      dueDaysOffset: 7,
    },
    {
      title: "松本様IoT提案準備",
      description: "IoTシステムの技術検証結果をまとめる",
      type: "TODO",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      dueDaysOffset: 4,
    },
    {
      title: "井上様物流システムデモ準備",
      description: "物流管理システムのデモ環境をセットアップ",
      type: "TODO",
      status: "NOT_STARTED",
      priority: "HIGH",
      dueDaysOffset: 6,
    },
    {
      title: "木村様AI導入ミーティング",
      description: "AI導入コンサルティングの初回ヒアリング",
      type: "MEETING",
      status: "COMPLETED",
      priority: "MEDIUM",
      dueDaysOffset: -3,
    },
    {
      title: "吉田様採用管理システムフォロー",
      description: "導入後の運用状況確認とサポート",
      type: "FOLLOW_UP",
      status: "DEFERRED",
      priority: "LOW",
      dueDaysOffset: 10,
    },
    {
      title: "高橋様ブランディング要件確認",
      description: "デザインコンセプトの方向性について確認",
      type: "CALL",
      status: "NOT_STARTED",
      priority: "MEDIUM",
      dueDaysOffset: 2,
    },
    {
      title: "月次レポート作成",
      description: "今月の営業活動の月次レポートを作成する",
      type: "TODO",
      status: "NOT_STARTED",
      priority: "LOW",
      dueDaysOffset: 14,
    },
    {
      title: "チーム定例会議の議事録作成",
      description: "先週のチーム定例で決まった事項を議事録にまとめる",
      type: "TODO",
      status: "COMPLETED",
      priority: "LOW",
      dueDaysOffset: -1,
    },
    {
      title: "前田様への新商品企画フォロー",
      description: "新商品企画のシステム連携について確認する",
      type: "FOLLOW_UP",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      dueDaysOffset: 3,
    },
  ];

  const tasks = await Promise.all(
    taskData.map((t, i) =>
      prisma.task.create({
        data: {
          title: t.title,
          description: t.description,
          dueDate: new Date(
            Date.now() + t.dueDaysOffset * 24 * 60 * 60 * 1000
          ),
          priority: t.priority,
          status: t.status,
          type: t.type,
          ownerId: randomUser(),
          contactId: contacts[i % contacts.length].id,
        },
      })
    )
  );

  // ===================== ACTIVITIES =====================
  console.log("Creating activities...");
  const activityData: Array<{
    type:
      | "EMAIL"
      | "CALL"
      | "MEETING"
      | "NOTE"
      | "DEAL_CREATED"
      | "TICKET_CREATED"
      | "FORM_SUBMISSION"
      | "PAGE_VIEW"
      | "LIFECYCLE_CHANGE";
    subject: string;
    body: string;
    contactIdx: number;
    dealIdx?: number;
    ticketIdx?: number;
    daysAgo: number;
  }> = [
    {
      type: "EMAIL",
      subject: "提案資料送付",
      body: "クラウド基盤構築プロジェクトの提案資料を送付しました。ご確認をお願いいたします。",
      contactIdx: 0,
      dealIdx: 0,
      daysAgo: 2,
    },
    {
      type: "CALL",
      subject: "初回ヒアリングコール",
      body: "CRMシステム導入について30分のヒアリングを実施。現行システムの課題と要件をヒアリング。",
      contactIdx: 1,
      dealIdx: 1,
      daysAgo: 5,
    },
    {
      type: "MEETING",
      subject: "要件定義ミーティング",
      body: "ECサイトリニューアルの要件定義ミーティングを実施。画面遷移図とワイヤーフレームを共有。",
      contactIdx: 4,
      dealIdx: 3,
      daysAgo: 3,
    },
    {
      type: "NOTE",
      subject: "商談メモ",
      body: "田中様はデジタルマーケティングのROI改善に強い関心を持っている。具体的なKPI設定を提案予定。",
      contactIdx: 2,
      dealIdx: 2,
      daysAgo: 1,
    },
    {
      type: "DEAL_CREATED",
      subject: "案件作成: クラウド基盤構築プロジェクト",
      body: "新規案件が作成されました。金額: ¥15,000,000",
      contactIdx: 0,
      dealIdx: 0,
      daysAgo: 30,
    },
    {
      type: "DEAL_CREATED",
      subject: "案件作成: 基幹システム刷新",
      body: "新規案件が作成されました。金額: ¥50,000,000",
      contactIdx: 3,
      dealIdx: 4,
      daysAgo: 45,
    },
    {
      type: "TICKET_CREATED",
      subject: "チケット作成: ログインできない",
      body: "サポートチケットが作成されました。優先度: HIGH",
      contactIdx: 0,
      ticketIdx: 0,
      daysAgo: 1,
    },
    {
      type: "TICKET_CREATED",
      subject: "チケット作成: メール送信エラー",
      body: "サポートチケットが作成されました。優先度: URGENT",
      contactIdx: 1,
      ticketIdx: 1,
      daysAgo: 2,
    },
    {
      type: "EMAIL",
      subject: "見積書送付",
      body: "データ分析基盤構築の見積書を送付しました。ご検討のほどよろしくお願いいたします。",
      contactIdx: 6,
      dealIdx: 6,
      daysAgo: 7,
    },
    {
      type: "CALL",
      subject: "フォローアップコール",
      body: "物流管理システムの交渉状況確認。契約条件の最終調整中。来週中に最終回答予定。",
      contactIdx: 8,
      dealIdx: 8,
      daysAgo: 1,
    },
    {
      type: "MEETING",
      subject: "AI導入キックオフ",
      body: "AI導入コンサルティングのキックオフミーティング。プロジェクトスコープと体制を確認。",
      contactIdx: 9,
      dealIdx: 9,
      daysAgo: 10,
    },
    {
      type: "FORM_SUBMISSION",
      subject: "お問い合わせフォーム送信",
      body: "三浦彩花様がお問い合わせフォームから資料請求を送信しました。",
      contactIdx: 19,
      daysAgo: 15,
    },
    {
      type: "PAGE_VIEW",
      subject: "料金ページ閲覧",
      body: "小野海斗様が料金プランページを閲覧しました。閲覧時間: 3分42秒",
      contactIdx: 15,
      daysAgo: 1,
    },
    {
      type: "LIFECYCLE_CHANGE",
      subject: "ライフサイクル変更: LEAD → MQL",
      body: "加藤美穂様のライフサイクルステージがLEADからMQLに変更されました。",
      contactIdx: 5,
      daysAgo: 8,
    },
    {
      type: "EMAIL",
      subject: "契約書送付",
      body: "セキュリティ監査の契約書を送付しました。ご確認・押印をお願いいたします。",
      contactIdx: 5,
      dealIdx: 5,
      daysAgo: 14,
    },
    {
      type: "CALL",
      subject: "サポート対応コール",
      body: "データ同期遅延の問題について技術サポートチームと連携して対応中。原因調査の進捗を報告。",
      contactIdx: 2,
      ticketIdx: 2,
      daysAgo: 1,
    },
    {
      type: "NOTE",
      subject: "競合情報メモ",
      body: "ネクストイノベーション社は他社のAIソリューションも検討中。価格面での優位性をアピールする必要あり。",
      contactIdx: 9,
      dealIdx: 9,
      daysAgo: 5,
    },
    {
      type: "MEETING",
      subject: "デモンストレーション",
      body: "採用管理システムのデモを実施。ヒューマンリソース社の人事部門3名が参加。好感触。",
      contactIdx: 10,
      dealIdx: 10,
      daysAgo: 12,
    },
    {
      type: "EMAIL",
      subject: "技術仕様書共有",
      body: "IoTシステム開発の技術仕様書を共有しました。次回ミーティングまでにご確認をお願いします。",
      contactIdx: 7,
      dealIdx: 7,
      daysAgo: 4,
    },
    {
      type: "LIFECYCLE_CHANGE",
      subject: "ライフサイクル変更: SQL → OPPORTUNITY",
      body: "山本太郎様のライフサイクルステージがSQLからOPPORTUNITYに変更されました。",
      contactIdx: 0,
      daysAgo: 20,
    },
  ];

  await Promise.all(
    activityData.map((a) =>
      prisma.activity.create({
        data: {
          type: a.type,
          subject: a.subject,
          body: a.body,
          userId: randomUser(),
          contactId: contacts[a.contactIdx].id,
          dealId: a.dealIdx !== undefined ? deals[a.dealIdx].id : null,
          ticketId: a.ticketIdx !== undefined ? tickets[a.ticketIdx].id : null,
          createdAt: new Date(
            Date.now() - a.daysAgo * 24 * 60 * 60 * 1000
          ),
        },
      })
    )
  );

  // ===================== NOTES =====================
  console.log("Creating notes...");
  const noteData = [
    {
      body: "山本様はクラウド移行に積極的。AWS/GCPの比較検討を希望している。技術的な判断は林様にも確認が必要。",
      contactIdx: 0,
      companyIdx: 0,
      dealIdx: 0,
    },
    {
      body: "佐々木様はプロジェクト管理の経験が豊富。Salesforceからの乗り換えを検討中。データ移行の工数を別途見積もる必要あり。",
      contactIdx: 1,
      companyIdx: 1,
      dealIdx: 1,
    },
    {
      body: "富士マーケティングはSNS広告の効果に課題を感じている。Google広告とMeta広告の最適化を提案予定。",
      contactIdx: 2,
      companyIdx: 2,
      dealIdx: 2,
    },
    {
      body: "大和建設は来期の予算策定中。基幹システム刷新は4月以降の実施を想定。それまでにPoC実施を提案する。",
      contactIdx: 3,
      companyIdx: 3,
      dealIdx: 4,
    },
    {
      body: "グローバルロジスティクスの井上様は海外拠点との連携に課題あり。多言語対応と時差を考慮したシステム設計が必要。",
      contactIdx: 8,
      companyIdx: 8,
      dealIdx: 8,
    },
    {
      body: "ネクストイノベーション木村代表との面談メモ。AI活用による業務効率化に強い関心。まずはチャットボット導入から検討。",
      contactIdx: 9,
      companyIdx: 9,
      dealIdx: 9,
    },
    {
      body: "ヒューマンリソース社の吉田様。採用管理システム導入後、応募者管理の工数が50%削減されたとのフィードバック。事例として活用可能。",
      contactIdx: 10,
      companyIdx: 10,
      dealIdx: 10,
    },
    {
      body: "クリエイティブデザイン高橋様。ブランディングサイトのデザインコンセプトは「シンプルかつ先進的」。参考サイトを3つ共有済み。",
      contactIdx: 11,
      companyIdx: 11,
      dealIdx: 11,
    },
    {
      body: "北海道フーズ渡辺様との技術ミーティングメモ。現行のデータウェアハウスはRedshift。BigQueryへの移行を含めて提案する。",
      contactIdx: 6,
      companyIdx: 6,
      dealIdx: 6,
    },
    {
      body: "関西エレクトロニクス松本様。IoTデバイスからのデータ収集にMQTTプロトコルを使用中。既存インフラとの統合が鍵。",
      contactIdx: 7,
      companyIdx: 7,
      dealIdx: 7,
    },
  ];

  await Promise.all(
    noteData.map((n) =>
      prisma.note.create({
        data: {
          body: n.body,
          userId: randomUser(),
          contactId: contacts[n.contactIdx].id,
          companyId: companies[n.companyIdx].id,
          dealId: deals[n.dealIdx].id,
        },
      })
    )
  );

  // ===================== EMAIL TEMPLATES =====================
  console.log("Creating email templates...");
  const emailTemplates = await Promise.all([
    prisma.emailTemplate.create({
      data: {
        name: "初回お問い合わせ返信",
        subject: "お問い合わせありがとうございます",
        body: "{{contact.lastName}}様\n\nこの度はお問い合わせいただき、誠にありがとうございます。\n\nご質問の内容について、担当者より改めてご連絡させていただきます。\n通常、1〜2営業日以内にご回答いたします。\n\n何かご不明な点がございましたら、お気軽にお問い合わせください。\n\nよろしくお願いいたします。",
        category: "フォローアップ",
      },
    }),
    prisma.emailTemplate.create({
      data: {
        name: "商談御礼メール",
        subject: "本日はお時間をいただきありがとうございました",
        body: "{{contact.lastName}}様\n\n本日はお忙しい中、お時間をいただき誠にありがとうございました。\n\nお打ち合わせでお話しいただいた内容を基に、ご提案資料を作成いたします。\n来週中にはお送りできる予定ですので、今しばらくお待ちください。\n\n引き続きよろしくお願いいたします。",
        category: "営業",
      },
    }),
    prisma.emailTemplate.create({
      data: {
        name: "見積書送付",
        subject: "お見積書のご送付",
        body: "{{contact.lastName}}様\n\nいつもお世話になっております。\n\nご依頼いただいておりましたお見積書を添付にてお送りいたします。\n\nお見積もり内容にご不明な点がございましたら、\nお気軽にお問い合わせください。\n\nご検討のほど、よろしくお願いいたします。",
        category: "営業",
      },
    }),
    prisma.emailTemplate.create({
      data: {
        name: "セミナー案内",
        subject: "【ご案内】無料オンラインセミナーのお知らせ",
        body: "{{contact.lastName}}様\n\nいつもお世話になっております。\n\n下記のとおり、無料オンラインセミナーを開催いたします。\n\n■テーマ: DX推進のための最新テクノロジー活用術\n■日時: {{seminar.date}}\n■場所: オンライン（Zoom）\n■参加費: 無料\n\nお申し込みは下記URLよりお願いいたします。\n{{seminar.url}}\n\n皆様のご参加をお待ちしております。",
        category: "マーケティング",
      },
    }),
    prisma.emailTemplate.create({
      data: {
        name: "契約更新のご案内",
        subject: "サービス契約更新のご案内",
        body: "{{contact.lastName}}様\n\nいつもご利用いただき、誠にありがとうございます。\n\nご契約いただいておりますサービスの契約期間が\n{{contract.endDate}}に満了となります。\n\n引き続きご利用いただける場合は、\n更新のお手続きをお願いいたします。\n\nご不明な点がございましたら、担当までお気軽にご連絡ください。",
        category: "カスタマーサクセス",
      },
    }),
  ]);

  // ===================== EMAIL CAMPAIGNS =====================
  console.log("Creating email campaigns...");
  const campaignData: Array<{
    name: string;
    status: "DRAFT" | "SCHEDULED" | "SENDING" | "SENT" | "CANCELLED";
    templateIdx: number;
    scheduledOffset?: number;
    sentOffset?: number;
  }> = [
    {
      name: "2026年春のDXセミナー案内",
      status: "SENT",
      templateIdx: 3,
      sentOffset: -14,
    },
    {
      name: "新サービスリリースのお知らせ",
      status: "SENT",
      templateIdx: 0,
      sentOffset: -7,
    },
    {
      name: "年度末キャンペーン",
      status: "SENT",
      templateIdx: 2,
      sentOffset: -3,
    },
    {
      name: "4月セミナー案内",
      status: "SCHEDULED",
      templateIdx: 3,
      scheduledOffset: 15,
    },
    {
      name: "契約更新案内（3月分）",
      status: "SENDING",
      templateIdx: 4,
    },
    {
      name: "ホワイトペーパー配布",
      status: "DRAFT",
      templateIdx: 0,
    },
    {
      name: "顧客満足度アンケート",
      status: "DRAFT",
      templateIdx: 0,
    },
    {
      name: "夏季キャンペーン企画",
      status: "CANCELLED",
      templateIdx: 3,
    },
  ];

  const campaigns = await Promise.all(
    campaignData.map((c) =>
      prisma.emailCampaign.create({
        data: {
          name: c.name,
          status: c.status,
          templateId: emailTemplates[c.templateIdx].id,
          scheduledAt: c.scheduledOffset
            ? new Date(
                Date.now() + c.scheduledOffset * 24 * 60 * 60 * 1000
              )
            : null,
          sentAt: c.sentOffset
            ? new Date(
                Date.now() + c.sentOffset * 24 * 60 * 60 * 1000
              )
            : null,
        },
      })
    )
  );

  // Campaign stats for sent/sending campaigns
  const campaignStatsData = [
    {
      campaignIdx: 0,
      sent: 450,
      delivered: 438,
      opened: 189,
      clicked: 67,
      bounced: 12,
      unsubscribed: 3,
    },
    {
      campaignIdx: 1,
      sent: 320,
      delivered: 312,
      opened: 156,
      clicked: 89,
      bounced: 8,
      unsubscribed: 2,
    },
    {
      campaignIdx: 2,
      sent: 280,
      delivered: 275,
      opened: 132,
      clicked: 45,
      bounced: 5,
      unsubscribed: 1,
    },
    {
      campaignIdx: 4,
      sent: 150,
      delivered: 120,
      opened: 45,
      clicked: 12,
      bounced: 3,
      unsubscribed: 0,
    },
  ];

  await Promise.all(
    campaignStatsData.map((s) =>
      prisma.emailCampaignStats.create({
        data: {
          campaignId: campaigns[s.campaignIdx].id,
          sent: s.sent,
          delivered: s.delivered,
          opened: s.opened,
          clicked: s.clicked,
          bounced: s.bounced,
          unsubscribed: s.unsubscribed,
        },
      })
    )
  );

  // ===================== FORMS =====================
  console.log("Creating forms...");
  const formData = [
    {
      name: "お問い合わせフォーム",
      fields: [
        { name: "lastName", label: "姓", type: "text", required: true },
        { name: "firstName", label: "名", type: "text", required: true },
        { name: "email", label: "メールアドレス", type: "email", required: true },
        { name: "company", label: "会社名", type: "text", required: true },
        { name: "phone", label: "電話番号", type: "tel", required: false },
        { name: "message", label: "お問い合わせ内容", type: "textarea", required: true },
      ],
      submissions: 145,
    },
    {
      name: "資料請求フォーム",
      fields: [
        { name: "lastName", label: "姓", type: "text", required: true },
        { name: "firstName", label: "名", type: "text", required: true },
        { name: "email", label: "メールアドレス", type: "email", required: true },
        { name: "company", label: "会社名", type: "text", required: true },
        { name: "jobTitle", label: "役職", type: "text", required: false },
        { name: "material", label: "希望資料", type: "select", required: true, options: ["製品カタログ", "導入事例集", "料金表", "ホワイトペーパー"] },
      ],
      submissions: 89,
    },
    {
      name: "セミナー申込フォーム",
      fields: [
        { name: "lastName", label: "姓", type: "text", required: true },
        { name: "firstName", label: "名", type: "text", required: true },
        { name: "email", label: "メールアドレス", type: "email", required: true },
        { name: "company", label: "会社名", type: "text", required: true },
        { name: "seminarDate", label: "参加希望日", type: "date", required: true },
        { name: "questions", label: "事前質問", type: "textarea", required: false },
      ],
      submissions: 67,
    },
    {
      name: "無料トライアル申込",
      fields: [
        { name: "lastName", label: "姓", type: "text", required: true },
        { name: "firstName", label: "名", type: "text", required: true },
        { name: "email", label: "ビジネスメール", type: "email", required: true },
        { name: "company", label: "会社名", type: "text", required: true },
        { name: "employeeCount", label: "従業員数", type: "select", required: true, options: ["1-10", "11-50", "51-200", "201-500", "501+"] },
        { name: "useCase", label: "利用目的", type: "textarea", required: true },
      ],
      submissions: 34,
    },
    {
      name: "顧客満足度アンケート",
      fields: [
        { name: "satisfaction", label: "総合満足度", type: "rating", required: true },
        { name: "nps", label: "推奨度(0-10)", type: "number", required: true },
        { name: "goodPoints", label: "良い点", type: "textarea", required: false },
        { name: "improvements", label: "改善点", type: "textarea", required: false },
        { name: "continueUsing", label: "継続利用意向", type: "select", required: true, options: ["はい", "検討中", "いいえ"] },
      ],
      submissions: 52,
    },
    {
      name: "パートナー申込フォーム",
      fields: [
        { name: "companyName", label: "会社名", type: "text", required: true },
        { name: "contactName", label: "担当者名", type: "text", required: true },
        { name: "email", label: "メールアドレス", type: "email", required: true },
        { name: "website", label: "Webサイト", type: "url", required: true },
        { name: "partnerType", label: "パートナー種別", type: "select", required: true, options: ["販売代理店", "技術パートナー", "コンサルティング"] },
        { name: "description", label: "事業内容", type: "textarea", required: true },
      ],
      submissions: 18,
    },
  ];

  await Promise.all(
    formData.map((f) =>
      prisma.form.create({
        data: {
          name: f.name,
          fields: f.fields,
          settings: { redirectUrl: "/thank-you", sendNotification: true },
          submissions: f.submissions,
        },
      })
    )
  );

  // ===================== LANDING PAGES =====================
  console.log("Creating landing pages...");
  const landingPageData = [
    {
      title: "製品概要 - クラウドCRMプラットフォーム",
      slug: "product-overview",
      published: true,
      views: 3245,
      conversions: 189,
      content: {
        hero: { heading: "ビジネスを加速するクラウドCRM", subheading: "顧客管理・営業支援・マーケティングを一つのプラットフォームで" },
        features: ["顧客管理", "営業パイプライン", "メールマーケティング", "レポート・分析"],
      },
    },
    {
      title: "料金プラン",
      slug: "pricing",
      published: true,
      views: 2156,
      conversions: 95,
      content: {
        plans: [
          { name: "スターター", price: 9800, features: ["5ユーザー", "1,000コンタクト", "基本レポート"] },
          { name: "プロフェッショナル", price: 29800, features: ["25ユーザー", "10,000コンタクト", "高度なレポート", "マーケティング"] },
          { name: "エンタープライズ", price: 98000, features: ["無制限ユーザー", "無制限コンタクト", "全機能", "専任サポート"] },
        ],
      },
    },
    {
      title: "DXセミナー2026春 申込ページ",
      slug: "dx-seminar-2026-spring",
      published: true,
      views: 876,
      conversions: 67,
      content: {
        event: { title: "DX推進のための最新テクノロジー活用術", date: "2026-04-15", location: "オンライン" },
        speakers: [{ name: "佐藤匠", title: "CTO" }],
      },
    },
    {
      title: "導入事例集ダウンロード",
      slug: "case-studies",
      published: true,
      views: 1534,
      conversions: 234,
      content: {
        heading: "100社以上の導入事例をご紹介",
        categories: ["IT・通信", "製造業", "金融", "小売"],
      },
    },
    {
      title: "無料トライアル申込",
      slug: "free-trial",
      published: false,
      views: 456,
      conversions: 34,
      content: {
        heading: "14日間無料でお試しください",
        benefits: ["クレジットカード不要", "全機能利用可能", "データ移行サポート"],
      },
    },
  ];

  await Promise.all(
    landingPageData.map((lp) =>
      prisma.landingPage.create({
        data: {
          title: lp.title,
          slug: lp.slug,
          content: lp.content,
          published: lp.published,
          views: lp.views,
          conversions: lp.conversions,
        },
      })
    )
  );

  // ===================== KNOWLEDGE BASE ARTICLES =====================
  console.log("Creating knowledge base articles...");
  const articleData = [
    {
      title: "初期設定ガイド",
      body: "## はじめに\n\n本ガイドでは、CRMプラットフォームの初期設定手順について説明します。\n\n### 1. アカウント作成\n管理者アカウントを作成し、組織情報を設定します。\n\n### 2. ユーザー招待\nチームメンバーを招待し、適切なロールを割り当てます。\n\n### 3. パイプライン設定\n営業プロセスに合わせてパイプラインのステージを設定します。\n\n### 4. データインポート\n既存の顧客データをCSVファイルからインポートします。",
      category: "はじめに",
      published: true,
      views: 1234,
      helpful: 89,
      notHelpful: 5,
    },
    {
      title: "コンタクト管理の基本",
      body: "## コンタクト管理\n\nコンタクトは顧客情報の基本単位です。\n\n### コンタクトの作成\n- 手動作成: 「新規コンタクト」ボタンから作成\n- インポート: CSVファイルから一括インポート\n- フォーム: ウェブフォームからの自動作成\n\n### ライフサイクルステージ\nコンタクトの状態を管理するためのステージ:\n- Subscriber → Lead → MQL → SQL → Opportunity → Customer\n\n### プロパティ管理\nカスタムプロパティを追加して、必要な情報を管理できます。",
      category: "コンタクト",
      published: true,
      views: 987,
      helpful: 76,
      notHelpful: 3,
    },
    {
      title: "営業パイプラインの設定と活用",
      body: "## 営業パイプライン\n\n営業プロセスを可視化し、案件を効率的に管理します。\n\n### パイプラインの設定\n1. 設定画面から「パイプライン」を選択\n2. ステージを追加・編集\n3. 各ステージの成約確率を設定\n\n### 案件(Deal)の管理\n- ドラッグ&ドロップでステージを移動\n- 金額・期日・担当者を設定\n- コンタクト・会社との関連付け\n\n### レポート\n- パイプラインの全体像を把握\n- ステージごとの案件数と金額を確認\n- 予測売上を算出",
      category: "営業",
      published: true,
      views: 756,
      helpful: 65,
      notHelpful: 8,
    },
    {
      title: "メールマーケティングの始め方",
      body: "## メールマーケティング\n\n### テンプレート作成\n1. マーケティング > メールテンプレートを選択\n2. テンプレート名とカテゴリを設定\n3. 件名と本文を作成\n4. パーソナライズトークンを活用\n\n### キャンペーン配信\n1. 新規キャンペーンを作成\n2. テンプレートを選択\n3. 配信対象を設定\n4. 配信日時を指定または即時配信\n\n### 効果測定\n- 開封率、クリック率を確認\n- A/Bテストで最適化\n- コンバージョン追跡",
      category: "マーケティング",
      published: true,
      views: 543,
      helpful: 42,
      notHelpful: 6,
    },
    {
      title: "チケット管理とカスタマーサポート",
      body: "## チケット管理\n\n### チケットの作成\n- 手動作成: サポート画面から新規作成\n- メール連携: 受信メールから自動作成\n- フォーム: お問い合わせフォームから作成\n\n### ステータス管理\n- 新規 → 対応中 → 確認待ち → 解決済み\n- SLA設定で対応期限を管理\n\n### 優先度設定\n- URGENT: 4時間以内に対応\n- HIGH: 24時間以内に対応\n- MEDIUM: 3営業日以内に対応\n- LOW: 1週間以内に対応",
      category: "サポート",
      published: true,
      views: 432,
      helpful: 38,
      notHelpful: 2,
    },
    {
      title: "レポートとダッシュボードの活用",
      body: "## レポート機能\n\n### 標準レポート\n- 営業パフォーマンスレポート\n- コンタクト分析レポート\n- マーケティングROIレポート\n- チケット対応状況レポート\n\n### カスタムダッシュボード\n1. ダッシュボード画面で「新規作成」\n2. ウィジェットを追加\n3. フィルターと期間を設定\n4. チームと共有\n\n### データエクスポート\n- CSV/Excel形式でエクスポート\n- 定期レポートの自動配信設定",
      category: "レポート",
      published: true,
      views: 321,
      helpful: 28,
      notHelpful: 4,
    },
    {
      title: "API連携ガイド",
      body: "## API連携\n\n### 認証\nAPIキーを使用してリクエストを認証します。\n\n```\nAuthorization: Bearer YOUR_API_KEY\n```\n\n### エンドポイント\n- GET /api/contacts - コンタクト一覧\n- POST /api/contacts - コンタクト作成\n- GET /api/deals - 案件一覧\n- POST /api/deals - 案件作成\n\n### レートリミット\n- 100リクエスト/分\n- 10,000リクエスト/日\n\n### Webhook\nイベント発生時に指定URLへ通知を送信します。",
      category: "開発者向け",
      published: true,
      views: 234,
      helpful: 21,
      notHelpful: 3,
    },
    {
      title: "データのインポートとエクスポート",
      body: "## データ管理\n\n### インポート\n1. CSV/Excelファイルを準備\n2. ファイルをアップロード\n3. カラムマッピングを設定\n4. プレビューで確認\n5. インポート実行\n\n### 対応フォーマット\n- CSV (UTF-8推奨)\n- Excel (.xlsx)\n- 最大ファイルサイズ: 50MB\n- 最大行数: 100,000行\n\n### エクスポート\n- フィルター適用後のデータをエクスポート\n- 全フィールドまたは選択フィールド\n- CSV/Excel形式を選択",
      category: "データ管理",
      published: false,
      views: 156,
      helpful: 15,
      notHelpful: 1,
    },
  ];

  await Promise.all(
    articleData.map((a) =>
      prisma.knowledgeBaseArticle.create({
        data: {
          title: a.title,
          body: a.body,
          category: a.category,
          published: a.published,
          views: a.views,
          helpful: a.helpful,
          notHelpful: a.notHelpful,
        },
      })
    )
  );

  console.log("✅ Seeding complete!");
  console.log(`  - ${users.length} users`);
  console.log(`  - 1 pipeline with ${stages.length} stages`);
  console.log(`  - 1 ticket pipeline with ${ticketStages.length} stages`);
  console.log(`  - ${companies.length} companies`);
  console.log(`  - ${contacts.length} contacts`);
  console.log(`  - ${deals.length} deals`);
  console.log(`  - ${dealContactPairs.length} deal-contact associations`);
  console.log(`  - ${tickets.length} tickets`);
  console.log(`  - ${taskData.length} tasks`);
  console.log(`  - ${activityData.length} activities`);
  console.log(`  - ${noteData.length} notes`);
  console.log(`  - ${emailTemplates.length} email templates`);
  console.log(`  - ${campaigns.length} email campaigns`);
  console.log(`  - ${campaignStatsData.length} campaign stats`);
  console.log(`  - ${formData.length} forms`);
  console.log(`  - ${landingPageData.length} landing pages`);
  console.log(`  - ${articleData.length} knowledge base articles`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
