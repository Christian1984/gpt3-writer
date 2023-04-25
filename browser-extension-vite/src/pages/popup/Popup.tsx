import React, { useEffect, useState } from "react";
import logo from "@assets/img/logo.svg";
import { Buffer } from "buffer";

export default function Popup(): JSX.Element {
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    chrome.storage.local?.get("openai-key").then((res) => {
      const key = res["openai-key"];
      if (key) {
        setApiKey(Buffer.from(key, "base64").toString("utf-8"));
        setShowKeyInput(false);
      } else {
        setApiKey("");
        setShowKeyInput(true);
      }
    });
  }, []);

  return (
    <div className="text-center h-full p-3 bg-gray-800">
      <div className="flex flex-col items-center justify-center text-white">
        {showKeyInput && (
          <div className="w-full">
            <p className="mb-3">To get started, add your OpenAI API Key!</p>
            <div className="flex w-full">
              <input
                className="grow mr-3 text-black p-1"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);

                  const encodedApiKey = Buffer.from(e.target.value, "utf-8").toString("base64");
                  chrome.storage.local.set({ "openai-key": encodedApiKey });
                }}
              />
              <button
                className="border p-1"
                onClick={() => {
                  setShowKeyInput(false);
                }}
              >
                Add key
              </button>
            </div>
          </div>
        )}
        {!showKeyInput && (
          <div className="w-full">
            <span>You entered your OpenAI API Key.</span>
            <div className="flex w-full">
              <button
                className="border p-1 grow"
                onClick={() => {
                  setShowKeyInput(true);
                }}
              >
                Change key
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
