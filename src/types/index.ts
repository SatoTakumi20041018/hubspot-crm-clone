export type NavItem = {
  title: string;
  href: string;
  icon: string;
  children?: NavItem[];
};

export type DashboardMetric = {
  label: string;
  value: number | string;
  change?: number;
  changeType?: "increase" | "decrease";
  icon?: string;
};

export type PipelineView = "board" | "list" | "table";

export type ContactWithRelations = {
  id: string;
  email: string | null;
  firstName: string;
  lastName: string;
  phone: string | null;
  jobTitle: string | null;
  avatar: string | null;
  lifecycleStage: string;
  leadStatus: string | null;
  source: string | null;
  ownerId: string | null;
  companyId: string | null;
  createdAt: string;
  updatedAt: string;
  company?: { id: string; name: string } | null;
  owner?: { id: string; name: string | null } | null;
  _count?: { deals: number; tickets: number; tasks: number; activities: number };
};

export type DealWithRelations = {
  id: string;
  name: string;
  amount: number | null;
  currency: string;
  closeDate: string | null;
  probability: number | null;
  stageId: string;
  pipelineId: string;
  ownerId: string | null;
  companyId: string | null;
  priority: string;
  createdAt: string;
  updatedAt: string;
  stage: { id: string; name: string; color: string; probability: number };
  pipeline: { id: string; name: string };
  owner?: { id: string; name: string | null } | null;
  company?: { id: string; name: string } | null;
  contacts?: { contact: { id: string; firstName: string; lastName: string } }[];
};

export type TicketWithRelations = {
  id: string;
  subject: string;
  description: string | null;
  status: string;
  priority: string;
  category: string | null;
  ownerId: string | null;
  contactId: string | null;
  companyId: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: { id: string; name: string | null } | null;
  contact?: { id: string; firstName: string; lastName: string } | null;
  company?: { id: string; name: string } | null;
};
