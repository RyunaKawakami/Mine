"use client";

/* eslint-disable @next/next/no-img-element -- demo accepts browser-local data URLs that are not sent through an image optimizer */

import { CalendarDays, Camera, Edit3, MapPin, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { prefectures } from "@/constants/prefectures";
import { useDemo } from "@/features/demo/demo-store";
import { formatTripDate } from "@/features/trips/components/trip-card";

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getTrip, deleteTrip } = useDemo();
  const trip = getTrip(id);
  if (!trip)
    return (
      <div className="page-wrap">
        <div className="empty-state">
          <h1>旅が見つかりません</h1>
          <Link className="primary-button" href="/memories">
            思い出一覧へ
          </Link>
        </div>
      </div>
    );

  const names = trip.prefectureIds
    .map(
      (prefectureId) =>
        prefectures.find((item) => item.id === prefectureId)?.name,
    )
    .filter(Boolean)
    .join("・");
  return (
    <article className="trip-detail">
      <header className="trip-detail-hero">
        {trip.photos[0] ? (
          <img src={trip.photos[0].src} alt={trip.photos[0].caption} />
        ) : (
          <div className="detail-photo-empty">
            <Camera aria-hidden="true" />
          </div>
        )}
        <div className="trip-detail-overlay" />
        <div className="trip-detail-heading">
          <p>
            <MapPin aria-hidden="true" />
            {names}
          </p>
          <h1>{trip.title}</h1>
          <span>
            <CalendarDays aria-hidden="true" />
            {formatTripDate(trip.startDate, trip.endDate)}
          </span>
        </div>
      </header>
      <div className="page-wrap trip-detail-body">
        <div className="trip-detail-actions">
          <Link className="secondary-button" href={`/trips/${trip.id}/edit`}>
            <Edit3 aria-hidden="true" />
            編集
          </Link>
          <button
            className="danger-button"
            type="button"
            onClick={() => {
              if (window.confirm(`「${trip.title}」を削除しますか？`)) {
                deleteTrip(trip.id);
                router.push("/memories");
              }
            }}
          >
            <Trash2 aria-hidden="true" />
            削除
          </button>
        </div>
        {trip.comment ? <blockquote>{trip.comment}</blockquote> : null}
        <section className="detail-section">
          <p className="eyebrow">Photo gallery</p>
          <h2>旅の景色</h2>
          {trip.photos.length ? (
            <div className="gallery-grid">
              {trip.photos.map((photo) => (
                <figure key={photo.id}>
                  <img src={photo.src} alt={photo.caption} />
                  <figcaption>{photo.caption}</figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="inline-empty">
              <Camera aria-hidden="true" />
              写真はまだありません。編集から追加できます。
            </div>
          )}
        </section>
        <section className="detail-section">
          <p className="eyebrow">Places</p>
          <h2>立ち寄った場所</h2>
          {trip.spots.length ? (
            <ol className="spot-list">
              {trip.spots.map((spot, index) => (
                <li key={spot.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{spot.name}</h3>
                    <p>
                      {
                        prefectures.find(
                          (item) => item.id === spot.prefectureId,
                        )?.name
                      }
                      {spot.comment ? ` — ${spot.comment}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="inline-empty">
              <MapPin aria-hidden="true" />
              スポットはまだありません。
            </div>
          )}
        </section>
      </div>
    </article>
  );
}
