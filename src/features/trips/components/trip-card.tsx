/* eslint-disable @next/next/no-img-element -- demo accepts browser-local data URLs that are not sent through an image optimizer */

import { ArrowUpRight, Camera, MapPin } from "lucide-react";
import Link from "next/link";

import { prefectures } from "@/constants/prefectures";
import type { DemoTrip } from "@/features/demo/types";

export function formatTripDate(startDate: string, endDate: string) {
  const format = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const start = format.format(new Date(`${startDate}T00:00:00`));
  const end = format.format(new Date(`${endDate}T00:00:00`));
  return startDate === endDate ? start : `${start} — ${end}`;
}

export function TripCard({ trip }: { trip: DemoTrip }) {
  const cover = trip.photos[0];
  const names = trip.prefectureIds
    .map((id) => prefectures.find((item) => item.id === id)?.name)
    .filter(Boolean)
    .join("・");

  return (
    <Link className="trip-card" href={`/trips/${trip.id}`}>
      <div className="trip-card-photo">
        {cover ? (
          <img alt={cover.caption || trip.title} src={cover.src} />
        ) : (
          <div className="photo-empty">
            <Camera aria-hidden="true" />
          </div>
        )}
        <span>{trip.photos.length} photos</span>
      </div>
      <div className="trip-card-body">
        <p className="eyebrow">
          {formatTripDate(trip.startDate, trip.endDate)}
        </p>
        <h3>{trip.title}</h3>
        <p className="place-line">
          <MapPin aria-hidden="true" />
          {names}
        </p>
        <ArrowUpRight className="trip-card-arrow" aria-hidden="true" />
      </div>
    </Link>
  );
}
