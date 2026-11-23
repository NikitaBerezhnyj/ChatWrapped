import type { ChatData } from "../models";
import { LocalChatAnalysisPipeline } from "../pipeline";
import type { ChatAnalysisPipeline } from "../pipeline";
import { LocalPresentationDataBuilder } from "./local-presentation-data-builder";
import type { PresentationDataBuilder } from "./presentation-data-builder";
import {
  DEFAULT_PRESENTATION_FORMATTING_OPTIONS,
  LocalPresentationFormatterFactory
} from "./formatting";
import type { PresentationFormatterFactory } from "./formatting";
import type {
  PresentationOptions,
  PresentationService,
  PreparedPresentation
} from "./presentation-service";

export class LocalPresentationService implements PresentationService {
  private readonly pipeline: ChatAnalysisPipeline;
  private readonly dataBuilder: PresentationDataBuilder;
  private readonly formatterFactory: PresentationFormatterFactory;

  constructor(
    pipeline: ChatAnalysisPipeline = new LocalChatAnalysisPipeline(),
    dataBuilder: PresentationDataBuilder = new LocalPresentationDataBuilder(),
    formatterFactory: PresentationFormatterFactory = new LocalPresentationFormatterFactory()
  ) {
    this.pipeline = pipeline;
    this.dataBuilder = dataBuilder;
    this.formatterFactory = formatterFactory;
  }

  async prepare(chat: ChatData, options: PresentationOptions = {}): Promise<PreparedPresentation> {
    const timezone = options.timezone ?? DEFAULT_PRESENTATION_FORMATTING_OPTIONS.timezone;

    const analysis = await this.pipeline.analyze(chat, {
      ...options.analysis,
      timezone
    });

    const data = this.dataBuilder.build(chat, analysis);
    const formatters = this.formatterFactory.create({ timezone });

    return {
      data,
      formatters
    };
  }
}
