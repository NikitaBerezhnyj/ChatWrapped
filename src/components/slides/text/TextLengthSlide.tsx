import type {
  PreparedPresentation,
  TextLengthSlide as TextLengthSlideData
} from "../../../core/presentation";
import { StatSlide } from "../StatSlide";

interface Props {
  slide: TextLengthSlideData;
  formatters: PreparedPresentation["formatters"];
}

export function TextLengthSlide({ slide, formatters }: Props) {
  return (
    <StatSlide
      tone="text"
      kicker="MESSAGE LENGTH"
      title={["The longest", "message."]}
      hero={{
        value: formatters.formatNumber(slide.longestCharacterCount),
        label: "CHARACTERS"
      }}
      stats={[
        {
          value: formatters.formatNumber(slide.shortestCharacterCount),
          label: "CHARACTERS IN THE SHORTEST"
        }
      ]}
    />
  );
}
