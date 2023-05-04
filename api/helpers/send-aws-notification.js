module.exports = {
  friendlyName: "Send MQTT aws notification",

  description: "This will send notifications to IoT Core",

  inputs: {
    channel: {
      type: "string",
      required: true,
      description: "Channel to publish data",
    },
    steps: {
      type: "json",
      required: true,
      description: "Steps to build the drink",
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs, exits) {
    // TODO
  },
};
