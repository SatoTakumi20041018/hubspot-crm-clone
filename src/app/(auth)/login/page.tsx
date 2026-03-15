"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("メールアドレスを入力してください");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("有効なメールアドレスを入力してください");
      return;
    }
    setStep(2);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("パスワードを入力してください");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("ログインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-4">
      <div className="rounded-2xl bg-white p-8 shadow-2xl">
        {/* Logo - C1: HubSpot sprocket logo placeholder */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#ff4800]">
            <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#1f1f1f]">
            <span className="text-[#ff4800]">Hub</span>Spot
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            アカウントにログイン
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoFocus
                className="w-full rounded-[8px] border border-[rgba(0,0,0,0.11)] px-4 py-2.5 text-sm transition focus:border-[#2f7579] focus:outline-none focus:ring-2 focus:ring-[#2f7579]/20"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-[8px] bg-[#ff4800] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c93700] active:bg-[#9f2800] focus:outline-none focus:ring-2 focus:ring-[#2f7579]/50"
            >
              次へ
            </button>
          </form>
        )}

        {/* Step 2: Password + Social Login */}
        {step === 2 && (
          <>
            {/* Show email with back button */}
            <div className="mb-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError("");
                  setPassword("");
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="戻る"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <span className="truncate text-sm text-gray-500">{email}</span>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-[#1f1f1f]"
                >
                  パスワード
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="パスワードを入力"
                  autoFocus
                  className="w-full rounded-[8px] border border-[rgba(0,0,0,0.11)] px-4 py-2.5 text-sm transition focus:border-[#2f7579] focus:outline-none focus:ring-2 focus:ring-[#2f7579]/20"
                />
              </div>

              {/* C2: Forgot password positioned right below password field */}
              <div className="flex justify-end -mt-1">
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#ff4800] hover:underline"
                >
                  パスワードをお忘れですか？
                </Link>
              </div>

              {/* Remember me */}
              <div className="flex items-center">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#ff4800] focus:ring-[#ff4800]"
                  />
                  ログイン状態を保持
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-[8px] bg-[#ff4800] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c93700] active:bg-[#9f2800] focus:outline-none focus:ring-2 focus:ring-[#2f7579]/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "ログイン中..." : "ログイン"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">または</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              {/* Google */}
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-[8px] border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Googleでログイン
              </button>

              {/* Microsoft */}
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-[8px] bg-[#2f2f2f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1a1a1a]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
                </svg>
                Microsoftでログイン
              </button>

              {/* Apple */}
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-[8px] bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-900"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Appleでログイン
              </button>
            </div>

            {/* SSO Link */}
            <div className="mt-4 text-center">
              <Link
                href="/login"
                className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
              >
                SSOでログイン
              </Link>
            </div>
          </>
        )}

        {/* Register link */}
        <div className="mt-6 text-center text-sm text-gray-500">
          アカウントをお持ちでないですか？{" "}
          <Link
            href="/register"
            className="font-medium text-[#ff4800] hover:underline"
          >
            アカウントを作成
          </Link>
        </div>
      </div>
    </div>
  );
}
