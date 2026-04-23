"use client";

import { Trash2 } from "lucide-react";

type DeleteResumeButtonProps = {
  companyName: string;
};

export function DeleteResumeButton({ companyName }: DeleteResumeButtonProps) {
  return (
    <button
      className="button icon-button danger"
      type="submit"
      aria-label="삭제"
      data-tooltip="삭제"
      onClick={(event) => {
        const confirmed = window.confirm(
          `${companyName} 이력서를 삭제할까요? 삭제 후에는 되돌릴 수 없습니다.`
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <Trash2 className="icon" />
    </button>
  );
}
