"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  User,
} from "lucide-react";

type TaskFilter = "all" | "today" | "overdue" | "upcoming";

interface Task {
  id: string;
  title: string;
  type: "call" | "email" | "todo" | "follow_up";
  dueDate: string;
  dueDateLabel: string;
  priority: "high" | "medium" | "low";
  contact: string;
  contactId: string;
  owner: string;
  completed: boolean;
  overdue: boolean;
}

const tasks: Task[] = [
  {
    id: "1",
    title: "田中様へフォローアップメール送信",
    type: "email",
    dueDate: "2026-03-14",
    dueDateLabel: "今日",
    priority: "high",
    contact: "田中 太郎",
    contactId: "1",
    owner: "佐藤 匠",
    completed: false,
    overdue: false,
  },
  {
    id: "2",
    title: "鈴木テクノロジー 提案書修正",
    type: "todo",
    dueDate: "2026-03-14",
    dueDateLabel: "今日",
    priority: "high",
    contact: "鈴木 花子",
    contactId: "2",
    owner: "佐藤 匠",
    completed: false,
    overdue: false,
  },
  {
    id: "3",
    title: "ABC株式会社 契約書送付",
    type: "follow_up",
    dueDate: "2026-03-15",
    dueDateLabel: "明日",
    priority: "medium",
    contact: "山田 一郎",
    contactId: "3",
    owner: "佐藤 匠",
    completed: false,
    overdue: false,
  },
  {
    id: "4",
    title: "デジタルソリューションズ 進捗確認コール",
    type: "call",
    dueDate: "2026-03-15",
    dueDateLabel: "明日",
    priority: "medium",
    contact: "佐々木 美咲",
    contactId: "4",
    owner: "田村 愛",
    completed: false,
    overdue: false,
  },
  {
    id: "5",
    title: "展示会リードのCRMインポート",
    type: "todo",
    dueDate: "2026-03-16",
    dueDateLabel: "3月16日",
    priority: "low",
    contact: "",
    contactId: "",
    owner: "佐藤 匠",
    completed: false,
    overdue: false,
  },
  {
    id: "6",
    title: "四半期営業レポート作成",
    type: "todo",
    dueDate: "2026-03-17",
    dueDateLabel: "3月17日",
    priority: "medium",
    contact: "",
    contactId: "",
    owner: "佐藤 匠",
    completed: true,
    overdue: false,
  },
  {
    id: "7",
    title: "高橋様 見積書の確認連絡",
    type: "call",
    dueDate: "2026-03-12",
    dueDateLabel: "3月12日",
    priority: "high",
    contact: "高橋 健一",
    contactId: "5",
    owner: "佐藤 匠",
    completed: false,
    overdue: true,
  },
  {
    id: "8",
    title: "イノベーション社 デモ環境準備",
    type: "todo",
    dueDate: "2026-03-13",
    dueDateLabel: "昨日",
    priority: "high",
    contact: "伊藤 さくら",
    contactId: "6",
    owner: "田村 愛",
    completed: false,
    overdue: true,
  },
  {
    id: "9",
    title: "グローバルシステム 要件定義レビュー",
    type: "follow_up",
    dueDate: "2026-03-18",
    dueDateLabel: "3月18日",
    priority: "high",
    contact: "渡辺 大輔",
    contactId: "7",
    owner: "佐藤 匠",
    completed: false,
    overdue: false,
  },
  {
    id: "10",
    title: "さくらデザイン ブランドガイドライン送付",
    type: "email",
    dueDate: "2026-03-16",
    dueDateLabel: "3月16日",
    priority: "low",
    contact: "中村 真理",
    contactId: "8",
    owner: "田村 愛",
    completed: false,
    overdue: false,
  },
  {
    id: "11",
    title: "フューチャーテック UAT確認",
    type: "todo",
    dueDate: "2026-03-19",
    dueDateLabel: "3月19日",
    priority: "medium",
    contact: "小林 誠",
    contactId: "9",
    owner: "佐藤 匠",
    completed: false,
    overdue: false,
  },
  {
    id: "12",
    title: "太陽コーポレーション 納品物の最終確認",
    type: "follow_up",
    dueDate: "2026-03-11",
    dueDateLabel: "3月11日",
    priority: "medium",
    contact: "松本 隆",
    contactId: "11",
    owner: "佐藤 匠",
    completed: true,
    overdue: false,
  },
];

const typeIcon = (type: string) => {
  switch (type) {
    case "call":
      return <Phone className="h-4 w-4 text-green-500" />;
    case "email":
      return <Mail className="h-4 w-4 text-blue-500" />;
    case "todo":
      return <FileText className="h-4 w-4 text-gray-500" />;
    case "follow_up":
      return <Calendar className="h-4 w-4 text-purple-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

const priorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case "high":
      return "danger" as const;
    case "medium":
      return "warning" as const;
    case "low":
      return "default" as const;
    default:
      return "default" as const;
  }
};

const priorityLabel = (priority: string) => {
  switch (priority) {
    case "high":
      return "高";
    case "medium":
      return "中";
    case "low":
      return "低";
    default:
      return priority;
  }
};

export default function TasksPage() {
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [taskList, setTaskList] = useState(tasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const filterTabs: { key: TaskFilter; label: string; count: number }[] = [
    { key: "all", label: "すべて", count: taskList.filter((t) => !t.completed).length },
    {
      key: "today",
      label: "今日",
      count: taskList.filter(
        (t) => !t.completed && t.dueDate === "2026-03-14"
      ).length,
    },
    {
      key: "overdue",
      label: "期限超過",
      count: taskList.filter((t) => !t.completed && t.overdue).length,
    },
    {
      key: "upcoming",
      label: "今後",
      count: taskList.filter(
        (t) => !t.completed && !t.overdue && t.dueDate > "2026-03-14"
      ).length,
    },
  ];

  const filteredTasks = taskList.filter((t) => {
    switch (filter) {
      case "today":
        return t.dueDate === "2026-03-14";
      case "overdue":
        return !t.completed && t.overdue;
      case "upcoming":
        return !t.completed && !t.overdue && t.dueDate > "2026-03-14";
      default:
        return true;
    }
  });

  const toggleTask = (id: string) => {
    setTaskList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: `new-${Date.now()}`,
      title: newTaskTitle,
      type: "todo",
      dueDate: "2026-03-14",
      dueDateLabel: "今日",
      priority: "medium",
      contact: "",
      contactId: "",
      owner: "佐藤 匠",
      completed: false,
      overdue: false,
    };
    setTaskList((prev) => [newTask, ...prev]);
    setNewTaskTitle("");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">タスク</h1>
          <p className="text-sm text-gray-500 mt-1">
            {taskList.filter((t) => !t.completed).length}件の未完了タスク
          </p>
        </div>
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
              />
            </div>
            <Button size="sm" onClick={addTask}>
              <Plus className="h-4 w-4 mr-1" />
              追加
            </Button>
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
                ? "border-[#FF7A59] text-[#FF7A59]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs ${
                filter === tab.key
                  ? "bg-[#FF7A59]/10 text-[#FF7A59]"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <Card
            key={task.id}
            className={`transition-all ${task.completed ? "opacity-60" : ""}`}
          >
            <div className="p-4 flex items-start gap-3">
              {/* Checkbox */}
              <button
                onClick={() => toggleTask(task.id)}
                className="mt-0.5 flex-shrink-0"
              >
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300 hover:text-gray-400" />
                )}
              </button>

              {/* Type Icon */}
              <div className="mt-0.5 flex-shrink-0">{typeIcon(task.type)}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    task.completed
                      ? "text-gray-400 line-through"
                      : "text-gray-900"
                  }`}
                >
                  {task.title}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  {/* Due Date */}
                  <div
                    className={`flex items-center gap-1 text-xs ${
                      task.overdue && !task.completed
                        ? "text-red-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {task.overdue && !task.completed ? (
                      <AlertTriangle className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                    {task.dueDateLabel}
                  </div>

                  {/* Priority */}
                  <Badge variant={priorityBadgeVariant(task.priority)}>
                    {priorityLabel(task.priority)}
                  </Badge>

                  {/* Contact */}
                  {task.contact && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      {task.contact}
                    </div>
                  )}
                </div>
              </div>

              {/* Owner */}
              <div className="flex-shrink-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF7A59] text-[10px] text-white">
                  {task.owner.charAt(0)}
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredTasks.length === 0 && (
          <div className="py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">タスクはありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
