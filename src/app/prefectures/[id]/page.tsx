"use client";

import { Camera, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { prefectures } from "@/constants/prefectures";
import { useDemo } from "@/features/demo/demo-store";
import { TripCard } from "@/features/trips/components/trip-card";

export default function PrefecturePage() {
  const { id } = useParams<{ id: string }>();
  const { trips } = useDemo();
  const prefecture = prefectures.find((item) => item.id === Number(id));
  if (!prefecture)
    return (
      <div className="page-wrap">
        <div className="empty-state">
          <h1>都道府県が見つかりません</h1>
          <Link className="primary-button" href="/">
            地図へ戻る
          </Link>
        </div>
      </div>
    );
  const related = trips
    .filter((trip) => trip.prefectureIds.includes(prefecture.id))
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
  const photoCount = related.reduce((sum, trip) => sum + trip.photos.length, 0);
  return (
    <div className="page-wrap">
      <header className="prefecture-hero">
        <span>
          <MapPin aria-hidden="true" />
        </span>
        <p className="eyebrow">
          {prefecture.nameEn} · {prefecture.region}
        </p>
        <h1>{prefecture.name}</h1>
        <div>
          <strong>{related.length}</strong> trips <i />{" "}
          <strong>{photoCount}</strong> photos
        </div>
      </header>
      {related.length ? (
        <section className="content-section">
          <div className="content-heading">
            <div>
              <p className="eyebrow">Travel log</p>
              <h2>{prefecture.name}の旅</h2>
            </div>
          </div>
          <div className="trip-grid">
            {related.map((trip) => (
              <TripCard trip={trip} key={trip.id} />
            ))}
          </div>
        </section>
      ) : (
        <div className="empty-state">
          <Camera aria-hidden="true" />
          <h2>まだ思い出がありません</h2>
          <p>{prefecture.name}を訪れたら、ここに旅が並びます。</p>
          <Link className="primary-button" href="/trips/new">
            旅を追加する
          </Link>
        </div>
      )}
    </div>
  );
}
