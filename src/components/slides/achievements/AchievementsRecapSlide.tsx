import type { CSSProperties } from "react";
import type { AchievementsRecapSlide as AchievementsRecapSlideData } from "../../../core/presentation";
import { StatSlide } from "../StatSlide";
import { AchievementIcon } from "./AchievementIcon";
import styles from "./AchievementsRecapSlide.module.css";

interface Props {
  slide: AchievementsRecapSlideData;
}

const MAX_LISTED = 8;

export function AchievementsRecapSlide({ slide }: Props) {
  const { achievements } = slide;

  const listed = achievements.slice(0, MAX_LISTED);
  const hiddenCount = achievements.length - listed.length;

  return (
    <StatSlide
      tone="achievements"
      kicker="YOUR ACHIEVEMENTS"
      title={["Look what", "you unlocked."]}
      hero={{
        value: achievements.length,
        label: achievements.length === 1 ? "ACHIEVEMENT" : "ACHIEVEMENTS",
        size: "md"
      }}
      footnote="EVERY ACHIEVEMENT TELLS A STORY"
    >
      <ul className={styles.grid}>
        {listed.map((achievement, index) => (
          <li
            className={styles.item}
            key={achievement.id}
            style={{ "--index": index } as CSSProperties}
          >
            <span className={styles.icon} aria-hidden="true">
              <AchievementIcon name={achievement.icon} />
            </span>
            <span className={styles.name}>{achievement.title}</span>
          </li>
        ))}
      </ul>

      {hiddenCount > 0 && <p className={styles.more}>+ {hiddenCount} MORE</p>}
    </StatSlide>
  );
}
