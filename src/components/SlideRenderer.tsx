import type { PreparedPresentation, PresentationSlide } from "../core/presentation";
import { AchievementSlide } from "./slides/achievements/AchievementSlide";
import { AchievementsRecapSlide } from "./slides/achievements/AchievementsRecapSlide";
import { ActivityMonthlySlide } from "./slides/activity/ActivityMonthlySlide";
import { ActivityPeakSlide } from "./slides/activity/ActivityPeakSlide";
import { ActivityRhythmSlide } from "./slides/activity/ActivityRhythmSlide";
import { ActivitySilenceSlide } from "./slides/activity/ActivitySilenceSlide";
import { ActivityStreakSlide } from "./slides/activity/ActivityStreakSlide";
import { ConversationsDurationSlide } from "./slides/conversations/ConversationsDurationSlide";
import { ConversationsMonologueSlide } from "./slides/conversations/ConversationsMonologueSlide";
import { ConversationsOverviewSlide } from "./slides/conversations/ConversationsOverviewSlide";
import { ConversationsResponsesSlide } from "./slides/conversations/ConversationsResponsesSlide";
import { CoverSlide } from "./slides/CoverSlide";
import { FinaleSlide } from "./slides/FinaleSlide";
import { OverviewDurationSlide } from "./slides/overview/OverviewDurationSlide";
import { OverviewPaceSlide } from "./slides/overview/OverviewPaceSlide";
import { OverviewVolumeSlide } from "./slides/overview/OverviewVolumeSlide";
import { ParticipantProfileSlide } from "./slides/participants/ParticipantProfileSlide";
import { ParticipantsBalanceSlide } from "./slides/participants/ParticipantsBalanceSlide";
import { TextEmojisSlide } from "./slides/text/TextEmojisSlide";
import { TextPhrasesSlide } from "./slides/text/TextPhrasesSlide";
import { TextRepeatedSlide } from "./slides/text/TextRepeatedSlide";
import { TextWordsSlide } from "./slides/text/TextWordsSlide";

interface SlideRendererProps {
  slide: PresentationSlide;
  chatTitle: string;
  formatters: PreparedPresentation["formatters"];
  onNext: () => void;
  onReplay: () => void;
}

export function SlideRenderer({
  slide,
  chatTitle,
  formatters,
  onNext,
  onReplay
}: SlideRendererProps) {
  switch (slide.kind) {
    case "cover":
      return (
        <CoverSlide slide={slide} chatTitle={chatTitle} formatters={formatters} onNext={onNext} />
      );

    case "overview_volume":
      return <OverviewVolumeSlide slide={slide} formatters={formatters} />;

    case "overview_duration":
      return <OverviewDurationSlide slide={slide} formatters={formatters} />;

    case "overview_pace":
      return <OverviewPaceSlide slide={slide} formatters={formatters} />;

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

    case "conversations_overview":
      return <ConversationsOverviewSlide slide={slide} formatters={formatters} />;

    case "conversations_duration":
      return <ConversationsDurationSlide slide={slide} formatters={formatters} />;

    case "conversations_responses":
      return <ConversationsResponsesSlide slide={slide} formatters={formatters} />;

    case "conversations_monologue":
      return <ConversationsMonologueSlide slide={slide} formatters={formatters} />;

    case "achievement":
      return <AchievementSlide slide={slide} formatters={formatters} />;

    case "achievements_recap":
      return <AchievementsRecapSlide slide={slide} />;

    default: {
      const exhaustiveCheck: never = slide;
      return exhaustiveCheck;
    }
  }
}
