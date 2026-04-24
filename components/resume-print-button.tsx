"use client";

import { Printer } from "lucide-react";

export function ResumePrintButton() {
  return (
    <button className="resume-print-button" type="button" onClick={() => window.print()}>
      <Printer className="icon" aria-hidden="true" />
      <span>PDF로 인쇄</span>
    </button>
  );
}
