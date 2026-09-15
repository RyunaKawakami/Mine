import { TripForm } from "@/features/trips/components/trip-form";

export default function NewTripPage() {
  return (
    <div className="page-wrap narrow-page">
      <header className="page-hero">
        <p className="eyebrow">New memory</p>
        <h1>思い出を追加</h1>
        <p>旅の輪郭を、覚えているところから。</p>
      </header>
      <TripForm />
    </div>
  );
}
