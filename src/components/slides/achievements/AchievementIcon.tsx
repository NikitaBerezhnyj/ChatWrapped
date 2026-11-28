import {
  BookOpen,
  CalendarRange,
  Flag,
  Flame,
  Keyboard,
  MessageSquare,
  MessagesSquare,
  Mic,
  Moon,
  MoonStar,
  Smile,
  Star,
  Zap,
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
  smile: Smile,
  flag: Flag,
  mic: Mic,
  zap: Zap
};

export function AchievementIcon({ name }: { name: string }) {
  const Icon = ICONS[name] ?? Star;

  return <Icon size="1em" strokeWidth={2.2} aria-hidden="true" />;
}
