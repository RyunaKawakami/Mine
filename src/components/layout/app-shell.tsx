"use client";

import { Heart, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { mainNavigation } from "@/config/navigation";
import { useDemo } from "@/features/demo/demo-store";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { authenticated, ready, logout, storageError } = useDemo();
  const isLogin = pathname === "/login";

  useEffect(() => {
    if (ready && !authenticated && !isLogin) router.replace("/login");
    if (ready && authenticated && isLogin) router.replace("/");
  }, [authenticated, isLogin, ready, router]);

  if (isLogin) return children;

  if (!ready || !authenticated) {
    return (
      <main className="demo-loading" aria-live="polite">
        <Heart aria-hidden="true" fill="currentColor" />
        <p>アルバムをひらいています…</p>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="Mine ホーム">
          Mine<span>.</span>
        </Link>
        <nav className="desktop-nav" aria-label="メインナビゲーション">
          {mainNavigation.map(({ href, label, icon: Icon, prominent }) => (
            <Link
              className={`${pathname === href ? "is-active" : ""} ${prominent ? "nav-add" : ""}`}
              href={href}
              key={href}
            >
              <Icon aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <button
          className="icon-button"
          type="button"
          aria-label="デモからログアウト"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          <LogOut aria-hidden="true" />
        </button>
      </header>

      {storageError ? (
        <p className="storage-alert" role="alert">
          {storageError}
        </p>
      ) : null}
      <main className="main-content">{children}</main>

      <nav className="bottom-nav" aria-label="モバイルナビゲーション">
        {mainNavigation.map(({ href, label, icon: Icon, prominent }) => (
          <Link
            className={`${pathname === href ? "is-active" : ""} ${prominent ? "nav-add" : ""}`}
            href={href}
            key={href}
          >
            <span>
              <Icon aria-hidden="true" />
            </span>
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
