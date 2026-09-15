"use client";

/* eslint-disable @next/next/no-img-element -- demo accepts browser-local data URLs that are not sent through an image optimizer */

import { Camera, Plus } from "lucide-react";
import Link from "next/link";

import { prefectures } from "@/constants/prefectures";
import { useDemo } from "@/features/demo/demo-store";
import { formatTripDate } from "@/features/trips/components/trip-card";

export default function MemoriesPage() {
  const { trips } = useDemo();
  const ordered = [...trips].sort((a, b) =>
    b.startDate.localeCompare(a.startDate),
  );

  return (
    <div className="page-wrap">
      <header className="page-hero">
        <p className="eyebrow">All memories</p>
        <h1>思い出</h1>
        <p>新しい旅から、写真とことばを時系列で。</p>
      </header>
      {ordered.length ? (
        <div className="memory-feed">
          {ordered.map((trip) => {
            const place = trip.prefectureIds
              .map((id) => prefectures.find((item) => item.id === id)?.name)
              .filter(Boolean)
              .join("・");
            return (
              <article className="memory-story" key={trip.id}>
                <div className="memory-date">
                  <strong>{trip.startDate.slice(0, 4)}</strong>
                  <span>{trip.startDate.slice(5).replace("-", ".")}</span>
                </div>
                <div className="memory-content">
                  <Link href={`/trips/${trip.id}`}>
                    <p className="eyebrow">{place}</p>
                    <h2>{trip.title}</h2>
                  </Link>
                  <p>{trip.comment}</p>
                  {trip.photos.length ? (
                    <div
                      className={`memory-photos count-${Math.min(trip.photos.length, 3)}`}
                    >
                      {trip.photos.slice(0, 3).map((photo) => (
                        <img
                          src={photo.src}
                          alt={photo.caption}
                          key={photo.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="memory-no-photo">
                      <Camera aria-hidden="true" />
                      {formatTripDate(trip.startDate, trip.endDate)}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <Camera aria-hidden="true" />
          <h2>思い出はまだありません</h2>
          <Link className="primary-button" href="/trips/new">
            <Plus aria-hidden="true" />
            最初の旅を追加
          </Link>
        </div>
      )}
    </div>
  );
}
