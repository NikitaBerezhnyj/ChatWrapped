import type { ChatData } from "../models";
import type { AnalyticsResult, AnalysisOptions } from "./types";

export interface AnalyticsEngine {
  analyze(chat: ChatData, options?: Partial<AnalysisOptions>): Promise<AnalyticsResult>;
}
