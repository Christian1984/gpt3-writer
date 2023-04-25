import { MessageType } from "@src/shared/messageTypes";

try {
  console.log("content script loaded");

  chrome.runtime.onMessage.addListener(
    (
      message: { type: MessageType; content: string },
      sender: chrome.runtime.MessageSender,
      sendResponse: (resp: { status: string }) => void
    ) => {
      switch (message.type) {
        case MessageType.Generating:
          console.log("generating");
          break;
        case MessageType.Completion:
          console.log("completion:", message.content);
          break;
        case MessageType.Error:
          console.warn("error:", message.content);
          break;
      }

      sendResponse({ status: "success" });
    }
  );
} catch (e) {
  console.error(e);
}
