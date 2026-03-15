"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit3,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Loader2,
  AlertCircle,
  Calendar,
  Square,
  CheckCircle2,
  Clock,
  MessageSquare,
  Mail,
  Phone,
  FileText,
  Star,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const statusLabels: Record<string, string> = {
  NOT_STARTED: "未着手",
  IN_PROGRESS: "進行中",
  COMPLETED: "完了",
  DEFERRED: "延期",
};

const statusVariant: Record<string, "default" | "warning" | "success" | "info"> = {
  NOT_STARTED: "default",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  DEFERRED: "info",
};

const priorityLabels: Record<string, string> = {
  LOW: "低",
  MEDIUM: "中",
  HIGH: "高",
  URGENT: "緊急",
};

const priorityVariant: Record<string, "default" | "info" | "orange" | "danger"> = {
  LOW: "default",
  MEDIUM: "info",
  HIGH: "orange",
  URGENT: "danger",
};

const typeLabels: Record<string, string> = {
  TODO: "ToDo",
  CALL: "通話",
  EMAIL: "メール",
  MEETING: "ミーティング",
  FOLLOW_UP: "フォローアップ",
};

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  } catch {
    return dateStr;
  }
}

function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editingDueDate, setEditingDueDate] = useState(false);
  const [editDueDate, setEditDueDate] = useState("");
  const [savingField, setSavingField] = useState(false);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/tasks/${id}`);

        if (!res.ok) {
          if (res.status === 404) {
            setError("タスクが見つかりませんでした。");
          } else {
            setError("タスクの取得に失敗しました。");
          }
          setLoading(false);
          return;
        }

        const data = await res.json();
        setTask(data);
      } catch (err) {
        console.error("Failed to fetch task:", err);
        setError("データの取得中にエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!task || toggling) return;

    const newStatus = task.status === "COMPLETED" ? "NOT_STARTED" : "COMPLETED";
    setToggling(true);

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setTask(updated);
      }
    } catch (err) {
      console.error("Failed to update task:", err);
    } finally {
      setToggling(false);
    }
  };

  const startEditingTitle = () => {
    setEditTitle(task?.title || task?.properties?.hs_task_subject || "");
    setEditingTitle(true);
  };

  const saveTitle = async () => {
    setSavingField(true);
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ properties: { hs_task_subject: editTitle } }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTask(updated);
        setEditingTitle(false);
      }
    } catch (err) {
      console.error("Failed to save title:", err);
    } finally {
      setSavingField(false);
    }
  };

  const startEditingDueDate = () => {
    const d = task?.dueDate || task?.properties?.hs_timestamp;
    setEditDueDate(d ? new Date(d).toISOString().slice(0, 16) : "");
    setEditingDueDate(true);
  };

  const saveDueDate = async () => {
    setSavingField(true);
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ properties: { hs_timestamp: editDueDate ? new Date(editDueDate).toISOString() : undefined } }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTask(updated);
        setEditingDueDate(false);
      }
    } catch (err) {
      console.error("Failed to save due date:", err);
    } finally {
      setSavingField(false);
    }
  };

  if (loading) {
    return (
      <div className="-m-6 flex flex-col items-center justify-center" style={{ height: "calc(100vh - 4rem)" }}>
        <Loader2 className="h-8 w-8 animate-spin text-[#ff4800]" />
        <p className="mt-3 text-sm text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="-m-6 flex flex-col items-center justify-center" style={{ height: "calc(100vh - 4rem)" }}>
        <AlertCircle className="h-12 w-12 text-red-400" />
        <p className="mt-3 text-base font-medium text-gray-900">
          {error || "タスクが見つかりません"}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          戻る
        </Button>
      </div>
    );
  }

  const title = task.title || "タイトルなし";
  const description = task.description || "";
  const status = task.status || "NOT_STARTED";
  const priority = task.priority || "MEDIUM";
  const type = task.type || "TODO";
  const dueDate = task.dueDate;
  const ownerName = task.owner?.name || "-";
  const contactName = task.contact
    ? `${task.contact.lastName || ""} ${task.contact.firstName || ""}`.trim() || "名前なし"
    : "";
  const contactId = task.contact?.id || "";
  const isCompleted = status === "COMPLETED";

  // Check if overdue
  const isOverdue = dueDate && new Date(dueDate) < new Date() && !isCompleted;

  return (
    <div className="-m-6 flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 px-6 pt-3 pb-1 bg-white flex-shrink-0">
        <Link href="/tasks" className="hover:text-gray-700">タスク</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900">{title}</span>
      </div>
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded ${
                isCompleted ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
              }`}
            >
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              {editingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") setEditingTitle(false); }}
                    className="text-lg font-bold text-gray-900 border border-gray-300 rounded px-2 py-0.5 focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                    autoFocus
                    disabled={savingField}
                  />
                  <Button size="sm" onClick={saveTitle} disabled={savingField}>
                    {savingField ? "..." : "保存"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingTitle(false)} disabled={savingField}>
                    取消
                  </Button>
                </div>
              ) : (
                <h1
                  className={`text-lg font-bold cursor-pointer hover:bg-gray-50 rounded px-1 -mx-1 ${isCompleted ? "text-gray-400 line-through" : "text-gray-900"}`}
                  onClick={startEditingTitle}
                  title="クリックして編集"
                >
                  {title}
                </h1>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Badge variant={statusVariant[status] || "default"}>
                  {statusLabels[status] || status}
                </Badge>
                <Badge variant={priorityVariant[priority] || "default"}>
                  {priorityLabels[priority] || priority}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isCompleted ? "outline" : "primary"}
            size="sm"
            onClick={handleToggleStatus}
            disabled={toggling}
          >
            {toggling ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : isCompleted ? (
              <Square className="h-4 w-4 mr-1" />
            ) : (
              <CheckCircle2 className="h-4 w-4 mr-1" />
            )}
            {isCompleted ? "未完了に戻す" : "完了にする"}
          </Button>
          <Button variant="outline" size="sm" onClick={startEditingTitle}>
            <Edit3 className="h-4 w-4 mr-1" />
            編集
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFollowing(!following)}
            className={following ? "text-[#ff4800] border-[#ff4800]" : ""}
          >
            <Star className={`h-4 w-4 mr-1 ${following ? "fill-[#ff4800] text-[#ff4800]" : ""}`} />
            {following ? "フォロー中" : "フォロー"}
          </Button>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT (Main) */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Task Details Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">タスク詳細</h2>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-medium text-gray-500">タイトル</label>
                  <p
                    className={`text-sm mt-1 cursor-pointer hover:bg-gray-50 rounded px-1 -mx-1 py-0.5 ${isCompleted ? "text-gray-400 line-through" : "text-gray-900"}`}
                    onClick={startEditingTitle}
                    title="クリックして編集"
                  >
                    {title}
                  </p>
                </div>

                {description && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">説明</label>
                    <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                      {description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">ステータス</label>
                    <div className="mt-1">
                      <Badge variant={statusVariant[status] || "default"}>
                        {statusLabels[status] || status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">優先度</label>
                    <div className="mt-1">
                      <Badge variant={priorityVariant[priority] || "default"}>
                        {priorityLabels[priority] || priority}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">タイプ</label>
                    <div className="mt-1">
                      <Badge>{typeLabels[type] || type}</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">期限</label>
                    {editingDueDate ? (
                      <div className="mt-1 space-y-2">
                        <input
                          type="datetime-local"
                          value={editDueDate}
                          onChange={(e) => setEditDueDate(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                          disabled={savingField}
                        />
                        <div className="flex items-center gap-1">
                          <Button size="sm" onClick={saveDueDate} disabled={savingField}>
                            {savingField ? "..." : "保存"}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingDueDate(false)} disabled={savingField}>
                            取消
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex items-center gap-1 mt-1 cursor-pointer hover:bg-gray-50 rounded px-1 -mx-1 py-0.5"
                        onClick={startEditingDueDate}
                        title="クリックして編集"
                      >
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {isOverdue && <Clock className="h-3.5 w-3.5 text-red-500" />}
                        <p className={`text-sm ${isOverdue ? "text-red-600 font-medium" : "text-gray-900"}`}>
                          {formatDateTime(dueDate)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">作成日</label>
                    <p className="text-sm text-gray-900 mt-0.5">
                      {formatDate(task.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">最終更新日</label>
                    <p className="text-sm text-gray-900 mt-0.5">
                      {formatDate(task.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completion Toggle Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isCompleted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {isCompleted ? "このタスクは完了しました" : "このタスクは未完了です"}
                    </p>
                    <p className="text-xs text-gray-500">
                      クリックしてステータスを切り替えます
                    </p>
                  </div>
                </div>
                <Button
                  variant={isCompleted ? "outline" : "primary"}
                  size="sm"
                  onClick={handleToggleStatus}
                  disabled={toggling}
                >
                  {toggling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isCompleted ? (
                    "未完了に戻す"
                  ) : (
                    "完了にする"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Related Activity */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">関連アクティビティ</h2>
              <div className="space-y-4">
                {/* Task creation event */}
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                    <CheckSquare className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">タスク作成</h3>
                      <span className="text-xs text-gray-400">{formatDateTime(task.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{title}</p>
                    <p className="mt-1 text-xs text-gray-400">{ownerName}</p>
                  </div>
                </div>

                {/* Status change event if completed */}
                {isCompleted && task.updatedAt && (
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-500">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">タスク完了</h3>
                        <span className="text-xs text-gray-400">{formatDateTime(task.updatedAt)}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">ステータスが「完了」に変更されました</p>
                      <p className="mt-1 text-xs text-gray-400">{ownerName}</p>
                    </div>
                  </div>
                )}

                {/* Related contact activity hint */}
                {contactId && (
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        関連コンタクトのアクティビティは
                        <Link href={`/contacts/${contactId}`} className="text-[#ff4800] hover:underline mx-1">
                          コンタクト詳細ページ
                        </Link>
                        で確認できます
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-72 flex-shrink-0 overflow-y-auto border-l border-gray-200 bg-white p-4">
          {/* Owner */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              担当者
            </h2>
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
                    {ownerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {ownerName}
                    </p>
                    {task.owner?.email && (
                      <p className="text-xs text-gray-500">{task.owner.email}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact */}
          {contactId && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                コンタクト
              </h2>
              <Card className="hover:border-gray-300 transition-colors">
                <CardContent className="p-3">
                  <Link
                    href={`/contacts/${contactId}`}
                    className="flex items-center gap-2"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff4800] text-xs font-medium text-white">
                      {contactName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {contactName}
                      </p>
                      {task.contact?.email && (
                        <p className="text-xs text-gray-500 truncate">
                          {task.contact.email}
                        </p>
                      )}
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}

          {/* No contact */}
          {!contactId && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                コンタクト
              </h2>
              <p className="text-xs text-gray-400 py-2">コンタクトは関連付けられていません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
