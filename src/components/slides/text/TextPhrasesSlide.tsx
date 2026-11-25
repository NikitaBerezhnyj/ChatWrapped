import type {
  PreparedPresentation,
  TextPhrasesSlide as TextPhrasesSlideData
} from "../../../core/presentation";
import { SlideFrame } from "../SlideFrame";
import { Title } from "../Title";
import styles from "./TextPhrasesSlide.module.css";

interface Props {
  slide: TextPhrasesSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function TextPhrasesSlide({ slide, formatters }: Props) {
  return (
    <SlideFrame
      tone="text"
      kicker="REPEATED PHRASES"
      footnote="MESSAGES CONTAINING EACH PHRASE"
    >
      <Title lines={["The most", "repeated", "phrases."]} />

      <ol className={styles.list}>
        {slide.phrases.map(item => (
          <li className={styles.phrase} key={item.phrase}>
            <span className={styles.text}>“{item.phrase}”</span>
            <span className={styles.count}>{formatters.formatNumber(item.count)}×</span>
          </li>
        ))}
      </ol>
    </SlideFrame>
  );
}
