"use client";

import { RotateCcw } from "lucide-react";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="page-wrap">
      <div className="empty-state">
        <h1>ページを表示できませんでした</h1>
        <p>データはブラウザ内に残っています。もう一度読み込んでください。</p>
        <button className="primary-button" type="button" onClick={reset}>
          <RotateCcw aria-hidden="true" />
          再読み込み
        </button>
      </div>
    </div>
  );
}
