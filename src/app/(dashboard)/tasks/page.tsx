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
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Phone,
  Mail,
  FileText,
  AlertTriangle,
  X,
  Trash2,
  Download,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type TaskFilter = "all" | "today" | "overdue" | "upcoming";

const savedViews = ["すべてのタスク", "マイタスク"];

interface TaskProperties {
  hs_task_subject?: string;
  hs_task_body?: string;
  hs_task_type?: string;
  hs_task_status?: string;
  hs_task_priority?: string;
  hs_timestamp?: string;
  hubspot_owner_id?: string;
  hs_task_completion_date?: string;
}

interface TaskItem {
  id: string;
  properties: TaskProperties;
  createdAt: string;
  updatedAt: string;
}

interface TasksResponse {
  results: TaskItem[];
  total?: number;
  paging?: {
    next?: {
      after: string;
    };
  };
}

const typeIcon = (type: string) => {
  switch (type?.toUpperCase()) {
    case "CALL":
      return <Phone className="h-4 w-4 text-green-500" />;
    case "EMAIL":
      return <Mail className="h-4 w-4 text-blue-500" />;
    case "TODO":
      return <FileText className="h-4 w-4 text-gray-500" />;
    case "FOLLOW_UP":
      return <Calendar className="h-4 w-4 text-purple-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

const priorityBadgeVariant = (priority: string) => {
  switch (priority?.toUpperCase()) {
    case "HIGH":
    case "高":
      return "danger" as const;
    case "MEDIUM":
    case "中":
      return "warning" as const;
    case "LOW":
    case "低":
      return "default" as const;
    default:
      return "default" as const;
  }
};

const priorityLabel = (priority: string) => {
  switch (priority?.toUpperCase()) {
    case "HIGH":
      return "高";
    case "MEDIUM":
      return "中";
    case "LOW":
      return "低";
    case "高":
    case "中":
    case "低":
      return priority;
    default:
      return priority || "-";
  }
};

function isTaskCompleted(task: TaskItem): boolean {
  const status = task.properties.hs_task_status?.toUpperCase();
  return status === "COMPLETED" || status === "完了" || !!task.properties.hs_task_completion_date;
}

function isTaskOverdue(task: TaskItem): boolean {
  if (isTaskCompleted(task)) return false;
  const dueDate = task.properties.hs_timestamp;
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

function isTaskToday(task: TaskItem): boolean {
  const dueDate = task.properties.hs_timestamp;
  if (!dueDate) return false;
  const today = new Date().toISOString().split("T")[0];
  return new Date(dueDate).toISOString().split("T")[0] === today;
}

function getDueDateLabel(task: TaskItem): string {
  const dueDate = task.properties.hs_timestamp;
  if (!dueDate) return "-";
  const date = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dTarget = new Date(date);
  dTarget.setHours(0, 0, 0, 0);

  if (dTarget.getTime() === today.getTime()) return "今日";
  if (dTarget.getTime() === tomorrow.getTime()) return "明日";
  if (dTarget.getTime() === yesterday.getTime()) return "昨日";
  return date.toLocaleDateString("ja-JP", { month: "long", day: "numeric" });
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
      </div>
      <Card>
        <div className="p-4">
          <div className="h-9 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </Card>
      <div className="flex gap-1 border-b border-gray-200 pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <div className="p-4 flex items-center gap-3">
              <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-7 w-7 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function TasksPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeView, setActiveView] = useState(savedViews[0]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [localPage, setLocalPage] = useState(0);
  const itemsPerPage = 10;

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks?limit=50");
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: TasksResponse = await res.json();
      setTasks(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filterTabs: { key: TaskFilter; label: string; count: number }[] = [
    {
      key: "all",
      label: "すべて",
      count: tasks.filter((t) => !isTaskCompleted(t)).length,
    },
    {
      key: "today",
      label: "今日",
      count: tasks.filter((t) => !isTaskCompleted(t) && isTaskToday(t)).length,
    },
    {
      key: "overdue",
      label: "期限超過",
      count: tasks.filter((t) => isTaskOverdue(t)).length,
    },
    {
      key: "upcoming",
      label: "今後",
      count: tasks.filter(
        (t) => !isTaskCompleted(t) && !isTaskOverdue(t) && !isTaskToday(t) &&
          t.properties.hs_timestamp && new Date(t.properties.hs_timestamp) > new Date()
      ).length,
    },
  ];

  const handleSort = (field: "dueDate" | "priority") => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const priorityOrder: Record<string, number> = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

  const filteredTasks = tasks
    .filter((t) => {
      // Search filter
      if (searchQuery) {
        const subject = (t.properties.hs_task_subject || "").toLowerCase();
        if (!subject.includes(searchQuery.toLowerCase())) return false;
      }
      // Tab filter
      switch (filter) {
        case "today":
          return isTaskToday(t);
        case "overdue":
          return isTaskOverdue(t);
        case "upcoming":
          return !isTaskCompleted(t) && !isTaskOverdue(t) && !isTaskToday(t) &&
            t.properties.hs_timestamp && new Date(t.properties.hs_timestamp) > new Date();
        default:
          return true;
      }
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "dueDate") {
        const dateA = a.properties.hs_timestamp ? new Date(a.properties.hs_timestamp).getTime() : Infinity;
        const dateB = b.properties.hs_timestamp ? new Date(b.properties.hs_timestamp).getTime() : Infinity;
        return (dateA - dateB) * dir;
      }
      if (sortBy === "priority") {
        const pA = priorityOrder[(a.properties.hs_task_priority || "MEDIUM").toUpperCase()] ?? 2;
        const pB = priorityOrder[(b.properties.hs_task_priority || "MEDIUM").toUpperCase()] ?? 2;
        return (pA - pB) * dir;
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(localPage * itemsPerPage, (localPage + 1) * itemsPerPage);

  const toggleTask = async (id: string) => {
    // Optimistic toggle
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const completed = isTaskCompleted(t);
        return {
          ...t,
          properties: {
            ...t.properties,
            hs_task_status: completed ? "NOT_STARTED" : "COMPLETED",
            hs_task_completion_date: completed ? undefined : new Date().toISOString(),
          },
        };
      })
    );
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkComplete = () => {
    setTasks((prev) =>
      prev.map((t) => {
        if (!selectedIds.has(t.id)) return t;
        return {
          ...t,
          properties: {
            ...t.properties,
            hs_task_status: "COMPLETED",
            hs_task_completion_date: new Date().toISOString(),
          },
        };
      })
    );
    setSelectedIds(new Set());
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          properties: {
            hs_task_subject: newTaskTitle,
            hs_task_type: "TODO",
            hs_task_status: "NOT_STARTED",
            hs_task_priority: "MEDIUM",
            hs_timestamp: new Date().toISOString(),
          },
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const newTask: TaskItem = await res.json();
      setTasks((prev) => [newTask, ...prev]);
      setNewTaskTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "タスクの作成に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && tasks.length === 0) return <LoadingSkeleton />;

  if (error && tasks.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">タスク</h1>
        </div>
        <Card>
          <div className="p-8 text-center">
            <p className="text-red-600 font-medium mb-2">エラーが発生しました</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <Button size="sm" onClick={() => fetchTasks()}>
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
          <h1 className="text-2xl font-bold text-gray-900">タスク</h1>
          <p className="text-sm text-gray-500 mt-1">
            {tasks.filter((t) => !isTaskCompleted(t)).length}件の未完了タスク
          </p>
        </div>
      </div>

      {/* Saved View Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        {savedViews.map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeView === view
                ? "border-[#ff4800] text-[#ff4800]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {view}
          </button>
        ))}
        <button
          className="px-2 py-2 text-gray-400 hover:text-gray-600 -mb-px border-b-2 border-transparent"
          onClick={() => alert("ビュー追加は準備中です")}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Quick Add */}
      <Card>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                placeholder="新しいタスクを追加..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTask();
                }}
                disabled={submitting}
              />
            </div>
            <Button size="sm" onClick={addTask} disabled={submitting}>
              <Plus className="h-4 w-4 mr-1" />
              {submitting ? "追加中..." : "追加"}
            </Button>
          </div>
          {error && tasks.length > 0 && (
            <p className="text-xs text-red-500 mt-2">{error}</p>
          )}
        </div>
      </Card>

      {/* Search & Sort */}
      <Card>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setLocalPage(0); }}
                placeholder="タスク名で検索..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4800]/20 focus:border-[#ff4800]"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSort("dueDate")}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  sortBy === "dueDate" ? "border-[#ff4800] text-[#ff4800] bg-[#ff4800]/5" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                期限順
                <ArrowUpDown className="h-3 w-3" />
              </button>
              <button
                onClick={() => handleSort("priority")}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  sortBy === "priority" ? "border-[#ff4800] text-[#ff4800] bg-[#ff4800]/5" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                優先度順
                <ArrowUpDown className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              filter === tab.key
                ? "border-[#ff4800] text-[#ff4800]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs ${
                filter === tab.key
                  ? "bg-[#ff4800]/10 text-[#ff4800]"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-[#1f1f1f] px-4 py-2.5 text-white">
          <span className="text-sm font-medium">{selectedIds.size}件を選択中</span>
          <div className="h-4 w-px bg-gray-600" />
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={bulkComplete}>
            <CheckCircle2 className="h-3.5 w-3.5" /> 完了にする
          </button>
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("エクスポートは準備中です")}>
            <Download className="h-3.5 w-3.5" /> エクスポート
          </button>
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm text-red-400 hover:bg-white/10 transition-colors" onClick={() => alert("一括削除は準備中です")}>
            <Trash2 className="h-3.5 w-3.5" /> 削除
          </button>
          <div className="flex-1" />
          <button className="rounded p-1 hover:bg-white/10 transition-colors" onClick={() => setSelectedIds(new Set())}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-2">
        {paginatedTasks.map((task) => {
          const completed = isTaskCompleted(task);
          const overdue = isTaskOverdue(task);
          const isSelected = selectedIds.has(task.id);
          return (
            <Card
              key={task.id}
              className={`transition-all cursor-pointer hover:border-gray-300 ${completed ? "opacity-60" : ""} ${isSelected ? "ring-1 ring-[#ff4800]/30 border-[#ff4800]/30" : ""}`}
              onClick={() => router.push(`/tasks/${task.id}`)}
            >
              <div className="p-4 flex items-start gap-3">
                {/* Selection Checkbox */}
                <input
                  type="checkbox"
                  className="mt-1 rounded border-gray-300 flex-shrink-0"
                  checked={isSelected}
                  onChange={() => toggleSelect(task.id)}
                  onClick={(e) => e.stopPropagation()}
                />

                {/* Completion Toggle */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                  className="mt-0.5 flex-shrink-0"
                >
                  {completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300 hover:text-gray-400" />
                  )}
                </button>

                {/* Type Icon */}
                <div className="mt-0.5 flex-shrink-0">
                  {typeIcon(task.properties.hs_task_type || "TODO")}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/tasks/${task.id}`}
                    className={`text-sm font-medium hover:underline ${
                      completed
                        ? "text-gray-400 line-through"
                        : "text-gray-900"
                    }`}
                  >
                    {task.properties.hs_task_subject || "件名なし"}
                  </Link>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    {/* Due Date */}
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        overdue
                          ? "text-red-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {overdue ? (
                        <AlertTriangle className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {getDueDateLabel(task)}
                    </div>

                    {/* Priority */}
                    <Badge variant={priorityBadgeVariant(task.properties.hs_task_priority || "")}>
                      {priorityLabel(task.properties.hs_task_priority || "")}
                    </Badge>
                  </div>
                </div>

                {/* Owner */}
                <div className="flex-shrink-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff4800] text-[10px] text-white">
                    {(task.properties.hubspot_owner_id || "?").charAt(0)}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredTasks.length === 0 && !loading && (
          <div className="py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">タスクはありません</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {`${localPage * itemsPerPage + 1}-${Math.min((localPage + 1) * itemsPerPage, filteredTasks.length)}件 / ${filteredTasks.length}件`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={localPage === 0}
              onClick={() => setLocalPage(localPage - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              前へ
            </Button>
            <span className="text-sm text-gray-500">
              {`${localPage + 1} / ${totalPages}`}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={localPage + 1 >= totalPages}
              onClick={() => setLocalPage(localPage + 1)}
            >
              次へ
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
