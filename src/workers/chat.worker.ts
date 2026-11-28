import { parseChatExport } from "../core/import/parse-chat-export";
import type { ChatData } from "../core/models";
import { filterChatByPeriod, type Period } from "../core/period";
import {
  DEFAULT_PRESENTATION_FORMATTING_OPTIONS,
  LocalPresentationService,
  type PresentationData
} from "../core/presentation";

export type ChatWorkerRequest =
  { type: "import"; file: File } | { type: "build"; chat: ChatData; period: Period };

export type ChatWorkerResponse =
  { type: "success"; result: ChatData | PresentationData } | { type: "error"; message: string };

const presentationService = new LocalPresentationService();

async function handleRequest(request: ChatWorkerRequest): Promise<ChatData | PresentationData> {
  if (request.type === "import") {
    return parseChatExport(await request.file.text());
  }

  const { timezone } = DEFAULT_PRESENTATION_FORMATTING_OPTIONS;
  const chat = filterChatByPeriod(request.chat, request.period, timezone);
  const { data } = await presentationService.prepare(chat, { timezone });

  return data;
}

self.addEventListener("message", async (event: MessageEvent<ChatWorkerRequest>) => {
  let response: ChatWorkerResponse;

  try {
    response = { type: "success", result: await handleRequest(event.data) };
  } catch (error) {
    response = {
      type: "error",
      message: error instanceof Error ? error.message : "Unable to process this file."
    };
  }

  self.postMessage(response);
});
