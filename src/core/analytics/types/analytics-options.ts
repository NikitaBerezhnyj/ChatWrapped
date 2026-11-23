export interface AnalysisOptions {
  conversationGapThresholdMs: number;
  nightStartHour: number;
  nightEndHour: number;
  topWordsLimit: number;
  topPhrasesLimit: number;
  topEmojisLimit: number;
  minimumWordLength: number;
  timezone: string;
}

export const DEFAULT_ANALYSIS_OPTIONS: AnalysisOptions = {
  conversationGapThresholdMs: 8 * 60 * 60 * 1000,
  nightStartHour: 0,
  nightEndHour: 6,
  topWordsLimit: 10,
  topPhrasesLimit: 10,
  topEmojisLimit: 10,
  minimumWordLength: 2,
  timezone: "UTC"
};
