import { ArrowRight, Heart, LogOut, MapPinned } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { StatusBadge } from "@/components/ui/status-badge";
import { siteConfig } from "@/config/site";
import { signOutFromMine } from "@/features/auth/actions/sign-out";
import { requireAlbumMember } from "@/lib/auth/authorize";

const foundations = [
  "Next.js 16 · App Router",
  "TypeScript · strict",
  "Tailwind CSS 4",
  "Vitest · Playwright",
] as const;

export default async function HomePage() {
  const album = await requireAlbumMember();

  return (
    <main className="relative min-h-screen overflow-hidden py-8 sm:py-12 lg:py-16">
      <div
        aria-hidden="true"
        className="absolute -top-36 -right-32 size-96 rounded-full bg-[#dfc9ba]/35 blur-3xl"
      />
      <PageContainer>
        <header className="border-line flex items-center justify-between border-b pb-5">
          <a
            className="font-serif text-2xl font-semibold tracking-[-0.04em]"
            href="#top"
          >
            {siteConfig.name}
          </a>
          <div className="flex items-center gap-3">
            <StatusBadge>Phase 3 ready</StatusBadge>
            <form action={signOutFromMine}>
              <button
                aria-label="ログアウト"
                className="border-line bg-surface text-muted hover:border-terracotta/30 hover:text-terracotta grid size-10 place-items-center rounded-full border transition-colors"
                type="submit"
              >
                <LogOut aria-hidden="true" className="size-4" />
              </button>
            </form>
          </div>
        </header>

        <section
          className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.06fr_0.94fr] lg:gap-20 lg:py-28"
          id="top"
        >
          <div>
            <p className="text-sage mb-5 flex items-center gap-2 text-sm font-semibold tracking-[0.16em] uppercase">
              <Heart
                aria-hidden="true"
                className="size-4"
                fill="currentColor"
              />
              Private travel album
            </p>
            <h1 className="max-w-2xl font-serif text-5xl leading-[1.16] font-medium tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">
              ふたりでつくる、
              <br />
              旅と思い出の地図。
            </h1>
            <p className="text-muted mt-7 max-w-xl text-base leading-8 sm:text-lg">
              写真と場所を手がかりに、ふたりの旅を何度でも振り返るためのプライベートアルバムです。
            </p>
            <p className="text-sage mt-4 text-sm">
              {album.userName ? `${album.userName}さん、` : ""}
              {album.albumName}へようこそ。
            </p>

            <div className="mt-9 flex flex-wrap gap-2.5" aria-label="開発基盤">
              {foundations.map((foundation) => (
                <span
                  className="border-line bg-surface/70 text-muted rounded-full border px-3.5 py-2 text-xs font-medium shadow-[0_8px_24px_rgb(72_54_40_/_0.04)]"
                  key={foundation}
                >
                  {foundation}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="bg-surface rotate-2 rounded-[2rem] border border-white/60 p-4 shadow-[0_28px_80px_rgb(73_50_34_/_0.14)] sm:p-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem] bg-[linear-gradient(145deg,#83917a_0%,#536252_35%,#c69f82_36%,#e1c8b4_64%,#9b674f_65%,#744735_100%)]">
                <div className="absolute inset-x-6 top-6 flex items-center justify-between text-white/95">
                  <span className="text-xs font-semibold tracking-[0.18em] uppercase">
                    Our journey
                  </span>
                  <MapPinned aria-hidden="true" className="size-5" />
                </div>
                <div className="absolute right-5 bottom-5 left-5 rounded-2xl border border-white/35 bg-[#2f2a26]/38 p-5 text-white backdrop-blur-md">
                  <p className="text-xs tracking-[0.14em] text-white/75 uppercase">
                    Coming next
                  </p>
                  <p className="mt-2 font-serif text-2xl">
                    思い出を記録する準備ができました
                  </p>
                  <p className="mt-3 flex items-center gap-2 text-sm text-white/80">
                    Phase 4 · Layout & Navigation
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </p>
                </div>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="border-terracotta/15 absolute -bottom-8 -left-7 -z-10 size-36 rounded-full border"
            />
          </div>
        </section>

        <footer className="border-line text-muted flex flex-col gap-2 border-t py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>Mine · Couple travel memories</p>
          <p>Database and private access boundary verified in code.</p>
        </footer>
      </PageContainer>
    </main>
  );
}
