import { LocalPresentationFormatterFactory, type PreparedPresentation } from "../core/presentation";
import type { ImportWorkerResponse } from "../workers/import-chat.worker";

const formatterFactory = new LocalPresentationFormatterFactory();

export function importChat(file: File): Promise<PreparedPresentation> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("../workers/import-chat.worker.ts", import.meta.url), {
      type: "module"
    });

    worker.onmessage = (event: MessageEvent<ImportWorkerResponse>) => {
      worker.terminate();

      const response = event.data;

      if (response.type === "error") {
        reject(new Error(response.message));
        return;
      }

      resolve({ data: response.data, formatters: formatterFactory.create() });
    };

    worker.onerror = () => {
      worker.terminate();
      reject(new Error("Unable to process this file."));
    };

    worker.postMessage(file);
  });
}
