"use client";

/* eslint-disable @next/next/no-img-element -- demo accepts browser-local data URLs that are not sent through an image optimizer */

import { Camera, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";

import { prefectures } from "@/constants/prefectures";
import { useDemo } from "@/features/demo/demo-store";
import type { DemoPhoto, DemoSpot, DemoTrip } from "@/features/demo/types";
import { demoTripSchema } from "@/features/trips/schemas/trip";

const MAX_PHOTO_BYTES = 1_500_000;

function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function TripForm({ trip }: { trip?: DemoTrip }) {
  const router = useRouter();
  const { saveTrip } = useDemo();
  const [title, setTitle] = useState(trip?.title ?? "");
  const [startDate, setStartDate] = useState(trip?.startDate ?? "");
  const [endDate, setEndDate] = useState(trip?.endDate ?? "");
  const [comment, setComment] = useState(trip?.comment ?? "");
  const [prefectureIds, setPrefectureIds] = useState<number[]>(
    trip?.prefectureIds ?? [],
  );
  const [spots, setSpots] = useState<DemoSpot[]>(trip?.spots ?? []);
  const [photos, setPhotos] = useState<DemoPhoto[]>(trip?.photos ?? []);
  const [error, setError] = useState<string | null>(null);
  const [readingPhotos, setReadingPhotos] = useState(false);

  function togglePrefecture(id: number) {
    setPrefectureIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function addSpot() {
    setSpots((current) => [
      ...current,
      {
        id: newId("spot"),
        name: "",
        prefectureId: prefectureIds[0] ?? 13,
        comment: "",
      },
    ]);
  }

  function updateSpot(id: string, patch: Partial<DemoSpot>) {
    setSpots((current) =>
      current.map((spot) => (spot.id === id ? { ...spot, ...patch } : spot)),
    );
  }

  async function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setReadingPhotos(true);
    setError(null);
    try {
      const accepted = files.filter((file) => {
        if (!file.type.startsWith("image/")) return false;
        if (file.size > MAX_PHOTO_BYTES) {
          setError("デモ版では写真1枚を1.5MB以下にしてください。");
          return false;
        }
        return true;
      });
      const next = await Promise.all(
        accepted.map(
          (file) =>
            new Promise<DemoPhoto>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () =>
                resolve({
                  id: newId("photo"),
                  src: String(reader.result),
                  caption: file.name.replace(/\.[^.]+$/, ""),
                  takenAt: startDate || new Date().toISOString().slice(0, 10),
                });
              reader.onerror = () =>
                reject(new Error("写真を読み込めませんでした。"));
              reader.readAsDataURL(file);
            }),
        ),
      );
      setPhotos((current) => [...current, ...next].slice(0, 12));
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "写真を読み込めませんでした。",
      );
    } finally {
      setReadingPhotos(false);
      event.target.value = "";
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = demoTripSchema.safeParse({
      title,
      startDate,
      endDate,
      comment,
      prefectureIds,
    });
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ?? "入力内容を確認してください。",
      );
      return;
    }
    if (spots.some((spot) => !spot.name.trim())) {
      setError("追加したスポットの名前を入力してください。");
      return;
    }
    const validSpots = spots.map((spot) => ({
      ...spot,
      prefectureId: prefectureIds.includes(spot.prefectureId)
        ? spot.prefectureId
        : prefectureIds[0]!,
    }));
    const saved: DemoTrip = {
      id: trip?.id ?? newId("trip"),
      title: parsed.data.title,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate,
      comment: parsed.data.comment,
      prefectureIds: parsed.data.prefectureIds,
      spots: validSpots,
      photos,
      createdAt: trip?.createdAt ?? new Date().toISOString(),
    };
    saveTrip(saved);
    router.push(`/trips/${saved.id}`);
  }

  return (
    <form className="trip-form" onSubmit={handleSubmit}>
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      <section className="form-section">
        <div className="section-heading">
          <span>01</span>
          <div>
            <h2>旅のこと</h2>
            <p>まずはタイトルと日付を記録しましょう。</p>
          </div>
        </div>
        <label>
          旅行名
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="例：夏の金沢旅行"
            maxLength={120}
          />
        </label>
        <div className="form-grid-two">
          <label>
            開始日
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>
          <label>
            終了日
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </label>
        </div>
        <label>
          ひとこと
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="旅の空気や、覚えておきたいこと"
            rows={4}
          />
        </label>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <span>02</span>
          <div>
            <h2>訪れた都道府県</h2>
            <p>複数選択できます。</p>
          </div>
        </div>
        <div className="prefecture-selector">
          {prefectures.map((prefecture) => (
            <label
              className={
                prefectureIds.includes(prefecture.id) ? "is-selected" : ""
              }
              key={prefecture.id}
            >
              <input
                type="checkbox"
                checked={prefectureIds.includes(prefecture.id)}
                onChange={() => togglePrefecture(prefecture.id)}
              />
              {prefecture.name}
            </label>
          ))}
        </div>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <span>03</span>
          <div>
            <h2>立ち寄った場所</h2>
            <p>カフェや景色など、自由に追加できます。</p>
          </div>
        </div>
        <div className="spot-editor-list">
          {spots.map((spot, index) => (
            <div className="spot-editor" key={spot.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <input
                aria-label={`スポット${index + 1}の名前`}
                value={spot.name}
                onChange={(event) =>
                  updateSpot(spot.id, { name: event.target.value })
                }
                placeholder="場所の名前"
              />
              <select
                aria-label={`スポット${index + 1}の都道府県`}
                value={spot.prefectureId}
                onChange={(event) =>
                  updateSpot(spot.id, {
                    prefectureId: Number(event.target.value),
                  })
                }
              >
                {(prefectureIds.length
                  ? prefectures.filter((item) =>
                      prefectureIds.includes(item.id),
                    )
                  : prefectures
                ).map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <input
                aria-label={`スポット${index + 1}のメモ`}
                value={spot.comment}
                onChange={(event) =>
                  updateSpot(spot.id, { comment: event.target.value })
                }
                placeholder="メモ（任意）"
              />
              <button
                type="button"
                aria-label={`${spot.name || `スポット${index + 1}`}を削除`}
                onClick={() =>
                  setSpots((current) =>
                    current.filter((item) => item.id !== spot.id),
                  )
                }
              >
                <Trash2 aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
        <button className="secondary-button" type="button" onClick={addSpot}>
          <Plus aria-hidden="true" />
          スポットを追加
        </button>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <span>04</span>
          <div>
            <h2>写真</h2>
            <p>端末内だけに保存されます（1枚1.5MB、最大12枚）。</p>
          </div>
        </div>
        <label className="photo-picker">
          <Camera aria-hidden="true" />
          <strong>{readingPhotos ? "読み込み中…" : "写真を選ぶ"}</strong>
          <span>JPEG・PNG・WebP など</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={addPhotos}
            disabled={readingPhotos}
          />
        </label>
        {photos.length ? (
          <div className="photo-edit-grid">
            {photos.map((photo) => (
              <div key={photo.id}>
                <img src={photo.src} alt={photo.caption} />
                <button
                  type="button"
                  aria-label={`${photo.caption}を削除`}
                  onClick={() =>
                    setPhotos((current) =>
                      current.filter((item) => item.id !== photo.id),
                    )
                  }
                >
                  <X aria-hidden="true" />
                </button>
                <input
                  aria-label="写真の説明"
                  value={photo.caption}
                  onChange={(event) =>
                    setPhotos((current) =>
                      current.map((item) =>
                        item.id === photo.id
                          ? { ...item, caption: event.target.value }
                          : item,
                      ),
                    )
                  }
                />
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <div className="form-actions">
        <button className="primary-button" type="submit">
          {trip ? "変更を保存" : "思い出を保存"}
        </button>
        <button
          className="text-button"
          type="button"
          onClick={() => router.back()}
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
