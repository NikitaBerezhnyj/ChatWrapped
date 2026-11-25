import type {
  PreparedPresentation,
  TextEmojisSlide as TextEmojisSlideData
} from "../../../core/presentation";
import { SlideFrame } from "../SlideFrame";
import { Title } from "../Title";
import styles from "./TextEmojisSlide.module.css";

interface Props {
  slide: TextEmojisSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function TextEmojisSlide({ slide, formatters }: Props) {
  const [leading, ...others] = slide.emojis;

  return (
    <SlideFrame tone="text" kicker="MOST USED EMOJIS" footnote="NUMBER NEXT TO AN EMOJI = TIMES USED">
      <Title lines={["The most", "used emojis."]} />

      <div className={styles.leading}>
        <span className={styles.emoji}>{leading.emoji}</span>

        <div className={styles.info}>
          <strong>{formatters.formatNumber(leading.count)}</strong>
          <span>USES OF THE TOP EMOJI</span>
        </div>
      </div>

      {others.length > 0 && (
        <ul className={styles.grid}>
          {others.map(item => (
            <li className={styles.item} key={item.emoji}>
              <span className={styles.gridEmoji}>{item.emoji}</span>
              <span className={styles.gridCount}>{formatters.formatCompactNumber(item.count)}</span>
            </li>
          ))}
        </ul>
      )}
    </SlideFrame>
  );
}
