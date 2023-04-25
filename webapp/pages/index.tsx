import Head from "next/head";
import Image from "next/image";
import buildspaceLogo from "../assets/buildspace-logo.png";
import { useState } from "react";

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchApi = async () => {
    if (isGenerating) return;

    setApiOutput("");
    setIsGenerating(true);

    const resp = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });

    const { output }: { output: string } = await resp.json();

    // console.log("Open AI replied with:", output);

    setApiOutput(output);
    setIsGenerating(false);
  };

  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            {/* <h1>generate a tweet thread about positive parenting</h1> */}
            <h1>generate a tweet about positive parenting</h1>
          </div>
          <div className="header-subtitle">
            <h2>
              write a quick sentence about a typical parenting challenge you are facing (e.g. limit tv time, deal with power
              struggles, handling allowance)
            </h2>
          </div>
        </div>
        <div className="prompt-container">
          <form
            style={{ width: "100%" }}
            onSubmit={(e) => {
              e.preventDefault();
              fetchApi();
            }}
          >
            <input
              placeholder="dealing with power struggles"
              className="prompt-box"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onSubmit={fetchApi}
              disabled={isGenerating}
            />
          </form>
          <div className="prompt-buttons">
            <a
              className={"generate-button" + (isGenerating || userInput.trim().length == 0 ? " loading" : "")}
              onClick={fetchApi}
            >
              <div className="generate">
                {!isGenerating && <p>Generate</p>}
                {isGenerating && <span className="loader"></span>}
              </div>
            </a>
          </div>
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="badge-container grow">
        <a href="https://buildspace.so/builds/ai-writer" target="_blank" rel="noreferrer">
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
