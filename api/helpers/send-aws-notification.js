const AWS = require("aws-sdk");

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
    console.log(`sendNotification:
      [channel] = ${inputs.channel}
      [steps] = ${JSON.stringify(inputs.steps)}
    `);

    try {
      const iotData = new AWS.IotData({
        endpoint: process.env.IOT_CORE_ENDPOINT,
      });

      const params = {
        topic: inputs.channel,
        payload: JSON.stringify({ message: "Hello, world!" }),
        qos: 0,
      };

      iotData.publish(params, (err, data) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Message published:", data);
        }
      });
      return exits.success("hello");
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
