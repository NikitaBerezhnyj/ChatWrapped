import type { ChatData } from "../models";
import { normalizeMessage } from "../normalization";
import {
  analyzeActivity,
  analyzeConversations,
  analyzeOverview,
  analyzeParticipants,
  analyzeText
} from "./index";
import { DEFAULT_ANALYSIS_OPTIONS } from "./types";
import type { AnalyticsEngine } from "./analytics-engine";
import type { AnalysisOptions, AnalyticsResult } from "./types";

export class LocalAnalyticsEngine implements AnalyticsEngine {
  async analyze(chat: ChatData, options: Partial<AnalysisOptions> = {}): Promise<AnalyticsResult> {
    const resolvedOptions: AnalysisOptions = {
      ...DEFAULT_ANALYSIS_OPTIONS,
      ...options
    };

    const messages = chat.messages.map(normalizeMessage);

    return {
      overview: analyzeOverview(messages),
      activity: analyzeActivity(messages, resolvedOptions),
      text: analyzeText(messages, resolvedOptions),
      participants: analyzeParticipants(messages, resolvedOptions),
      conversations: analyzeConversations(messages, resolvedOptions)
    };
  }
}
