import type {
  OverviewMediaSlide as OverviewMediaSlideData,
  PreparedPresentation
} from "../../../core/presentation";
import { StatSlide } from "../StatSlide";

interface Props {
  slide: OverviewMediaSlideData;
  formatters: PreparedPresentation["formatters"];
}

const LABELS: Record<OverviewMediaSlideData["mediaCounts"][number]["type"], string> = {
  photo: "PHOTOS",
  video: "VIDEOS",
  voice: "VOICE MESSAGES",
  audio: "AUDIO",
  file: "FILES",
  sticker: "STICKERS",
  location: "LOCATIONS"
};

export function OverviewMediaSlide({ slide, formatters }: Props) {
  return (
    <StatSlide
      tone="overview"
      kicker="MEDIA"
      title={["Not only", "text."]}
      hero={{
        value: formatters.formatCompactNumber(slide.totalMedia),
        label: "MEDIA MESSAGES"
      }}
      stats={slide.mediaCounts.map(item => ({
        value: formatters.formatCompactNumber(item.count),
        label: LABELS[item.type]
      }))}
    />
  );
}
