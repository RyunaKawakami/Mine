import { Heart, LockKeyhole } from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { PageContainer } from "@/components/layout/page-container";
import { signInWithGoogle } from "@/features/auth/actions/sign-in";

const errorMessages: Record<string, string> = {
  AccessDenied: "このGoogleアカウントはMineに登録されていません。",
  Configuration: "認証設定を確認してください。",
  OAuthCallbackError: "Googleログインを完了できませんでした。",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  const { error } = await searchParams;
  const message = error
    ? (errorMessages[error] ?? "ログイン中に問題が発生しました。")
    : null;

  return (
    <main className="grid min-h-screen place-items-center py-10">
      <PageContainer className="max-w-lg">
        <section className="bg-surface/90 rounded-[2rem] border border-white/70 p-7 text-center shadow-[0_28px_80px_rgb(73_50_34_/_0.12)] backdrop-blur sm:p-10">
          <div className="bg-terracotta/10 text-terracotta mx-auto grid size-14 place-items-center rounded-full">
            <Heart aria-hidden="true" className="size-6" fill="currentColor" />
          </div>
          <p className="mt-6 font-serif text-4xl font-semibold tracking-[-0.04em]">
            Mine
          </p>
          <h1 className="mt-5 font-serif text-2xl">ふたりの思い出へ</h1>
          <p className="text-muted mt-3 text-sm leading-7">
            登録済みのGoogleアカウントでログインしてください。
          </p>

          {message ? (
            <p
              className="border-terracotta/20 bg-terracotta/8 text-terracotta-dark mt-6 rounded-xl border px-4 py-3 text-sm"
              role="alert"
            >
              {message}
            </p>
          ) : null}

          <form action={signInWithGoogle} className="mt-7">
            <button
              className="bg-foreground hover:bg-terracotta-dark inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors"
              type="submit"
            >
              <GoogleMark />
              Googleでログイン
            </button>
          </form>

          <p className="text-muted mt-6 flex items-center justify-center gap-2 text-xs">
            <LockKeyhole aria-hidden="true" className="size-3.5" />
            許可された2つのアカウントだけがアクセスできます
          </p>
        </section>
      </PageContainer>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
      <path
        d="M21.35 12.21c0-.64-.06-1.26-.16-1.85H12v3.5h5.25a4.49 4.49 0 0 1-1.95 2.94v2.27h3.16c1.85-1.7 2.89-4.22 2.89-6.86Z"
        fill="#4285F4"
      />
      <path
        d="M12 21.75c2.64 0 4.86-.88 6.47-2.38l-3.16-2.45c-.88.59-2 .94-3.31.94-2.55 0-4.71-1.72-5.48-4.03H3.25v2.53A9.75 9.75 0 0 0 12 21.75Z"
        fill="#34A853"
      />
      <path
        d="M6.52 13.83A5.86 5.86 0 0 1 6.22 12c0-.64.11-1.26.3-1.83V7.64H3.25A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1 4.36l3.27-2.53Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.14c1.44 0 2.73.49 3.75 1.46l2.81-2.81A9.43 9.43 0 0 0 12 2.25a9.75 9.75 0 0 0-8.75 5.39l3.27 2.53C7.29 7.86 9.45 6.14 12 6.14Z"
        fill="#EA4335"
      />
    </svg>
  );
}
