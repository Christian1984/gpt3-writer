import { NextApiRequest, NextApiResponse } from "next";
import { userAgent } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const promptSystemMessage = "You are well respected, kind twitter user.";
const promptPrefix =
  "Write a tweet about positive parenting from the perspective of a loving parent about the following topic. Do not exceed 140 characters and use at least one hashtag!";

const generateAction = async (req: NextApiRequest, resp: NextApiResponse) => {
  // console.log(`API: ${req.body.userInput}`);

  if (!req.body.userInput?.trim()) {
    resp.status(500).json({});
    return;
  }

  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: promptSystemMessage },
      { role: "user", content: promptPrefix },
      { role: "user", content: req.body.userInput },
    ],
    temperature: 0.8,
    max_tokens: 200,
  });

  const chatOutput = chatCompletion.data.choices.pop().message.content;
  // const chatOutput =
  //   '"Just spent some time experimenting with #chatgpt and I am blown away by its power! The advanced language capabilities and ability to generate meaningful responses is truly remarkable. Excited to see where this technology takes us in the future 🚀 #AI #MachineLearning"';

  resp.status(200).json({ output: chatOutput });
};

export default generateAction;
