import { Heart } from "lucide-react";

export default function Loading() {
  return (
    <div className="demo-loading">
      <Heart aria-hidden="true" fill="currentColor" />
      <p>思い出をひらいています…</p>
    </div>
  );
}
