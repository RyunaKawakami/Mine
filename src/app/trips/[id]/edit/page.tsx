"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useDemo } from "@/features/demo/demo-store";
import { TripForm } from "@/features/trips/components/trip-form";

export default function EditTripPage() {
  const { id } = useParams<{ id: string }>();
  const { getTrip } = useDemo();
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
  return (
    <div className="page-wrap narrow-page">
      <header className="page-hero">
        <p className="eyebrow">Edit memory</p>
        <h1>思い出を編集</h1>
        <p>「{trip.title}」の記録を整えます。</p>
      </header>
      <TripForm trip={trip} />
    </div>
  );
}
