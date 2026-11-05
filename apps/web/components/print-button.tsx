"use client";

export function PrintButton({ label = "Print this list" }: { label?: string }) {
  return (
    <button type="button" className="btn" onClick={() => window.print()}>
      🖨️ {label}
    </button>
  );
}
