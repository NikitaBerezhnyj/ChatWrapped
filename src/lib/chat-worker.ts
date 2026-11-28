import type { ChatData } from "../core/models";
import type { Period } from "../core/period";
import {
  LocalPresentationFormatterFactory,
  type PreparedPresentation,
  type PresentationData
} from "../core/presentation";
import type { ChatWorkerRequest, ChatWorkerResponse } from "../workers/chat.worker";

const formatterFactory = new LocalPresentationFormatterFactory();

function runWorker<T extends ChatData | PresentationData>(request: ChatWorkerRequest): Promise<T> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("../workers/chat.worker.ts", import.meta.url), {
      type: "module"
    });

    worker.onmessage = (event: MessageEvent<ChatWorkerResponse>) => {
      worker.terminate();

      const response = event.data;

      if (response.type === "error") {
        reject(new Error(response.message));
        return;
      }

      resolve(response.result as T);
    };

    worker.onerror = () => {
      worker.terminate();
      reject(new Error("Unable to process this file."));
    };

    worker.postMessage(request);
  });
}

export function importChat(file: File): Promise<ChatData> {
  return runWorker<ChatData>({ type: "import", file });
}

export async function buildPresentation(
  chat: ChatData,
  period: Period
): Promise<PreparedPresentation> {
  const data = await runWorker<PresentationData>({ type: "build", chat, period });

  return { data, formatters: formatterFactory.create() };
}
