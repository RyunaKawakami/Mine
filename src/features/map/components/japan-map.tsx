"use client";

import Link from "next/link";

import { prefectures, prefectureRegions } from "@/constants/prefectures";
import type { DemoTrip } from "@/features/demo/types";

const regionNames: Record<(typeof prefectureRegions)[number], string> = {
  HOKKAIDO: "北海道",
  TOHOKU: "東北",
  KANTO: "関東",
  CHUBU: "中部",
  KANSAI: "関西",
  CHUGOKU: "中国",
  SHIKOKU: "四国",
  KYUSHU: "九州・沖縄",
};

export function JapanMap({ trips }: { trips: DemoTrip[] }) {
  const stats = new Map<number, { trips: number; photos: number }>();

  for (const prefecture of prefectures) {
    const related = trips.filter((trip) =>
      trip.prefectureIds.includes(prefecture.id),
    );
    stats.set(prefecture.id, {
      trips: related.length,
      photos: related.reduce((sum, trip) => sum + trip.photos.length, 0),
    });
  }

  return (
    <section className="japan-map" aria-label="都道府県から思い出を探す">
      {prefectureRegions.map((region) => (
        <div
          className={`map-region region-${region.toLowerCase()}`}
          key={region}
        >
          <h3>{regionNames[region]}</h3>
          <div>
            {prefectures
              .filter((item) => item.region === region)
              .map((prefecture) => {
                const count = stats.get(prefecture.id) ?? {
                  trips: 0,
                  photos: 0,
                };
                const visited = count.trips > 0;
                return (
                  <Link
                    className={visited ? "is-visited" : ""}
                    href={`/prefectures/${prefecture.id}`}
                    key={prefecture.id}
                    title={`${prefecture.name}: ${count.trips} trips / ${count.photos} photos`}
                  >
                    <span>{prefecture.name.replace(/[都府県]$/, "")}</span>
                    {visited ? <small>{count.trips}</small> : null}
                  </Link>
                );
              })}
          </div>
        </div>
      ))}
    </section>
  );
}
