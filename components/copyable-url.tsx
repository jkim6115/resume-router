"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

type CopyableUrlProps = {
  value: string;
  compact?: boolean;
};

export function CopyableUrl({ value, compact = false }: CopyableUrlProps) {
  const idleStatus = "클릭하면 URL이 복사됩니다.";
  const [status, setStatus] = useState(idleStatus);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("복사되었습니다.");
      window.setTimeout(() => setStatus(idleStatus), 1200);
    } catch {
      setStatus("브라우저 권한 때문에 복사하지 못했습니다. 클릭해서 다시 시도하세요.");
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      copyUrl();
    }
  }

  return (
    <div
      className={`link-box copyable-url${compact ? " compact-url" : ""}`}
      onClick={copyUrl}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      title={status}
      aria-label="URL 복사"
    >
      <span>{value}</span>
      {compact ? <Copy className="icon" /> : <small>{status}</small>}
    </div>
  );
}
