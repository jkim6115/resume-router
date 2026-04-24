"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyableUrlProps = {
  value: string;
  compact?: boolean;
};

export function CopyableUrl({ value, compact = false }: CopyableUrlProps) {
  const idleStatus = "클릭하면 URL이 복사됩니다.";
  const copiedStatus = "복사되었습니다.";
  const [status, setStatus] = useState(idleStatus);
  const resetTimerRef = useRef<number | null>(null);
  const isCopied = status === copiedStatus;

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus(copiedStatus);
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
      resetTimerRef.current = window.setTimeout(() => setStatus(idleStatus), 1200);
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
      aria-label={isCopied ? "URL 복사됨" : "URL 복사"}
    >
      <span className="url-text">{value}</span>
      {compact ? (
        <span className={`copy-status${isCopied ? " copied" : ""}`} aria-live="polite">
          {isCopied ? (
            <>
              <Check className="icon" />
              <small>복사됨</small>
            </>
          ) : (
            <Copy className="icon" />
          )}
        </span>
      ) : (
        <small aria-live="polite">{status}</small>
      )}
    </div>
  );
}
