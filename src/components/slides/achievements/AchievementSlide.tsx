import type {
  AchievementSlide as AchievementSlideData,
  PreparedPresentation
} from "../../../core/presentation";

import layout from "../SlideLayout.module.css";
import styles from "./AchievementSlide.module.css";

interface Props {
  slide: AchievementSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function AchievementSlide({ slide }: Props) {
  const { achievement } = slide;

  return (
    <section className={`${layout.slide} ${styles.slide}`}>
      <span className={layout.kicker}>ACHIEVEMENT UNLOCKED</span>

      <div className={styles.content}>
        <div className={styles.emblem} aria-hidden="true">
          <span className={styles.emblemInner}>{achievement.icon}</span>
        </div>

        <span className={styles.category}>{achievement.category.toUpperCase()}</span>

        <h2 className={styles.title}>{achievement.title}</h2>

        <p className={styles.description}>{achievement.description}</p>
      </div>

      <p className={layout.slideFootnote}>ONE MORE THING THAT MADE THIS CHAT UNIQUE</p>
    </section>
  );
}
