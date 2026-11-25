import type { AchievementSlide as AchievementSlideData } from "../../../core/presentation";
import { SlideFrame } from "../SlideFrame";
import { Title } from "../Title";
import { AchievementIcon } from "./AchievementIcon";
import styles from "./AchievementSlide.module.css";

interface Props {
  slide: AchievementSlideData;
}

const MAX_NAMES = 3;

function formatHolders(holders: AchievementSlideData["holders"]): string {
  if (holders.length === 0) {
    return "The whole chat";
  }

  const names = holders.slice(0, MAX_NAMES).map(holder => holder.name);
  const hiddenCount = holders.length - names.length;

  return hiddenCount > 0 ? `${names.join(", ")} +${hiddenCount} more` : names.join(", ");
}

export function AchievementSlide({ slide }: Props) {
  const { achievement, holders } = slide;

  return (
    <SlideFrame
      tone="achievements"
      kicker="ACHIEVEMENT UNLOCKED"
    >
      <div className={styles.emblem} aria-hidden="true">
        <span className={styles.emblemInner}>
          <AchievementIcon name={achievement.icon} />
        </span>
      </div>

      <div className={styles.text}>
        <span className={styles.category}>{achievement.category}</span>
        <Title lines={[achievement.title]} />
        <p className={styles.description}>{achievement.description}</p>
      </div>

      <div className={styles.holders}>
        <span className={styles.holdersLabel}>EARNED BY</span>
        <span className={styles.holdersNames}>{formatHolders(holders)}</span>
      </div>
    </SlideFrame>
  );
}
