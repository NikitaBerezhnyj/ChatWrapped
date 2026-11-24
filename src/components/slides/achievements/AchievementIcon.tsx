import {
  BookOpen,
  CalendarRange,
  Flame,
  Keyboard,
  MessageSquare,
  MessagesSquare,
  Moon,
  MoonStar,
  Smile,
  Star,
  type LucideIcon
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  "calendar-range": CalendarRange,
  flame: Flame,
  keyboard: Keyboard,
  "message-square": MessageSquare,
  "messages-square": MessagesSquare,
  moon: Moon,
  "moon-star": MoonStar,
  smile: Smile
};

export function AchievementIcon({ name }: { name: string }) {
  const Icon = ICONS[name] ?? Star;

  return <Icon size="1em" strokeWidth={2.2} aria-hidden="true" />;
}
