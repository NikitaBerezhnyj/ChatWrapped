import type { ChatData } from "../models";
import type { AnalysisOptions } from "../analytics";
import type { ChatAnalysisResult } from "./chat-analysis-result";

export interface ChatAnalysisPipeline {
  analyze(chat: ChatData, options?: Partial<AnalysisOptions>): Promise<ChatAnalysisResult>;
}
