"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Print this list" }: { label?: string }) {
  return (
    <button type="button" className="btn" onClick={() => window.print()}>
      <Printer className="size-5" aria-hidden="true" />
      {label}
    </button>
  );
}
