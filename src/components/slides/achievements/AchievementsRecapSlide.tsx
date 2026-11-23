import type { AchievementsRecapSlide as AchievementsRecapSlideData } from "../../../core/presentation";

import layout from "../SlideLayout.module.css";
import styles from "./AchievementsRecapSlide.module.css";

interface Props {
  slide: AchievementsRecapSlideData;
}

export function AchievementsRecapSlide({ slide }: Props) {
  const achievements = slide.achievements.filter(achievement => achievement.unlocked);

  const categoryCount = new Set(achievements.map(achievement => achievement.category)).size;

  return (
    <section className={`${layout.slide} ${styles.slide}`}>
      <span className={layout.kicker}>YOUR ACHIEVEMENTS</span>

      <div className={styles.content}>
        <div className={styles.heading}>
          <h2 className={styles.title}>
            Look what
            <br />
            you unlocked.
          </h2>

          <div className={styles.total}>
            <span className={styles.count}>{achievements.length}</span>
            <span className={styles.totalLabel}>
              {achievements.length === 1 ? "ACHIEVEMENT" : "ACHIEVEMENTS"}
            </span>
          </div>
        </div>

        {achievements.length > 0 ? (
          <>
            <div className={styles.achievementGrid}>
              {achievements.map((achievement, index) => (
                <div
                  className={styles.achievement}
                  key={achievement.id}
                  style={
                    {
                      "--item-index": index
                    } as React.CSSProperties
                  }
                >
                  <span className={styles.icon} aria-hidden="true">
                    {achievement.icon}
                  </span>

                  <span className={styles.achievementTitle}>{achievement.title}</span>
                </div>
              ))}
            </div>

            <p className={styles.description}>
              {categoryCount === 1
                ? "One side of your conversation had a lot to celebrate."
                : `Your conversation made its mark across ${categoryCount} different categories.`}
            </p>
          </>
        ) : (
          <p className={styles.description}>
            Every conversation has its own story. This one is just getting started.
          </p>
        )}
      </div>

      <p className={layout.slideFootnote}>EVERY ACHIEVEMENT TELLS A STORY</p>
    </section>
  );
}
