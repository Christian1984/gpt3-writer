try {
  console.log("content script loaded");

  const overlayId = "pp-twitter-overlay";

  const copyTweetToClipboard = (tweet: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = tweet;
    textarea.select();
    navigator.clipboard.writeText(textarea.value);
  };

  const generateBackground = () => {
    const existingBackground = document.getElementById(overlayId);
    if (existingBackground) return existingBackground;

    const background = document.createElement("div");
    background.setAttribute(
      "style",
      "background-color: rgba(20, 0, 35, 0.7);" +
        "color:white;" +
        "position: fixed;" +
        "left: 0;" +
        "top: 0;" +
        "right: 0;" +
        "bottom: 0;" +
        "z-index: 10000;" +
        "display: flex;" +
        "flex-direction: column;" +
        "justify-content: center;" +
        "align-items: center;"
    );
    background.setAttribute("id", overlayId);

    return background;
  };

  const showGenerating = () => {
    const content = document.createElement("h2");
    content.textContent = "generating tweet...";

    const background = generateBackground();

    background.appendChild(content);
    document.body.appendChild(background);
  };

  const showCompletion = (tweet: string) => {
    const content = document.createElement("h2");
    content.textContent = "here is your tweet";

    const tweetElement = document.createElement("p");
    tweetElement.setAttribute("style", "text-align: center;");
    tweetElement.textContent = tweet;

    const copyButton = document.createElement("span");
    copyButton.setAttribute(
      "style",
      "cursor: pointer;" +
        "border: 1px solid white;" +
        "background-color: white;" +
        "color: black;" +
        "padding: 10px;" +
        "margin: 3px"
    );
    copyButton.innerText = "copy to clipboard";
    copyButton.addEventListener("click", () => {
      copyTweetToClipboard(tweet);
      hideOverlay();
    });

    const closeButton = document.createElement("span");
    closeButton.setAttribute("style", "cursor: pointer;" + "border: 1px solid white;" + "padding: 10px;" + "margin: 3px");
    closeButton.innerText = "close";
    closeButton.addEventListener("click", () => hideOverlay());

    const buttonBar = document.createElement("div");
    buttonBar.setAttribute("style", "display: flex;");
    buttonBar.appendChild(closeButton);
    buttonBar.appendChild(copyButton);

    const background = generateBackground();

    background.appendChild(content);
    background.appendChild(tweetElement);
    background.appendChild(buttonBar);

    document.body.appendChild(background);
  };

  const hideOverlay = () => {
    const background = document.getElementById(overlayId);
    if (background) {
      document.body.removeChild(background);
    }
  };

  chrome.runtime.onMessage.addListener(
    (
      message: { type: string; content: string },
      sender: chrome.runtime.MessageSender,
      sendResponse: (resp: { status: string }) => void
    ) => {
      switch (message.type) {
        case "generating":
          console.log("generating");
          showGenerating();
          break;
        case "completion":
          console.log("completion:", message.content);
          hideOverlay();
          showCompletion(message.content);
          break;
        case "error":
          console.warn("error:", message.content);
          alert(message.content);
          hideOverlay();
          break;
      }

      sendResponse({ status: "success" });
    }
  );
} catch (e) {
  console.error(e);
}
