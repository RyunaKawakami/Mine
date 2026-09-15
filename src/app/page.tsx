"use client";

import { ArrowRight, Heart, MapPin, Plus } from "lucide-react";
import Link from "next/link";

import { useDemo } from "@/features/demo/demo-store";
import { JapanMap } from "@/features/map/components/japan-map";
import { TripCard } from "@/features/trips/components/trip-card";

export default function HomePage() {
  const { trips } = useDemo();
  const visited = new Set(trips.flatMap((trip) => trip.prefectureIds)).size;
  const recent = [...trips]
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .slice(0, 3);

  return (
    <div className="page-wrap">
      <section className="home-hero">
        <div>
          <p className="eyebrow">
            <Heart aria-hidden="true" fill="currentColor" /> Our travel archive
          </p>
          <h1>
            ふたりで訪れた、
            <br />
            <em>{visited}</em>の都道府県。
          </h1>
          <p>地図をたどると、その日の景色や会話がそっと戻ってくる。</p>
        </div>
        <Link className="primary-button" href="/trips/new">
          <Plus aria-hidden="true" />
          思い出を追加
        </Link>
      </section>

      <section className="map-panel">
        <div className="map-panel-heading">
          <div>
            <p className="eyebrow">Our Japan</p>
            <h2>思い出の地図</h2>
          </div>
          <div className="map-stat">
            <strong>{visited}</strong>
            <span>/ 47 visited</span>
          </div>
        </div>
        <JapanMap trips={trips} />
        <p className="map-note">
          <MapPin aria-hidden="true" />
          色のついた都道府県を選ぶと、旅の記録を見られます。
        </p>
      </section>

      <section className="content-section">
        <div className="content-heading">
          <div>
            <p className="eyebrow">Recent stories</p>
            <h2>最近の思い出</h2>
          </div>
          <Link href="/memories">
            すべて見る <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        {recent.length ? (
          <div className="trip-grid">
            {recent.map((trip) => (
              <TripCard trip={trip} key={trip.id} />
            ))}
          </div>
        ) : (
          <EmptyTrips />
        )}
      </section>
    </div>
  );
}

function EmptyTrips() {
  return (
    <div className="empty-state">
      <Heart aria-hidden="true" />
      <h2>最初の旅を残しましょう</h2>
      <p>写真がなくても、場所とひとことから始められます。</p>
      <Link className="primary-button" href="/trips/new">
        思い出を追加
      </Link>
    </div>
  );
}
