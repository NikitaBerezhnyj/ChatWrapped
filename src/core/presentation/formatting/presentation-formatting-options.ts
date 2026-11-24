export interface PresentationFormattingOptions {
  timezone: string;
}

export const DEFAULT_PRESENTATION_FORMATTING_OPTIONS: PresentationFormattingOptions = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
};
