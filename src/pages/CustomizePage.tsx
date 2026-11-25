import { useMemo, useState, type FormEvent } from "react";
import {
  getAnonymousNames,
  getDefaultNames,
  getParticipantList,
  MAX_NAME_LENGTH,
  type PresentationData,
  type PresentationNames
} from "../core/presentation";
import styles from "./CustomizePage.module.css";

interface CustomizePageProps {
  data: PresentationData;
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

function CustomizePage({ data, onStart, onBack }: CustomizePageProps) {
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
    <main className={styles.page}>
      <div className={styles.content}>
        <button className={styles.back} type="button" onClick={onBack}>
          ← BACK
        </button>

        <span className={styles.eyebrow}>BEFORE YOU START</span>

        <h1 className={styles.title}>Check the names</h1>

        <p className={styles.description}>
          These names appear on the slides. Change them or anonymize everything before you share
          anything.
        </p>

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

          <button className={styles.startButton} type="submit">
            <span>START STORY</span>
            <span aria-hidden="true">↗</span>
          </button>
        </form>
      </div>
    </main>
  );
}

export default CustomizePage;
