import {
  BookOpen,
  BookText,
  CalendarDays,
  CalendarRange,
  Flame,
  Keyboard,
  MessageCircle,
  MessageSquare,
  MessagesSquare,
  Moon,
  MoonStar,
  Smile,
  Star,
  Zap,
  type LucideIcon
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  "book-text": BookText,
  "calendar-days": CalendarDays,
  "calendar-range": CalendarRange,
  flame: Flame,
  keyboard: Keyboard,
  "message-circle": MessageCircle,
  "message-square": MessageSquare,
  "messages-square": MessagesSquare,
  moon: Moon,
  "moon-star": MoonStar,
  smile: Smile,
  zap: Zap
};

export function AchievementIcon({ name }: { name: string }) {
  const Icon = ICONS[name] ?? Star;

  return <Icon size="1em" strokeWidth={2.2} aria-hidden="true" />;
}
