import type {
  PreparedPresentation,
  TextWordsSlide as TextWordsSlideData
} from "../../../core/presentation";
import { SlideFrame } from "../SlideFrame";
import { Title } from "../Title";
import styles from "./TextWordsSlide.module.css";

interface Props {
  slide: TextWordsSlideData;
  formatters: PreparedPresentation["formatters"];
}

const MIN_SIZE = 3.6;
const SIZE_RANGE = 6.4;

export function TextWordsSlide({ slide, formatters }: Props) {
  const { words } = slide;
  const maxCount = Math.max(...words.map(word => word.count), 1);

  return (
    <SlideFrame
      tone="text"
      kicker="MOST USED WORDS"
      footnote="NUMBER NEXT TO A WORD = TIMES USED"
    >
      <Title lines={["The most", "used words."]} />

      <ul className={styles.cloud}>
        {words.map((word, index) => {
          const weight = word.count / maxCount;

          return (
            <li
              className={styles.word}
              key={word.word}
              data-leading={index === 0 || undefined}
              style={{
                fontSize: `calc(var(--u) * ${MIN_SIZE + weight * SIZE_RANGE})`,
                opacity: 0.55 + weight * 0.45
              }}
            >
              <span>{word.word}</span>
              <span className={styles.count}>{formatters.formatCompactNumber(word.count)}</span>
            </li>
          );
        })}
      </ul>
    </SlideFrame>
  );
}
