import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center py-16">
      <PageContainer className="text-center">
        <p className="text-terracotta text-sm font-semibold tracking-[0.15em] uppercase">
          404
        </p>
        <h1 className="mt-4 font-serif text-4xl">ページが見つかりません</h1>
        <p className="text-muted mt-4">
          URLを確認して、もう一度お試しください。
        </p>
        <Link
          className="bg-foreground hover:bg-terracotta-dark mt-8 inline-flex min-h-11 items-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors"
          href="/"
        >
          ホームへ戻る
        </Link>
      </PageContainer>
    </main>
  );
}
