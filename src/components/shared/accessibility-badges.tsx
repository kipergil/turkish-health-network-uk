import {
  Accessibility,
  Ear,
  DoorOpen,
  Hand,
  PawPrint,
  ToiletIcon,
} from "lucide-react";
import type { Accessibility as AccessibilityInfo } from "@/lib/schemas/common";

const ACCESSIBILITY_FEATURES: {
  key: keyof AccessibilityInfo;
  label: string;
  icon: typeof Accessibility;
}[] = [
  {
    key: "wheelchairAccessible",
    label: "Wheelchair accessible",
    icon: Accessibility,
  },
  { key: "stepFreeAccess", label: "Step-free access", icon: DoorOpen },
  { key: "accessibleToilet", label: "Accessible toilet", icon: ToiletIcon },
  { key: "hearingLoop", label: "Hearing loop", icon: Ear },
  {
    key: "signLanguageAvailable",
    label: "Sign language available",
    icon: Hand,
  },
  {
    key: "assistanceDogsWelcome",
    label: "Assistance dogs welcome",
    icon: PawPrint,
  },
];

export function AccessibilityBadges({
  accessibility,
}: {
  accessibility?: AccessibilityInfo;
}) {
  if (!accessibility) return null;

  const active = ACCESSIBILITY_FEATURES.filter(
    (feature) => accessibility[feature.key],
  );
  if (active.length === 0) return null;

  return (
    <ul
      className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2"
      aria-label="Accessibility features"
    >
      {active.map(({ key, label, icon: Icon }) => (
        <li
          key={key}
          className="text-muted-foreground flex items-center gap-2 text-sm"
        >
          <Icon className="text-primary size-4 shrink-0" aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
}
