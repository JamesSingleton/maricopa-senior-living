import {
  Brain,
  Bus,
  Flower2,
  HandHeart,
  HeartPulse,
  House,
  type LucideIcon,
  Medal,
  PawPrint,
  PiggyBank,
  Scale,
  ShieldCheck,
  Sun,
  Users,
  Utensils,
} from "lucide-react";

/** Icon names match TOPIC_ICONS in apps/studio/schemaTypes/documents/topic.ts. */
const ICONS: Record<string, LucideIcon> = {
  "heart-pulse": HeartPulse,
  brain: Brain,
  "hand-heart": HandHeart,
  house: House,
  "piggy-bank": PiggyBank,
  scale: Scale,
  flower: Flower2,
  "shield-check": ShieldCheck,
  sun: Sun,
  utensils: Utensils,
  bus: Bus,
  users: Users,
  medal: Medal,
  "paw-print": PawPrint,
};

export function TopicIcon({ name }: { name?: string | null }) {
  const Icon = (name && ICONS[name]) || Users;
  return (
    <span
      className="grid size-14 shrink-0 place-items-center rounded-full bg-[var(--msl-sand)] text-[var(--msl-primary)]"
      aria-hidden="true"
    >
      <Icon className="size-8" strokeWidth={2} />
    </span>
  );
}
