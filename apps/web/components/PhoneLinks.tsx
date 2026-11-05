import { splitPhoneText } from "@/lib/phone";

/**
 * Shows a phone field as typed, with each recognizable number as its own
 * tap-to-call link. Text without a full number (e.g. "1-800-799-SAFE") stays
 * plain so nothing dials the wrong digits.
 */
export function PhoneLinks({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className="whitespace-pre-line">
      {splitPhoneText(text.trim()).map((segment, index) =>
        segment.type === "phone" ? (
          <a
            key={index}
            href={segment.href}
            aria-label={`Call ${segment.value}`}
            className={className}
          >
            {segment.value}
          </a>
        ) : (
          <span key={index}>{segment.value}</span>
        ),
      )}
    </span>
  );
}
