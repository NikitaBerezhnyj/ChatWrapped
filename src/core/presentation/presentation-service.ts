import type { AnalysisOptions } from "../analytics";
import type { ChatData } from "../models";
import type { PresentationData } from "./types";
import type { PresentationFormattingOptions } from "./formatting";
import type { PresentationFormatters } from "./formatting";

export interface PresentationOptions {
  analysis?: Omit<Partial<AnalysisOptions>, "timezone">;
  timezone?: PresentationFormattingOptions["timezone"];
}

export interface PreparedPresentation {
  data: PresentationData;
  formatters: PresentationFormatters;
}

export interface PresentationService {
  prepare(chat: ChatData, options?: PresentationOptions): Promise<PreparedPresentation>;
}
