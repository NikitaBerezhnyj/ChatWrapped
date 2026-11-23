import type { ChatData } from "../models";
import { LocalAnalyticsEngine } from "../analytics";
import { LocalAchievementsEngine } from "../achievements";
import type { AnalysisOptions } from "../analytics";
import type { ChatAnalysisPipeline } from "./chat-analysis-pipeline";
import type { ChatAnalysisResult } from "./chat-analysis-result";

export class LocalChatAnalysisPipeline implements ChatAnalysisPipeline {
  private readonly analyticsEngine = new LocalAnalyticsEngine();
  private readonly achievementsEngine = new LocalAchievementsEngine();

  async analyze(chat: ChatData, options?: Partial<AnalysisOptions>): Promise<ChatAnalysisResult> {
    const analytics = await this.analyticsEngine.analyze(chat, options);
    const achievements = this.achievementsEngine.evaluate(analytics);

    return {
      analytics,
      achievements
    };
  }
}
