import { Buffer } from "buffer";

console.log("positive parenting tweeter background script loaded");

const getApiKey = async (): Promise<string> => {
  const res = await chrome.storage.local.get("openai-key");
  const key = res["openai-key"];

  return key ? Buffer.from(key, "base64").toString("utf-8") : "";
};

const generate = async (topic: string) => {
  console.log("enter generate with topic:", topic);

  if (!topic) Promise.reject();

  const promptSystemMessage = "You are well respected, kind twitter user.";
  const promptPrefix =
    "Write a tweet about positive parenting from the perspective of a loving parent, specifically about the following topic. Do not exceed 140 characters and use at least one hashtag!";

  const body = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: promptSystemMessage },
      { role: "user", content: promptPrefix },
      { role: "user", content: "Topic: " + topic },
    ],
    temperature: 0.8,
    max_tokens: 200,
  };

  console.log("body", body);

  const url = "https://api.openai.com/v1/chat/completions";
  const key = await getApiKey();

  if (!key) Promise.reject();

  // const resp = await fetch(url, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${key}`,
  //   },
  //   body: JSON.stringify(body),
  // });
  // const json = await resp.json();

  // console.log(json);

  // return json.choices?.pop().message.content || "no response received!";

  return "As a parent, I've learned that positive discipline is an experiment in patience and love. #PositiveParenting #ParentingTips";
};

const generateCompletionAction = async (info: chrome.contextMenus.OnClickData) => {
  const { selectionText } = info;

  try {
    if (!selectionText) throw new Error("nothing selected!");

    const resp = await generate(selectionText);
    console.log(resp);
  } catch (e) {
    console.error(e);
  }
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "context-run",
    title: "generate positive parenting tweet",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(generateCompletionAction);