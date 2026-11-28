import type { PreparedPresentation, PresentationSlide } from "../core/presentation";
import { AchievementSlide } from "./slides/achievements/AchievementSlide";
import { AchievementsRecapSlide } from "./slides/achievements/AchievementsRecapSlide";
import { ActivityMonthlySlide } from "./slides/activity/ActivityMonthlySlide";
import { ActivityPeakSlide } from "./slides/activity/ActivityPeakSlide";
import { ActivityRhythmSlide } from "./slides/activity/ActivityRhythmSlide";
import { ActivitySilenceSlide } from "./slides/activity/ActivitySilenceSlide";
import { ActivityStreakSlide } from "./slides/activity/ActivityStreakSlide";
import { ConversationsOverviewSlide } from "./slides/conversations/ConversationsOverviewSlide";
import { ConversationsParticipantsSlide } from "./slides/conversations/ConversationsParticipantsSlide";
import { ConversationsResponsesSlide } from "./slides/conversations/ConversationsResponsesSlide";
import { CoverSlide } from "./slides/CoverSlide";
import { FinaleSlide } from "./slides/FinaleSlide";
import { OverviewDurationSlide } from "./slides/overview/OverviewDurationSlide";
import { OverviewMediaSlide } from "./slides/overview/OverviewMediaSlide";
import { OverviewPaceSlide } from "./slides/overview/OverviewPaceSlide";
import { OverviewVolumeSlide } from "./slides/overview/OverviewVolumeSlide";
import { ParticipantProfileSlide } from "./slides/participants/ParticipantProfileSlide";
import { ParticipantsBalanceSlide } from "./slides/participants/ParticipantsBalanceSlide";
import { TextEmojisSlide } from "./slides/text/TextEmojisSlide";
import { TextLengthSlide } from "./slides/text/TextLengthSlide";
import { TextPhrasesSlide } from "./slides/text/TextPhrasesSlide";
import { TextRepeatedSlide } from "./slides/text/TextRepeatedSlide";
import { TextWordsSlide } from "./slides/text/TextWordsSlide";

interface SlideRendererProps {
  slide: PresentationSlide;
  formatters: PreparedPresentation["formatters"];
  onNext: () => void;
  onReplay: () => void;
}

export function SlideRenderer({ slide, formatters, onNext, onReplay }: SlideRendererProps) {
  switch (slide.kind) {
    case "cover":
      return <CoverSlide slide={slide} formatters={formatters} onNext={onNext} />;

    case "overview_volume":
      return <OverviewVolumeSlide slide={slide} formatters={formatters} />;

    case "overview_duration":
      return <OverviewDurationSlide slide={slide} formatters={formatters} />;

    case "overview_pace":
      return <OverviewPaceSlide slide={slide} formatters={formatters} />;

    case "overview_media":
      return <OverviewMediaSlide slide={slide} formatters={formatters} />;

    case "finale":
      return <FinaleSlide slide={slide} formatters={formatters} onReplay={onReplay} />;

    case "activity_peak":
      return <ActivityPeakSlide slide={slide} formatters={formatters} />;

    case "activity_rhythm":
      return <ActivityRhythmSlide slide={slide} formatters={formatters} />;

    case "activity_streak":
      return <ActivityStreakSlide slide={slide} formatters={formatters} />;

    case "activity_silence":
      return <ActivitySilenceSlide slide={slide} formatters={formatters} />;

    case "activity_monthly":
      return <ActivityMonthlySlide slide={slide} formatters={formatters} />;

    case "participants_balance":
      return <ParticipantsBalanceSlide slide={slide} formatters={formatters} />;

    case "participant_profile":
      return <ParticipantProfileSlide slide={slide} formatters={formatters} />;

    case "text_words":
      return <TextWordsSlide slide={slide} formatters={formatters} />;

    case "text_phrases":
      return <TextPhrasesSlide slide={slide} formatters={formatters} />;

    case "text_emojis":
      return <TextEmojisSlide slide={slide} formatters={formatters} />;

    case "text_repeated":
      return <TextRepeatedSlide slide={slide} formatters={formatters} />;

    case "text_length":
      return <TextLengthSlide slide={slide} formatters={formatters} />;

    case "conversations_overview":
      return <ConversationsOverviewSlide slide={slide} formatters={formatters} />;

    case "conversations_participants":
      return <ConversationsParticipantsSlide slide={slide} formatters={formatters} />;

    case "conversations_responses":
      return <ConversationsResponsesSlide slide={slide} formatters={formatters} />;

    case "achievement":
      return <AchievementSlide slide={slide} />;

    case "achievements_recap":
      return <AchievementsRecapSlide slide={slide} />;

    default: {
      const exhaustiveCheck: never = slide;
      return exhaustiveCheck;
    }
  }
}
