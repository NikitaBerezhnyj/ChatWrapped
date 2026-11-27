import { processChatExport } from "../core/import/process-chat-export";
import type { PresentationData } from "../core/presentation";

export type ImportWorkerResponse =
  { type: "success"; data: PresentationData } | { type: "error"; message: string };

self.addEventListener("message", async (event: MessageEvent<File>) => {
  let response: ImportWorkerResponse;

  try {
    const text = await event.data.text();

    response = { type: "success", data: await processChatExport(text) };
  } catch (error) {
    response = {
      type: "error",
      message: error instanceof Error ? error.message : "Unable to process this file."
    };
  }

  self.postMessage(response);
});
