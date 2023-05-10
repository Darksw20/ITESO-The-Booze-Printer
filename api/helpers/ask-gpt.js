const { Configuration, OpenAIApi } = require("openai");

module.exports = {
  friendlyName: "Ask Chat GPT for something",
  description: "This will be the interface to ask various things to Chat GPT",

  inputs: {
    history: {
      type: "ref",
      required: true,
      description: "The prompt to send to chatgpt",
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    console.log(`ask-gpt: 
        [apiKey] = ${process.env.OPENAI_API_KEY}\n
        [history] = ${JSON.stringify(inputs.history)}\n
    `);
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const messages = inputs.history;

    try {
      const completion = await openai.createChatCompletion({
        // model: "gpt-4",
        model: "gpt-3.5-turbo",
        messages: messages,
      });

      const completionText = completion.data.choices[0].message.content;
      console.log("[usage]", JSON.stringify(completion.data.usage));
      console.log("[response]", JSON.stringify(completion.data.choices[0]));
      console.log("[content]", JSON.stringify(completionText));

      const firstString = completionText.substring(completionText.indexOf("{"));
      const jsonResponse = JSON.parse(
        firstString.slice(0, firstString.lastIndexOf("}") + 1)
      );

      console.log("[result]", jsonResponse);
      console.log("[ingredients]", jsonResponse.ingredients);
      console.log("[instructions]", jsonResponse.instructions);

      return exits.success(jsonResponse);
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
      return exits.error(error.message);
    }
  },
};
