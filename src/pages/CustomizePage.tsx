import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Button } from "../components/Button";
import { Page } from "../components/Page";
import { PageIntro } from "../components/PageIntro";
import { ThemePicker } from "../components/ThemePicker";
import {
  getAnonymousNames,
  getDefaultNames,
  getParticipantList,
  MAX_NAME_LENGTH,
  type PresentationData,
  type PresentationNames
} from "../core/presentation";
import type { ThemeId } from "../themes/themes";
import styles from "./CustomizePage.module.css";

interface CustomizePageProps {
  data: PresentationData;
  theme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  onStart: (names: PresentationNames, hideTextSlides: boolean) => void;
  onBack: () => void;
}

interface NameFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

function NameField({ label, value, placeholder, onChange }: NameFieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <input
        className={styles.input}
        type="text"
        value={value}
        placeholder={placeholder}
        maxLength={MAX_NAME_LENGTH}
        onChange={event => onChange(event.target.value)}
      />
    </label>
  );
}

function CustomizePage({ data, theme, onThemeChange, onStart, onBack }: CustomizePageProps) {
  const defaults = useMemo(() => getDefaultNames(data), [data]);
  const participants = useMemo(() => getParticipantList(data), [data]);

  const [names, setNames] = useState<PresentationNames>(defaults);
  const [hideTextSlides, setHideTextSlides] = useState(false);

  function setChatTitle(chatTitle: string) {
    setNames(current => ({ ...current, chatTitle }));
  }

  function setParticipantName(id: string, name: string) {
    setNames(current => ({
      ...current,
      participants: { ...current.participants, [id]: name }
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onStart(names, hideTextSlides);
  }

  return (
    <Page>
      <div className={styles.content}>
        <button className={styles.back} type="button" onClick={onBack}>
          <ArrowLeft width={14} aria-hidden="true" />
          BACK
        </button>

        <PageIntro
          eyebrow="BEFORE YOU START"
          title="Check the names"
          description="These names appear on the slides. Change them or anonymize everything before you share anything."
        />

        <form onSubmit={handleSubmit}>
          <div className={styles.toolbar}>
            <button
              className={styles.textButton}
              type="button"
              onClick={() => setNames(getAnonymousNames(data))}
            >
              ANONYMIZE
            </button>

            <button className={styles.textButton} type="button" onClick={() => setNames(defaults)}>
              RESET
            </button>
          </div>

          <div className={styles.fields}>
            <NameField
              label="CHAT TITLE"
              value={names.chatTitle}
              placeholder={defaults.chatTitle}
              onChange={setChatTitle}
            />

            {participants.map(participant => (
              <NameField
                key={participant.id}
                label={participant.name}
                value={names.participants[participant.id] ?? ""}
                placeholder={participant.name}
                onChange={value => setParticipantName(participant.id, value)}
              />
            ))}
          </div>

          <p className={styles.note}>An empty field keeps the original name.</p>

          <ThemePicker value={theme} onChange={onThemeChange} />

          <label className={styles.checkbox}></label>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={hideTextSlides}
              onChange={event => setHideTextSlides(event.target.checked)}
            />

            <span className={styles.checkboxText}>
              Hide words and phrases
              <span className={styles.checkboxHint}>
                These slides are built from the text of messages and may contain real names.
              </span>
            </span>
          </label>

          <Button className={styles.startButton} type="submit">
            <span>START STORY</span>
            <ArrowUpRight width={19} aria-hidden="true" />
          </Button>
        </form>
      </div>
    </Page>
  );
}

export default CustomizePage;
