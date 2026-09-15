"use client";

import { Camera, Heart, MapPinned, RotateCcw, Route } from "lucide-react";

import { useDemo } from "@/features/demo/demo-store";

export default function ProfilePage() {
  const { trips, userName, resetDemo } = useDemo();
  const visited = new Set(trips.flatMap((trip) => trip.prefectureIds)).size;
  const photos = trips.reduce((sum, trip) => sum + trip.photos.length, 0);

  return (
    <div className="page-wrap profile-page">
      <header className="profile-hero">
        <div className="profile-avatar">
          <Heart aria-hidden="true" fill="currentColor" />
        </div>
        <p className="eyebrow">Our little archive</p>
        <h1>{userName}のアルバム</h1>
        <p>ふたりの足あとを、これからも少しずつ。</p>
      </header>
      <section className="stats-grid" aria-label="アルバムの統計">
        <article>
          <MapPinned aria-hidden="true" />
          <span>Visited</span>
          <strong>
            {visited}
            <small> / 47</small>
          </strong>
          <p>訪れた都道府県</p>
        </article>
        <article>
          <Route aria-hidden="true" />
          <span>Trips</span>
          <strong>{trips.length}</strong>
          <p>残した旅</p>
        </article>
        <article>
          <Camera aria-hidden="true" />
          <span>Photos</span>
          <strong>{photos}</strong>
          <p>アルバムの写真</p>
        </article>
      </section>
      <section className="demo-settings">
        <div>
          <p className="eyebrow">Demo settings</p>
          <h2>デモデータ</h2>
          <p>追加・編集した内容を消して、最初のサンプルに戻せます。</p>
        </div>
        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            if (window.confirm("追加したデータを消して初期状態に戻しますか？"))
              resetDemo();
          }}
        >
          <RotateCcw aria-hidden="true" />
          初期データに戻す
        </button>
      </section>
    </div>
  );
}
