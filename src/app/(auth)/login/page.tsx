"use client";

import { ArrowRight, Heart, LockKeyhole, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { useDemo } from "@/features/demo/demo-store";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useDemo();

  return (
    <main className="login-page">
      <section className="login-visual" aria-label="Mineの紹介">
        <div className="login-brand">
          <Heart aria-hidden="true" fill="currentColor" /> Mine.
        </div>
        <div className="login-quote">
          <p>
            旅先で見つけた
            <br />
            小さな宝物を、
            <br />
            ふたりのものに。
          </p>
          <span>Private travel album</span>
        </div>
        <div className="login-postcard">
          <span>08.09</span>
          <strong>KANAZAWA</strong>
          <small>rainy day, lovely day.</small>
        </div>
      </section>
      <section className="login-panel">
        <div className="login-box">
          <span className="login-icon">
            <Sparkles aria-hidden="true" />
          </span>
          <p className="eyebrow">Welcome to Mine</p>
          <h1>ふたりの思い出へ</h1>
          <p className="login-copy">
            これは端末内だけで動く無料デモです。外部サービスへの登録なしですぐに体験できます。
          </p>
          <button
            className="demo-login-button"
            type="button"
            onClick={() => {
              login();
              router.push("/");
            }}
          >
            デモをはじめる <ArrowRight aria-hidden="true" />
          </button>
          <p className="privacy-note">
            <LockKeyhole aria-hidden="true" />
            入力したデータと写真はこのブラウザ内だけに保存されます
          </p>
        </div>
      </section>
    </main>
  );
}
