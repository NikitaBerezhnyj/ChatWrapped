import type { ChatData } from "../models";
import type { ChatAnalysisResult } from "../pipeline";
import type { PresentationData } from "./types";

export interface PresentationDataBuilder {
  build(chat: ChatData, analysis: ChatAnalysisResult): PresentationData;
}
