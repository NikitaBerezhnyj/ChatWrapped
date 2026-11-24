import type { AchievementSlide as AchievementSlideData } from "../../../core/presentation";
import { SlideFrame } from "../SlideFrame";
import { Title } from "../Title";
import { AchievementIcon } from "./AchievementIcon";
import styles from "./AchievementSlide.module.css";

interface Props {
  slide: AchievementSlideData;
}

export function AchievementSlide({ slide }: Props) {
  const { achievement } = slide;

  return (
    <SlideFrame
      tone="achievements"
      kicker="ACHIEVEMENT UNLOCKED"
      footnote="ONE MORE THING THAT MADE THIS CHAT UNIQUE"
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
    </SlideFrame>
  );
}
