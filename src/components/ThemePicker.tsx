import { THEMES, type ThemeId } from "../themes/themes";
import styles from "./ThemePicker.module.css";

interface ThemePickerProps {
  value: ThemeId;
  onChange: (theme: ThemeId) => void;
}

export function ThemePicker({ value, onChange }: ThemePickerProps) {
  return (
    <fieldset className={styles.picker}>
      <legend className={styles.legend}>THEME</legend>

      <div className={styles.options}>
        {THEMES.map(theme => (
          <label className={styles.option} key={theme.id} data-story-theme={theme.id}>
            <input
              className={styles.radio}
              type="radio"
              name="theme"
              value={theme.id}
              checked={value === theme.id}
              onChange={() => onChange(theme.id)}
            />

            <span className={styles.card}>
              <span className={styles.swatches} aria-hidden="true">
                <span className={styles.swatch} data-slide="cover" />
                <span className={styles.swatch} data-slide="overview" />
                <span className={styles.swatch} data-slide="activity" />
                <span className={styles.swatch} data-slide="text" />
              </span>

              <span className={styles.name}>
                {theme.name}
                <span className={styles.accent} aria-hidden="true" />
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
